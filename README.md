# Sam Charmz Full Stack Application

## Prerequisites
- Node.js
- MongoDB (Local or Atlas)

## Getting Started

1. **Install Dependencies**
   Run the following command in the root folder to install dependencies for root, client, and server:
   ```bash
   npm run install:all
   ```

2. **Environment Setup**
   - Copy `server/.env.example` to `server/.env` and configure `MONGO_URI` (either locally or your MongoDB Atlas URI).
   - Copy `client/.env.example` to `client/.env`.

3. **Run Concurrently**
   From the root folder, start both the frontend and backend servers:
   ```bash
   npm run dev
   ```

## Folder Structure
- `/client`: React (Vite) Frontend
- `/server`: Express & MongoDB Backend
