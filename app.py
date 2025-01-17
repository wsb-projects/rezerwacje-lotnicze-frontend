from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import requests
from functools import wraps
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

BASE_URL = 'http://localhost:8080'
FLIGHTS_STORAGE = []

def get_flights():
    global FLIGHTS_STORAGE
    if not FLIGHTS_STORAGE:
        FLIGHTS_STORAGE.extend(fetch_flights())
    return FLIGHTS_STORAGE

def fetch_flights():
    try:
        response = requests.get(f'{BASE_URL}/api/Flight/GetFlights')
        if response.status_code == 200:
            flights = response.json()
            return sorted(flights, key=lambda x: x['id'])
        return []
    except requests.RequestException:
        return []

def get_next_flight_id():
    flights = get_flights()
    if not flights:
        return 5
    return max(flight['id'] for flight in flights) + 1

@app.before_request
def clear_session_on_startup():
    if not getattr(app, '_got_first_request', False):
        session.clear()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_email' not in session:
            flash('Please login to access this page')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('is_admin'):
            flash('Admin access required')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    if session.get('is_admin'):
        return redirect(url_for('admin_dashboard'))
    flights = get_flights()
    return render_template('index.html', flights=flights)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        if '@' not in email or '.' not in email:
            flash('Invalid email format')
            return render_template('register.html')
            
        try:
            response = requests.post(
                f'{BASE_URL}/register',
                json={'email': email, 'password': password},
                headers={'accept': '*/*', 'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                flash('Registration successful! Please login.')
                return redirect(url_for('login'))
            else:
                error_data = response.json()
                if 'errors' in error_data:
                    for error_type, messages in error_data['errors'].items():
                        flash(f"{error_type}: {', '.join(messages)}")
                else:
                    flash('Registration failed. Please try again.')
                    
        except requests.RequestException as e:
            print(f"Registration error: {str(e)}")
            flash('Server connection error')
            
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        if email == 'admin@example.com' and password == 'Admin123!':
            session['user_email'] = email
            session['is_admin'] = True
            session['authenticated'] = True
            return redirect(url_for('admin_dashboard'))

        try:
            login_data = {
                'email': email,
                'password': password
            }
            
            response = requests.post(
                f'{BASE_URL}/login',
                params={'useCookies': 'true', 'useSessionCookies': 'true'},
                json=login_data,
                headers={'accept': 'application/json', 'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                session['user_email'] = email
                session['is_admin'] = False
                session['authenticated'] = True
                return redirect(url_for('index'))
            else:
                flash('Invalid credentials')
                
        except requests.RequestException as e:
            flash('Connection error')
            
        return redirect(url_for('login'))
        
    return render_template('login.html')

@app.route('/book_ticket', methods=['POST'])
@login_required
def book_ticket():
    # First, ensure we have fresh flight data
    global FLIGHTS_STORAGE
    FLIGHTS_STORAGE = fetch_flights()  # Force refresh from API
    
    flight_id = int(request.form['flight_id'])
    seats = int(request.form.get('seats', 1))
    
    # Debug logging to verify data
    print(f"Attempting to book flight {flight_id}")
    print(f"Available flights: {[f['id'] for f in FLIGHTS_STORAGE]}")
    
    selected_flight = next((
        flight for flight in FLIGHTS_STORAGE 
        if flight['id'] == flight_id
    ), None)
    
    if selected_flight:
        if 'tickets' not in session:
            session['tickets'] = []
            
        new_ticket = {
            'id': len(session['tickets']) + 1,
            'flightId': flight_id,
            'userId': session['user_email'],
            'seats': seats,
            'flight': selected_flight
        }
        
        # Add ticket to session
        current_tickets = session.get('tickets', [])
        current_tickets.append(new_ticket)
        session['tickets'] = current_tickets
        session.modified = True
        
        return redirect(url_for('my_tickets'))
    
    # If flight not found, log the error and available flights
    print(f"Flight {flight_id} not found in storage")
    flash('Flight not found - please try again')
    return redirect(url_for('index'))


@app.route('/my-tickets')
@login_required
def my_tickets():
    tickets = session.get('tickets', [])
    user_tickets = [ticket for ticket in tickets if ticket['userId'] == session['user_email']]
    return render_template('my_tickets.html', tickets=user_tickets)

@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    flights = get_flights()
    return render_template('admin/dashboard.html', flights=flights)

@app.route('/admin/add-passenger-flight', methods=['POST'])
@admin_required
def add_passenger_flight():
    try:
        data = request.get_json()
        payload = {
            'id': get_next_flight_id(),
            'flightType': 0,
            'departureLocation': data['departureLocation'],
            'arrivalLocation': data['arrivalLocation'],
            'departureDate': data['departureDate'],
            'arrivalDate': data['arrivalDate'],
            'seatsCapacity': int(data['seatsCapacity']),
            'seatPrice': float(data['seatPrice']),
            'tickets': []
        }
        
        FLIGHTS_STORAGE.append(payload)
        response = requests.post(
            f'{BASE_URL}/api/Flight/AddPassengerFlight',
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        return jsonify({'success': True, 'message': 'Flight added successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/admin/add-cargo-flight', methods=['POST'])
@admin_required
def add_cargo_flight():
    try:
        data = request.get_json()
        payload = {
            'id': get_next_flight_id(),
            'flightType': 1,
            'departureLocation': data['departureLocation'],
            'arrivalLocation': data['arrivalLocation'],
            'departureDate': data['departureDate'],
            'arrivalDate': data['arrivalDate'],
            'cargoWeight': float(data['cargoWeight']),
            'cargoVolume': float(data['cargoVolume']),
            'tickets': []
        }
        
        FLIGHTS_STORAGE.append(payload)
        response = requests.post(
            f'{BASE_URL}/api/Flight/AddCargoFlight',
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        return jsonify({'success': True, 'message': 'Cargo flight added successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/flights/<int:id>', methods=['DELETE'])
@admin_required
def delete_flight(id):
    try:
        response = requests.delete(f'{BASE_URL}/api/Flight?id={id}')
        global FLIGHTS_STORAGE
        FLIGHTS_STORAGE = [f for f in FLIGHTS_STORAGE if f['id'] != id]
        return jsonify(success=True)
    except requests.RequestException:
        return jsonify(success=False), 500

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))
if __name__ == '__main__':
    app.run(debug=True)