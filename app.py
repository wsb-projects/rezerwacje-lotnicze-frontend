from flask import Flask, render_template, request, redirect, url_for, flash, session
import requests
import json
import os
from functools import wraps
import logging

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

BASE_URL = 'http://localhost:8080'
JSON_FILE = 'data/flights.json'
TICKETS_FILE = 'data/tickets.json'

#logging.basicConfig(
    #filename='booking.log',
    #level=logging.DEBUG,
    #format='%(asctime)s - %(levelname)s - %(message)s'
#)

def ensure_data_directory():
    os.makedirs('data', exist_ok=True)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_email' not in session:
            flash('Please login to book flights')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def fetch_flights():
    try:
        response = requests.get(f'{BASE_URL}/api/Flight/GetFlights')
        return response.json()
    except requests.RequestException:
        if os.path.exists(JSON_FILE):
            with open(JSON_FILE, 'r') as file:
                return json.load(file)
        return []

def load_tickets():
    if os.path.exists(TICKETS_FILE):
        with open(TICKETS_FILE, 'r') as file:
            return json.load(file)
    return []

def save_tickets(tickets):
    ensure_data_directory()
    with open(TICKETS_FILE, 'w') as file:
        json.dump(tickets, file, indent=2)

def generate_ticket_id():
    tickets = load_tickets()
    if not tickets:
        return 1
    return max(ticket['ticket_id'] for ticket in tickets) + 1

@app.route('/')
def index():
    flights = fetch_flights()
    return render_template('index.html', flights=flights)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = {
            'email': request.form['email'],
            'password': request.form['password'],
            'twoFactorCode': "",
            'twoFactorRecoveryCode': ""
        }
        
        try:
            login_url = f'{BASE_URL}/login'
            params = {
                'useCookies': 'true',
                'useSessionCookies': 'true'
            }
            
            response = requests.post(
                login_url,
                params=params,
                json=data,
                headers={
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            )
            
            if response.status_code == 200:
                session['user_email'] = data['email']
                session['authenticated'] = True
                flash('Login successful!')
                return redirect(url_for('index'))
            else:
                flash('Invalid credentials')
                
        except requests.RequestException as e:
            flash(f'Network error: {str(e)}')
            
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = {
            'email': request.form['email'],
            'password': request.form['password']
        }
        
        try:
            response = requests.post(
                f'{BASE_URL}/register',
                json=data,
                headers={
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            )
            
            if response.status_code == 200:
                flash('Registration successful! Please login.')
                return redirect(url_for('login'))
            else:
                error_data = response.json()
                if 'errors' in error_data:
                    for field, errors in error_data['errors'].items():
                        for error in errors:
                            flash(f'{field}: {error}')
                else:
                    flash(error_data.get('detail', 'Registration failed'))
                            
        except requests.RequestException as e:
            flash(f'Connection error: {str(e)}')
            
    return render_template('register.html')

@app.route('/book_ticket', methods=['POST'])
@login_required
def book_ticket():
    flight_id = int(request.form['flight_id'])
    user_email = session['user_email']
    
    try:
        flights = fetch_flights()
        selected_flight = next((f for f in flights if f['id'] == flight_id), None)
        
        if not selected_flight:
            flash('Flight not found')
            return redirect(url_for('index'))
        
        tickets = load_tickets()
        new_ticket = {
            'ticket_id': generate_ticket_id(),
            'flight_id': flight_id,
            'user_email': user_email,
            'departure': selected_flight['departureLocation'],
            'arrival': selected_flight['arrivalLocation'],
            'departure_date': selected_flight['departureDate'],
            'arrival_date': selected_flight['arrivalDate']
            
        }
        
        tickets.append(new_ticket)
        save_tickets(tickets)
        
        flash('Ticket booked successfully!')
        
    except Exception as e:
        logging.error(f'Booking error: {str(e)}')
        flash('Booking failed')
    
    return redirect(url_for('index'))

@app.route('/my-tickets')
@login_required
def my_tickets():
    tickets = load_tickets()
    user_tickets = [ticket for ticket in tickets if ticket['user_email'] == session['user_email']]
    return render_template('my_tickets.html', tickets=user_tickets)

@app.route('/logout')
def logout():
    session.clear()
    flash('Successfully logged out!')
    return redirect(url_for('index'))

def save_flights_to_file(flights):
    ensure_data_directory()
    with open(JSON_FILE, 'w') as file:
        json.dump(flights, file, indent=2)

@app.before_request
def update_local_data():
    try:
        flights = fetch_flights()
        save_flights_to_file(flights)
    except:
        pass

if __name__ == '__main__':
    app.run(port=5000, debug=True)