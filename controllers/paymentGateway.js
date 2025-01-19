const PAYSTACK_SECRET_KEY = "sk_test_63f8e17bf7de66b45c7a1a40b3680a155fe60e00"
const axios = require("axios")

const paymentGateway = async (req, res) => {
    const { amount, email, orderId } = req.body;  // I extract the payment details (amount, email, and orderId) from the request body.

    try {
        // I make a POST request to Paystack's API to initialize the payment.
        // The API expects the amount in kobo (1 kobo = 1/100 of a Naira), so I multiply the amount by 100.
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',  // Paystack endpoint to initialize payment
            {
                email: email,  // The email of the user making the payment
                amount: amount * 100,  // Amount is expected in kobo, so I multiply the amount by 100
                order_id: orderId,  // A unique order identifier
                 
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,  // I add the authorization header with the Paystack secret key.
                },
            }
        );

        // I log the response from Paystack to inspect the data for debugging purposes.
        console.log(response);

        // If Paystack returns a successful status, I send back the authorization URL to the frontend so the user can complete the payment.
        if (response.data.status === true) {
            res.json({
                success: true,
                authorization_url: response.data.data.authorization_url,  // The URL where the user can authorize the payment
                reference: response.data.data.reference,  // The payment reference for tracking
            });
        } else {
            // If Paystack couldn't initialize the payment, I send a failure message.
            res.json({
                success: false,
                message: 'Payment initialization failed',  // Indicate that something went wrong with initializing the payment
            });
        }
    } catch (error) {
        // If an error occurs during the API request, I log the error and send a 500 status with a failure message.
        console.log(error);
        
        res.status(500).json({
            success: false,
            message: 'Error processing payment request',  // Notify the client that there was a problem with the payment request
        });
    }
}


module.exports = { paymentGateway };