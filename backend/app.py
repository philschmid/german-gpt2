from utils.predict import predict
from flask import Flask, request, jsonify
import os
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/predict', methods=['POST'])
@cross_origin()
def get_prediciton():
    data = request.get_json()
    response = predict(data['text'])
    return jsonify({"text": response})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
