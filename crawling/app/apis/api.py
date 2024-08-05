from app import app
from flask import jsonify

@app.route('/flask/check', methods=["GET"])
def health_check():
    return jsonify({"response": "Flask is working!"}), 200


