import os

# Generate 32 random bytes
key_bytes = os.urandom(32)

# Convert to hexadecimal string (64 hex characters)
key_hex = key_bytes.hex()

print("Your 32-byte (64 hex chars) key is:", key_hex)
