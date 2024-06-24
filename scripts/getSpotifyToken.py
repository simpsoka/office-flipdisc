import requests
import base64
import urllib.parse
from dotenv import load_dotenv
import os

from pathlib import Path
env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)
load_dotenv()

client_id = os.getenv('SPOTIFY_CLIENT_ID')
client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
redirect_uri = os.getenv('SPOTIFY_REDIRECT_URI')
scopes = 'user-read-recently-played user-read-currently-playing user-read-playback-state user-modify-playback-state'

# Step 1: Get authorization code
auth_url = (
    f"https://accounts.spotify.com/authorize?"
    f"client_id={client_id}&response_type=code&redirect_uri={urllib.parse.quote(redirect_uri)}&scope={urllib.parse.quote(scopes)}"
)
print(f"Go to the following URL to authorize: {auth_url}")

# Step 2: Get the authorization code from the redirected URL
authorization_code = input("Enter the authorization code from the URL: ")

# Step 3: Exchange authorization code for access token
token_url = "https://accounts.spotify.com/api/token"
auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()

headers = {
    "Authorization": f"Basic {auth_header}",
}

data = {
    "grant_type": "authorization_code",
    "code": authorization_code,
    "redirect_uri": redirect_uri,
}

response = requests.post(token_url, headers=headers, data=data)
response_data = response.json()

access_token = response_data.get("refresh_token")
print(f"Refresh Token: {access_token}")
