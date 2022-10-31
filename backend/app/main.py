import nltk
nltk.download('punkt')
from nltk import sent_tokenize
from sentence_transformers import SentenceTransformer, util
import numpy as np
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/split-text")
def split_sentences(input_text: str):    
    sentence_list = nltk.tokenize.sent_tokenize(input_text)
    return sentence_list

@app.get("/sentence-embeddings")
def return_sentence_embeddings(input_text: str):
    model = SentenceTransformer('allenai-specter')
    sentence_list = nltk.tokenize.sent_tokenize(input_text)
    sentence_embeddings = np.stack([model.encode(sentence) for sentence in sentence_list])
    return sentence_embeddings.tolist()

@app.get("/semantic-search")
def semantic_search(input_text: str, user_query: str):
    model = SentenceTransformer('allenai-specter')
    sentence_list = nltk.tokenize.sent_tokenize(input_text)
    sentence_embeddings = np.stack([model.encode(sentence) for sentence in sentence_list])
    query_embedding = model.encode(user_query)
    answer_meta = util.semantic_search(query_embedding, sentence_embeddings, top_k=1)
    response = {}
    for answer in answer_meta[0]:
        s_id = answer["corpus_id"]
        score = answer["score"]
        response["score"] = str(score)
        response["sentence"] = sentence_list[s_id]
        print(f"The most similar sentence to the query: {sentence_list[s_id]}")
        print(f"Score: {str(score)}")

    return JSONResponse(response)