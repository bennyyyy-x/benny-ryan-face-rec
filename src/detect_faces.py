import sys
import os

# Add the parent directory (project root) to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from mtcnn.mtcnn import MTCNN
from PIL import Image
import pillow_heif
import tensorflow as tf
from tensorflow import keras
import numpy as np
from config.config import MODEL_PATH, IMAGE_HEIGHT, IMAGE_WIDTH, BENNY_IMAGE_PATH, RYAN_IMAGE_PATH, IMAGE_DIR_PATH, MTCNN_CONFIDENCE, FACE_CONFIDENCE

pillow_heif.register_heif_opener()

def main():
    image_path = sys.argv[1]
    print(f"Image path: {image_path}")

    if image_path is None or not (image_path.lower().endswith('.heic') or
                                  image_path.lower().endswith('.heif') or
                                  image_path.lower().endswith('.jpg') or
                                  image_path.lower().endswith('.jpeg') or
                                  image_path.lower().endswith('.png')):
        print(-1)
        return

    image = Image.open(image_path)
    detector = MTCNN()
    image_array = np.array(image)
    faces = detector.detect_faces(image_array)
    if len(faces) == 0:
        print('0\n0')
        return

    model: keras.models.Model = keras.models.load_model(MODEL_PATH)

    benny_face = None
    benny_prob = 0
    ryan_face = None
    ryan_prob = 0

    if os.path.exists(BENNY_IMAGE_PATH):
        os.remove(BENNY_IMAGE_PATH)
    if os.path.exists(RYAN_IMAGE_PATH):
        os.remove(RYAN_IMAGE_PATH)
    if not os.path.exists(IMAGE_DIR_PATH):
        os.makedirs(IMAGE_DIR_PATH)

    for face in faces:
        x, y, w, h = face['box']
        confidence = face['confidence']
        print(f"Face: {x}, {y}, {w}, {h}, {confidence}")
        if confidence <= MTCNN_CONFIDENCE:
            continue

        cropped = image.crop((x, y, x + w, y + h))
        cropped_resized = cropped.resize((IMAGE_WIDTH, IMAGE_HEIGHT))
        if cropped_resized.mode != "RGB":
            cropped_resized = cropped_resized.convert("RGB")
        cropped_array = np.array(cropped_resized) / 255.0
        cropped_array = np.expand_dims(cropped_array, axis=0)
        print(f"cropped_array.shape is {cropped_array.shape}")

        score = model.predict(cropped_array)
        print(f"score is {score}")
        index = np.argmax(score)
        if index == 0:
            if score[0, index] > benny_prob:
                benny_face = cropped
                benny_prob = score[0, index]
        elif index == 1:
            if score[0, index] > ryan_prob:
                ryan_face = cropped
                ryan_prob = score[0, index]

    if benny_face is not None:
        benny_face.save(BENNY_IMAGE_PATH)
    if ryan_face is not None:
        ryan_face.save(RYAN_IMAGE_PATH)

if __name__ == '__main__':
    main()