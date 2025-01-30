from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from pydantic import BaseModel
import database
from routers.auth import role_required

router = APIRouter(dependencies=[Depends(role_required(["admin"]))])

#dashboard Total Products
@router.get("/products/count")
async def count_unique_products():
    conn = None
    try:
        # Establish database connection
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        # Query to count unique products by productName and category (grouped by productName and category)
        query = """
            SELECT COUNT(*)
            FROM (
                SELECT productName, category
                FROM Products
                WHERE isActive = 1
                GROUP BY productName, category
            ) AS unique_products;
        """
        await cursor.execute(query)
        result = await cursor.fetchone()

        # Return the count
        return {"Total Products": result[0]}

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error counting unique products: {str(e)}")
    finally:
        if conn:
            await conn.close()

#Count all the Orders
@router.get("/orders/last30days/count")
async def count_last_30_days_orders():
    conn = None
    try:
        # Establish database connection
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        # Query to count orders from the last 30 days based on orderStatus
        query = """
            SELECT COUNT(*)
            FROM purchaseOrders
            WHERE orderDate >= DATEADD(DAY, -30, GETDATE()) 
              AND orderStatus IS NOT NULL;
        """
        await cursor.execute(query)
        result = await cursor.fetchone()

        # Return the count
        return {"orderCount": result[0]}

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error counting orders: {str(e)}")
    finally:
        if conn:
            await conn.close()

#For count orders in Delivered status 1 month 
@router.get("/orders/delivered/last30days/count")
async def count_last_30_days_delivered_orders():
    conn = None
    try:
        # Establish database connection
        conn = await database.get_db_connection()
        cursor = await conn.cursor()

        # Query to count delivered orders from the last 30 days based on orderStatus
        query = """
            SELECT COUNT(*)
            FROM purchaseOrders
            WHERE orderDate >= DATEADD(DAY, -30, GETDATE()) 
              AND orderStatus = 'Received';
        """
        await cursor.execute(query)
        result = await cursor.fetchone()

        # Return the count
        return {"deliveredOrderCount": result[0]}

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error counting delivered orders: {str(e)}")
    finally:
        if conn:
            await conn.close()