from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the model file
model_path = os.path.join(current_dir, '/model.h5')

# Load the model
try:
    model = load_model(model_path)
    logger.info(f"Model loaded successfully from {model_path}")
except Exception as e:
    logger.error(f"Failed to load model from {model_path}: {str(e)}")
    raise HTTPException(status_code=500, detail="Failed to load model")

@app.post("/predict/")
async def create_upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        image = image.convert('RGB')  # Ensure the image is in RGB format
        image = image.resize((224, 224))  # Resize to the input size required by the model
        image = np.array(image) / 255.0  # Normalize the image
        image = np.expand_dims(image, axis=0)  # Model expects a batch dimension

        logger.info(f"Processing image: {file.filename}, shape: {image.shape}")

        predictions = model.predict(image)
        class_names = ["Normal", "Pneumonia"]
        response = {
            "class": class_names[np.argmax(predictions)],
            "confidence": float(np.max(predictions)),
            "probabilities": {
                class_name: float(prob) for class_name, prob in zip(class_names, predictions[0])
            }
        }
        logger.info(f"Prediction result: {response}")
        return JSONResponse(content=response)
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)