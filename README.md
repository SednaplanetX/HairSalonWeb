# Salon Tu Booking App

This is a simple salon booking application built with Node.js, Express, EJS, and MySQL.

## Prerequisites

- Node.js
- npm
- MySQL server

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure database connection.

In the db.js file, set your database connection credentials to the variables.

```js
const {
  DB_HOST = 'localhost', // Set host (localhost default)
  DB_PORT = '3306', // Set port number (3306 default)
  DB_USER = 'root', // Set your MySQL username here
  DB_PASSWORD = '', // Set your MySQL password here
  DB_NAME = 'salon_db'
} = process.env;
```

Then, run `npm start` and it should connect to the database server.

It may also be necessary to first run the db_query.sql file in your database to create the schema structure.

3. Create a MySQL user and grant permissions if needed:

_THIS STEP MAY NOT BE NECESSARY_

I had trouble with authentication from root, so this was my work around. I recommend trying the method in step two first!

```sql
CREATE DATABASE IF NOT EXISTS salon_db;
CREATE USER 'salon_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON salon_db.* TO 'salon_user'@'localhost';
FLUSH PRIVILEGES;
```

> If you use `root`, set `DB_USER=root` and `DB_PASSWORD` accordingly.

## Run

Start the application and server:

```bash
npm start
```

Then open:

- `http://localhost:3000`

## Project structure

- `app.js` — main Express application
- `models/db.js` — MySQL connection and initialization
- `routes/auth.js` — login/register/logout routes
- `routes/appointments.js` — appointment CRUD routes
- `views/` — EJS templates
- `public/` — static assets

## Notes

- The app automatically creates the database and required tables on startup.
- Make sure your MySQL server is running before starting the app.
- The default port for MySQL is `3000`, but you can override it with with any other port.
- To access bookings and make appointments, you will first need to register an account. That can be found at the top right of the webpage for logged out or non-users.
