from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel 
import httpx
from datetime import datetime, date, timedelta
from typing import Optional, List
from decimal import Decimal
import database
import logging

router = APIRouter()

# base url for vms api
VMS_BASE_URL = 'http://127.0.0.1:8001'

# pydantic model for purchase order
class PurchaseOrder(BaseModel):
    productID: int
    productName: str 
    productDescription: str
    size: str
    color: Optional[str] = 'Black'
    category: str
    quantity: int
    warehouseID: int
    vendorID: int 
    orderDate: Optional[datetime] = None
    expectedDate: Optional[datetime] = None


# function to send purchase order to vms
async def send_order_to_vms(payload: dict):
    async with httpx.AsyncClient() as client:
        try: 
            response = await client.post(f"{VMS_BASE_URL}/vms/orders", json=payload)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logging.error(f"HTTP error sending order to VMS: {e}")
            raise HTTPException(status_code=500, detail=f"Error sending order to VMS: {e}")
        except ValueError as e:
            logging.error(f"error parsing response from VMS: {e}")
            raise HTTPException(
                status_code=500, detail="Invalied response from VMS")

# webhook to handle stock updates from IMS
@router.post('/stock')
async def stock_webhook(request: Request):
    conn = None
    try:
        #parse payload from ims 
        payload = await request.json()
        logging.info(F"Received payload: {payload}")

        productID = payload.get('productID')
        currentStock = payload.get('currentStock')

        if productID is None or currentStock is None:
            raise HTTPException(status_code=400, detail='Invalid paylaod received')
        
        # check if the stock level requires a PO
        conn = await database.get_db_connection()
        cursor = await conn.cursor()
        await cursor.execute('''SELECT CAST(P.productID AS INT) AS productID,
       P.productName,
       P.productDescription,
       P.size,
       P.color,
       P.category,
       CAST(P.reorderLevel AS INT) AS reorderLevel,
       CAST(P.minStockLevel AS INT) AS minStockLevel,
       CAST(P.warehouseID AS INT) AS warehouseID,
       W.warehouseName
FROM Products P
INNER JOIN Warehouses W ON P.warehouseID = W.warehouseID
WHERE P.productID = ? AND P.isActive = 1;
''',(productID,))
        product = await cursor.fetchone()

        if not product:
            raise HTTPException(status_code=404, detail='Product not found')
        print ('fetched product raw: ', product)
        print("Length of product:", len(product))
        print(f"Type of product: {type(product)}")

        productID = product[0]
        productName = product[1]
        productDescription = product[2]
        size = product[3]
        color = product[4]
        category = product[5]
        reorderLevel = product[6]
        minStockLevel = product[7]
        warehouseID = product[8]
        warehouseName = product[9]

        # extract product details
        (productID, productName, productDescription, size, color, category, 
         reorderLevel, minStockLevel, warehouseID, warehouseName) = (product)

        # if stock is at or below the reorder level, generate PO
        if currentStock <= reorderLevel:
            quantity_to_order = max(minStockLevel - currentStock, 0)
            if quantity_to_order > 0:
                # prepare dynamic dates
                orderDate = datetime.now().date().isoformat()
                expectedDate = (datetime.now() + timedelta(days=7)).date().isoformat()

                # select a vendor for the purchase order
                await cursor.execute('''select top 1 * from Vendors
                                     where isActive = 1
                                     ''')
                vendor = await cursor.fetchone()
                if not vendor:
                    raise HTTPException(status_code=404, detail='No active vendors available.')

                vendorID, vendorName, building, street, barangay, city, country, zipcode = vendor

                # insert into PurchaseOrders table
                await cursor.execute(
                    '''insert into PurchaseOrders (orderDate, orderStatus, statusDate, vendorID)
                    output inserted.orderID
                    values (?, ?, ?, ?)''',
                    (orderDate, 'Pending', datetime.utcnow(), vendorID)
                )
                order = await cursor.fetchone()
                orderID = order[0] if order else None

                if not orderID:
                    raise HTTPException(status_code=500, detail='Failed to create purchase order.')
                
                # insert into PurchaseOrderDetails
                await cursor.execute(
                    '''insert into PurchaseOrderDetails (orderQuantity, expectedDate, warehouseID, orderID)
                    values (?, ?, ?, ?)
                    ''',
                    (quantity_to_order, expectedDate, warehouseID, orderID)
                )
                
                await conn.commit()

                # prepare payload for vms
                po_payload = {
                    "orderID": orderID,
                    "productID": productID,
                    "productName": productName,
                    "productDescription": productDescription,
                    "size": size,
                    "color": color,
                    "category": category,
                    "quantity": quantity_to_order,
                    "warehouseID": warehouseID,
                    "vendorID": vendorID,
                    "vendorName": vendorName,
                    "orderDate": orderDate,
                    "expectedDate": expectedDate,
                }

                # send PO to vms
                response = await send_order_to_vms(po_payload)

                return{
                    "message": "Stock update processed. Purchase order created and sent to VMS.",
                    "payload": po_payload,
                    "response": response,
                }
        else:
            return {"message": "Stock update processed. No purchase order required."}
        
    except Exception as e:
        logging.error(f"error processing stock webhook: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing stock webhook: {e}")
    finally:
        if conn:  # check if conn is not None before closing  
            await conn.close() 


def convert_decimal_to_json_compatible(data):
    if isinstance(data, dict):
        return {key: convert_decimal_to_json_compatible(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_decimal_to_json_compatible(item) for item in data]
    elif isinstance(data, Decimal):
        return float(data)  # Or str(data) if you prefer strings for decimals
    elif isinstance(data, datetime):  # If it's a datetime object
        return data.strftime('%Y-%m-%dT%H:%M:%S')  # Format with date and time
    # elif isinstance(data, date):  # If it's a date object
    #     return data.strftime('%Y-%m-%d')  # Return just the date in YYYY-MM-DD format
    return data


# manual endpoint to create PO
@router.post('/create-purchase-order')
async def create_purchase_order(payload: dict):
    try:
        # extract payload fields
        productName = payload.get('productName')
        size = payload.get('size')
        category = payload.get('category')
        quantity = payload.get('quantity')
        warehouseName = payload.get('warehouseName')
        building = payload.get('building')
        street = payload.get('street')
        barangay = payload.get('barangay')
        city = payload.get('city')
        country = payload.get('country')
        zipcode = payload.get('zipcode')
        userID = payload.get('userID')

        # validate the payload 
        if not productName or not size or not category or not quantity or not warehouseName:
            raise HTTPException(status_code=400, detail="Invalid payload. Missing required fields.")
        
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        # fetch color (use default value 'Black' if not provided)
        color = 'Black'

        # execute stored procedure 
        await cursor.execute(
            "EXEC CreatePurchaseOrder ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?",
            (productName, size, category, quantity, warehouseName, building, street, barangay, city, country, zipcode, userID)
        )
        order = await cursor.fetchone()


        if not order:
            raise HTTPException(status_code=404, detail='Failed to create purchase order')
        
        orderID = order[0]

        await conn.commit()
        # Fetch order details for VMS
        await cursor.execute('''
            SELECT po.orderID, po.orderDate, v.vendorID, v.vendorName, 
                   w.warehouseID, w.warehouseName, w.building, w.street, 
                   w.barangay, w.city, w.country, w.zipcode, 
                   p.productID, p.productName, p.productDescription, p.size, p.color, p.category,
                   pod.orderQuantity, pod.expectedDate, u.userID, u.firstName, u.lastName
            FROM PurchaseOrders po
            JOIN Vendors v ON po.vendorID = v.vendorID
            JOIN PurchaseOrderDetails pod ON po.orderID = pod.orderID
            JOIN Warehouses w ON pod.warehouseID = w.warehouseID
            JOIN ProductVariants pv ON pod.variantID = pv.variantID
            JOIN Products p ON pv.productID = p.productID
            JOIN Users u ON po.userID = u.userID
            WHERE po.orderID = ?;
        ''', (orderID,))

        order_details = await cursor.fetchone()

        if not order_details:
            raise HTTPException(status_code=404, detail="Order details not found.")

        (orderID, orderDate, vendorID, vendorName, warehouseID, warehouseName, building, street, 
         barangay, city, country, zipcode, productID, productName, productDescription, size, color, category,
         quantity, expectedDate, userID, firstName, lastName) = order_details

        # Prepare payload for VMS
        po_payload = {
            "orderID": orderID,
            "productID": productID,
            "productName": productName,
            "productDescription": productDescription,
            "size": size,
            "color": 'Black',
            "category": category,
            "quantity": quantity,
            "warehouseID": warehouseID,
            "warehouseName": warehouseName,
            "warehouseAddress": f"{building}, {street}, {barangay}, {city}, {country}, {zipcode}",
            "vendorID": vendorID,
            "vendorName": vendorName,
            "orderDate": orderDate,
            "expectedDate": expectedDate,
            "userID": userID,
            "userName": f"{firstName} {lastName}",
        }

        po_payload = convert_decimal_to_json_compatible(po_payload)

        # Send PO to VMS
        response = await send_order_to_vms(po_payload)

        return {
            "message": "Purchase order successfully created and sent to VMS.",
            "payload": po_payload,
            "response": response,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating purchase order: {str(e)}")

    finally:
        await conn.close()

# get all generated orders and their details
@router.get('/purchase-orders', response_model=List[dict])
async def get_purchase_orders():
    try:
        conn = await database.get_db_connection()
        cursor = await conn.cursor()
        await cursor.execute(
            '''select 
    po.orderid,
    po.orderdate,
    po.orderstatus,
    po.statusdate,
    
    -- vendor details
    v.vendorid,
    v.vendorname,
    (isnull(v.building, '') + ', ' + isnull(v.street, '') + ', ' + isnull(v.barangay, '') + ', ' + 
     isnull(v.city, '') + ', ' + isnull(v.country, '') + ', ' + isnull(v.zipcode, '')) as vendoraddress,
    
    -- user details
    u.userid,
    concat(u.firstname, ' ', u.lastname) as orderedby,
    
    -- purchase order details
    pod.orderdetailid,
    pod.orderquantity,
    pod.expecteddate,
    pod.actualdate,
    
    -- product details
    p.productid,
    p.productname,
    p.productdescription,
    p.size,
    p.color,
    p.category,

    -- warehouse details
    w.warehouseid,
    w.warehousename,
    (isnull(w.building, '') + ', ' + isnull(w.street, '') + ', ' + isnull(w.barangay, '') + ', ' + 
     isnull(w.city, '') + ', ' + isnull(w.country, '') + ', ' + isnull(w.zipcode, '')) as warehouseaddress

from 
    purchaseorders po
left join 
    vendors v on po.vendorid = v.vendorid
left join 
    users u on po.userid = u.userid
left join 
    purchaseorderdetails pod on po.orderid = pod.orderid
left join 
    warehouses w on pod.warehouseid = w.warehouseid
left join 
    productvariants pv on pod.variantid = pv.variantid
left join 
    products p on pv.productid = p.productid

order by 
    po.orderdate desc;'''
        )
        rows = await cursor.fetchall()

        # fetch column names
        columns = [column[0] for column in cursor.description]

        # convert rows to dictionary
        purchase_orders = [dict(zip(columns, row)) for row in rows]

        return purchase_orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"error fetching purchase orders: {e}")
    finally:
        await conn.close()