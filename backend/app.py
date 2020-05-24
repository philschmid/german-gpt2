from utils.predict import predict
from flask import Flask, request, jsonify
import os
from flask_cors import CORS, cross_origin
from model.bert import Model
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

model = Model(model_name='distilbert-base-german-cased')


@app.route('/predict', methods=['POST'])
@cross_origin()
def get_prediciton():
    data = request.get_json()
    response = predict(data['text'])
    return jsonify({"text": response})


@app.route('/predict/word', methods=['POST'])
@cross_origin()
def get_prediciton_word():
    data = request.get_json()
    response = model.predict_next_word(data['text'])
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
