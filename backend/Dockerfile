FROM python:3.10

WORKDIR /app

COPY . .

# Create a virtual environment in the /app directory
RUN python -m venv venv

# Install the dependencies
RUN /bin/bash -c "source venv/bin/activate && pip install --no-cache-dir -r requirements.txt"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
