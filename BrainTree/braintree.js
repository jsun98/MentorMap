const
	braintree = require('braintree'),
	gateway = braintree.connect({
		environment: braintree.Environment.Sandbox,
		merchantId: process.env.MERCHANT_KEY,
		publicKey: process.env.PUBLIC_KEY,
		privateKey: process.env.PRIVATE_KEY,
	})

module.exports = gateway
