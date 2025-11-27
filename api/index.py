from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

# Store tasks in a simple JSON file
TASKS_FILE = 'tasks.json'

def load_tasks():
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    with open(TASKS_FILE, 'w') as f:
        json.dump(tasks, f)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/skills')
def skills():
    return render_template('skills.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/experience')
def experience():
    return render_template('experience.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/resume')
def resume():
    return render_template('resume.html')

@app.route('/projects/weather')
def weather_project():
    return render_template('weather.html')

@app.route('/projects/task-manager')
def task_manager_project():
    return render_template('task_manager.html')

@app.route('/projects/heart-prediction')
def heart_prediction_project():
    return render_template('heart_prediction.html')

# Weather API endpoint
@app.route('/api/weather/<city>')
def get_weather(city):
    # Mock weather data
    weather_data = {
        'new york': {'temp': 22, 'humidity': 50, 'wind': 15, 'icon': 'sun'},
        'london': {'temp': 15, 'humidity': 65, 'wind': 20, 'icon': 'cloud'},
        'tokyo': {'temp': 28, 'humidity': 45, 'wind': 10, 'icon': 'sun'},
        'paris': {'temp': 18, 'humidity': 55, 'wind': 12, 'icon': 'cloud-rain'},
        'sydney': {'temp': 25, 'humidity': 40, 'wind': 8, 'icon': 'sun'},
    }
    
    city_lower = city.lower()
    if city_lower in weather_data:
        return jsonify({
            'city': city,
            'data': weather_data[city_lower],
            'success': True
        })
    else:
        return jsonify({
            'city': city,
            'data': {
                'temp': 20 + len(city) % 10,
                'humidity': 40 + len(city) % 30,
                'wind': 5 + len(city) % 20,
                'icon': 'cloud'
            },
            'success': True
        })

# Task Management API endpoints
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = load_tasks()
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    tasks = load_tasks()
    new_task = {
        'id': len(tasks) + 1,
        'title': data.get('title'),
        'completed': False
    }
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    tasks = load_tasks()
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = data.get('completed', task['completed'])
            save_tasks(tasks)
            return jsonify(task)
    return jsonify({'error': 'Task not found'}), 404

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = load_tasks()
    tasks = [t for t in tasks if t['id'] != task_id]
    save_tasks(tasks)
    return jsonify({'success': True})

@app.route('/ping')
def ping():
    return "pong"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)

