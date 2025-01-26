FROM python:3.10

WORKDIR /app

# Copy only the necessary files to build the image (including requirements.txt)
COPY . .

# Install dependencies from requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

EXPOSE 8000

# Start the app with Uvicorn  
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]