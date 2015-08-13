
var WEB_COMPONENTS = {
	"Header": require("./GBL_Segment_Header/skin.app.jsx"),
	"Menu": require("./GBL_Segment_Menu/skin.app.jsx"),
	"Footer": require("./GBL_Segment_Footer/skin.app.jsx")
};

exports.RootView = require("./GBL_DEV_Views/skin.app.jsx");

exports.views = {
	"Menu_Email": {
		"component": require("./GBL_View_Menu_Email/skin.app.jsx"),
		"config": {}
	},
	"Menu_Web": {
		"component": require("./GBL_View_Menu_Web/skin.app.jsx"),
		"config": {},
		"components": WEB_COMPONENTS
	},
	"Checkout": {
		"component": require("./GBL_View_Checkout/skin.app.jsx"),
		"config": {},
		"components": WEB_COMPONENTS
	},
	"Order_Placed": {
		"component": require("./GBL_View_Order_Placed/skin.app.jsx"),
		"config": {},
		"components": WEB_COMPONENTS
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

