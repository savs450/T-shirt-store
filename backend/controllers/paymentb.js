var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "f6swdsvbphn36ygw",
  publicKey: "85xq4hw4qv9jq7cr",                               
  privateKey: "3a65a3966c8e937fd85bae9266e2106f",           
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      //res.status(500).send(err)
      console.log(err)
      res.status(500).json(err);
    } else {
      console.log(response)
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nounceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;

  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      //  deviceData: deviceDataFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        res.status(500).json(error);
      } else {
        res.send(result);
      }
    }
  );
};






