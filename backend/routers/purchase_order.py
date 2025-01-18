from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel 
import httpx
from datetime import datetime, timedelta
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
    color: str
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
    return data


# manual endpoint to create PO
@router.post('/create-purchase-order')
async def create_purchase_order(payload: dict):
    try:
        # extract payload fields
        productID = payload.get('productID')
        quantity = payload.get('quantity')
        warehouseID = payload.get('warehouseID')
        category = payload.get('category')
        size = payload.get('size')
        color = payload.get('color') 
        userID = payload.get('userID')

        # validate the payload 
        if not productID or not quantity or not warehouseID:
            raise HTTPException(status_code=400, detail="invalid payload. missing required fields")
        
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        # check product and warehouse
        await cursor.execute('''
        SELECT 
            P.productID, P.productName, P.productDescription, P.size, P.color, P.category, 
            W.warehouseName, 
            (ISNULL(W.building, '') + ', ' + ISNULL(W.street, '') + ', ' + ISNULL(W.barangay, '') + ', ' + 
             ISNULL(W.city, '') + ', ' + ISNULL(W.country, '') + ', ' + ISNULL(W.zipcode, '')) AS warehouseAddress
        FROM 
            Products P
        INNER JOIN 
            Warehouses W ON P.warehouseID = W.warehouseID
        WHERE 
            P.productID = ? AND P.warehouseID = ?
            AND P.category = ? AND P.size = ? AND P.color = ?
            AND P.isActive = 1''',
            (productID, warehouseID,   category, size, color))
        product = await cursor.fetchone()

        if not product:
            raise HTTPException(status_code=404, detail='Product not found or inactive.')
        
        productID, productName, productDescription, size, color, category, warehouseName, warehouseAddress = product

        # select vendor
        await cursor.execute('''
        select top 1 vendorID, vendorName
                             from vendors
                             where isActive = 1
                             ''')
        vendor = await cursor.fetchone()
        if not vendor:
            raise HTTPException(status_code=404, detail="no active vendors available.")
        
        vendorID, vendorName = vendor

        # fetch user details
        await cursor.execute(
            '''select firstName, lastName
            from Users
            where userID = ?''', 
            (userID,)
        )
        user = await cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail='user not found.')
        
        firstName, lastName =user

        # identify product variant to connect to hte right productID
        await cursor.execute(
            '''select variantID
        FROM ProductVariants
        WHERE productID = ? AND isAvailable = 1
        ''', (productID,))
        variant = await cursor.fetchone()
        if not variant:
            raise HTTPException(status_code=404, detail="no available product variant found")
        variantID = variant[0]

        # prepare dynamic dates 
        orderDate = datetime.now().date().isoformat()
        expectedDate = (datetime.now() + timedelta(days=7)).date().isoformat()

        # insert into PurchaseOrders table
        await cursor.execute(
            '''INSERT INTO PurchaseOrders (orderDate, orderStatus, statusDate, vendorID, userID)
            OUTPUT INSERTED.orderID
            VALUES (?, ?, ?, ?, ?)
            ''',
            (orderDate, "Pending", datetime.utcnow(), vendorID, userID)
        )
        order = await cursor.fetchone()
        orderID = order[0] if order else None

        if not orderID:
            raise HTTPException(status_code=500, detail="Failed to create purchase order.")
        
        # insert into PurchaseORderDetails table
        await cursor.execute(
            '''insert into PurchaseOrderDetails (orderQuantity, expectedDate, warehouseID, orderID, variantID)
            values (?, ?, ?, ?, ?)
            ''',
            (quantity, expectedDate, warehouseID, orderID, variantID)
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
            "quantity": quantity,
            "warehouseID": warehouseID,
            "warehouseName": warehouseName,
            "warehouseAddress": warehouseAddress,
            "vendorID": vendorID,
            "vendorName": vendorName,
            "orderDate": orderDate,
            "expectedDate": expectedDate,
            "userID": userID,
            "userName": f"{firstName} {lastName}",
            "variantID": variantID
        }

        po_payload = convert_decimal_to_json_compatible(po_payload)

        # send PO to VMS
        response = await send_order_to_vms(po_payload)

        return {
            "message": "Purchase order manually created and sent to VMS.",
            "payload": po_payload,
            "response": response,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating purchase order: {e}")
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