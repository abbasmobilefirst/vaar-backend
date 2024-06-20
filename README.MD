
## Discreit - APIs

This is the backend for the discreit app, a RESTful API built with Node.js, Express, and MongoDB for a mobile application.

### Folder Structure

The project contains different types of folders:

- **controllers**: It contains all the controllers for the routes. The controllers are further categorized into two folders: `admin` and `user`.

- **models**: It contains all the models for the database.

- **routes**: It contains all the routes for the controllers.

- **middlewares**: It contains all the middleware for authentication and authorization.

- **utils**: It contains all the utility functions for the controllers.

### Getting Started

1. First, clone the repository from GitHub:

```bash
git clone https://github.com/pedalsup/discreit-api.git
```

2. Change into the project directory:

```bash
cd discreit-api
```

3. Install the dependencies:

```bash
npm install
```

4. Install nodemon globally (if not already installed):

```bash
npm install -g nodemon
```

5. Create a `.env` file and add the following variables:

```dotenv
DEV_ENV=LOCAL
ACCESS_SECRET=<your_access_secret>
REFRESH_SECRET=<your_refresh_secret>
KEY_ENCRYPT_DECRYPT=<your_key_for_encryption_and_decryption>

# SSL Configuration
SSL_PRIV_KEY=<path_to_ssl_private_key> for local it will be empty
SSL_FULLCHAIN_KEY=<path_to_ssl_fullchain_key> for local it will be empty

PORT=3000

DB_USER=<database_username> for local it will be empty
DB_PASSWORD=<database_password> for local it will be empty
DB_SERVER=<database_server> for local it will be empty
DB_PORT=<database_port> for local it will be empty
DB_NAME=<database_name> for local it will be empty
ADMIN_ACCESS_SECRET=<admin_access_secret>
ADMIN_REFRESH_SECRET=<admin_refresh_secret>

AWS_KEY=<your_aws_key>
AWS_REGION=<your_aws_region>
AWS_SECRET=<your_aws_secret>
AWS_S3BUCKET=<your_aws_s3bucket>
ADMIN_EMAIL_ID=<admin_email_id>
```

6. Install Google Cloud Storage for storing the data:

```bash
npm i @google-cloud/storage
```

7. After cloning the repo, make sure you have Node.js and MongoDB installed on your system.

8. In the `middleware` folder, create a file named `utilitarian-arc-387906-4b808cb547a3.json` and add the credentials of your Google Cloud Storage.

9. Start the server:

```bash
npm start
```

Please make sure to replace `<placeholders>` with the actual values for the respective variables.

Note: The nodejs version required is 15.0.0, and the MongoDB version required is 5.0.0.

---

The corrected README provides clear instructions on how to set up and run the backend for the Discreit app. If you have any other specific questions or need further assistance, feel free to ask!





