
require("./component.jsx")['for'](module, {
	getHTML: function (Context) {

		var tpl = require("../../www/lunchroom-landing~0/components/AppMenu/header.cjs.jsx")(Context);

		return tpl;
	}
});
