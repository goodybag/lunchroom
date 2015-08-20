
const PATH = require("path");
const FS = require("fs");

require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {

    exports.email = {
        send: function (templateId, message, request) {

            return API.Q.fcall(function () {

                API.ASSERT.equal(Array.isArray(message.to), true);

                console.log("Sending email '" + templateId + "' to '" + message.to[0].email + "'");

                if (templateId === "Receipt") {

                    message = API.DEEPMERGE({
                        "subject": "Lunch is ordered!",
                        "text": [
                            "Thanks for ordering with Goodybag. You'll receive a follow-up email when your lunch arrives.",
                            "",
                            "Order ID: " + message.data.orderHashId.substring(0, 7),
                            "Order from: " + message.data.orderFrom,
                            "Delivery date: " + message.data.deliveryDate,
                            "Delivery time: " + message.data.deliveryTime,
                            "",
                            "Deliver to: " + message.data.deliverLocation,
                            "",
                            "Items:",
                            "",
                            message.data.items.map(function (item) {
                                return "  * " + item.title + " (" + item.quantity + " x " + item['format.price'] + " = " + item['format.amount'] + ")";
                            }).join("\n"),
                            "",
                            "Subtotal: " + message.data.summary["format.amount"],
                            "Tax (" + message.data.summary["format.tax"] + "): " + message.data.summary["format.taxAmount"],
                            "Goodybag Fee: " + message.data.summary["format.goodybagFee"],
                            "Total: " + message.data.summary["format.total"],
                            "",
                            "If you have any questions, please contact us at (512) 677-4224 or support@goodybag.com",
                            "This is an automated email and cannot receive replies!"
                        ].join("\n")
                    }, message || {});

                    return API["mandrill-send"]["$io.pinf.service.mandrill/send/0"].sendMessage(message);

                } else
                if (templateId === "Confirm_Subscription") {

                    var confirmLink = request._FireNodeContext.config.email.actionBaseUrl + "/cs/" + message.data.consumerGroupSubscription.token;
                    var lunchroomLink = request._FireNodeContext.config.email.actionBaseUrl + "/" + message.data.consumerGroup.alias;

                    message = API.DEEPMERGE({
                        "subject": "Confirm Your Email Address",
                        "text": [
                            "Hi!",
                            "",
                            "All that's left to do is click the link below to confirm your email address:",
                            "",
                            confirmLink,
                            "",
                            "Thanks a bunch for signing up & keep an eye out for the daily menus :)",
                            "--",
                            "The Goodybag Team",
                            "",
                            "Have questions or concerns?",
                            "Contact us by calling (512) 677-4224 or emailing support@goodybag.com",
                            "We are available M-F, 7am-6pm.",
                            "This is an automated email, replies to this email will not be received!"
                        ].join("\n")
                    }, message || {});

                    return API["mandrill-send"]["$io.pinf.service.mandrill/send/0"].sendMessage(message);

                } else
                if (templateId === "Menu") {

                    message = API.DEEPMERGE({
                        "subject": "Daily Lunch Menu - Order by " + message.data.menu.orderByTime,
                        "text": [
                            "Todays menu is from: " + message.data.menu.restaurantName,
                            "",
                            "Here is a taste:",
                            "",
                            message.data.items.map(function (item) {
                                return "  * " + item.title;
                            }).join("\n"),
                            "",
                            "Goto " + message.data.menu.lunchroomUrl + " to see the full menu.",
                            "",
                            "Sincerely,",
                            "-Goodybot",
                            "",
                            message.data.menu.lunchroomUrl + " https://www.goodybag.com",
                            "",
                            "Unsubscribe: " + message.data.subscription.unsubscribeUrl
                        ].join("\n")
                    }, message || {});

                    return API["mandrill-send"]["$io.pinf.service.mandrill/send/0"].sendMessage(message);

                } else
                if (templateId === "Order_Arrived") {

                    message = API.DEEPMERGE({
                        "subject": "Your Lunchroom Order has Arrived!",
                        "text": [
                            "Lunchroom Order #" + message.data.orderHashId.substring(0, 7) + " has arrived and is waiting for you " + message.data.event.pickupLocation,
                            "",
                            "Sincerely,",
                            "-Goodybot",
                            "",
                            "https://www.goodybag.com"                        
                        ].join("\n")
                    }, message || {});

                    return API["mandrill-send"]["$io.pinf.service.mandrill/send/0"].sendMessage(message);

                } else {
                    return API.Q.reject(new Error("Template with id '" + templateId + "' not declared!"));
                }
            });
        }
    }

    exports.sms = {
        send: function (templateId, message) {

            return API.Q.fcall(function () {

                API.ASSERT.equal(typeof message.to, "string");

    //            message.to = message.to.replace(/^\D/g, "");
    //            if (message.to.length === 10) {
    //                message.to = "1" + message.to;
    //            }
    //            message.to = "+" + message.to;

                console.log("Sending SMS '" + templateId + "' to '" + message.to + "'");

                if (templateId === "Order_Arrived") {

                    message = API.DEEPMERGE({
                        "to": "<REPLACE>",
                        "body": [
                            "Your Goodybag Lunchroom Order has arrived and is waiting for you ",
                            message.data.event.pickupLocation
                        ].join('')
                    }, message || {});

                    return API["twilio-send"]["$io.pinf.service.twilio/send/0"].sendMessage(message);

                } else {
                    return API.Q.reject(new Error("Template with id '" + templateId + "' not declared!"));
                }
            });
        }
    }

    exports.cater = {
        sendPayment: function (info, request) {

            return API.Q.fcall(function () {

                /*
                    @see https://github.com/goodybag/cater-api-server/pull/1889

                    POST '/api/payments' {
                      // Goodybag Restaurant ID whose account will be credited
                      restaurant_id:          Number
                      // Stripe Customer Object/Identifier
                    , customer:               String
                      // Stripe Credit Card Object/Identifier
                    , source:                 String
                      // Amount to be charged in cents before Tax and optional service_fee
                    , amount:                 Number
                      // Amount in cents on top of base `amount` - all funds go to Goodybag account
                    , service_fee:            Number
                      // Arbitrary object to attach to transaction
                    , metadata:               {...}
                      // What will show up on bank statement
                    , statement_descriptor:  String
                    }
                */

                API.ASSERT.equal(typeof info.restaurant_id, "number");
                API.ASSERT.equal(typeof info.customer, "string");
                API.ASSERT.equal(typeof info.source, "string");
                API.ASSERT.equal(typeof info.amount, "number");
                API.ASSERT.equal(typeof info.service_fee, "number");
                API.ASSERT.equal(typeof info.metadata, "string");
                API.ASSERT.equal(typeof info.statement_descriptor, "string");

                return API.Q.denodeify(function (callback) {

                    var url = "http://" + request._FireNodeContext.config.cater.host + "/api/payments";

                    console.log("Posting payment payload to url '", url, "':", JSON.stringify(info, null, 4));

                    return API.REQUEST({
                        uri: url,
                        method: 'POST',
                        json: info
                    }, function (err, res, body) {
                        if (err) return callback(err);
                        if (res.statusCode !== 200) {
                            var err = new Error("Got status '" + res.statusCode + "' while calling '" + url + "'");
                            err.code = res.statusCode;
                            return callback(err);
                        }
                        console.log("Cater payment POST response:". body);
                        return callback(null);
                    });
                })();
            });
        }
    }

});

