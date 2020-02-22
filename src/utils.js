let paymentMethodsConfig = {
    shopperReference: 'Checkout Components sample code test',
    reference: 'Checkout Components sample code test',
    countryCode: 'NL',
    amount: {
        value: localStorage.getItem('baskettotal'),
        currency: 'EUR'
    }
};

const paymentsDefaultConfig = {
    shopperReference: 'Checkout Components sample code test',
    reference: 'Checkout Components sample code test',
    countryCode: 'NL',
    channel: 'Web',
    returnUrl: 'http://localhost:3000/webstore%20test/dropin/',
    amount: {
        value: localStorage.getItem('baskettotal'),
        currency: 'EUR'
    },
    lineItems: [{
        id: '1',
        description: 'Test Item 1',
        amountExcludingTax: 10000,
        amountIncludingTax: 11800,
        taxAmount: 1800,
        taxPercentage: 1800,
        quantity: 1,
        taxCategory: 'High'
    }]
};

const paymentDetailsConfig = {
    paymentData: '',
    details: {
        PaReq: '',
        TermUrl: '',
        MD: ''
    }
};

// Generic POST Helper
const httpPost = (endpoint, data) =>
    fetch(`/${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());


// Get all available payment methods from the local server
const getPaymentMethods = () =>

    httpPost('paymentMethods', paymentMethodsConfig)
    .then(response => {
        if (response.error) throw 'No paymentMethods available';
        return response;

    })
    .catch(console.error);



// Posts a new payment into the local server
const makePayment = (paymentMethod, config = {}) =>



    //console.log(`sending payments to server \npayment : ${JSON.stringify(paymentRequest)}`);

    // updateRequestContainer(paymentRequest);

    //console.log(`update request container ok`);

    httpPost('payments', {...paymentsDefaultConfig, ...config, ...paymentMethod })
    .then(response => {

        if (response.error) throw 'Payment initiation failed';

        // updateResponseContainer(response);
        // authoriseCheck(response.resultCode);

        return response;
    })
    .catch(console.error);



// Fetches an originKey from the local server
const getOriginKey = () =>
    httpPost('originKeys')
    .then(response => {
        if (response.error || !response.originKeys) throw 'No originKey available';

        return response.originKeys[Object.keys(response.originKeys)[0]];
    })
    .catch(console.error);

// Posts a new payment into the local server
const makeDetailsCall = (paymentResponse) =>




    //console.log(`paymentDetailsConfig is now : ${JSON.parse(paymentDetailsConfig)}`);

    // updateRequestContainer(paymentRequest);

    httpPost('payments/details', paymentResponse.redirect.data)
    .then(response => {

        console.log(paymentResponse);
        if (response.error) throw 'Payment verification failed';

        // updateResponseContainer(response);

        return response;
    })
    .catch(console.error);



// const makeDetailsCall = (state, config = {}) =>
//     httpPost('payments/details', { state })
//     .then(response => {
//         console.log(state);
//         console.log(response);
//         if (response.error) throw 'Payment initiation failed';
//         return response;
//     })
//     .catch(console.error);