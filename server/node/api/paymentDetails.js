 const { post } = require('request');
 const getPostParameters = require('../utils/getPostParameters');
 const handleCallback = require('../utils/handleCallback');

 module.exports = (res, request) => {
     const params = getPostParameters('payments/details', request);
     console.log(`from payments-details method API : sending ${params.body} to ${params.url}`);
     post(params, (error, response, body) => handleCallback({ error, response, body }, res));
 }