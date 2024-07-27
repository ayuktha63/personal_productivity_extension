from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')  # Adjust URI if using a remote database
db = client['todolist_db']  # Database name
todos_collection = db['todos']  # Collection name

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/todos', methods=['GET', 'POST', 'DELETE'])
def handle_todos():
    if request.method == 'GET':
        todos = list(todos_collection.find({}, {'_id': 0}))
        return jsonify(todos)
    
    elif request.method == 'POST':
        new_item = request.json
        todos_collection.insert_one(new_item)
        return jsonify(new_item), 201

    elif request.method == 'DELETE':
        item_to_delete = request.json
        # Here you can manage how to handle "soft" deletes, e.g., by adding a 'deleted' field
        # but for now, it will just return the item without deleting from DB
        return jsonify(item_to_delete)

if __name__ == '__main__':
    app.run(debug=True)
