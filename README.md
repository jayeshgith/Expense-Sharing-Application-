# Expense Sharing Application (Node.js + Express + MongoDB)

## Overview
This project is a backend for an Expense Sharing Application supporting user auth, group management, expenses, balances and settlements.

## Quick start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file from `.env.example` and set `MONGO_URI` to your local MongoDB (default provided).
3. Start MongoDB (for transactions you may need a replica set in local dev):
   ```bash
   # e.g. on Linux
   mongod --dbpath /path/to/db --replSet rs0 --port 27017
   # then in mongo shell:
   rs.initiate()
   ```
4. Run the server:
   ```bash
   npm run dev
   ```
5. Seed sample data (optional):
   ```bash
   npm run seed
   ```

## API endpoints (summary)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/groups
- DELETE /api/groups/:groupId
- POST /api/groups/:groupId/invite
- POST /api/groups/:groupId/join
- GET /api/groups/user/:userId
- POST /api/groups/:groupId/expenses
- GET /api/groups/:groupId/expenses
- GET /api/groups/:groupId/balances
- POST /api/groups/:groupId/settlements
- GET /api/users/:userId/settlements

See Postman collection in `postman/` for request examples.
