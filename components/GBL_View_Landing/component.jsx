
var console = require("../../app/lib/console");

var COMPONENT = require("../GBL_ReactComponent");

exports['for'] = function (module, Context) {

	module.exports = COMPONENT.create(Context, {

		appContextView: "Landing",

	    onMount: function () {
			this.props.appContext.get('stores').consumerGroups.on("sync", this._trigger_forceUpdate);
	    },

	    onUnmount: function () {
			this.props.appContext.get('stores').consumerGroups.off("sync", this._trigger_forceUpdate);
	    },

	    render: function () {
	    	var self = this;

	        var consumerGroups = self.props.appContext.get('stores').consumerGroups;
			var consumerGroup = self.modelRecordsWithStore(consumerGroups, consumerGroups.where())[0];

	        var consumerGroupSubscriptions = self.props.appContext.get('stores').consumerGroupSubscriptions;
			var consumerGroupSubscription = self.modelRecordsWithStore(consumerGroupSubscriptions, consumerGroupSubscriptions.where())[0];

	        return {

	        	config: {
	        		doNothingOnEmptyEmailSubmit: true
	        	},

	        	consumerGroup: consumerGroup,
	        	consumerGroupSubscription: consumerGroupSubscription,

	        	subscribeWithEmail: function (email) {

					self.props.appContext.get('stores').consumerGroupSubscriptions.subscribeWithEmail(
						consumerGroups.where()[0].get("id"), email
					);
				}
	        };
	    }
	});

}
