# Tournament Management Mobile Application - Client
This is the React Native client part of the application. The client has two main bottom navigation tabs: Tournaments and Profile. Below are the screens that can be accessed by each tab:
- Tournaments: `tournaments` screens -> `stages` screens -> either `matches_rr` or `matches_se` screens
- Profile: `profile` screens
In the code, "rr" or "RR" stand for "Round Robin", and "se" or "SE" stand for "Single Elimination".
## Environment variables
After cloning this project, please create a .env file and add the following variables:
- EXPO_PUBLIC_AUTH_SERVER_URL: URL of the authentication server. For example, http://192.168.90.69:5000
- EXPO_PUBLIC_SERVER_URL: URL of the tournament data server. For example, http://192.168.90.69:5244
## User Interface
The user interface images can be seen [here](https://drive.google.com/drive/u/0/folders/1dOiF_606qseo_VNXDRKvtwP6sqhXtEPH).