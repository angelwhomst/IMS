from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
# from routers import inventory, auth, purchase_order, employee_accounts
from routers import inventory, purchase_order, auth, employee_accounts, receive_orders, sales
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"  
]

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=origins,
)

# Mount the frontend folder if needed (for serving static files)
# app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

# Include routers for the various APIs
app.include_router(inventory.router, prefix='/ims', tags=['inventory'])
app.include_router(auth.router, prefix='/auth', tags=['auth'])
app.include_router(purchase_order.router, prefix='/purchase-order', tags=['purchase-order'])
app.include_router(employee_accounts.router, prefix='/employee-accounts', tags=['employee-accounts'])
app.include_router(receive_orders.router, prefix='/receive-orders', tags=['receive-orders'])
app.include_router(sales.router, prefix='/sales', tags=['sales'])

# Example API endpoint to serve some data (to match the React fetch URL)
@app.get("/api/data")
async def get_data():
    return {"data": "Sample data from FastAPI backend!"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        port=8000, 
        host="127.0.0.1", 
        reload=True
    )
