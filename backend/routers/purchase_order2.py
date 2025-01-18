import httpx

url = "http://127.0.0.1:8000/purchase-order/stock"
payload = {
    "productID": 1,
    "currentStock": 10  # Replace with actual product details
}

response = httpx.post(url, json=payload)
print(response.status_code)
print(response.json())
