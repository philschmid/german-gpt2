from transformers import BertTokenizer, BertForMaskedLM,AutoTokenizer,AutoModelWithLMHead
import torch
import string

class Model:
    def __init__(self, model_name,top_k = 5):
      self.tokenizer =  AutoTokenizer.from_pretrained(model_name)
      self.model = AutoModelWithLMHead.from_pretrained(model_name)
      self.top_k_words = top_k
    def decode(self,tokenizer, pred_idx):
        ignore_tokens = string.punctuation + '[PAD]'
        tokens = []
        for w in pred_idx:
            token = ''.join(tokenizer.decode(w).split())
            if token not in ignore_tokens:
                tokens.append(token.replace('##', ''))
        return tokens[:self.top_k_words]


    def encode(self,tokenizer, text, add_special_tokens=True):
        text = text.replace('<mask>', tokenizer.mask_token)
        # if <mask> is the last token, append a "." so that models dont predict punctuation.
        if tokenizer.mask_token == text.split()[-1]:
            text += ' .'

        input_ids = torch.tensor([tokenizer.encode(text, add_special_tokens=add_special_tokens)])
        mask_idx = torch.where(input_ids == tokenizer.mask_token_id)[1].tolist()[0]
        return input_ids, mask_idx


    def predict_next_word(self,req_text):
        text = req_text + ' <mask>'
        input_ids, mask_idx = self.encode(self.tokenizer, text)
        with torch.no_grad():
            predict = self.model(input_ids)[0]
        values = predict[0, mask_idx, :].topk(self.top_k_words).values.tolist()
        tokens = self.decode(self.tokenizer, predict[0, mask_idx, :].topk(self.top_k_words).indices.tolist())

        return [{'word':tokens[i],'score':values[i]} for i in range(len(tokens))]
    def predict_next_k_words(self,req_text,k_range,threshold=13):  
        text_score= 15   
        for i in range(k_range):
          tokens = self.predict_next_word(req_text)
          req_text += f" {tokens[0]['word']}"
          score = tokens[0]['score']
          text_score = (score + text_score) / 2
          if (text_score) < threshold:
            break
        return req_text