from app import app
from app.config import APP_PORT

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=APP_PORT, debug=True)
