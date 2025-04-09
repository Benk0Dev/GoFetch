GoFetch is a full-stack application divided into client, server, and shared components.

## Project Structure

- client: React frontend application built with TypeScript and Vite
- server: Node.js backend application
- shared: Common TypeScript types and utilities shared between client and server

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation and Running the Application

#### Option 1: Starting Server and Client Separately

1. **Install and start the server:**

```bash
cd server
npm install
npm run dev
```

2. **Install and start the client (in a separate terminal):**

```bash
cd client
npm install
npm run dev
```

**Note for Windows users:**
```bash
npm install @rollup/rollup-win32-x64-msvc
```

#### Option 2: Using VS Code Launch Configuration

This project includes VS Code launch configurations that make it easy to start both applications:

1. Open the project in VS Code
2. Press `F5` or click the "Run and Debug" icon in the sidebar
3. Select "Run Server + Client Dev" from the dropdown menu
4. Click the green play button

This will launch both the client and server in separate terminal windows.

## Development

- Server runs on: http://localhost:3001 by default
- Client runs on: http://localhost:5173 by default (managed by Vite)

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express
- **Communication**: WebSockets for real-time features, REST API

## Project Features

- Authentication (login/registration)
- User profiles and roles
- Service booking system
- Messaging capabilities
- Pet management
- Payment processing

## Made by

- Benas Kuliesis(230356980)
- Andrii Karmazinskyi(230978409)
- Rachel Miriam Teper(220335605)
- Oluwadamilare Taiwo(230161953)
- Mohammad Usman Khan(230300068)
- Mohammed Usman Kakar(230350409)

For detailed documentation on specific components, please refer to the README files in the respective folders.