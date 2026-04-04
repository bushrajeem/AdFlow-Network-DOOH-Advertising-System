<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# AdFlow Network

## Digital Out-of-Home Advertising Management Platform

A cloud-based platform where brands upload digital ads and they display on screens in local supershops. One dashboard controls everything.

## Live Demo

- Frontend : https://ad-flow-network-dooh-advertising-sy.vercel.app/
- Backend : https://adflow-network-dooh-advertising-system-production.up.railway.app
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
-Opens via a short screen code - `player/XX-0000`
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

```

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
```

### Clone the repo

```go to git bash
git clone https://github.com/bushrajeem/AdFlow-Network-DOOH-Advertising-System.git

cd adflow-network
```

### Frontend setup

```bash
npm install
```

Create `.env` in the root folder and paste these:

```
VITE_SOCKET_URL=https://adflow-network-dooh-advertising-system-production.up.railway.app
VITE_API_BASE_URL=https://adflow-network-dooh-advertising-system-production.up.railway.app/api
```

npm run dev

### Backend setup

```bash
cd backend
npm install
```

Create .env in backend root folder and paste:

```
PORT=5000
MONGO_URI=mongodb+srv://jeem:adflow@cluster0.zknjti2.mongodb.net/adflow?retryWrites=true&w=majority
```

npm run dev

## How to use the Screen Player

1. Go to admin/screen and create new screen
2. copy the generated code (ScreenCode)
3. open vercel link or local host and paste: `player/ScreenCode(insert generated code)` on any device (phone, laptop, tab)
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
>>>>>>> a90c83806c2ca722e5b9fa477c9981e67b7524f0
