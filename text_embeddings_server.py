from typing import List
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModel
import torch
from chromadb import Documents, EmbeddingFunction
import chromadb
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

class EmbeddingFunction(EmbeddingFunction):
    def __init__(self, model_name: str):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)

    def __call__(self, texts: Documents) -> List[List[float]]:
        inputs = self.tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
        with torch.no_grad():
            embeddings = self.model(**inputs).pooler_output
        return  embeddings.detach().numpy().tolist()

chroma_client = chromadb.PersistentClient(path="./chroma_data")

@app.route('/store_text_embeddings', methods=['POST'])
def store_text_embeddings():
    texts = request.json['texts']
    collection_name = request.json.get('collection_name', 'default_collection')

    if not texts:
        return jsonify({"error": "No texts provided"}), 400

    try:
        collection = chroma_client.get_collection(collection_name, embedding_function=EmbeddingFunction("intfloat/multilingual-e5-large"))
    except ValueError:
        collection = chroma_client.create_collection(collection_name, metadata={"hnsw:space": "cosine"}, embedding_function=EmbeddingFunction("intfloat/multilingual-e5-large"))

    ids = [str(i) for i in range(len(texts))]
    
    collection.add(
        ids=ids,
        documents=texts,
        metadatas=[{"text": text} for text in texts] 
    )

    return jsonify({"status": "success", "message": f"{len(texts)} texts stored successfully."})
    
@app.route('/query_similar_text', methods=['POST'])
def query_similar_text():
    texts = request.json['texts']
    results_num = request.json.get('results_num', 1)
    collection_name = request.json.get('collection_name', 'default_collection')

    try:
        collection = chroma_client.get_collection(collection_name, embedding_function=EmbeddingFunction("intfloat/multilingual-e5-large"))
    except ValueError:
        return jsonify({"error": f"No collection named {collection_name}"}), 400  

    results = collection.query(
        query_texts=texts,
        n_results=results_num
    )

    return jsonify({"status": "success", "data": results})


@app.route('/get_collection_names', methods=['GET'])
def get_collection_names():
    collection_names = chroma_client.list_collections()
    names_list = [collection.name for collection in collection_names]
    return jsonify({"status": "success", "collection_names": names_list}), 200

if __name__ == '__main__':
    
    app.run()