
var WEB_COMPONENTS = {
	"Header": require("./GBL_Segment_Header/skin.semantic-ui.jsx"),
	"Menu": require("./GBL_Segment_Menu/skin.semantic-ui.jsx"),
	"Footer": require("./GBL_Segment_Footer/skin.semantic-ui.jsx")
};

var EMAIL_COMPONENTS = {
	CORRESPONDENCE: {
		"Header": require("./skin.email.correspondence/Header"),
		"Footer": require("./skin.email.correspondence/Footer")
	},
	LIST: {
		"Header": require("./skin.email.list/Header"),
		"Footer": require("./skin.email.list/Footer")
	}
};


exports.RootView = require("./GBL_DEV_Views/skin.semantic-ui.jsx");

exports.views = {
	"Landing": {
		"component": require("./GBL_View_Landing/skin.semantic-ui.jsx"),
		"config": {}
	},
	"Menu_Email": {
		"component": require("./GBL_View_Menu_Email/skin.semantic-ui.jsx"),
		"config": {},
		"components": EMAIL_COMPONENTS.LIST
	},
	"Menu_Web": {
		"component": require("./GBL_View_Menu_Web/skin.semantic-ui.jsx"),
		"config": {},
		"components": WEB_COMPONENTS
	},
	"Checkout": {
		"component": require("./GBL_View_Checkout/skin.semantic-ui.jsx"),
		"config": {},
		"components": WEB_COMPONENTS
	},
	"Order_Placed": {
		"component": require("./GBL_View_Order_Placed/skin.semantic-ui.jsx"),
		"config": {},
		"components": WEB_COMPONENTS
	},
	"Receipt": {
		"component": require("./GBL_View_Receipt/skin.semantic-ui.jsx"),
		"config": {},
		"components": EMAIL_COMPONENTS.CORRESPONDENCE
	},
	"Order_Arrived": {
		"component": require("./GBL_View_Order_Arrived/skin.semantic-ui.jsx"),
		"config": {},
		"components": WEB_COMPONENTS.CORRESPONDENCE
	},
	"ContactUs": {
		"component": require("./GBL_View_ContactUs/skin.semantic-ui.jsx"),
		"config": {},
		"components": WEB_COMPONENTS
	},
	"PrivacyPolicy": {
		"component": require("./GBL_View_PrivacyPolicy/skin.semantic-ui.jsx"),
		"config": {},
		"components": WEB_COMPONENTS
	},
	"TermsOfService": {
		"component": require("./GBL_View_TermsOfService/skin.semantic-ui.jsx"),
		"config": {},
		"components": WEB_COMPONENTS
	},
	"Admin_Events": {
		"group": "admin",
		"container": "iframe",
		"component": require("./GBL_Admin_Events/index"),
		"config": {}
	},
	"Admin_Orders": {
		"group": "admin",
		"container": "iframe",
		"component": require("./GBL_Admin_Orders/index"),
		"config": {}
	},
	"Admin_Restaurant": {
		"group": "admin",
		"container": "iframe",
		"component": require("./GBL_Admin_Restaurant/index"),
		"config": {}
	},
	"Admin_Company": {
		"group": "admin",
		"container": "iframe",
		"component": require("./GBL_Admin_Company/index"),
		"config": {}
	},	
	"Model_Days": {
		"group": "model",
		"component": require("./GBL_Model_Days/index"),
		"config": {}
	},
	"Model_Events": {
		"group": "model",
		"component": require("./GBL_Model_Events/index"),
		"config": {}
	},
	"Model_Vendors": {
		"group": "model",
		"component": require("./GBL_Model_Vendors/index"),
		"config": {}
	},
	"Model_Items": {
		"group": "model",
		"component": require("./GBL_Model_Items/index"),
		"config": {}
	},
	"Model_Menus": {
		"group": "model",
		"component": require("./GBL_Model_Menus/index"),
		"config": {}
	},
	"Model_ConsumerGroups": {
		"group": "model",
		"component": require("./GBL_Model_ConsumerGroups/index"),
		"config": {}
	},
	"Model_Consumers": {
		"group": "model",
		"component": require("./GBL_Model_Consumers/index"),
		"config": {}
	},
	"Model_ConsumerGroupSubscriptions": {
		"group": "model",
		"component": require("./GBL_Model_ConsumerGroupSubscriptions/index"),
		"config": {}
	},
	"Model_Cart": {
		"group": "model",
		"component": require("./GBL_Model_Cart/index"),
		"config": {}
	},
	"Model_Orders": {
		"group": "model",
		"component": require("./GBL_Model_Orders/index"),
		"config": {}
	},
	"Model_OrderStatus": {
		"group": "model",
		"component": require("./GBL_Model_OrderStatus/index"),
		"config": {}
	}
};
