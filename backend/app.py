from flask import Flask, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Secret key for session management
app.secret_key = os.urandom(24)  # Folosește o cheie mai sigură în producție

# Configure database
app.config.update(
    SESSION_COOKIE_SAMESITE="None",  # Sau "None" dacă ai cereri CORS complexe
    SESSION_COOKIE_SECURE=False,    # Setează True doar dacă folosești HTTPS
    SESSION_COOKIE_DOMAIN=None,     # Lasă None pentru localhost
    SESSION_COOKIE_PATH="/",        # Path-ul implicit
)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database and migration tools
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Define the frontend directory and distribution folder
frontend_folder = os.path.join(os.getcwd(), "..", "frontend")
dist_folder = os.path.join(frontend_folder, "dist")

# Route to serve static files from the "dist" folder
@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(dist_folder, filename)

# Import API routes (ensure routes.py exists and is properly configured)
import routes

# Create the database tables if they don't exist
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)