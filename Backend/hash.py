import bcrypt

def generate_hashed_password(plain_password: str) -> str:
    # Generate a salt using 12 rounds (same as $2b$12)
    salt = bcrypt.gensalt(rounds=12)
    
    # Hash the password with the salt
    hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    
    return hashed_password.decode('utf-8')

# Example usage
plain_password = 'root'  # Replace this with the actual password you want to hash
hashed_password = generate_hashed_password(plain_password)
print(f'Hashed Password: {hashed_password}')



# INSERT INTO "users" ("staff_code", "staff_name", "designation", "role", "email", "mobile_number", "user_status", "remarks", "password")
# VALUES 
# ('A101', 'AdminName', 'Assistant Director', 'Admin', 'admin@example.com', '1234567890', 'Enabled', '', '$2b$12$Rh5Qu8/s6EMcvb.sz1GVgu/jzRfncsmrLuypY57smWXgSw1Ewli/6');
