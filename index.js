const express = require('express');
const app = express();
const cors = require('cors');
const constants = require('./utils/constants')


const mongoose = require('mongoose');

const https = require('https');

const fs = require('fs');

const basicAuth = require('express-basic-auth');

const bodyParser = require('body-parser');
const swaggerJsDoc = require("swagger-jsdoc");
const SwaggerUi = require("swagger-ui-express")
require('dotenv').config({ path: __dirname + '/.env' });


//solving the CORS issue for the frontend.
const corsOptions = {
  origin: '*',
  // methods:'GET,PUT,POST'
}

//Cors
app.use(cors(corsOptions));
app.use(handleCORSRequests);


function handleCORSRequests(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, content-type, Authorization"
  );
  next();
}

//handling the body parser for the incoming json
app.use(bodyParser.json());

//user role API entry point
app.use("/api",require("./Routes/User/User"));
app.use("/api",require("./Routes/User/Property"));
app.use("/api",require("./Routes/User/OTP"));

//admin user role API entry point
app.use("/admin",require("./Routes/Admin/Property"));
app.use("/admin",require("./Routes/Admin/User"));
app.use("/admin",require("./Routes/Admin/Admin"));


//for swagger 
const options = {
  definition: {
      openapi: "3.0.0",
      info: {
          title: "Discreit API",
          version: "1.0.0",
          description: "A documentation for Discreit API"
      },
      servers: [
          {
              url: "http://localhost:3001/"
          }
         
      ],
  },
  apis: ["./docs/**/*.js","./docs/*js"],
};

//Making Swagger Call
const swaggerDocs = swaggerJsDoc(options);
app.use('/api-docs',basicAuth({
  users: { 'Admin': 'Admin@123' },
  challenge: true,
}), SwaggerUi.serve, SwaggerUi.setup(swaggerDocs));



// Connect to MongoDB

// const connection_string =  `mongodb://localhost:27017/discreit`
// before
// const connection_string =  `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_NAME}`
// after
const connection_string =  `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_SERVER}/${process.env.DB_NAME}`

// mongoose.connect(connection_string, { useNewUrlParser: true, useUnifiedTopology: true })

//   .then(() => {
//     console.log('Connected to Database...');
//   })
//   app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);
      
//   });

 


mongoose.connect(connection_string, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to Database...');
  })
  .then(() => {

    let serverConfig = process.env.DEV_ENV;
    let httpsServer;

    //spin up the https server in case of not local env
    if(serverConfig !== constants.LOCAL_DEV_ENV){
      httpsServer = https.createServer({
        key: fs.readFileSync(process.env.SSL_PRIV_KEY),
        cert: fs.readFileSync(process.env.SSL_FULLCHAIN_KEY),
      }, app);
    }


    // start the respective server
    if(serverConfig === constants.LOCAL_DEV_ENV){
      app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      });
    } else if (serverConfig === constants.STAGING_DEV_ENV || serverConfig === constants.PROD_DEV_ENV) {   
      httpsServer.listen(process.env.PORT, () => {
        console.log(`HTTPS Server running on port ${process.env.PORT}`);
      });
    } else {
      console.log('please check your .env file for the specification');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Could not connect to MongoDB...');
    console.error(err);
    process.exit(1); // Stop the server and exit the process
  });


// // Other server configuration and routes
// // ...

