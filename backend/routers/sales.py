from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import database
from routers.auth import get_current_active_user, role_required

router = APIRouter(dependencies=[Depends(role_required(["employee"]))])

# pydantic models
class Customer(BaseModel):
    firstName: str 
    lastName: str
    contactNumber: str
    building: Optional[str]= None
    street: Optional[str] = None
    barangay: Optional[str] = None
    city: str 
    country: str
    zipcode: Optional[str] = None

class Delivery(BaseModel):
    salesDate: datetime
    customerLastName: str
    customerFirstName: str
    customerContact: str

class DeliveryDetail(BaseModel):
    salesDate: datetime
    customerLastName: str
    customerFirstName: str
    customerContact: str
    barcode: str
    quantity: int
    expectedDate: datetime

# add a new customer
@router.post("/customers")
async def add_customer(customer: Customer):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()
    try: 
        # check if custoemr already exists
        await cursor.execute(
            '''select customerID from customers
            where lastname = ? 
            and firstname =? 
            and contactNumber = ?''', customer.lastName, customer.firstName, customer.contactNumber
        )
        existing_customer = await cursor.fetchone()

        if existing_customer: 
            return{'message': "Customer already exists", "Customer First Name": existing_customer[2], "Customer First Name": existing_customer[1]}
        
        # insert new customer 
        await cursor.execute(
            '''insert into Customers (lastName, firstName, contactNumber, building, street, barangay, city, country, zipcode)
            values (?,?,?,?,?,?,?,?,?)''',
            customer.lastName, customer.firstName, customer.contactNumber, customer.building, customer.street, customer.barangay, customer.city, customer.country, customer.zipcode
        )
        await conn.commit()
        return {"message": "Customer added successfully"}
    except Exception as e: 
        if conn: 
            await conn.rollback()
        raise HTTPException(status_code=500, detail=f"An error occured while adding the customer: {str(e)}")
    finally: 
        if conn: 
            await conn.close()

@router.post("/deliveries")
async def add_delivery(delivery: Delivery):
    try:
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        # validate customer existence
        await cursor.execute(
            '''select customerID from Customers 
            where lastName = ? and firstName =? and contactNumber =?
            ''',
            delivery.customerLastName, delivery.customerFirstName, delivery.customerContact
        )
        customer = await cursor.fetchone()

        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        customer_id = customer[0]

        # create new delivery
        await cursor.execute(
            '''insert into Deliveries (salesDate, customerID)
            values (?,?)''',
            delivery.salesDate, customer_id
        )
        await conn.commit()
        return{"message": "Delivery record created successfully"}
    except Exception as e: 
        if conn: 
            await conn.close()

@router.post("/delivery-details")
async def add_delivery_detail(detail: DeliveryDetail):
    try: 
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        #validate customer existence 
        await cursor.execute(
            '''select customerID from Customers 
            where lastName = ? and firstName =? and contactNumber =?
            ''', detail.customerLastName, detail.customerLastName, detail.customerContact
        )
        customer = await cursor.fetchone()

        if not customer:
            raise HTTPException(status_code=404, detail="customer not found")
        customer_id = customer [0]

        # validate delivery existence
        await cursor.execute(
            '''select deliveryID
            from deliveries
            where salesDate = ? and customerID=?''',
            detail.salesDate, customer_id
        )
        delivery = await cursor.fetchone()

        if not delivery: 
            raise HTTPException(status_code=404, detail="Delivery record not found")
        
        delivery_id = delivery[0]
        
        #validate product variant existence
        await cursor.execute(
            '''select variantID, productID 
            from productVariants
            where barcode = ? and isAvailable =? ''',
            detail.barcode
        )
        variant = await cursor.fetchone()

        if not variant:
            raise HTTPException(status_code=404, detail="Product variant not found or unavailable.")
        
        variant_id, product_id = variant
        #update stock for the product
        await cursor.execute(
            '''update Products
            set currentStock = currentStock - ?
            where productID = ? and currentstock >= ?''',
            detail.quantity, product_id, detail.quantity
        )
        if cursor.rowcount == 0: 
            raise HTTPException(status_code=400, detail="insufficient stock")
        
        # mark variants as unavailable
        await cursor.execute(
            '''update ProductVariants
            set isAvailable = 0
            where variantId = ?''',
            variant_id
        )

        # insert into delivery details 
        await cursor.execute(
            '''isnert into deliveryDetails (quantity, expectedDate, variantID, deliveryID)
            values (?,?,?,?)''',
            detail.quantity, detail.expectedDate, variant_id, delivery_id
        )
        await conn.commit()
        return{"message": "delivery detail added successfully"}
    except HTTPException:
        if conn: 
            await conn.rollback()
        raise
    except Exception as e:
        if conn: 
            await conn.rollback()
        raise HTTPException(status_code=500, detail=f"An error occured while adding the delivery detail: {str(e)}")
    finally:
        if conn:
            await conn.close()
