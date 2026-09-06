from PIL import Image
import numpy as np

img_path = '/home/thunder/.gemini/antigravity-cli/brain/3b55e6c5-72a7-4de7-8f4e-1c815ecb699e/.user_uploaded/uploaded_media_1788604072420.webp'
img = Image.open(img_path).convert('RGBA')
arr = np.array(img)
print("Shape:", arr.shape)
print("Has alpha channel:", (arr[:,:,3] < 255).any())

# Check background
print("Top left pixel:", arr[0, 0])
