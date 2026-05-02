# AdFlow Network

## Digital Out-of-Home Advertising Management Platform

A cloud-based platform where brands upload digital ads and they display on screens in local supershops. One dashboard controls everything.

## Live Demo

- Frontend : https://ad-flow-network-dooh-advertising-sy.vercel.app/
- Backend : https://adflow-network.onrender.com
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

Note: For Vercel, use `frontend/` as the Root Directory (or keep the root `vercel.json` in this repo to build from `frontend`).

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
VITE_SOCKET_URL=https://adflow-network.onrender.com
VITE_API_BASE_URL=https://adflow-network.onrender.com/api
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

Base URL:

- Local: `http://localhost:5000/api`
- Production: `https://adflow-network-dooh-advertising-system-production.up.railway.app/api`

All responses are JSON. Unless noted, requests use `Content-Type: application/json`.

### Ads

- `GET /ads` — list all ads
- `POST /ads` — create a new ad (multipart/form-data)
	- Body fields: `name` (string, required), `duration` (number, optional), `video` (file, required)
- `PATCH /ads/:id/play` — increment play count for an ad
- `DELETE /ads/:id` — delete an ad (also removes the Cloudinary asset)

Example (create ad):

```bash
curl -X POST "$VITE_API_BASE_URL/ads" \
	-F "name=Winter Sale" \
	-F "duration=15" \
	-F "video=@/path/to/ad.mp4"
```

### Screens

- `GET /screens` — list all screens (includes playlist + location)
- `GET /screens/code/:code` — fetch screen by screenCode (e.g. `AB-1234`)
- `POST /screens` — create a new screen
	- Body: `name` (required), `playlistId` (optional), `locationId` (optional)
- `PATCH /screens/:id` — update screen
	- Body: `name` (optional), `playlistId` (optional), `locationId` (optional), `status` (optional)
- `DELETE /screens/:id` — delete a screen

### Playlists

- `GET /playlists` — list all playlists (includes ads + locations)
- `POST /playlists` — create a new playlist
	- Body: `name` (required), `adIds` (array of ad IDs), `locationIds` (array of location IDs)
- `PATCH /playlists/:id` — update a playlist
	- Body: `name` (optional), `adIds` (optional), `locationIds` (optional)
- `DELETE /playlists/:id` — delete a playlist

### Locations

- `GET /locations` — list all locations
- `GET /locations/type/:type` — filter by type (`country`, `city`, or `location`)
- `POST /locations` — create a location
	- Body:
		- Common: `name` (required), `type` (optional)
		- Country: `timezone` (required if type is `country`)
		- City: `country` (required if type is `city`)
		- Location: `city` and `country` (required if type is `location`)
- `DELETE /locations/:id` — delete a location

### Dashboard

- `GET /dashboard/stats` — return counts for ads, playlists, screens, locations

### Users

- `POST /users/signup` — create a new user
- `POST /users/login` — login
- `GET /users` — list users
- `DELETE /users/:id` — delete a user

### Example Requests & Responses

`GET /ads`

```json
[
	{
		"_id": "64f1a1...",
		"name": "Winter Sale",
		"duration": 15,
		"videoUrl": "https://res.cloudinary.com/...",
		"playCount": 12,
		"playlistCount": 2,
		"createdAt": "2024-09-05T08:31:22.000Z"
	}
]
```

`POST /ads` (multipart/form-data)

```json
{
	"_id": "64f1a1...",
	"name": "Winter Sale",
	"duration": 15,
	"videoUrl": "https://res.cloudinary.com/...",
	"playCount": 0,
	"createdAt": "2024-09-05T08:31:22.000Z"
}
```

`PATCH /ads/:id/play`

```json
{ "playCount": 13 }
```

`DELETE /ads/:id`

```json
{ "message": "Ad and associated video deleted successfully." }
```

`GET /screens`

```json
[
	{
		"_id": "6501...",
		"name": "Front Display",
		"screenCode": "AB-1234",
		"status": "online",
		"playlist": { "_id": "6602...", "name": "Morning Loop" },
		"location": { "_id": "6703...", "name": "Dhaka" }
	}
]
```

`GET /screens/code/:code`

```json
{
	"_id": "6501...",
	"name": "Front Display",
	"screenCode": "AB-1234",
	"playlist": {
		"_id": "6602...",
		"name": "Morning Loop",
		"ads": [{ "_id": "64f1a1...", "name": "Winter Sale" }]
	},
	"location": { "_id": "6703...", "name": "Dhaka" }
}
```

`POST /screens`

```json
{
	"_id": "6501...",
	"name": "Front Display",
	"screenCode": "AB-1234",
	"playlist": null,
	"location": null
}
```

`PATCH /screens/:id`

```json
{
	"_id": "6501...",
	"name": "Front Display",
	"status": "online",
	"playlist": { "_id": "6602...", "name": "Morning Loop" },
	"location": { "_id": "6703...", "name": "Dhaka" }
}
```

`DELETE /screens/:id`

```json
{ "message": "Screen deleted." }
```

`GET /playlists`

```json
[
	{
		"_id": "6602...",
		"name": "Morning Loop",
		"ads": [{ "_id": "64f1a1...", "name": "Winter Sale" }],
		"locations": [{ "_id": "6703...", "name": "Dhaka" }]
	}
]
```

`POST /playlists`

```json
{
	"_id": "6602...",
	"name": "Morning Loop",
	"ads": ["64f1a1..."],
	"locations": ["6703..."]
}
```

`PATCH /playlists/:id`

```json
{
	"_id": "6602...",
	"name": "Morning Loop",
	"ads": ["64f1a1..."],
	"locations": ["6703..."]
}
```

`DELETE /playlists/:id`

```json
{ "message": "Playlist deleted." }
```

`GET /locations`

```json
[
	{
		"_id": "6703...",
		"type": "city",
		"name": "Dhaka",
		"country": "Bangladesh",
		"timezone": "Asia/Dhaka"
	}
]
```

`GET /locations/type/:type`

```json
[
	{ "_id": "6703...", "type": "city", "name": "Dhaka" }
]
```

`POST /locations`

```json
{
	"_id": "6703...",
	"type": "city",
	"name": "Dhaka",
	"country": "Bangladesh",
	"timezone": "Asia/Dhaka"
}
```

`DELETE /locations/:id`

```json
{ "message": "Location deleted." }
```

`GET /dashboard/stats`

```json
{ "ads": 12, "playlists": 4, "screens": 7, "locations": 5 }
```

`POST /users/signup`

```json
{
	"message": "Signup Successful!",
	"user": {
		"id": "6804...",
		"name": "Admin",
		"email": "addmin@example.com",
		"role": "admin"
	}
}
```

`POST /users/login`

```json
{
	"message": "Login Successful!",
	"user": {
		"id": "6804...",
		"name": "Admin",
		"email": "admin@example.com",
		"role": "admin"
	}
}
```

`GET /users`

```json
[
	{
		"name": "Admin",
		"email": "admin@example.com",
		"role": "admin",
		"phone": null,
		"avatar": null
	}
]
```

`DELETE /users/:id`

```json
{ "message": "User deleted." }
```

### Error Codes

| Status | Meaning | Example message |
| --- | --- | --- |
| 400 | Bad Request | "Invalid location type." |
| 401 | Unauthorized | "Cloudinary credentials are mismatched in deployment env." |
| 404 | Not Found | "Screen not found." |
| 500 | Server Error | "Something went wrong." |

### OpenAPI Stub

If you want to publish formal docs later, start with this minimal OpenAPI skeleton:

```yaml
openapi: 3.0.3
info:
	title: AdFlow Network API
	version: 1.0.0
servers:
	- url: https://adflow-network-dooh-advertising-system-production.up.railway.app/api
	- url: http://localhost:5000/api
paths:
	/ads:
		get:
			summary: List ads
			responses:
				"200": { description: OK }
		post:
			summary: Create ad
			responses:
				"201": { description: Created }
	/ads/{id}/play:
		patch:
			summary: Increment play count
			responses:
				"200": { description: OK }
	/screens:
		get:
			summary: List screens
			responses:
				"200": { description: OK }
```

## Team

Built by -
Taslima Bushra Islam Jeem
(insert your name)

## License

This project is for educational purpose
