from flask import Flask, render_template, Response, jsonify
from keras.models import load_model
from keras.preprocessing import image
import cv2
import numpy as np
import time

app = Flask(__name__)

# Load the pre-trained model
model_best = load_model('./face_model.h5')

# Classes for 7 emotional states
class_names = ['Angry', 'Disgusted', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Load the pre-trained face cascade
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Store the latest emotion globally
latest_emotion = "Neutral"

def generate_frames():
    global latest_emotion
    cap = cv2.VideoCapture(0)

    try:
        while True:
            # Capture frame-by-frame
            success, frame = cap.read()
            if not success:
                break

            # Convert the frame to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Detect faces
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))

            for (x, y, w, h) in faces:
                # Extract the face region
                face_roi = frame[y:y + h, x:x + w]

                # Preprocess the face image
                face_image = cv2.resize(face_roi, (48, 48))
                face_image = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
                face_image = image.img_to_array(face_image)
                face_image = np.expand_dims(face_image, axis=0)

                # Predict emotion
                predictions = model_best.predict(face_image)
                emotion_label = class_names[np.argmax(predictions)]
                latest_emotion = emotion_label

                # Display the emotion label
                cv2.putText(frame, f'Emotion: {emotion_label}', (x, y - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

                # Draw rectangle around face
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

            # Encode the frame to send to React
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            # Slow down the feed slightly
            time.sleep(0.03)

    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        cap.release()


@app.route('/video_feed')
def video_feed():
    # Route for webcam feed
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/emotion', methods=['GET'])
def get_emotion():
    # This API endpoint returns the current detected emotion as JSON
    return jsonify({'emotion': latest_emotion})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
