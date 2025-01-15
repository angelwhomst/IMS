from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel
import logging
import database
from routers.auth import role_required, get_current_active_user


logging.basicConfig(level=logging.INFO)
router = APIRouter(dependencies=[Depends(role_required(["admin", "employee"]))])

# Pydantic Models
class CartItemInput(BaseModel):
    productName: str
    category: str
    size: str
    quantity: int
    # price: float

class CheckoutRequest(BaseModel):
    cart: List[CartItemInput]

# In-memory cart storage
cart = []

# Add to cart
@router.post("/sales/cart")
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
            "quantity": item.quantity
            #,"price": item.price
        }
        cart.append(cart_item)

        return {"message": "Item added to cart."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        await conn.close()

# view cart
@router.get("/sales/cart")
async def view_cart():
    return cart

# process sales endpoint
@router.post("/sales/checkout")
async def checkout(request: CheckoutRequest, current_user=Depends(get_current_active_user)):
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

        #clear in-memory cart after successful checkout
        cart.clear()

        return {'message': 'Checkout successful!'}
    
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        await conn.close()
#
