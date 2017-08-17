const
	braintree = require('braintree'),
	myMerchantKey = 'c6jjcwcq4s4v4bhq',
	myPublicKey = '3fsxbv882nxj3f2v',
	myPrivateKey = 'ff0cb8823056151b6ef0be8b1709f2fd',
	gateway = braintree.connect({
		environment: braintree.Environment.Sandbox,
		merchantId: myMerchantKey,
		publicKey: myPublicKey,
		privateKey: myPrivateKey,
	})

module.exports = gateway
