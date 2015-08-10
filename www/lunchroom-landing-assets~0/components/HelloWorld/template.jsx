'use strict';

exports.init = function (React) {

	React.render(React.createElement(
		'h1',
		null,
		'Yes!!1'
	), document.getElementById('HelloWorld'));

	return React.createElement(
		'h1',
		null,
		'Yes!!2'
	);
};