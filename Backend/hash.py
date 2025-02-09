# import bcrypt

# def generate_hashed_password(plain_password: str) -> str:
#     # Generate a salt using 12 rounds (same as $2b$12)
#     salt = bcrypt.gensalt(rounds=12)
    
#     # Hash the password with the salt
#     hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    
#     return hashed_password.decode('utf-8')

# # Example usage
# plain_password = 'new'  # Replace this with the actual password you want to hash
# hashed_password = generate_hashed_password(plain_password)
# print(f'Hashed Password: {hashed_password}')



# INSERT INTO "users" ("staff_code", "staff_name", "designation", "role", "email", "mobile_number", "user_status", "remarks", "password")
# VALUES 
# ('A101', 'AdminName', 'Assistant Director', 'Admin', 'admin@example.com', '1234567890', 'Enabled', '', '$2b$12$Rh5Qu8/s6EMcvb.sz1GVgu/jzRfncsmrLuypY57smWXgSw1Ewli/6');



import bcrypt

def generate_hashed_password(plain_password: str) -> str:
    """Generates a bcrypt hashed password with 12 rounds."""
    salt = bcrypt.gensalt(rounds=12)
    hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

# Ask the user for input
staff_code = input("Enter Staff Code: ")
staff_name = input("Enter Staff Name: ")
designation = input("Enter Designation: ")
role = input("Enter Role (SuperAdmin): ")
email = input("Enter Email: ")
mobile_number = input("Enter Mobile Number: ")
user_status = input("Enter User Status (Enabled/Disabled): ")
password = input("Enter Password: ")

# Hash the password
hashed_password = generate_hashed_password(password)

# Generate SQL Query
sql_query = f"""
INSERT INTO "users" ("staff_code", "staff_name", "designation", "role", "email", "mobile_number", "user_status", "password")
VALUES 
('{staff_code}', '{staff_name}', '{designation}', '{role}', '{email}', '{mobile_number}', '{user_status}', '{hashed_password}');
"""

print("\nGenerated SQL Query:")
print(sql_query)
