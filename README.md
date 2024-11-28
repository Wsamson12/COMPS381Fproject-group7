# Booking Collection System

Created for Book Collection, 1-click easy, self-hostable.
Developed using HTML / CSS / Javascript / Node.js

## Project Info

**Project Name:** Booking Collection System

This project was undertaken as a group assignment for the Server Side and Cloud Computing course (COMP S381F / S3810SEF) at HKMU as Group 7

**Group Info:**
**Group No.:** [Group 7]

- **Students’ Names:** [Student 1 Name], [Student 2 Name], [Student 3 Name], [Student 4 Name]
- **Student IDs:** [SID 1], [SID 2], [SID 3], [SID 4]

## Project File Introduction

- **server.js:**

  - Sets up the Express server, handles routing, and manages middleware for authentication and session management. Connects to the database and serves static files.
- **package.json:**

  - Lists dependencies required for the project, including Express, EJS, Mongoose, and other libraries.
- **public (folder):**

  - Contains static files such as CSS stylesheets, JavaScript files, and images.
- **views (folder):**

  - Includes EJS templates for rendering HTML pages, such as login, registration, and book management interfaces.
- **models (folder):**

  - Contains Mongoose model definitions for the database schema (users and books).

## Cloud-Based Server URL

- **Testing URL:** [https://comps381fproject-group7.onrender.com](https://comps381fproject-group7.onrender.com)

## Features

- Username Login
- Username Signup
- Create Books
- Update book records
- Delete Books
- Inspect Books

## Operation Guides

### Requirements

Computer with modern OS (macOS / Linux / Windows)

- Node.js installed and configured
- A web browser
- Some knowledge in command line
- git installed
- MongoDB API key
- Sufficient network bandwidth (If you want to host your own)
- An IDE

For computers that do not have Node.js installed, you can install it  [here](https://nodejs.org/)

For computers that do not have git installed, install it [here](https://https://git-scm.com/)

## Set Up Process

1. To set up, clone the repository to your computer using git

```
git clone 
```

2. Open the cloned folder in command line and install all required dependencies

```
npm i

// Or you can use
npm install
```

3. open the IDE to input your own API KEYS, the api key location has been placed in `server.js`.


| Field      | Description                                 |
| ---------- | ------------------------------------------- |
| `mongoURI` | MongoDB backend for server data CURD access |

You are required to input your MONGO DB API KEY into the following script :

const mongoURI = process.env.MONGODB_URI || `'Your_own_API_KEY'`[^1];

### User Flow

Below are the user steps for login, register and conduct crud process of the books.

#### Registration Page

- **Sign Up Steps:**
  1. Navigate to the registration page.
  2. Fill out the form with the required information (username, password, email, etc.).
  3. Click the "Register" button to create a new account.

#### Login/Logout Pages

- **Valid Login Information:**

  - Username: `t01`
  - Password: `12101` （it will be hashed due to security reason)
- **Sign In Steps:**

  1. Navigate to the login page.
  2. Enter the username and password.
  3. Click the "Login" button to access the system.
  4. To logout, click the "Logout" button in the navigation menu.

#### CRUD Web Pages

- **Create Book:**

  - Click the "Add Book" button on the dashboard.
  - Fill out the form with book details (name, type, Imaage, description, etc.).
  - Submit the form to create a new book entry.
- **Read Books:**

  - The homepage displays a list of all books in the collection.
  - Click on a book title to view its details.
- **Edit Book:**

  - Click the "Edit" button next to the book you wish to modify.
  - Update the necessary fields and submit the changes.
- **Delete Book:**

  - Click the "Delete" button next to the book you want to remove.
  - Confirm the deletion in the prompt.

#### RESTful CRUD Services

- **API Endpoints:**
  - **Register User:**

    - **Method:** POST
    - **Path:** `/register`
  - **Login User:**

    - **Method:** POST
    - **Path:** `/login`
  - **Logout User:**

    - **Method:** Get
    - **Path:** `/logout`
  - **Trace the newest user:**

    - **Method:** GET
    - **Path:** `/user/latestuser`
  - **Get Register and login status:**

    - **Method:** GET
    - **Path:** `/message`

//not yet

- **Create Book:**

  - **Method:** POST
  - **Path:** `/create`
- **Read Book list:**

  - **Method:** GET
  - **Path:** `/BookList`
- **Update Book:**

  - **Method:** PUT
  - **Path:** `/update/:id`
- **Delete Book:**

  - **Method:** DELETE
  - **Path:** `/delete/:id`
- **Search Books**

  - **Method:** GET
  - **Path:** `/search`

### Testing with CURL

> Example:

- **Register User:**
  curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username": "t01", "password": "12101"}'
- **Create a Book:**
  curl -X POST -F "name=The%20Hobbit" -F "type=Fantasy" -F "description=Another%20Tolkien%20classic" -F "image=@/path/to/your/image.jpg" http://localhost:3000/create
- **Update a Book:**
  curl -X PUT -H "Content-Type: application/json" -d '{"bookName": "Updated Title", "bookType": "Fantasy", "bookDescription": "Updated Description"}' http://localhost:3000/update/6557b1a7c5a77a66e7b7a123
- **Delete a Book:**
  curl -X DELETE http://localhost:3000/delete/6557b1a7c5a77a66e7b7a123
- **Search a Book:**
  curl http://localhost:3000/search?bookName=Hobbit

## Library used

### NPM packages


| Dependency      | Version | Description                                                              |
| --------------- | ------- | ------------------------------------------------------------------------ |
| bcrypt          | ^5.1.1  | A library to help you hash passwords securely.                           |
| cookie-session  | ^2.1.0  | Middleware for handling cookie-based sessions in Express.                |
| dotenv          | ^16.4.5 | A zero-dependency module to load environment variables from a .env file. |
| ejs             | ^3.1.9  | A templating language that lets you generate HTML with plain JavaScript. |
| express         | ^4.18.2 | A minimal and flexible Node.js web application framework.                |
| express-session | ^1.17.2 | Middleware for managing session data in Express applications.            |
| i               | ^0.3.7  | A library for inferring the type of an object.                           |
| mongodb         | *       | The official MongoDB driver for Node.js.                                 |
| mongoose        | ^8.8.1  | An ODM (Object Data Modeling) library for MongoDB and Node.js.           |

[^1]: input the mongodb api key in the ' ' part.
