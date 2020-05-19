from model.model import ModelWrapper
from pathlib import Path

model_path = 'german-gpt2'
tokens_to_generate = 2
top_k = 8

model = ModelWrapper.load(Path(model_path))


def predict(text=''):
    try:
        tokens = model.tokenize(text)
        print(tokens)
        tokens_gen = model.generate_tokens(tokens, tokens_to_generate, top_k)
        return model.sp_model.DecodePieces(tokens_gen)
    except Exception as e:
        raise(e)
