
require("./component.jsx")['for'](module, {

	getHTML: function (Context) {


		// TODO: Remove this once we can inject 'React' automatically at build time.
		var React = Context.REACT;


        return (
        	<div className="ui grid page-content">

	        	{Context.appContext.get('view').components.Header}

			    <div className="sixteen wide column">

<h1 className="page-title">Terms of Service</h1>

<h2>WEBSITE TERMS AND CONDITIONS OF USE</h2>
<h3>1.&nbsp;&nbsp;TERMS</h3>
<p>By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
<h3>2.&nbsp;&nbsp;USE LICENSE</h3>
<ol>
<li>Permission is granted to temporarily download one copy of the materials (information or software) on Goodybag, Inc.’s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
  <ol>
    <li>Modify or copy the materials;</li>
    <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
    <li>Attempt to decompile or reverse engineer any software contained on Goodybag, Inc.’s website;</li>
    <li>Remove any copyright or other proprietary notations from the materials; or</li>
    <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
  </ol>
</li>
<li>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Goodybag, Inc. at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</li>
</ol>
<h3>3.&nbsp;&nbsp;DISCLAIMER</h3>
<p>The materials on Goodybag, Inc.’s website are provided "as is". Goodybag, Inc. makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, Goodybag, Inc. does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet website or otherwise relating to such materials or on any sites linked to this site.</p>
<h3>4.&nbsp;&nbsp;LIMITATIONS</h3>
<p>In no event shall Goodybag, Inc. or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on Goodybag, Inc.’s Internet site, even if Goodybag, Inc. or a Goodybag, Inc. authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
<h3>5.&nbsp;&nbsp;REVISIONS AND ERRATA</h3>
<p>The materials appearing on Goodybag, Inc.’s website could include technical, typographical, or photographic errors. Goodybag, Inc. does not warrant that any of the materials on its website are accurate, complete, or current. Goodybag, Inc. may make changes to the materials contained on its website at any time without notice. Goodybag, Inc. does not, however, make any commitment to update the materials.</p>
<h3>6.&nbsp;&nbsp;LINKS</h3>
<p>Goodybag, Inc. has not reviewed all of the sites linked to its Internet website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Goodybag, Inc. of the site. Use of any such linked website is at the user's own risk.</p>
<h3>7.&nbsp;&nbsp;SITE TERMS OF USE MODIFICATION</h3>
<p>Goodybag, Inc. may revise these terms of use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.</p>
<h3>8.&nbsp;&nbsp;GOVERNING LAW</h3>
<p>Any claim relating to Goodybag, Inc.’s website shall be governed by the laws of the State of Delaware without regard to its conflict of law provisions.</p>
<p>Any claim relating to Goodybag, Inc.'s website shall be governed by the laws of the State of Delaware without regard to its conflict of law provisions.</p>
<p>General Terms and Conditions applicable to Use of a Web Site</p>
<h3>PRIVACY POLICY</h3>
<p>Your privacy is very important to us. Accordingly, we have developed this Policy in order for you to understand how we collect, use, communicate and disclose and make use of personal information. The following outlines our privacy policy.</p>
<ul>
<li>Before or at the time of collecting personal information, we will identify the purposes for which information is being collected.</li>
<li>We will collect and use of personal information solely with the objective of fulfilling those purposes specified by us and for other compatible purposes, unless we obtain the consent of the individual concerned or as required by law.</li>
<li>We will only retain personal information as long as necessary for the fulfillment of those purposes.</li>
<li>We will collect personal information by lawful and fair means and, where appropriate, with the knowledge or consent of the individual concerned.</li>
<li>Personal data should be relevant to the purposes for which it is to be used, and, to the extent necessary for those purposes, should be accurate, complete, and up-to-date.</li>
<li>We will protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification.</li>
<li>We will make readily available to customers information about our policies and practices relating to the management of personal information.</li>
</ul>

<p>Visit the <a data-link="#PrivacyPolicy">Privacy Policy page</a> to view to full Privacy Policy.</p>

				</div>

	        	{Context.appContext.get('view').components.Footer}

			</div>
        );
	}
});
