
# Notesyncs Project – Connection Setup

1️⃣ **Backend Folder Structure**

* backend/

  * .env
  * index.js
  * node_modules/

---

2️⃣ **Install Dependencies**

* Initialize project: `npm init -y`
* Install packages:

  * `npm install express mysql2 dotenv cors`
  * `npm install --save-dev nodemon`

Explanation:

* express → backend server
* mysql2 → connect MySQL database
* dotenv → read `.env` file
* cors → allow frontend ↔ backend requests

---

3️⃣ **Backend .env file**

* Path: backend/.env

Example:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=         (MySQL root password or leave blank if none)
DB_NAME=notesyncs_db
PORT=5000

* DB_HOST → MySQL host
* DB_USER → MySQL username
* DB_PASSWORD → MySQL password
* DB_NAME → Database name
* PORT → Backend server port

---

4️⃣ **Backend index.js**

* Setup express server + connect MySQL:

1. Import packages: express, cors, mysql2, dotenv
2. Middleware: cors(), express.json()
3. Database connection:

* Use `mysql.createConnection` with `.env` variables
* Connect and log success or error

4. Test route: `/`

* Run query `SELECT NOW() AS currentTime`
* Return JSON to frontend

5. Start server on PORT


5️⃣ **MySQL Database Setup**

* Create database:
  `CREATE DATABASE notesyncs_db;`

* Optional: dedicated user for security:
  `CREATE USER 'notesyncs_user'@'localhost' IDENTIFIED BY 'userpassword';`
  `GRANT ALL PRIVILEGES ON notesyncs_db.* TO 'notesyncs_user'@'localhost';`
  `FLUSH PRIVILEGES;`

* Update `.env` with new user/password if using dedicated user

---

6️⃣ **Frontend Setup**

* Frontend folder `.env`:

`REACT_APP_API_URL=http://localhost:5000`

* React fetch example (`App.js`):

1. useEffect → fetch(`${process.env.REACT_APP_API_URL}/`)
2. Convert response to JSON → set state
3. Display in component:

Example:

* `<h1>Backend Time from MySQL:</h1>`
* `<p>{time}</p>`

---

7️⃣ **Run & Test**

* Backend: `cd backend` → `npm run dev`
* Frontend: `cd frontend` → `npm start`
* Browser: `http://localhost:3000`
* Screen shows **Backend Time from MySQL:** + current time → connection working 

---


