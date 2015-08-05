
const COMPONENT = require("../GBL_ReactComponent");

exports.for = function (module, Context) {

	module.exports = COMPONENT.create(Context, {

		appContextView: "Landing",

	    onMount: function () {
			this.props.appContext.stores.consumerGroups.on("sync", this._trigger_forceUpdate);
	    },

	    onUnmount: function () {
			this.props.appContext.stores.consumerGroups.off("sync", this._trigger_forceUpdate);
	    },

	    render: function () {
	    	var self = this;

	        var consumerGroups = self.props.appContext.stores.consumerGroups;
			var consumerGroup = self.modelRecordsWithStore(consumerGroups, consumerGroups.where())[0];

	        var consumerGroupSubscriptions = self.props.appContext.stores.consumerGroupSubscriptions;
			var consumerGroupSubscription = self.modelRecordsWithStore(consumerGroupSubscriptions, consumerGroupSubscriptions.where())[0];

	        return {

	        	config: {
	        		doNothingOnEmptyEmailSubmit: true
	        	},

	        	consumerGroup: consumerGroup,
	        	consumerGroupSubscription: consumerGroupSubscription,

	        	subscribeWithEmail: function (email) {

					self.props.appContext.stores.consumerGroupSubscriptions.subscribeWithEmail(consumerGroup.get("id"), email);
				}
	        };
	    }
	});

}
