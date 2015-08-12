
require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {

    exports.email = {
        send: function (templateId, message, request) {

            if (templateId === "Order_Placed") {

                API.ASSERT.equal(Array.isArray(message.to), true);

                message = API.DEEPMERGE({
                    "text": "Order placed!",
                    "subject": "Order Placed!"
                }, message || {});

                return API["mandrill-send"]["$io.pinf.service.mandrill/send/0"].sendMessage(message);

            } else
            if (templateId === "Confirm_Subscription") {

                API.ASSERT.equal(Array.isArray(message.to), true);

                var confirmLink = request._FireNodeContext.config.email.actionBaseUrl + "/cs/" + message.data.consumerGroupSubscription.token;

                message = API.DEEPMERGE({
                    "subject": "Please confirm your subscription",
                    "text": [
                        "You are subscribing to daily menus for: " + message.data.consumerGroup.title,
                         "Please click on this link to confirm: " + confirmLink
                    ].join("\n")
                }, message || {});

                return API["mandrill-send"]["$io.pinf.service.mandrill/send/0"].sendMessage(message);

            } else
            if (templateId === "Menu") {

                API.ASSERT.equal(Array.isArray(message.to), true);

                message = API.DEEPMERGE({
                    "subject": "Menu for today",
                    "text": [
                        "Hi there",
                        "",
                        "We have some goodies for you today!",
                        "",
                        "See the menu: " + message.data.menu.url,
                        "",
                        "Here is a taste:",
                        "",
                        message.data.items.map(function (item) {
                            return "  * " + item.title;
                        }).join("\n"),
                        "",
                        "See you soon!"
                    ].join("\n")
                }, message || {});

                return API["mandrill-send"]["$io.pinf.service.mandrill/send/0"].sendMessage(message);

            } else {
                return API.Q.reject(new Error("Template with id '" + templateId + "' not declared!"));
            }
        }
    }

    exports.sms = {
        send: function (templateId, message) {

            if (templateId === "Order_Placed") {

                API.ASSERT.equal(typeof message.to, "string");

                message = API.DEEPMERGE({
                    "to": "<REPLACE>",
                    "body": "Hello your lunch from Goodybag is here!"
                }, message || {});

                return API["twilio-send"]["$io.pinf.service.twilio/send/0"].sendMessage(message);

            } else {
                return API.Q.reject(new Error("Template with id '" + templateId + "' not declared!"));
            }
        }
    }

});
