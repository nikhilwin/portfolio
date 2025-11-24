from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/resume')
def resume():
    return render_template('resume.html')

@app.route('/project/weather')
def weather_project():
    return render_template('weather.html')

@app.route('/project/task-manager')
def task_manager_project():
    return render_template('task_manager.html')

@app.route('/ping')
def ping():
    return "pong"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
