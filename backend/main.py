from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
# from routers import inventory, auth, purchase_order, employee_accounts
from routers import inventory, purchase_order, auth, employee_accounts, receive_orders, sales
import uvicorn
import os

app = FastAPI()

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")


# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=origins,
)

# mount the static files directory
app.mount("/images_upload", StaticFiles(directory="images_upload"), name="images")

# Include routers for the various APIs
app.include_router(inventory.router, prefix='/ims', tags=['inventory'])
app.include_router(auth.router, prefix='/auth', tags=['auth'])
app.include_router(purchase_order.router, prefix='/purchase-order', tags=['purchase-order'])
app.include_router(employee_accounts.router, prefix='/employees', tags=['employee-accounts'])
app.include_router(receive_orders.router, prefix='/receive-orders', tags=['receive-orders'])
app.include_router(sales.router, prefix='/employee-sales', tags=['employee sales'])

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}

# Example API endpoint to serve some data (to match the React fetch URL)
@app.get("/api/data")
async def get_data():
    return {"data": "Sample data from FastAPI backend!"}

# Global exception handler for better error responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred.", "details": str(exc)},
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        port=8000, 
        host="127.0.0.1", 
        reload=True
    )
