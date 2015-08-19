
const DEV = false;

var SERVICES = require("./services");

SERVICES['for']({}).then(function (_SERVICES) {
	SERVICES = _SERVICES;
});

const DB = require("./db/bookshelf.knex.postgresql");
const JOBS = require("./jobs");


require('org.pinf.genesis.lib').forModule(require, module, function (API, exports) {

    exports.renderEmail = function (templateAlias, data) {

    	function loadTemplate () {
	    	return API.Q.fcall(function () {
		    	var templatePath = null;
		    	if (templateAlias === "menu") {
//		    		templatePath = API.PATH.join(__dirname, "../www/lunchroom-landing~0/components/EmailMenu/email.dot.cjs");
		    		templatePath = API.PATH.join(__dirname, "emails/menu.dot");
		    	}
		    	if (!templatePath) {
		    		throw new Error("Template '" + template + "' not defined!");
		    	}
//		    	return require(templatePath);
				return API.QFS.read(templatePath).then(function (dot) {
					return API.DOT.template(dot);
				});
	    	});
    	}

    	return loadTemplate().then(function (template) {

    		console.log("DATA", data);

    		function markupData (data) {

    			return API.Q.fcall(function () {

			    	if (templateAlias === "menu") {

			    		if (data && data.event_id) {

			    			function loadMenuDataForEvents () {
			    				if (data.menus) return API.Q.resolve(data.menus);
								return JOBS.loadMenuDataForEvents(DB.getKnex(), API.appContext, [
									data.event_id
								]);
			    			}

							return loadMenuDataForEvents().then(function (menus) {

								var event = menus.events[data.event_id].event;
								// Assume only one vendor.
								var vendor = menus.vendors[Object.keys(menus.vendors).shift()];

								var items = menus.events[data.event_id].items;

//console.log("RENDER TEMPLATE items", JSON.stringify(items, null, 4));

console.log("event", event);

								data = {
									restaurantName: vendor.get('title'),
									lunchroomUrl: event.get("menuUrl"),
									orderByTime: event.get("format.orderByTime"),
									itemGrid: [
										[]
									]
								};
console.log("data", data);
								// TODO: The skin exporter should determine this automatically.
								var maxColumns = 2;
								Object.keys(items).forEach(function (itemId) {
									var item = items[itemId];
									if (data.itemGrid[data.itemGrid.length-1].length === maxColumns) {
										data.itemGrid.push([]);
									}
									data.itemGrid[data.itemGrid.length-1].push({
										title: item.get("title"),
										price: item.get("format.price"),
										description: item.get("description"),
										photo_url: item.get("photo_url") + "/convert?w=277&h=135&fit=crop",
										_last: ((data.itemGrid[data.itemGrid.length-1].length+1) === maxColumns)
									});
								});

								return data;
							});

			    		} else
			    		// Test data
			    		if (!data) {
				    		data = {
								restaurantName: "Trudy's",
								lunchroomUrl: "http://lunchroom.goodybag.com/bazaarvoice",
								orderByTime: "10 AM",
								itemGrid: [
									[
										{
											title: "Spiced Chicken dd",
											price: "$11.00",
											photo_url: "https://www.filepicker.io/api/file/qNsuHk2lQdiyCFvk6ZY5/convert?w=277&h=135&fit=crop"
										},
										{
											_last: true,
											title: "Spiced Beef",
											price: "$13.00",
											photo_url: "https://www.filepicker.io/api/file/yA3EYAFS7uOtqpcCQIy6/convert?w=277&h=135&fit=crop"
										}
									],
									[
										{
											title: "Spiced Chicken 2",
											price: "$11.00 5",
											photo_url: "https://www.filepicker.io/api/file/qNsuHk2lQdiyCFvk6ZY5/convert?w=277&h=135&fit=crop"
										},
										{
											_last: true,
											title: "Spiced Beef 3",
											price: "$13.00 4",
											photo_url: "https://www.filepicker.io/api/file/yA3EYAFS7uOtqpcCQIy6/convert?w=277&h=135&fit=crop"
										}
									]
								]
							};
						}
			    	}

			    	return data;
    			});
    		}

    		return markupData(data).then(function (data) {

//console.log("RENDER TEMPLATE DATA", JSON.stringify(data, null, 4));

	    		return template(data);
    		});
    	});
    }

});

/*
			try {

				var template = API.DOT.template(API.FS.readFileSync(API.PATH.join(__dirname, "server/emails/menu.dot"), "utf8"));

console.log("template", template);

				var html = template({
					restaurantName: "Trudy's",
					lunchroomUrl: "http://lunchroom.goodybag.com/bazaarvoice",
					orderByTime: "10 AM",
					itemGrid: [
						[
							{
								title: "Spiced Chicken",
								price: "$11.00",
								photo_url: "https://www.filepicker.io/api/file/qNsuHk2lQdiyCFvk6ZY5/convert?w=277&h=135&fit=crop"
							},
							{
								_last: true,
								title: "Spiced Beef",
								price: "$13.00",
								photo_url: "https://www.filepicker.io/api/file/yA3EYAFS7uOtqpcCQIy6/convert?w=277&h=135&fit=crop"
							}
						],
						[
							{
								title: "Spiced Chicken 2",
								price: "$11.00 5",
								photo_url: "https://www.filepicker.io/api/file/qNsuHk2lQdiyCFvk6ZY5/convert?w=277&h=135&fit=crop"
							},
							{
								_last: true,
								title: "Spiced Beef 3",
								price: "$13.00 4",
								photo_url: "https://www.filepicker.io/api/file/yA3EYAFS7uOtqpcCQIy6/convert?w=277&h=135&fit=crop"
							}
						]
					]
				});

console.log("html", html);

				res.writeHead(200, {
					"Content-Type": "text/html"
				});
				return res.end(html);

			} catch (err) {
				return next(err);
			}
*/
