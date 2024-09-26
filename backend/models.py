from app import db 

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    second_name = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(50), nullable=True)
    description = db.Column(db.Text, nullable=False)
    reparation_status = db.Column(db.String(50), nullable=False)
    reparation_price = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    def to_json(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'second_name': self.second_name,
            'phone_number': self.phone_number,
            'email': self.email,
            'description': self.description,
            'reparation_status': self.reparation_status,
            'reparation_price': self.reparation_price,
            'date': self.date
        }
    
    