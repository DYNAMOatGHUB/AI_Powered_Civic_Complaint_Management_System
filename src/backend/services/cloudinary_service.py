import os
import base64
import cloudinary
import cloudinary.uploader

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    try:
        cloudinary.config(
            cloud_name=CLOUDINARY_CLOUD_NAME,
            api_key=CLOUDINARY_API_KEY,
            api_secret=CLOUDINARY_API_SECRET
        )
    except Exception as cfg_err:
        print(f"Cloudinary config warning: {cfg_err}")

def upload_image(image_bytes: bytes) -> str:
    """
    Uploads camera capture image to Cloudinary and returns secure URL.
    Fallback gracefully to base64 data URL if Cloudinary keys are missing, disabled, or encounter errors.
    """
    if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
        try:
            response = cloudinary.uploader.upload(image_bytes, folder="civic_pulse_complaints")
            if response and "secure_url" in response:
                return response.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload exception (falling back to base64 data URL): {e}")

    # Dev and Error fallback: return clean base64 data URL
    b64_str = base64.b64encode(image_bytes).decode('utf-8')
    return f"data:image/jpeg;base64,{b64_str}"
