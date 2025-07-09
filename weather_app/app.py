
import os
from flask import Flask, render_template, request
import requests


app = Flask(__name__)

API_KEY = os.environ.get("API_KEY")

@app.route('/', methods=['GET', 'POST'])
def index():
    weather = None
    error = None
    if request.method == 'POST':
        city = request.form.get('city')
        if city:
            if not API_KEY:
                error = "API key not set. Please contact the site owner."
            else:
                url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
                response = requests.get(url)
                if response.status_code == 200:
                    data = response.json()
                    weather = {
                        'city': data['name'],
                        'temp': data['main']['temp'],
                        'desc': data['weather'][0]['description'].title(),
                        'icon': data['weather'][0]['icon']
                    }
                else:
                    error = "City not found. Please try again."
        else:
            error = "Please enter a city name."
    return render_template('weather.html', weather=weather, error=error)

if __name__ == '__main__':
    app.run(debug=True)
