const { post } = require('request');
const getPostParameters = require('../utils/getPostParameters');
const handleCallback = require('../utils/handleCallback');

module.exports = (res, request) => {
    const params = getPostParameters('/payments', request);
    console.log(`from payments API : sending ${params.body} to ${res.req.url}`);
    post(params, (err, response, body) => handleCallback({ err, response, body }, res));
};