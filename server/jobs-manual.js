
const KNEX = require('knex');
const STRIPE = require('stripe');


// @see http://knexjs.org/#Installation-node
var knex = KNEX({
	'client': 'pg',
	"connection": {

/*
// dev/local
		"host": "github-com-goodybag-goodybag-core-0.goodybag.github.pinf.me",
        "port": 8089,
        "user": "lunchroom_dev_preview",
        "password": "1E07DEEC-DE21-4E84-B47F-104C5070259A",
        "database": "lunchroom_dev_preview",
        "ssl": true
*/

// staging
		"host": "ec2-107-21-240-156.compute-1.amazonaws.com",
        "port": 5732,
        "user": "u9e5uar8mdmlqt",
        "password": "p3m0t493t12oufb6shuj8q9saav",
        "database": "d6da1bd7tqk7k",
        "ssl": true
/*
// live
		"host": "ec2-107-21-253-234.compute-1.amazonaws.com",
        "port": 6002,
        "user": "uenn1nb98f3669",
        "password": "p5i82eo3fhl5m0etr22uimc8cmk",
        "database": "ddn7dgetbsvnkc",
        "ssl": true
*/
    }
});



var MOMENT = function () {
//	return require("moment-timezone")().tz("America/Chicago");
	return require("moment")();
}


var day_id = MOMENT().format("YYYY-MM-DD");

//knex('orders').where('form', 'like', '%jag@goodybag.com%').then(function (resp) {
//knex('orders').select('id', 'form').where('day_id', day_id).then(function (resp) {

knex('orders').select('id', 'form').then(function (resp) {

	var newInfo = {};

	resp.forEach(function (row) {
		try {
			var form = JSON.parse(row.form);

			newInfo[row.id] = form;
		} catch (err) {}
	});


console.log("newInfo", newInfo);



/*
//	if (!resp[0].menuEmailTime) {
		knex('events').where('id', 9).update({
			menuEmailTime: MOMENT(
				day_id + ":" + "10:00", "YYYY-MM-DD:H:mm"
			).format(),
			menuSmsTime: MOMENT(
				day_id + ":" + "10:00", "YYYY-MM-DD:H:mm"
			).format()
		}).then(function (res) {

console.log("res", res);

		});
//	}
*/

});


/*
knex('orders').whereIn('id', [
	24
]).delete().then(function (resp) {

console.log("resp2", resp);

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

