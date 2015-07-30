
require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {

    exports.email = {
        send: function (templateId, message) {

            if (templateId === "Order_Placed") {

                API.ASSERT.equal(Array.isArray(message.to), true);

                message = API.DEEPMERGE({
                    "text": "Order placed!",
                    "subject": "Order Placed!"
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
