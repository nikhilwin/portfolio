<<<<<<< HEAD


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

@app.route('/debug-templates')
def debug_templates():
    import os
    return str(os.listdir(os.path.join(app.root_path, 'templates')))

if __name__ == '__main__':
    # You need SSL certificates (cert.pem and key.pem) in your project folder
    app.run(host='0.0.0.0', port=5003)
=======
from flask import Flask, render_template, url_for, jsonify, request, session

app = Flask(__name__)
app.secret_key = 'your-secret-key'  # Required for session

@app.route('/')
def home():
    return render_template('index.html', theme=session.get('theme', 'light'))

@app.route('/about')
def about():
    return render_template('about.html', theme=session.get('theme', 'light'))

@app.route('/skills')
def skills():
    return render_template('skills.html', theme=session.get('theme', 'light'))

@app.route('/projects')
def projects():
    return render_template('projects.html', theme=session.get('theme', 'light'))

@app.route('/contact')
def contact():
    return render_template('contact.html', theme=session.get('theme', 'light'))

@app.route('/experience')
def experience():
    return render_template('experience.html', theme=session.get('theme', 'light'))

@app.route('/projects/<project_id>')
def project_detail(project_id):
    # Add your project details here
    projects = {
        'portfolio': {
            'title': 'Portfolio Website',
            'description': 'A modern portfolio built with Flask',
            'technologies': ['Flask', 'HTML5', 'CSS3', 'JavaScript'],
            'github': 'https://github.com/nikhilwin/portfolio',
            'live': 'https://your-portfolio-url.com'
        }
        # Add more projects here
    }
    return render_template('project_detail.html', project=projects.get(project_id))

@app.route('/toggle-theme', methods=['POST'])
def toggle_theme():
    session['theme'] = 'dark' if session.get('theme', 'light') == 'light' else 'light'
    return jsonify({'theme': session['theme']})

if __name__ == '__main__':
    app.run(debug=True)
>>>>>>> ba088f69f2429875e165baf9b49f255804891d99
