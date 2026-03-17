# HOD Performance & Workflow Management System

## Overview
A full-stack College Department Management System built with **Next.js** (Frontend) and **Node.js/Express** (Backend). It supports hierarchical workflow: Student -> Faculty -> HOD.

## Features
- **Role-based Authentication**: Secure login for Students, Faculty, and HOD.
- **Dashboards**: Dedicated dashboards for each role.
- **Workflow Management**: Students submit requests, Faculty verifies, HOD approves.
- **Attendance & Marks**: Tracking for students.

## Quick Start

### 1. Backend Setup
1. Navigate to `/server`:
   ```bash
   cd server
   ```
2. Install Dependencies (if not already done):
   ```bash
   npm install
   ```
3. **Seed the HOD User**:
   ```bash
   node seeds/seed.js
   ```
   *Creates admin user: `hod@college.edu` / `admin123`*
4. Start the Server:
   ```bash
   npm start
   ```
   *Server runs on port 5000.*

### 2. Frontend Setup
1. Navigate to `/client`:
   ```bash
   cd client
   ```
2. Install Dependencies (if pending):
   ```bash
   npm install
   ```
3. Start the Development Server:
   ```bash
   npm run dev
   ```
   *Client runs on port 3000.*

## API Endpoints
- `/api/auth/login`: Login
- `/api/hod/dashboard`: HOD Stats
- `/api/faculty/requests`: Faculty Verifications
- `/api/student/stats`: Student Data

## Default Login
- **Email**: `hod@college.edu`
- **Password**: `admin123`
