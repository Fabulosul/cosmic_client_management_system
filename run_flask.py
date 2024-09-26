import subprocess
import webbrowser
import time
import os

def start_server():
    # Change to the backend directory
    os.chdir("backend")

    # Command to start the Gunicorn server
    gunicorn_command = "gunicorn --bind 192.168.0.111:5000 app:app"

    # Start the Gunicorn server
    process = subprocess.Popen(gunicorn_command, shell=True)

    # Wait for the server to start (adjust the sleep time if needed)
    time.sleep(0)

    # URL to open in the browser
    # url = "http://127.0.0.1:5000/"

    # # Open the URL in Google Chrome
    # chrome_path = "/home/fabulosu/chrome %s"  # Path to Google Chrome on Linux
    # webbrowser.get(chrome_path).open(url)

    # Keep the script running while the Gunicorn server is active
    try:
        process.communicate()
    except KeyboardInterrupt:
        process.terminate()

# Call the start_server function
if __name__ == "__main__":
    start_server()