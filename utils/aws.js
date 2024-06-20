const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname + './../../.env') });

var AWS = require('aws-sdk');

exports.SendEmailWithConfirmation = (email, template, subject) => {

    // Set the region 
    AWS.config.update({
          region: process.env.AWS_REGION,
          accessKeyId: process.env.AWS_KEY,
          secretAccessKey: process.env.AWS_SECRET,
    });

    // Create sendEmail params 
    var params = {
          Destination: {
                ToAddresses: [
                      email
                ]
          },
          Message: {
                Body: {
                      Html: {
                            Charset: "UTF-8",
                            Data: template
                      },
                      Text: {
                            Charset: "UTF-8",
                            Data: "TEXT_FORMAT_BODY"
                      }
                },
                Subject: {
                      Charset: 'UTF-8',
                      Data: subject
                }
          },
          Source: process.env.ADMIN_EMAIL_ID
    };

    // Create the promise and SES service object
    var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

   
    return new Promise((resolve, reject) => {

          sendPromise
                .then(function (data) {
                      resolve(true)
                })
                .catch(function (err) {
                      // console.error(err, err.stack);
                      reject(false)
                });

    })

}