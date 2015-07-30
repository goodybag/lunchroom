/** @jsx React.DOM */
'use strict'

const React = require('react');


require("./component.jsx").for(module, {
	getViewTabHTML: function (Context) {
		return (
			<li className="menu" onClick={Context.onClick}>{Context.label}</li>
		);
	},
	getHTML: function (Context) {
        return (
        	<div>
				<ul className="GBL_DEV_Views__menu">
					{Object.keys(Context.views).map(function(viewAlias) {
			        	return (
			        		<Context.ViewLink
				        		key={viewAlias}
				        		data={Context.views[viewAlias]}
				        		appContext={Context.appContext}
				        	/>
				        );
			        })}
			    </ul>

			    <div className="container">
					<Context.ViewComponent
				  		appContext={Context.appContext}
				  	/>
				</div>

				<br/>
				<br/>

			    <div className="container">
				  {Context.ViewMockup}
				</div>


			    <div className="container">
			      <div className="title">
			        <h1>Kitchen Sink<small>examples and tid bits</small></h1>
			      </div>
			      <h1>h1</h1>
			      <h2>h2</h2>
			      <h3>h3</h3>
			      <h4>h4</h4>
			      <button className="btn">Click</button>
			      <button className="btn btn-checkout">Checkout</button>
			      <p>
			        Here is a paragraph with links <a href="#">here</a> and
			        <a href="#">here</a>. Wayfarers 8-bit High Life normcore street art.
			      </p>
			      <p>
			        Truffaut squid mixtape, wayfarers irony Banksy next level. Locavore
			        mumblecore sriracha, fap hashtag cornhole meggings listicle Etsy.
			      </p>
			      <ul>
			        <li><a href="#">Learn More</a> - Get the scoop on daily lunch specials around your office </li>
			        <li><a href="#">Get Started</a> - Click here to sign up</li>
			        <li><a href="#">Help</a> - Contact us for more assistance</li>
			      </ul>
			      <div className="title">
			        <h1>Inputs</h1>
			      </div>
			      <p>Inline inputs</p>
			      <input type="text" placeholder="Text input"/>
			      <input type="text" placeholder="Text input"/>
			      <input type="text" placeholder="Text input"/>
			      <p>Block level inputs</p>
			      <input type="text" placeholder="Charlie Sheen" className="input-block"/>
			    </div>
		    </div>
        );
	}
});
