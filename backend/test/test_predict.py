import pytest
from utils.predict import predict


def test_predict():
    res = predict('Hallo')
    assert isinstance(res, str)
