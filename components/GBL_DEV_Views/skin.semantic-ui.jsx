/** @jsx React.DOM */
'use strict'


require("./component.jsx")['for'](module, {
	getViewTabHTML: function (Context) {
		return (
		  <div className="item" onClick={Context.onClick}>
		    <div className="content">
		      <div className="header">{Context.label}</div>
		    </div>
		  </div>			
		);
	},
	getHTML: function (Context) {

		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;

		if (
			!Context.isTopFrame ||
			Context.appContext.get('context').type
		) {
			return (
				<Context.ViewComponent
					appContext={Context.appContext}
				/>
			);
/*			
	        return (
				<div className="ui grid">
				    <div className="sixteen wide column">
						<Context.ViewComponent
							appContext={Context.appContext}
						/>
				    </div>
				</div>
	        );
*/	        
		}

		var mockup = "";
		if (!Context.group) {
			mockup = (
				<div className="ui grid">
				    <div className="sixteen wide column">
				    	<br/>
				    	<br/>
				    	<br/>
				    	<br/>
				    	<br/>
					    <div className="ui inverted center aligned segment">
					    	<h3 className="ui header">HTML View above; Mockup Image Below</h3>
						</div>
					</div>
				    <div className="sixteen wide column">
					    <div className="ui segment">
						  {Context.ViewMockup}
						</div>
				    </div>
			    </div>
			);
		}

        return (
			<div className="ui grid">
			    <div className="three wide column">
					<div className="ui grid">
					    <div className="sixteen wide column">

						    <h2 className="ui header">Views</h2>

							<div className="ui selection list">
								{Object.keys(Context.views).map(function(alias) {
									if (Context.views[alias].group) return;
						        	return (
						        		<Context.ViewLink
							        		key={alias}
							        		data={Context.views[alias]}
				        					appContext={Context.appContext}
							        	/>
							        );
						        })}
							</div>

					    </div>
						<div className="sixteen wide column">

						    <h2 className="ui header">Admins</h2>

							<div className="ui selection list">
								{Object.keys(Context.views).map(function(alias) {
									if (Context.views[alias].group !== "admin") return;
						        	return (
						        		<Context.ViewLink
							        		key={alias}
							        		data={Context.views[alias]}
				        					appContext={Context.appContext}
							        	/>
							        );
						        })}
							</div>

					    </div>
					    <div className="sixteen wide column">

						    <h2 className="ui header">Models</h2>

							<div className="ui selection list">
								{Object.keys(Context.views).map(function(alias) {
									if (Context.views[alias].group !== "model") return;
						        	return (
						        		<Context.ViewLink
							        		key={alias}
							        		data={Context.views[alias]}
				        					appContext={Context.appContext}
							        	/>
							        );
						        })}
							</div>

					    </div>
					</div>
			    </div>
			    <div className="thirteen wide column">
					<div className="ui grid">
					    <div className="sixteen wide column">
							<Context.ViewComponent
								appContext={Context.appContext}
							/>
					    </div>
					</div>
				    {mockup}
			    </div>
			</div>
        );
	}
});
