
exports.RootView = require("./GBL_DEV_Views/skin.app.jsx");

exports.views = {
	"Menu_Email": {
		"component": require("./GBL_View_Menu_Email/skin.app.jsx"),
		"config": {}
	},
	"Menu_Web": {
		"component": require("./GBL_View_Menu_Web/skin.app.jsx"),
		"config": {}
	},
	"Checkout": {
		"component": require("./GBL_View_Checkout/skin.app.jsx"),
		"config": {}
	},
	"Order_Placed": {
		"component": require("./GBL_View_Order_Placed/skin.app.jsx"),
		"config": {}
	},
	"Receipt": {
		"component": require("./GBL_View_Receipt/skin.app.jsx"),
		"config": {}
	},
	"Order_Arrived": {
		"component": require("./GBL_View_Order_Arrived/skin.app.jsx"),
		"config": {}
	}
};
