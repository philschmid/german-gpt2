from utils.predict import predict


def handler():
    try:
        res = predict('Hallo, wie')
        return res
    except Exception as e:
        raise(e)
