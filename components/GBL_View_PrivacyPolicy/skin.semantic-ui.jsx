
require("./component.jsx")['for'](module, {

	getHTML: function (Context) {


		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;


        return (
        	<div className="ui grid page-content">

	        	{Context.appContext.get('view').components.Header}

			    <div className="sixteen wide column">

<h1 className="page-title">Privacy Policy</h1>

<h3>WHAT DO WE USE YOUR INFORMATION FOR?</h3>
<p>Any of the information we collect from you may be used in one of the following ways:</p>
<ul>
	<li>To personalize your experience. (Your information helps us to better respond to your individual needs.) </li>
	<li>To improve our website. (We continually strive to improve our website offerings based on the information and feedback we receive from you.)</li>
	<li>To improve customer service. (Your information helps us to more effectively respond to your customer service requests and support needs.)</li>
	<li>To process transactions. (Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without your consent, other than for the express purpose of delivering the purchased product or service requested.)</li>
	<li>To administer a contest, promotion, survey, or other site feature.</li>
	<li>To send periodic emails. (The email address you provide for order processing may be used to send you information and updates pertaining to your order, in addition to occasional company news, updates, related product or service information, etc.)</li>
</ul>
<h3>HOW DO WE PROTECT YOUR INFORMATION?</h3>
<p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
<p>We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our payment gateway provider's database only to be accessed by those authorized with special access rights to such systems, who are required to keep the information confidential.</p>
<h3>DO WE USE COOKIES?</h3>
<p>Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you "Allow") that enables the site's or service provider's systems to recognize your browser and capture and remember certain information. We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools.</p>
<h3>DO WE DISCLOSE ANY INFORMATION TO OUTSIDE PARTIES?</h3>
<p>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect our or others' rights, property, or safety. However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.</p>
<h3>THIRD-PARTY LINKS</h3>
<p>Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.</p>
<h3>CALIFORNIA ONLINE PRIVACY PROTECTION ACT COMPLIANCE</h3>
<p>Because we value your privacy, we have taken the necessary precautions to be in compliance with the California Online Privacy Protection Act. We therefore will not distribute your personal information to outside parties without your consent. As part of the California Online Privacy Protection Act, all users of our site may make any changes to their information at anytime by logging into their account and going to the <a href="/users/me">'Profile View/Edit'</a> page.</p>
<h3>CHILDREN’S ONLINE PRIVACY PROTECTION ACT</h3>
<p>We are in compliance with the requirements of COPPA (Children’s Online Privacy Protection Act): We do not collect any information from anyone under 13 years of age. Our website, products, and services are all directed to individuals who are at least 13 years old or older.</p>
<h3>ONLINE PRIVACY POLICY ONLY</h3>
<p>This Online Privacy Policy applies only to information collected through our website and not to information collected offline.</p>
<h3>TERMS AND CONDITIONS</h3>
<p>Please also visit our <a href="/legal">Terms and Conditions section</a> establishing the use, disclaimers, and limitations of liability governing the use of our website at www.goodybag.com and biz.goodybag.com.</p>
<h3>YOUR CONSENT</h3>
<p>By using our site, you consent to our Online Privacy Policy.</p>
<h3>CHANGES TO OUR PRIVACY POLICY</h3>
<p>If we decide to change our privacy policy, we will post any changes to this page, and/or update the Privacy Policy modification date below.</p>
<p>This policy was last modified on 6/18/2013.</p>
<h3>CONTACT US</h3>
<p>If you have any questions regarding this Privacy Policy you may contact us using the following:<br/>
<a href="http://www.goodybag.com">www.goodybag.com</a><br/>
<a href="mailto:support@goodybag.com">support@goodybag.com</a></p>

				</div>

	        	{Context.appContext.get('view').components.Footer}

			</div>
        );
	}
});
