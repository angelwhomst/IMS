from fastapi import * 
from pydantic import BaseModel
import httpx
import random
import string
from typing import Optional
import database
from routers.auth import get_current_active_user, role_required

# function to generate barcode
def generate_barcode():
    characters = string.ascii_uppercase + string.digits
    barcode = ''.join(random.choices(characters, k=13))
    return barcode

# function to generate sku
def generate_sku():
    characters = string.ascii_uppercase + string.digits
    sku = ''.join(random.choices(characters, k=8))
    return sku

router = APIRouter(dependencies=[Depends(role_required(["admin"]))])

# webhook url ---------------------

STOCK_WEBHOOK_URL = "http://127.0.0.1:8001/stock"

# pydantic model for products 
class Product(BaseModel):
    productName: str
    productDescription: Optional[str] = None
    size: str
    color: str
    category: str
    unitPrice: float
    reorderLevel: int = 0
    minStockLevel: int = 0
    maxStockLevel: int = 0
    quantity: int =1 # number of variants to addd

# pydantic model for adding quantities to an existing product
class AddQuantity(BaseModel):
    productName: str
    size: str
    category: str
    quantity: int

# pydantic model for prod variaants
class ProductVariant(BaseModel):
    productName: str
    barcode: str
    productCode: str
    productDescription: str
    size: str
    color: str
    unitPrice: float
    warehouseID: Optional [int] = None
    isDamaged: bool = False 
    isWrongItem: bool = False
    isReturned: bool = False


# function to trigger stock webhook
async def trigger_stock_webhook(product_id: int, current_stock: int):
    async with httpx.AsyncClient() as client:
        try:
            payload = {"productID": product_id, "currentStock": current_stock}
            response = await client.post(
                STOCK_WEBHOOK_URL, json=payload)
            if response.raise_for_status != 200:
                print(f'error triggering stock webhook: {e}')
        except Exception as e:
            print(f'Error sending stock webhook: {e}')

# create a new product with variants
@router.post('/products')
async def add_product(product: Product):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()
    try:
        # check if a product with the same details already exists
        await cursor.execute(
            '''select productID from Products
            where productname = ? and size=? and category=?
            and isActive=1''',
            product.productName,
            product.size,
            product.category
        )
        existing_product = await cursor.fetchone()

        if existing_product:
            raise HTTPException(status_code=400, 
                                detail=f"A product with name '{product.productName}', size '{product.size}', and category '{product.category}' already exists.")
        
        # insert the new product
        await cursor.execute(''' insert into Products (
                            productName, productDescription, size, color, category, 
                    unitPrice, reorderLevel, minStockLevel, maxStockLevel, currentStock)
                            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);''',
                            product.productName,
                            product.productDescription,
                            product.size,
                            product.color,
                            product.category,
                            product.unitPrice,
                            product.reorderLevel,
                            product.minStockLevel,
                            product.maxStockLevel,
                            product.quantity)
        await conn.commit()

        # get the last inserted productID
        await cursor.execute("select IDENT_CURRENT('Products')")
        product_id_row = await cursor.fetchone()
        product_id = product_id_row[0] if product_id_row else None

        if not product_id:
            raise HTTPException(status_code=500, detail='Failed to retrieve productID after insertion')

        # insert multiple variants/quantity into productVariants table
        variants_data= [(
                    generate_barcode(),
                    generate_sku(),
                    product_id )
                 for _ in range(product.quantity)
                 ]
        
        await cursor.executemany(
            ''' insert into ProductVariants (barcode, productCode, productID)
            values (?, ?, ?);''',
            variants_data
        )
        await conn.commit()

        # trigger the stock webhook
        await trigger_stock_webhook(product_id, product.quantity)

        return{'message': f'Product {product.productName} added with {product.quantity} variants.'}
    
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        await conn.close()

# add quantities to an existing products
@router.post('/products/add-quantity')
async def add_product_quantity(product: AddQuantity):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()

    try:
        await cursor.execute(
            ''' select productID, currentStock
            from Products
            where productName = ? and size = ? and category=? 
            and isActive = 1''',
            product.productName,
            product.size,
            product.category
        )
        product_row = await cursor.fetchone()

        if not product_row:
            raise HTTPException(status_code=404, detail='Product not found.')

        product_id, current_stock = product_row

        # add new variant to ProductVariants table 
        variants_data= [(
                    generate_barcode(),
                    generate_sku(),
                    product_id )
                 for _ in range(product.quantity)
                 ]
        await cursor.executemany(
                    '''insert into ProductVariants (barcode, productCode, productID)
                    values (?, ?, ?)''',
                    variants_data
                )
        
        # update currentStock in Products tabel
        new_stock = current_stock + product.quantity
        await cursor.execute(
            '''update Products set currentStock = ? where productID =?''',
            new_stock, product_id
        )

        await conn.commit()

        # trigger the stock webhook
        await trigger_stock_webhook(product_id, new_stock)

        return{'message': f'{product.quantity} quantities of {product.productName} added successfully.'}
    
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()
    
# get all productss 
@router.get("/products")
async def get_products():
    conn = await database.get_db_connection()
    try: 
        async with conn.cursor() as cursor:
            await cursor.execute('''
select p.productName, p.productDescription,
p.size, p.color, p.unitPrice, p.warehouseID,
count(pv.variantID) as 'available quantity', p.currentStock,
p.reorderLevel, p.minStockLevel, p.maxStockLevel
from products as p
left join ProductVariants as pv
on p.productID = pv.productID
where p.isActive = 1 and pv.isAvailable =1
group by p.productName, p.productDescription, p.size, p.color, p.unitPrice, p.warehouseID, p.reorderLevel, p.minStockLevel, p.maxStockLevel, p.currentStock
''')
            products = await cursor.fetchall()
            # map column names to row values
            return [dict(zip([column[0] for column in cursor.description], row)) for row in products]
    finally: 
        await conn.close()

# get one product
@router.get('/products/{product_id}')
async def get_product(product_id: int):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()
    try:
        await cursor.execute('''select p.productName, p.productDescription,
p.size, p.color, p.unitPrice, 
p.reorderLevel, p.minStockLevel, p.maxStockLevel, p.warehouseID,
count(pv.variantID) as 'available quantity'
from products as p
left join ProductVariants as pv
on p.productID = pv.productID
where p.productID = ? and p.isActive = 1 and pv.isAvailable =1
group by p.productName, p.productDescription, p.size, p.color, p.unitPrice, p.warehouseID, p.reorderLevel, p.minStockLevel, p.maxStockLevel''', product_id)
        product = await cursor.fetchone()
        if not product:
            raise HTTPException(status_code=404, detail='product not found')
        return dict(zip([column[0] for column in cursor.description], product))
    finally:
        await conn.close()

# get all product variants 
@router.get("/product/variants")
async def get_product_variants():
    conn = await database.get_db_connection()
    try: 
        async with conn.cursor() as cursor:
            await cursor.execute('''
select p.productName, pv.barcode, pv.productCode, 
p.productDescription, p.size, p.color, p.unitPrice, p.warehouseID,
p.reorderLevel, p.minStockLevel, p.maxStockLevel
from Products as p
full outer join ProductVariants as pv
on p.productID = pv.productID
where p.isActive = 1 and pv.isAvailable = 1;''')
            products = await cursor.fetchall()
            # map column names to row values
            return [dict(zip([column[0] for column in cursor.description], row)) for row in products]
    finally: 
        await conn.close()

# get one product variant
@router.get('/products/variant/{variant_id}', response_model=ProductVariant)
async def get_product(variant_id: int):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()
    try:
        await cursor.execute('''select p.productName, pv.barcode, pv.productCode, 
p.productDescription, p.size, p.color, p.unitPrice, p.warehouseID,
p.reorderLevel, p.minStockLevel, p.maxStockLevel
from Products as p
full outer join ProductVariants as pv
on p.productID = pv.productID
where p.isActive = 1 and pv.isAvailable = 1
and pv.variantID = ?''', variant_id)
        row = await cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail='product variant not found')
        
        product_variant = ProductVariant(
            productName=row[0],
            barcode=row[1],
            productCode=row[2],
            productDescription=row[3],
            size=row[4],
            color=row[5],
            unitPrice=row[6],
            warehouseID=row[7],
            reorderLevel=row[8],
            minStockLevel=row[9],
            maxStockLevel=row[10]
        )
        return product_variant
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()


# update a product
@router.put('/products/{product_id}')
async def update_product(product_id: int, product: Product):
    conn = await database.get_db_connection()
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(
            '''
update Products
set productName = ?, productDescription = ?, size = ?, color = ?, category = ?, unitPrice = ?, 
reorderLevel = ?, minStockLevel = ?, maxStockLevel = ?
where productID = ? ''',
            product.productName,
            product.productDescription,
            product.size,
            product.color,
            product.category,
            product.unitPrice,
            product.reorderLevel,
            product.minStockLevel,
            product.maxStockLevel,
            product_id,
        )
            await conn.commit()
            return{'message': 'product updated successfully!'}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

# delete a product
@router.delete('/products/{product_id}')
async def delete_product(product_id: int):
    conn = await database.get_db_connection()
    try:
        async with conn.cursor() as cursor:
            await cursor.execute('''update ProductVariant
                       set isActive=0
                       where productID = ?''', product_id)
            await conn.commit()
            return {'message': 'product deleted successfully'}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

# soft delete a product variant
@router.delete('/products/variant/{variant_id}')
async def delete_product_variant(variant_id: int):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()
    try:
        # get the productID of the variant to be deleted
        await cursor.execute(
            '''select productID from ProductVariants
               where variantID = ? AND isAVailable = 1''',
            variant_id
        )
        variant_row = await cursor.fetchone()

        if not variant_row:
            raise HTTPException(status_code=404, detail="Product variant not found or already deleted.")

        product_id = variant_row[0]

        # soft delete the product variant
        await cursor.execute('''update productVariants
                    set isAvailable = 0
                    where variantID = ?''', variant_id)
        
        # decrease currentStock in Products table
        await cursor.execute(
            '''update Products
            set currentStock = currentStock - 1
            where productID = ?''', product_id
        )
        await conn.commit()

        # get the updated stock
        await cursor.execute(
            'select currentStock from Products where productID =?', product_id)
        updated_stock_row = await cursor.fetchone()
        updated_stock = updated_stock_row[0] if updated_stock_row else 0

        # trigger teh stock webhook with updated stock level
        await trigger_stock_webhook(product_id, updated_stock)

        return {'message': 'Product variant deleted successfully'}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()