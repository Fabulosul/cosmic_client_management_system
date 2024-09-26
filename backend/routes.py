from app import app, db
from flask import request, jsonify, session
from models import Client
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# Hardcoded username and hashed password
USERNAME = 'cosmicimpex'
PASSWORD_HASH = generate_password_hash('Mazilita9997')

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username == USERNAME and check_password_hash(PASSWORD_HASH, password):
        session['authenticated'] = True
        # app.logger.debug(f"Session after login: {session}")
        return jsonify({'success': True}), 200
    else:
        return jsonify({'success': False}), 401
    
# Verify if authenficated
@app.route('/verify_auth', methods=['GET'])
def verify_auth():
    if session.get('authenticated') == True:
        return jsonify({'success': 'True'}), 200
    else:
        return jsonify({'success': 'False'}), 200
    


# Logout route
@app.route('/logout', methods=['POST'])
def logout():
    try:
        session.pop('authenticated', None)
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        

# # Middleware to protect routes
# @app.before_request
# def require_login():
#     app.logger.debug(f"Session: {session}")
#     if request.endpoint not in ['login', 'static'] and not session.get('authenticated'):
#         return jsonify({'error': 'Unauthorized'}), 401

# Get all clients
@app.route('/get_clients', methods=['GET'])
def get_clients():
    authentificator = session.get('authenticated')
    if authentificator is None:
        return jsonify({"error" : "Trebuie să vă logați pentru a accesa informațiile despre clienți!"}), 404
    clients = Client.query.all()
    clients_json = [client.to_json() for client in clients]
    return jsonify(clients_json)

# Create a new client
@app.route('/create_client', methods=['POST'])
def create_client():
    authentificator = session.get('authenticated')
    if authentificator is None:
        return jsonify({"error" : "Trebuie să vă logați pentru a accesa informațiile despre clienți!"}), 404
    try:
        data = request.get_json()
        required_fields = ['first_name', 'second_name', 'phone_number', 'description', 'reparation_status', 'date']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return jsonify({'error': f'Missing or empty {field} parameter'}), 400

        date = datetime.strptime(data['date'], '%d.%m.%Y')

        new_client = Client(
            first_name=data['first_name'],
            second_name=data['second_name'],
            phone_number=data['phone_number'],
            email=data['email'],
            description=data['description'],
            reparation_status=data['reparation_status'],
            reparation_price=data['reparation_price'],
            date=date
        )
        db.session.add(new_client)
        db.session.commit()
        return jsonify(new_client.to_json()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a client
@app.route('/delete_client/<int:id>', methods=['DELETE'])
def delete_client(id):
    authentificator = session.get('authenticated')
    if authentificator is None:
        return jsonify({"error" : "Trebuie să vă logați pentru a accesa informațiile despre clienți!"}), 404
    try:
        client = Client.query.get(id)
        if client is None:
            return jsonify({'error': 'Client not found'}), 404
        db.session.delete(client)
        db.session.commit()
        return jsonify({'message': 'Client deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Update a client 
@app.route('/update_client/<int:id>', methods=['PATCH'])
def update_client(id):
    authentificator = session.get('authenticated')
    if authentificator is None:
        return jsonify({"error" : "Trebuie să vă logați pentru a accesa informațiile despre clienți!"}), 404
    try:
        client = Client.query.get(id)
        if client is None:
            return jsonify({'error': 'Client not found'}), 404

        data = request.get_json()
        
        client.first_name = data.get('first_name', client.first_name)
        client.second_name = data.get('second_name', client.second_name)
        client.phone_number = data.get('phone_number', client.phone_number)
        client.email = data.get('email', client.email)
        client.description = data.get('description', client.description)
        client.reparation_status = data.get('reparation_status', client.reparation_status)
        client.reparation_price = data.get('reparation_price', client.reparation_price)    
        client.date = data.get('date', client.date)  

        if 'date' in data:
            try:
                client.date = datetime.strptime(data['date'], '%d.%m.%Y')
            except ValueError:
                return jsonify({'error': 'Invalid date format, should be MM-DD-YYYY'}), 400                      

        db.session.commit()
        return jsonify(client.to_json()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500