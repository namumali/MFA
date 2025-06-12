from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pyotp
import bcrypt
import os
import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Setup Flask
app = Flask(__name__)
CORS(app)

# Get Mongo URI from environment
MONGO_URI = os.getenv("MONGO_URI")
TWO_MINUTES_MS = os.getenv("TWO_MINUTES_MS")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI is not set in environment variables")

# Connect to MongoDB Atlas              
client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client["mfa_demo"]
users = db["users"]



def get_unix_timestamp_ms():
    """Return the current UTC timestamp in milliseconds."""
    return int(datetime.datetime.now(datetime.timezone.utc).timestamp() * 1000)


def update_last_login_time(user_id, timestamp_ms):
    """
    Update the lastLoginTime field for a given user in MongoDB.
    Assumes users.insert_one stored _id as the document's ObjectId.
    """
    users.update_one(
        {"_id": user_id},
        {"$set": {"lastLoginTime": timestamp_ms}}
    )


def validate_password(input_password: str, hashed_password: bytes) -> bool:
    """
    Validate a plaintext password against its bcrypt hash.
    Returns True if they match, False otherwise.
    """
    try:
        return bcrypt.checkpw(input_password.encode("utf-8"), hashed_password)
    except Exception:
        return False


@app.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Check if user already exists
    if users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    # Hash the password
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # Generate a new TOTP secret for this user
    secret = pyotp.random_base32()
    otp_uri = pyotp.TOTP(secret).provisioning_uri(name=email, issuer_name="FlaskMFAExample")

    # Insert user document into MongoDB (lastLoginTime defaults to 0)
    new_user = {
        "email": email,
        "password": hashed_pw,
        "secret": secret,
        "lastLoginTime": 0,
        "qrScanned": False  # Track if QR code was scanned
    }
    result = users.insert_one(new_user)

    return jsonify({"otp_uri": otp_uri}), 200


@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = users.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid user. Kindly register."}), 404

    # Current time in milliseconds
    current_time_ms = get_unix_timestamp_ms()
    last_login_time_ms = user.get("lastLoginTime", 0)
    print(f"Current time: {current_time_ms}, Last login time: {last_login_time_ms},TWO_MINUTES_MS: {TWO_MINUTES_MS}")
    # Check if the difference is within TWO_MINUTES_MS  

    if (current_time_ms - last_login_time_ms) <= int(TWO_MINUTES_MS):
        # Skip MFA if password is valid
        if validate_password(password, user["password"]):
            update_last_login_time(user["_id"], current_time_ms)
            return jsonify({"message": "Login successful (MFA skipped)"}), 200
        else:
            return jsonify({"error": "Invalid password"}), 401

    # Otherwise, proceed with MFA
    if validate_password(password, user["password"]):
        # Update last login time before requiring OTP
        update_last_login_time(user["_id"], current_time_ms)
        return jsonify({"message": "Password valid. MFA required."}), 200
    else:
        return jsonify({"error": "Invalid password"}), 401


@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json or {}
    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    user = users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    totp = pyotp.TOTP(user["secret"])
    if totp.verify(otp):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid OTP"}), 401

@app.route("/success", methods=["GET"])
def success():
    """
    Handle successful login redirection.
    """
    return jsonify({"message": "Login successful (MFA skipped)"}), 200

@app.route("/confirm-scan", methods=["POST"])
def confirm_scan():
    data = request.json or {}
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update the user document to indicate QR code was scanned
    users.update_one({"email": email}, {"$set": {"qrScanned": True}})
    return jsonify({"message": "QR code scanned successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)
