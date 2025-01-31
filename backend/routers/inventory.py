from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from pydantic import BaseModel
import httpx
import random
import string
import os
import base64
from typing import Optional
import logging
from fastapi.staticfiles import StaticFiles 
import database
from routers.auth import role_required, get_current_active_user

# Directory for saving uploaded images
UPLOAD_DIRECTORY = "images_upload"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Function to generate a unique filename for images
def generate_image_filename():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=16)) + ".png"

# Function to decode Base64 image and save to file
def save_base64_image(base64_image: str) -> str:
    try:
        # Decode the Base64 string
        if "," in base64_image:
            base64_image = base64_image.split(",")[1]

        
        missing_padding = len(base64_image) % 4
        if missing_padding:
            base64_image += "=" * (4 - missing_padding)

        image_data = base64.b64decode(base64_image)
        filename = generate_image_filename()
        filepath = os.path.join(UPLOAD_DIRECTORY, filename)
        with open(filepath, "wb") as file:
            file.write(image_data)
        return filepath
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid Base64 image: {str(e)}")

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

STOCK_WEBHOOK_URL = "http://127.0.0.1:8001/stock" # not used

# pydantic model for products 
class Product(BaseModel):
    productName: str
    productDescription: Optional[str] = None
    size: str
    color: Optional[str] = None
    category: str
    unitPrice: float
    threshold: int = 0
    reorderLevel: int = 0
    minStockLevel: int = 0
    maxStockLevel: int = 0
    quantity: int = 1  # number of variants to add
    image: Optional[str] = None  # Base64 image string

# pydantic model for adding quantities to an existing product
class AddQuantity(BaseModel):
    productName: str
    size: str
    category: str
    quantity: int

# pydantic model for product variants
class ProductVariant(BaseModel):
    productName: str
    barcode: str
    productCode: str
    productDescription: str
    size: str
    color: Optional[str] = None
    unitPrice: float
    warehouseID: Optional[int] = None
    isDamaged: bool = False
    isWrongItem: bool = False
    isReturned: bool = False

class ProductQueryParams(BaseModel):
    productName: str
    productDescription: str
    unitPrice: Optional[float] = None
    category: str

class ProductVariantResponse(BaseModel):
   size: str
   productCode: str
   barcode: str

class ProductUpdate(BaseModel):
    productName: str
    productDescription: str
    size: str
    category: str
    unitPrice: float
    newSize: str
    minStockLevel: int
    maxStockLevel: int
    reorderLevel: int
    threshold: int

    class Config:
        orm_mode = True

class ProductUpdates(BaseModel):
    productName: str  
    productDescription: str 
    category: str  
    unitPrice: float  
    newProductName: str 
    newProductDescription: str 
    newCategory: str  
    newUnitPrice: float 
    newImage: str 

class ADDSIZE(BaseModel):
    productName: str
    productDescription: str
    size: str
    category: str
    unitPrice: float
    threshold: int
    reorderLevel: int
    minStockLevel: int
    maxStockLevel: int
    quantity: int
    image: str = None


# function to trigger stock webhook
async def trigger_stock_webhook(product_id: int, current_stock: int):
    async with httpx.AsyncClient() as client:
        try:
            # Ensure currentStock is treated as an integer
            payload = {"productID": product_id, "currentStock": int(current_stock)} 
            response = await client.post(STOCK_WEBHOOK_URL, json=payload)
            response.raise_for_status()  
        except Exception as e:
            print(f'Error sending stock webhook: {e}')

# create a new product with variants
@router.post('/products')
async def add_product(product: Product):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()
    try:
        # save Base64 image to file
        image_path = save_base64_image(product.image)

        # call the stored procedure
        new_product_id = await cursor.execute('''
        declare @newProductID int;
        exec sp_add_product ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @newProductID output;
        select @newProductID;''',
            (
                product.productName,
                product.productDescription,
                product.size,
                product.color,
                product.category,
                float(product.unitPrice),
                product.threshold,
                product.reorderLevel,
                product.minStockLevel,
                product.maxStockLevel,
                product.quantity,
                image_path,
            ),) 
        # fetch the new product id
        product_id_row = await cursor.fetchone()
        product_id = product_id_row[0] if product_id_row else None

        if not product_id:
            raise HTTPException(status_code=500, detail='Failed to retrieve productID after insertion')
        await conn.commit()

        # trigger stock webhook asynchronously
        await trigger_stock_webhook(product_id, product.quantity)

        return {'message': f'Product {product.productName} added with {product.quantity} variants.'}
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
        # call the stored procedure
        new_stock_ouput = await cursor.execute(
            '''declare @newStock int;
            exec sp_add_product_quantity ?, ?, ?, ?, @newStock output;select @newStock;''',
            (
                product.productName,
                product.size,
                product.category,
                product.quantity
            ),)
        
        # fetch the new stock value
        new_stock_row = await cursor.fetchone()
        new_stock = new_stock_row[0] if new_stock_row else None

        if new_stock is None:
            raise HTTPException(status_code=500, detail='Failed to update product quantity')
        
        await conn.commit()

        # trigger the stock webhook asynchronously
        await trigger_stock_webhook(product.productName, new_stock)

        return {'message': f'{product.quantity} quantities of {product.productName} added successfully.'}
    
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

# edit size of a product
@router.post('/products/update')
async def update_product(productData: ProductUpdate):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()

    try:
        # execute stored proc
        await cursor.execute(
            '''exec sp_update_product ?, ?, ?, ?, ?, ?, ?, ?, ?, ?''',
            (
                productData.productName,
                productData.productDescription,
                productData.size,
                productData.category,
                float(productData.unitPrice),
                productData.newSize,
                productData.minStockLevel,
                productData.maxStockLevel,
                productData.reorderLevel,
                productData.threshold
            )
        )
        await conn.commit()
        return {'message': f'Product {productData.productName} updated successfully.'}
    
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

# add a new size to an existing product
@router.post('/products/add-size')
async def add_size(product: ADDSIZE):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()

    try:
        # save base64 image to file
        image_path = None
        if product.image:
            image_path = save_base64_image(product.image)
        
        # execute stored proc
        await cursor.execute(
            '''exec sp_add_product_size ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
             output''',
             (
                 product.productName,  
                product.productDescription,  
                product.size,  
                product.category,  
                float(product.unitPrice),  
                product.threshold,  
                product.reorderLevel,  
                product.minStockLevel,  
                product.maxStockLevel,  
                product.quantity,  
                image_path
             )
        )
        await conn.commit()
    
        return {'message': f'Product {product.productName} size {product.size} added with {product.quantity} variants successfully.'}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

# get all sizes of a product
@router.get('/products/sizes')
async def get_size(productName: str, category: str, unitPrice: Optional[float] = None, productDescription: Optional[str] = None):
    conn = await database.get_db_connection()
    try:
        async with conn.cursor() as cursor:
            # SQL query to fetch all sizes with the same field names used in the frontend code
            await cursor.execute('''sp_get_all_sizes_of_a_product @productName = ?, @category = ?''', 
                                 (productName, category))
            
            products = await cursor.fetchall()

            if products:
                # map the query results to a list of dictionaries with the field names used in the frontend
                size_list = [
                    {"size": product[0], "quantity": product[1], "minQuantity": product[2], "maxQuantity": product[3], "reorderQuantity": product[4], "threshold": product[5]}
                    for product in products
                ]
                return {"size": size_list}  
            else:
                raise HTTPException(status_code=404, detail="Product not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

@router.get('/products/size_variants', response_model=list[ProductVariantResponse])
async def get_size_variants(productName: str, category: str, unitPrice: Optional[float] = None, productDescription: Optional[str] = None):
    conn = await database.get_db_connection()
    try:
     async with conn.cursor() as cursor:

        await cursor.execute(
            '''exec sp_get_variants_per_size ?, ?, ?;  
            ''', (productName, category, productDescription))
        variants = await cursor.fetchall()

        if variants:
            variant_list = [
                {
                    "size": variant[0],
                    "productCode": variant[1],
                    "barcode": variant[2]
                }
                for variant in variants
            ]
            return variant_list
        else:
            raise HTTPException(status_code=404, detail="Product not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:    
        await conn.close()

#update product details such as name, description, category, unit price, and image
@router.put('/products/update-details')
async def update_product_details(productData: ProductUpdates):
    conn = await database.get_db_connection()
    cursor = await conn.cursor()

    try:
        # prepare output variables
        updated_product_name = ''  
        updated_product_description = ''  
        updated_category = ''  
        updated_unit_price = 0.0  
        image_path = ''

        # execute stored proc
        await cursor.execute(
            '''exec sp_update_product_details ?, ?, ?, ?, ?, ?, ?, ?, ? output, ? output, ? output, ? output, ? output''',
            (
                productData.productName,  
                productData.productDescription,  
                productData.category,  
                float(productData.unitPrice),  
                productData.newProductName,  
                productData.newProductDescription,  
                productData.newCategory,  
                float(productData.newUnitPrice),  
                updated_product_name,  
                updated_product_description,  
                updated_category,  
                updated_unit_price,  
                image_path
            )
        )
        await conn.commit() 

        return {  
            "message": "Product updated successfully.",  
            "updated_product": {  
                "productName": updated_product_name,  
                "productDescription": updated_product_description,  
                "category": updated_category,  
                "unitPrice": updated_unit_price,  
                "image_path": image_path  
            }  
        }
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
            await cursor.execute(''' select * from vw_get_all_products''')
            products = await cursor.fetchall()
            # map column names to row values
            return [dict(zip([column[0] for column in cursor.description], row)) for row in products]
    finally: 
        await conn.close()


# get all Womens products
@router.get("/products/Womens-Leather-Shoes")
async def get_womens_products():
    conn = await database.get_db_connection()
    cursor = await conn.cursor()
    try: 
        await cursor.execute(
            ''' exec sp_get_all_womens''')
        products = await cursor.fetchall()
        # map column names to row values
        return [dict(zip([column[0] for column in cursor.description], row)) for row in products]
    finally: 
        await conn.close()

# get all Mens products
@router.get("/products/Mens-Leather-Shoes")
async def get_mens_products():
    logging.info("Received request for Men's Leather Shoes products")

    conn = await database.get_db_connection()
    cursor = await conn.cursor()
    try: 
        await cursor.execute(
            '''exec sp_get_all_mens''')
        products = await cursor.fetchall()
        # map column names to row values
        return [dict(zip([column[0] for column in cursor.description], row)) for row in products]
    finally: 
        await conn.close()

# get all boy's leather shoes
@router.get("/products/Boys-Leather-Shoes") 
async def get_boys_products():
    conn = await database.get_db_connection()
    cursor = await conn.cursor()
    try: 
        await cursor.execute(
            '''exec sp_get_all_boys''')
        products = await cursor.fetchall()
        # map column names to row values
        return [dict(zip([column[0] for column in cursor.description], row)) for row in products]
    finally: 
        await conn.close()

# get all girl's leather shoes
@router.get("/products/Girls-Leather-Shoes")
async def get_girls_products():
    conn = await database.get_db_connection()
    cursor = await conn.cursor()
    try: 
        await cursor.execute(
            '''exec sp_get_all_girls''')
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
        await cursor.execute('''exec sp_get_one_product ?''', (product_id,))
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
            await cursor.execute('''select * from vw_get_all_variants''')
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
        await cursor.execute('''exec sp_get_one_variant ?''', (variant_id,))
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
       # prepare an output variable for the updated stock 
       updated_stock = 0

       # execute the stored proc
       await cursor.execute('''exec sp_delete_product_variant ?, ? output''', (variant_id, updated_stock))
       await conn.commit()

       # trigger the stock webhook with updated stock level
       await trigger_stock_webhook(variant_id, updated_stock)

       return {'message': 'Product variant deleted successfully'}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

#delete a size
@router.patch('/products/sizes/soft-delete')
async def soft_delete_size(
    productName: str, 
    unitPrice: float, 
    category: str, 
    size: str
):
    conn = await database.get_db_connection()
    try:
        async with conn.cursor() as cursor:
            # execute the store proc
            await cursor.execute(
                ''' exec sp_soft_delete_size ?, ?, ?, ?''',
                (productName, float(unitPrice), category, size)
            )
            await conn.commit()
            return {'message': 'Product size deleted successfully'}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

@router.patch('/products/soft-delete')
async def soft_delete_products(productName: str, category: str):
    conn = await database.get_db_connection()
    try:
        async with conn.cursor() as cursor:
            # execute the store proc
            await cursor.execute('''exec sp_soft_delete_products ?, ?''', (productName, category))
            await conn.commit()
            return {'message': 'Product deleted successfully'}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

