<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException, Response
from typing import List
from pydantic import BaseModel
import logging
from fastapi.responses import JSONResponse
import database
from routers.auth import role_required, get_current_active_user


logging.basicConfig(level=logging.INFO)
router = APIRouter()

# Pydantic Models
class CartItemInput(BaseModel):
    productName: str
    category: str
    size: str
    quantity: int
    price: float

class CheckoutRequest(BaseModel):
    cart: List[CartItemInput]

# In-memory cart storage
cart = []

# Add to cart
@router.post("/sales/cart", dependencies=[Depends(role_required(["employee"]))])
async def add_to_cart(item: CartItemInput):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()

    try:
        # retrieve productID based on productName, category, and size
        await cursor.execute(
            """
            SELECT productID, currentStock 
            FROM Products
            WHERE productName = ? AND category = ? AND size = ?
            """,
            (item.productName, item.category, item.size)
        )
        product_row = await cursor.fetchone()

        if not product_row:
            raise HTTPException(
                status_code=404,
                detail=f"Product '{item.productName}' with category '{item.category}' and size '{item.size}' not found."
            )

        productID, currentStock = product_row

        # check if enough stock is available
        if currentStock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for product '{item.productName}'. Available stock: {currentStock}."
            )

        # Add to in-memory cart
        cart_item = {
            "productID": productID,
            "productName": item.productName,
            "category": item.category,
            "size": item.size,
            "quantity": item.quantity,
            "price": item.price
        }
        cart.append(cart_item)

        return {"message": "Item added to cart."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        await conn.close()

# view cart
@router.get("/sales/cart", dependencies=[Depends(role_required(["employee"]))])
async def view_cart():
    return cart

# process sales endpoint
@router.post("/sales/checkout")
async def checkout(request: CheckoutRequest, current_user=Depends(get_current_active_user)):
    logging.info(f"Checkout request received: {request}")
    conn = await database.get_db_connection()
    cursor = await conn.cursor()

    try:
        if not cart:
            raise HTTPException(status_code=400, detail="Cart is empty.")
        
        #generate variantID list from the cart
        variant_id_list = []

        for item in cart:
            # fetch `variantIDs` for each product and size
            await cursor.execute(
                '''select top(?) variantID
                from productVariants
                where productID =?
                and isAvailable = 1''',
                (item['quantity'], item['productID'])
            )
            variants = await cursor.fetchall()

            if len(variants) < item['quantity']:
                raise HTTPException(status_code=400, detail=f"Not enough available variants for product '{item['productName']}' with size '{item['size']}'.")
            
            # add variantIDs to the list
            variant_id_list.extend([variant[0] for variant in variants])
        
        # call the CheckoutSale stored procedure
        variant_id_list_str = ",".join(map(str, variant_id_list))
        await cursor.execute(
            '''exec CheckoutSale @userID = ?, @variantIDList =?''',
            (current_user.userID, variant_id_list_str)
        )
        await conn.commit()
        logging.info("Checkout successful.")

        #clear in-memory cart after successful checkout
        cart.clear()
        return JSONResponse(content={"message": "Checkout successful!"}, status_code=200)   
    
    except HTTPException as http_err:
        # Catch HTTP exceptions explicitly
        logging.error(f"HTTPException occurred: {http_err.detail}")
        raise http_err
    
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        await conn.close()

# sales history for employee
@router.get('/sales/history', dependencies=[Depends(role_required(["employee"]))])
async def get_sales_history(current_user=Depends(get_current_active_user)):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()

    try:
        await cursor.execute(
            '''exec EmployeeSalesHistory @userID = ?''',
            current_user.userID
        )
        sales_rows = await cursor.fetchall()

        # constructing teh response
        sales_history = [
            {
                "Product Name": row[0],
                "Category": row[1],
                "Size": row[2], 
                "Total Quantity Sold": row[3],
                "Total Amount": row[4],
                "Sales Date": row[5].strftime("%m-%d-%Y %I:%M %p"),
            }
            for row in sales_rows
        ]

        return{"Employee Sales History": sales_history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        await conn.close()
    
# get products per category for the dropdown in sales logic
@router.get("/sales/products", dependencies=[Depends(role_required(["employee"]))])
async def get_products_per_category(category: str = "All Categories"):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()

    try:
        # call the stored procedure
        await cursor.execute('exec GetProductByCategory @category = ?', (category,))
        products = await cursor.fetchall()
        
        # format the response
        product_list = [
            {
                "productName": row[0],
                "size": row[1],
                "price": f"₱{row[2]:.2f}",
                "category": row[3],
                "image": row[4] if row[4] else "https://via.placeholder.com/150"
            }
            for row in products
        ]

        return {"products": product_list}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        await conn.close()


# sales history admin side
@router.get('/sales/data', dependencies=[Depends(role_required(["admin"]))])
async def sales_data():
    conn = await database.get_db_connection()
    cursor = await conn.cursor()

    try: 
        await cursor.execute(
            '''exec SalesData'''
        )
        sales_row = await cursor.fetchall()

        # constructing teh response
        sales_data = [
            {
                "Product Name": row[0],
                "Category": row[1],
                "Size": row[2], 
                "Total Quantity Sold": row[3],
                "Total Amount": row[4],
                "Sales Date": row[5].strftime("%m-%d-%Y %I:%M %p"),
            }
            for row in sales_row
        ]

        return{"Sales History": sales_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()
        
=======
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
>>>>>>> IMS-DASH/master
