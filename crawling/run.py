from app import app
from config import APP_PORT

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=APP_PORT, debug=False, use_reloader=False)
