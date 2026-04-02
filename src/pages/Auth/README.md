# Modern Authentication Module 🔐

## Professional React & Tailwind Auth System

A sleek, production-ready authentication interface with a unified design. This module provides a seamless transition between Login, Signup, and Password Recovery, ensuring a fixed-size UI that stays centered on all screens.

## Live Demo
- Frontend: [Your Vercel/Netlify Link Here]
- Status: Development Ready

### Key Features
- Unified UI Design: Both Login and Signup interfaces share a fixed dimension (360px x 550px) to prevent layout shifting.
- Fixed Positioning: The card is locked to the center using fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 to ensure stability.
- Complete Auth Flow: Supports Login, Signup, Forgot Password (OTP via EmailJS), and Password Reset.
- Google Integration: Pre-configured buttons for Google Auth with optimized account chooser links.
- Real-time Validation: Integrated required field handling and custom icon-aware inputs.

## Tech Stack
- Framework: React.js
- Styling: Tailwind CSS
- Icons: Lucide React
- Email Service: EmailJS (For OTP delivery)
- Routing: React Router DOM

## Project Structure
- src/auth/Login.jsx: Login, OTP & Password Reset logic
- src/auth/Signup.jsx: Registration interface
- src/auth/Input.jsx: Reusable custom Input component
- src/auth/Button.jsx: Reusable custom Button component
- src/App.js: Main routing and view controller

## Setup & Installation

1. Clone the repo:
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name

2. Install Dependencies:
   npm install lucide-react @emailjs/browser

3. Environment Configuration:
   Open Login.jsx and update your EmailJS credentials:
   const SERVICE_ID = "YOUR_SERVICE_ID";
   const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
   const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

4. Run the Project:
   npm start

## How It Works
1. Switching Views: The App.js uses a state-based view switcher to toggle between Login and Signup.
2. Password Recovery: Click "Forgot Password" in Login. Enter Email to receive a 4-digit OTP via EmailJS. Verify OTP to unlock the Password Reset field.
3. Responsive Design: Uses Tailwind's utility classes to ensure the 360x550 card looks perfect on Desktop and Mobile.

## Design Constants
- Card Width: 360px
- Card Height: 550px
- Background Color: #E9EDF0
- Primary Action Color: #2297FE
- Font Family: Inter, system-ui

## License
This project is open-source and free to use for personal and commercial applications.