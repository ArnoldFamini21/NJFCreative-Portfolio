import glob
from PIL import Image
import numpy as np

for f in glob.glob("icon_*.png"):
    print(f"Processing {f}...")
    img = Image.open(f).convert("RGBA")
    data = np.array(img).astype(np.float32)
    
    alpha = np.max(data[:,:,:3], axis=2)
    new_data = np.zeros_like(data)
    alpha_safe = np.maximum(alpha, 1.0)
    
    new_data[:,:,0] = np.clip((data[:,:,0] / (alpha_safe / 255.0)), 0, 255)
    new_data[:,:,1] = np.clip((data[:,:,1] / (alpha_safe / 255.0)), 0, 255)
    new_data[:,:,2] = np.clip((data[:,:,2] / (alpha_safe / 255.0)), 0, 255)
    new_data[:,:,3] = alpha
    
    Image.fromarray(new_data.astype(np.uint8)).save(f)
