
const KNEX = require('knex');
const STRIPE = require('stripe');


// @see http://knexjs.org/#Installation-node
var knex = KNEX({
	'client': 'pg',
	"connection": {
		"host": "ec2-107-21-253-234.compute-1.amazonaws.com",
        "port": 6002,
        "user": "uenn1nb98f3669",
        "password": "",
        "database": "ddn7dgetbsvnkc",
        "ssl": true
    }
});

/*
knex('orders').where('id', 6).orderBy('time', 'desc').limit(5).then(function (resp) {

console.log("resp", resp);


});
*/

/*
var stripe = STRIPE("");
var payload = {
	"amount": 1371,
	"currency": "usd",
	"metadata": {
		"orderHashId": "76baa672-e2b4-4404-8f3c-ad755d7cea2d",
		"email": "xavier.gonzalez@bazaarvoice.com"
	},
	"capture": true,
	"source": "tok_16anLIEQiCMC2eZ7SRKXeNNO",
	"description": "Manual lunchroom charge for 'Xavier Gonzalez'"
};
console.log("Posting to stripe:", JSON.stringify(payload, null, 4));
stripe.charges.create(payload, function (err, paymentCharge) {
	if (err) return callback(err);

console.log("paymentCharge", paymentCharge);
process.stdout.write(JSON.stringify(paymentCharge));

	return knex('orders').update({
		paymentCharge: JSON.stringify(paymentCharge)
	}).where("id", 6);
});
*/

/*
{
	"amount": 1371,
	"currency": "usd",
	"metadata": {
		"orderHashId": "76baa672-e2b4-4404-8f3c-ad755d7cea2d",
		"email": "xavier.gonzalez@bazaarvoice.com"
	},
	"capture": true,
	"source": "tok_16anLIEQiCMC2eZ7SRKXeNNO",
	"description": "Manual lunchroom charge for 'Xavier Gonzalez'"
}


Xavier Order

id: tok_16anLIEQiCMC2eZ7SRKXeNNO
livemode: true
created: 1439816880
used: false
object: "token"
type: "card"
card:
id: card_16anLIEQiCMC2eZ72eorih0W
object: "card"
last4: "0872"
brand: "Visa"
funding: "debit"
exp_month: 6
exp_year: 2020
country: "US"
name: "Xavier Gonzalez"
address_line1: null
address_line2: null
address_city: null
address_state: null
address_zip: null
address_country: null
cvc_check: "unchecked"
address_line1_check: null
address_zip_check: null
tokenization_method: null
dynamic_last4: null
metadata:
client_ip: "216.166.20.1"
*/

