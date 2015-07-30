
exports.RootView = require("./GBL_DEV_Views/skin.index.jsx");

exports.views = {
	"Landing": {
		"component": require("./GBL_View_Landing/skin.index.jsx"),
		"config": {}
	},
	"Menu_Email": {
		"component": require("./GBL_View_Menu_Email/skin.index.jsx"),
		"config": {}
	},
	"Menu_Web": {
		"component": require("./GBL_View_Menu_Web/skin.index.jsx"),
		"config": {}
	},
	"Checkout": {
		"component": require("./GBL_View_Checkout/skin.index.jsx"),
		"config": {}
	},
	"Order_Placed": {
		"component": require("./GBL_View_Order_Placed/skin.index.jsx"),
		"config": {}
	},
	"Receipt": {
		"component": require("./GBL_View_Receipt/skin.index.jsx"),
		"config": {}
	},
	"Order_Arrived": {
		"component": require("./GBL_View_Order_Arrived/skin.index.jsx"),
		"config": {}
	}
};
