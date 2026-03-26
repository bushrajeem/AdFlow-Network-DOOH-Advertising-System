# AdFlow Network

## Digital Out-of-Home Advertising Management Platform

A cloud-based platform where brands upload digital ads and they display on screens in local supershops. One dashboard controls everything.

## Live Demo

- Frontend : [https: ](https://ad-flow-network-dooh-advertising-sy.vercel.app/)

- Player demo/Screen : https://ad-flow-network-dooh-advertising-sy.vercel.app/player/ScreenCode

### Admin Dashboard

-Overview with real-time stats (screens, ads etc)
-Screen management with live Online/Offline status
-Ad upload with Couldinary video storage
-Playlist creation with multiple ad selection
-Location management
-Edit drawer for screens, playlists

### Screen Player

-Any device as a digital screen
-Opens via a short screen code - `player/ScreenCode`
-Plays assigned playlist in loop
-Updates when admin changes playlist (no refresh needed)
-Sends heartbeat to stay Online
-Shows waiting screen when no playlist is assigned

### Real-time

-Socket.io connection between admin dasboard and screen devices
-Screen status (Online/Offline) updates live in admin panel
-Playlist assignment pushes to screen instantly

--

## Tech Stack

### Frontend

- React + vite : UI framework
- Tailwind CSS : Styling
- React Router : Routing
- Socket.io Client : Real-time connection
- Lucide React : Icons
- Cloudinary : Video storage

### Backend

- Node.js + Express : Server
- MongoDB + Mongoose : Database
- Socket.io : Real-time events
- dotenv : Environment config

### Deployment

- Vercel : Frontend
- MongoDB Atlas : Database
- Cloudinary : Media files

### Project Structure

adflow-network/
├── src/ # React frontend
│ ├── pages/
│ │ ├── admin/ # All admin pages
│ │ │ ├── components/ # AdminLayout, AdminSidebar, AdminTopBar
│ │ │ ├── location/ # Country, City, Location pages
│ │ │ ├── AdminDashboardPage.jsx
│ │ │ ├── ScreenPage.jsx
│ │ │ ├── AdsPage.jsx
│ │ │ ├── PlaylistsPage.jsx
│ │ │ ├── UsersPage.jsx
│ │ │ ├── CreateScreenPage.jsx
│ │ │ ├── CreateAdPage.jsx
│ │ │ └── CreatePlaylistPage.jsx
│ │ └── player/
│ │ └── PlayerPage.jsx # The screen display page
│ ├── hooks/
│ │ └── useSidebarToggle.js
│ ├── services/
│ │ └── api.js # All backend API calls
│ └── main.jsx # Routing
│
└── backend/ # Express backend
├── controllers/
│ ├── adController.js
│ ├── screenController.js
│ ├── playlistController.js
│ ├── locationController.js
│ └── dashboardController.js
├── models/
│ ├── Ad.js
│ ├── Screen.js
│ ├── Playlist.js
│ └── Location.js
├── routes/
│ ├── adRoutes.js
│ ├── screenRoutes.js
│ ├── playlistRoutes.js
│ ├── locationRoutes.js
│ └── dashboardRoutes.js
├── config/
│ └── db.js
├── socket.js
└── server.js

### Clone the repo

```go to git bash
git clone https://github.com/bushrajeem/AdFlow-Network-DOOH-Advertising-System.git

cd adflow-network
```

### Frontend setup

```bash
npm install
```

### Backend setup

```bash
cd backend
npm install
```

## How to use the Screen Player

1. Go to admin/screen and create new screen
2. copy the generated code (ScreenCode)
3. open vercel link or local host and paste: `player/ScreenCode(insert generated code)` on any device
4. device appears Online in the admin screen page
5. create a playlist with ads and assign to the screen
6. device automatically starts to play in loop; no refresh needed

## API Endpoints

### Ads

### Screens

### Playlists

### Locations

### Dashboard

## Team

Built by -
Taslima Bushra Islam Jeem
(insert your name)

## License

This project is for educational purpose
