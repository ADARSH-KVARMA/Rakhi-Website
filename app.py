from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Config: Serve index.html template
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, host='127.0.0.1', port=5000)
