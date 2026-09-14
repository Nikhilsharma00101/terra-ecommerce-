from PIL import Image, ImageOps
import numpy as np

# Load original logo
img = Image.open('public/images/logo/logo.jpeg').convert('RGB')
data = np.array(img)

# Convert to grayscale / luminance
# In the original image, background is black (~0) and logo is white (~255)
gray = np.dot(data[...,:3], [0.2989, 0.5870, 0.1140])

# Clean background noise (anything < 25 is transparent, smooth curve to 255)
alpha = np.clip((gray - 20) / (230 - 20) * 255, 0, 255).astype(np.uint8)

# Find bounding box where alpha > 10 to crop tightly
coords = np.argwhere(alpha > 10)
y0, x0 = coords.min(axis=0)
y1, x1 = coords.max(axis=0) + 1

# Add slight padding
pad = 8
y0 = max(0, y0 - pad)
x0 = max(0, x0 - pad)
y1 = min(img.height, y1 + pad)
x1 = min(img.width, x1 + pad)

cropped_alpha = alpha[y0:y1, x0:x1]

# 1. White logo on transparent
white_img = np.zeros((cropped_alpha.shape[0], cropped_alpha.shape[1], 4), dtype=np.uint8)
white_img[..., 0] = 246 # Warm ivory white #F6F3ED
white_img[..., 1] = 243
white_img[..., 2] = 237
white_img[..., 3] = cropped_alpha
Image.fromarray(white_img).save('public/images/logo/logo-white.png')

# 2. Dark charcoal logo on transparent #181817
dark_img = np.zeros((cropped_alpha.shape[0], cropped_alpha.shape[1], 4), dtype=np.uint8)
dark_img[..., 0] = 24 # Deep charcoal #181817
dark_img[..., 1] = 24
dark_img[..., 2] = 23
dark_img[..., 3] = cropped_alpha
Image.fromarray(dark_img).save('public/images/logo/logo-dark.png')

# 3. Forest green logo on transparent #2D4438
green_img = np.zeros((cropped_alpha.shape[0], cropped_alpha.shape[1], 4), dtype=np.uint8)
green_img[..., 0] = 45 # Forest green #2D4438
green_img[..., 1] = 68
green_img[..., 2] = 56
green_img[..., 3] = cropped_alpha
Image.fromarray(green_img).save('public/images/logo/logo-green.png')

# 4. Pure white (#FFFFFF)
pure_white_img = np.zeros((cropped_alpha.shape[0], cropped_alpha.shape[1], 4), dtype=np.uint8)
pure_white_img[..., 0] = 255
pure_white_img[..., 1] = 255
pure_white_img[..., 2] = 255
pure_white_img[..., 3] = cropped_alpha
Image.fromarray(pure_white_img).save('public/images/logo/logo-pure-white.png')

print("Successfully generated transparent logos:")
print("- public/images/logo/logo-white.png")
print("- public/images/logo/logo-dark.png")
print("- public/images/logo/logo-green.png")
print("- public/images/logo/logo-pure-white.png")
