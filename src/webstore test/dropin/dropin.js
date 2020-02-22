let dropin = "";

// const dropin = checkout
//     .create('dropin', {
//         paymentMethodsConfiguration: {
//             card: { // Example optional configuration for Cards
//                 hasHolderName: true,
//                 holderNameRequired: true,
//                 enableStoreDetails: false,
//                 name: 'Credit or debit card'
//             },
//             ideal: {
//                 supportsRecurring: true,
//                 type: 'ideal'
//             }
//         },
//         onSubmit: (state, dropin) => {
//             makePayment(state.data)
//                 // Your function calling your server to make the /payments request
//                 .then(action => {
//                     dropin.handleAction(action);
//                     // Drop-in handles the action object from the /payments response
//                 })
//                 .catch(error => {
//                     throw Error(error);
//                 });
//         },
//         onAdditionalDetails: (state, dropin) => {
//             makeDetailsCall(state.data)
//                 // Your function calling your server to make a /payments/details request
//                 .then(action => {
//                     dropin.handleAction(action);
//                     // Drop-in handles the action object from the /payments/details response
//                 })
//                 .catch(error => {
//                     throw Error(error);
//                 });
//         }
//     })
//     .mount('#dropin-container');




// 0. Get originKey
getOriginKey().then(originKey => {
    getPaymentMethods().then(paymentMethodsResponse => {
        // 1. Create an instance of AdyenCheckout
        const checkout = new AdyenCheckout({
            environment: 'test',
            originKey: originKey, // Mandatory. originKey from Costumer Area
            paymentMethodsResponse,
            removePaymentMethods: ['paysafecard', 'c_cash', 'sepadirectdebit']
        });

        // 2. Create and mount the Component
        let dropin = checkout
            .create('dropin', {
                paymentMethodsConfiguration: {
                    card: { // Example optional configuration for Cards
                        hasHolderName: true,
                        holderNameRequired: true,
                        enableStoreDetails: false,
                        name: 'Credit or debit card'
                    },
                    ideal: {
                        supportsRecurring: true,
                        type: 'ideal'
                    }
                },
                onSubmit: (state, dropin) => {
                    makePayment(state.data)
                        // Your function calling your server to make the /payments request
                        .then(action => {
                            switch (action.resultCode) {
                                case 'Authorised':
                                    dropin.setStatus('success');
                                    break;
                                case 'Refused':
                                    dropin.setStatus('error', { message: `Transaction has been refused\nReason : ${paymentStatusResponse.refusalReason}` });
                                    break;
                                case 'RedirectShopper':
                                    console.log(JSON.stringify(action));
                                    window.open(action.redirect.url);
                                    makeDetailsCall(action).then(action => {
                                        console.log(`inside redirect shopper : ${JSON.stringify(action)}`);
                                    });
                                    break;
                                default:
                                    break;
                            }
                            dropin.handleAction(action);
                            // Drop-in handles the action object from the /payments response
                        })
                        .catch(error => {
                            console.log(error.message);
                            throw Error(error);
                        });
                },
                onAdditionalDetails: (state, dropin) => {
                    console.log("addtl details called1");
                    makeDetailsCall(state.data)
                        // Your function calling your server to make a /payments/details request
                        .then(action => {
                            //dropin.handleAction(action);
                            // Drop-in handles the action object from the /payments/details response
                            console.log("addtl details called2");
                        })
                        .catch(error => {
                            throw Error(error);
                        });
                }
            }).mount('#dropin-container');
    });
});

function authoriseCheck(dropin, resultCode) {
    console.log(resultCode);
    if (resultCode === 'Refused') {
        dropin.setStatus('error');
    }
    if (resultCode === 'success') {
        dropin.setStatus('success');
    }
}