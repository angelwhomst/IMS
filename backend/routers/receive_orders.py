from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import logging
import database
import json

router = APIRouter()

# pydantic model for the variant data
class ProductVariant(BaseModel):
    barcode: str
    productCode: str
    productName: str
    category: str
    size: str

class VariantPayload(BaseModel):
    orderID: int
    variants: List[ProductVariant]

class OrderID(BaseModel):
    order_id: int


@router.post("/ims/orders/confirm")
async def update_order_status(payload: dict):
    conn = None
    try:
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        orderID = payload.get('orderID')
        orderStatus = payload.get('orderStatus')

        if not orderID or not orderStatus:
            raise HTTPException(status_code=400, detail='Missing required fields.')
        
        # check if order exists in the IMS database
        await cursor.execute(
            '''select * from purchaseOrders
              where orderID = ?''',
              (orderID,)
        )
        order_in_db = await cursor.fetchone()

        if not order_in_db:
            raise HTTPException(status_code=404, detail='Order not found in the IMS')
        
        # update the order status in IMS db
        await cursor.execute(
            ''' update purchaseOrders 
            set orderStatus = ?
            where orderID = ? ''',
            (orderStatus, orderID)
        ) 
        await conn.commit()
        return {'message': 'order status updated', 'orderID': orderID, "status": orderStatus}
    
    except Exception as e:
        logging.error(f"error updating order status: {e}")
        raise HTTPException(status_code=500, detail=f"error processing order: {e}")
    finally: 
        if conn:
            await conn.close()

# ims 
@router.post('/ims/orders/ToShip')
async def update_order_status(payload: dict):
    conn = None
    try:
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        orderID = payload.get("orderID")
        orderStatus = payload.get("orderStatus")

        if not orderID or not orderStatus:
            raise HTTPException(status_code=400, detail='Missing required fields.')
        
        # check if the order exists in IMS db
        await cursor.execute(
            '''select * 
            from purchaseOrders 
            where orderID = ?''',
            (orderID,)
        )
        order_in_db = await cursor.fetchone()

        if not order_in_db:
            raise HTTPException(status_code=404, detail='order not found in IMS')
        
        # update order status in IMS db
        await cursor.execute(
            '''update purchaseOrders
            set orderStatus = ?
            where OrderID = CAST(? AS INT)
            ''',
            (orderStatus, orderID)
        )
        await conn.commit()

        return {'message': 'Order status Updated', 'orderID': orderID, 'status': orderStatus}
    except Exception as e:
        logging.error(f"error updated order status: {e}")
        raise HTTPException(status_code=500, detail=f"error processing order: {e}")
    finally:
        if conn: 
            await conn.close()

# this works already
@router.post('/ims/variants/receive')
async def receive_variants(payload: VariantPayload):
    conn = None
    try:
        logging.info(f"Received payload: {json.dumps(payload.dict(), default=str)}")
        
        if not payload.variants:
            raise HTTPException(status_code=400, detail='No product variants provided')
        
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        processed_variants = 0
        for variant in payload.variants:
            logging.info(f"Processign variant: {variant.barcode}")

            # check barcode existence 
            await cursor.execute(
                '''select count(*)
                from productVariants
                where barcode =? ''',
                (variant.barcode,)
            )
            barcode_exists = (await cursor.fetchone())[0]

            if barcode_exists > 0:
                logging.warning(f"barcode {variant.barcode} already exists. Skipping")
                continue

            # fetch productID 
            await cursor.execute(
                '''Select productID
                from Products
                where productName = ?
                and category = ? 
                and size = ?
                ''',
                (variant.productName, variant.category, variant.size)
            )
            product_id_row = await cursor.fetchone()
            if not product_id_row:
                logging.error(f"product not for variant: {variant.barcode}")
                continue
            product_id = product_id_row[0]

            # insert into productVariants
            logging.info(f'inserting variant: {variant.barcode}')
            await cursor.execute(
                '''insert into productVariants
                (barcode, productCode, isAvailable, productID)
                values (?, ?, ?, ?)''',
                (variant.barcode, variant.productCode, 1, product_id)
            )

            #update stock
            logging.info(f"UPdating stock for productID: {product_id}")
            await cursor.execute(
                '''update products
                set currentstock = currentStock +1
                where productID = ? ''',
                (product_id,)
            )
            processed_variants += 1
        
        # update orderStatus if all variants are processed 
        if processed_variants == len(payload.variants):
            logging.info(f'Updating order status for orderID: {payload.orderID}')
            await cursor.execute(
                '''update purchaseOrders
                set orderStatus = 'Delivered'
                where orderID = ? ''',
                (payload.orderID,)
            )
            await conn.commit()
            return {'message': 'Variants received and saved successfully.', 'status': 'success'}

    except Exception as e:
        logging.error(f"HTTP error occurred: {e.status_code} - {e.detail}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing variants.")
    finally:
        if conn:
            await conn.close()


'''
for dropdown logic from the frontend
'''
# function to fetch orders based on status  
async def fetch_orders(order_status=None):  
    conn = await database.get_db_connection()  
    cursor = await conn.cursor()  
    
    try:  
        if order_status:  
            await cursor.execute(f"exec get_orders_by_status @orderStatus = '{order_status}'")  
        else:  
            await cursor.execute('exec get_all_orderStatus')  

        orders_row = await cursor.fetchall()  
        orders_data = [  
            {  
                "Product Name": row[0],  
                "Category": row[1],  
                "Size": row[2],  
                "Quantity": row[3],  
                "Total Price": row[4],  
                "Date": row[5].strftime("%m-%d-%Y %I:%M %p"),  
                "Status": row[6],
            }  
            for row in orders_row  
        ]  
        return orders_data  
    except Exception as e:  
        raise HTTPException(status_code=500, detail=str(e))  
    finally:  
        await conn.close()  

# Display all order status  
@router.get('/all-orders')  
async def get_all_orders():  
    orders_data = await fetch_orders()  
    return {"All order status": orders_data}  

# Display orders by status  
@router.get('/{status}-orders')  
async def get_orders_by_status(status: str):  
    valid_statuses = ['Pending', 'Confirmed', 'Rejected', 'To Ship', 'Delivered']  
    if status not in valid_statuses:  
        raise HTTPException(status_code=400, detail="Invalid order status")  
    
    orders_data = await fetch_orders(order_status=status)  
    return {f"{status} orders": orders_data}

# Get all the order in delivered status
@router.get('/ims/variants/delivered')
async def get_delivered_orders():
    conn = None
    try:
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        # SQL query to fetch only orders with the status 'Delivered'
        await cursor.execute(
            '''
            SELECT p.productName, p.category, p.size, 
                   pod.orderQuantity,
                   FORMAT((pod.orderQuantity * p.unitPrice), 'N', 'en-US') AS [total price],
                   po.statusDate, po.orderStatus
            FROM PurchaseOrders AS po
            LEFT JOIN PurchaseOrderDetails AS pod ON po.orderID = pod.orderID
            LEFT JOIN productVariants pv ON pod.variantid = pv.variantid
            LEFT JOIN Products p ON pv.productid = p.productid
            WHERE po.orderStatus = 'Delivered'  -- Filtering for delivered orders only
            ORDER BY po.orderDate DESC
            '''
        )

        delivered_orders_row = await cursor.fetchall()

        if not delivered_orders_row:
            raise HTTPException(status_code=404, detail="No delivered orders found.")

        # Prepare the response data with the necessary fields
        delivered_orders = [
            {
                "product_name": row[0],
                "category": row[1],
                "size": row[2],
                "quantity": row[3],
                "total_price": row[4],
                "status_date": row[5].strftime("%m-%d-%Y %I:%M %p"),
                "order_status": row[6]
            }
            for row in delivered_orders_row
        ]

        return {"delivered_orders": delivered_orders}

    except HTTPException as e:
        logging.error(f"HTTP error occurred: {e.status_code} - {e.detail}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching delivered orders.")
    finally:
        if conn:
            await conn.close()

#Received
@router.post("/ims/variants/mark-received")
async def mark_variants_received(order: OrderID):
    order_id = order.order_id
    conn = None
    try:
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        # Check if order exists and is marked as Delivered
        await cursor.execute(
            '''
            SELECT orderStatus 
            FROM purchaseOrders
            WHERE orderID = ?
            ''',
            (order_id,)
        )
        order_status_row = await cursor.fetchone()

        if not order_status_row:
            raise HTTPException(status_code=404, detail=f"Order with ID {order_id} not found.")

        order_status = order_status_row[0]
        if order_status != "Delivered":
            raise HTTPException(status_code=400, detail=f"Order is not in 'Delivered' status. Current status: {order_status}")

        # Update orderStatus to Received
        logging.info(f"Updating order status to 'Received' for orderID: {order_id}")
        await cursor.execute(
            '''
            UPDATE purchaseOrders
            SET orderStatus = 'Received'
            WHERE orderID = ?
            ''',
            (order_id,)
        )
        await conn.commit()

        return {"message": f"Order {order_id} marked as 'Received' successfully.", "status": "success"}
    
    except HTTPException as e:
        logging.error(f"HTTP error occurred: {e.status_code} - {e.detail}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while marking the order as 'Received'.")
    finally:
        if conn:
            await conn.close()



# for receive orders

'''
for dropdown logic from the frontend
'''
# function to fetch orders based on status  
async def fetch_orders(order_status=None):  
    conn = await database.get_db_connection()  
    cursor = await conn.cursor()  
    
    try:  
        if order_status:  
            await cursor.execute(f"exec get_orders_by_status @orderStatus = '{order_status}'")  
        else:  
            await cursor.execute('exec get_all_orderStatus')  

        orders_row = await cursor.fetchall()  
        orders_data = [  
            {  
                "Product Name": row[0],  
                "Category": row[1],  
                "Size": row[2],  
                "Quantity": row[3],  
                "Total Price": row[4],  
                "Date": row[5].strftime("%m-%d-%Y %I:%M %p"),  
                "Status": row[6],
            }  
            for row in orders_row  
        ]  
        return orders_data  
    except Exception as e:  
        raise HTTPException(status_code=500, detail=str(e))  
    finally:  
        await conn.close()  

# display all order status  
@router.get('/all-orders')  
async def get_all_orders():  
    orders_data = await fetch_orders()  
    return {"All order status": orders_data}  

# display orders by status  
@router.get('/{status}-orders')  
async def get_orders_by_status(status: str):  
    valid_statuses = ['Pending', 'Confirmed', 'Rejected', 'To Ship', 'Delivered']  
    if status not in valid_statuses:  
        raise HTTPException(status_code=400, detail="Invalid order status")  
    
    orders_data = await fetch_orders(order_status=status)  
    return {f"{status} orders": orders_data}