module.exports = ({ error, response = {}, body }, res) => {
    if (error) {
        console.error(error);
        return res.send(error);
    }

    if (response.statusCode && response.statusMessage) {
        console.log(`Request to ${response.url} ended with status ${response.statusCode} - ${response.statusMessage}`);
    }

    console.log(`in the handle callback : ${body}`);
    res.send(body);
};