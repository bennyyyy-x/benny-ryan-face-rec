import os

MODEL_PATH = 'models/model1'
IMAGE_HEIGHT = 256
IMAGE_WIDTH = 256
IMAGE_DIR_PATH = 'images/'
BENNY_IMAGE_PATH = os.path.join(IMAGE_DIR_PATH, 'benny.jpg')
RYAN_IMAGE_PATH = os.path.join(IMAGE_DIR_PATH, 'ryan.jpg')
MTCNN_CONFIDENCE = 0.9
FACE_CONFIDENCE = 0.8