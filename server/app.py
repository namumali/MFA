from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pyotp
import bcrypt
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Setup Flask
app = Flask(__name__)
CORS(app)

# Get Mongo URI from environment
MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)
db = client["mfa_demo"]
users = db["users"]

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    secret = pyotp.random_base32()
    otp_uri = pyotp.totp.TOTP(secret).provisioning_uri(name=email, issuer_name="ReactFlaskMFA")

    users.insert_one({
        "email": email,
        "password": hashed_pw,
        "secret": secret
    })

    return jsonify({"otp_uri": otp_uri}), 200

@app.route("/verify", methods=["POST"])
def verify():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    user = users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    totp = pyotp.TOTP(user["secret"])
    if totp.verify(otp):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid OTP"}), 401

if __name__ == "__main__":
    app.run(debug=True)
