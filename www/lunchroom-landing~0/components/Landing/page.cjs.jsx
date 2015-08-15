module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <body className="page">

    
<header className="navbar navbar-transparent navbar-transparent-dark">
  <div className="container">
    <a href="/">
      <img src="/lunchroom-landing~0/resources/assets/img~logo_goodybag_white-14f9e4c.png" alt="Goodybag.com" className="navbar-logo"/>
    </a>

    <ul className="nav navbar-nav navbar-right">
      <li>
        <a href="#" data-toggle="modal" data-target="#contact-us-modal">Contact Us</a>
      </li>
    </ul>
  </div>
</header>

<section className="page-section hero-unit primary-section" id="email-signup-cta">
  <div className="container">
    <h1 className="section-header">Get your lunch delivered every day.</h1>
    <p>Your choice of meal brought to you at work. Starts August 17th, 2015.</p>
    <form action="#" className="cta-form form" data-component-id="subscribe">
      <div className="form-group">
        <div className="email-wrapper">
          <input type="email" name="email"/>
        </div>
        <div className="submit-wrapper">
          <button className="btn btn-primary">Get notified</button>
        </div>
      </div>
      <p className="form-explanation">Enter your email to receive daily menus when we launch!</p>
    </form>
    <h2 className="outro-header">Share the love! Send this page to your coworkers.</h2>
  </div>
</section>

<section className="page-section" id="how-it-works">
  <div className="container">
    <h1 className="section-title">How it'll work</h1>
    <div className="marketing-points">
      <div className="point">
        <img src="/lunchroom-landing~0/resources/assets/img~icons_step1-7706235.png" alt="Restaurant rotation"/>
        <p>One restaurant featured each day.</p>
      </div>
      <div className="point">
        <img src="/lunchroom-landing~0/resources/assets/img~icons_step2-c733bfa.png" alt="Order deadline"/>
        <p>Order by 10 AM.</p>
      </div>
      <div className="point">
        <img src="/lunchroom-landing~0/resources/assets/img~icons_step3-e7ec2cb.png" alt="Delivery notification"/>
        <p>We'll deliver your food at 12 and text you when it arrives!</p>
      </div>
    </div>
  </div>
</section>

<section className="page-section section-dark" id="new-menu-everyday">
  <div className="container">
    <h1 className="section-title">A new menu every day</h1>
    <img src="/lunchroom-landing~0/resources/assets/img~browsers_3mockups-de6a12d.png" className="section-screenshot" alt="Menu screenshot"/>
  </div>
</section>

<section className="page-section" id="restaurants">
  <div className="container">
    <h1 className="section-title">A few restaurants you can expect</h1>
    <ul className="logo-list">
      <li><img src="/lunchroom-landing~0/resources/assets/img~logo_trudys-d2b99e0.png" alt="Trudy's"/></li>
      <li><img src="/lunchroom-landing~0/resources/assets/img~logo_micklethwait-b31ccde.png" alt="Micklethwait"/></li>
      <li><img src="/lunchroom-landing~0/resources/assets/img~logo_torchys-9bde0e3.png" alt="Torchy's Tacos"/></li>
      <li><img src="/lunchroom-landing~0/resources/assets/img~logo_zoes-9a626ef.png" alt="Zoe's Kitchen"/></li>
      <li><img src="/lunchroom-landing~0/resources/assets/img~logo_madammams-addef91.png" alt="Madam Mam's"/></li>
    </ul>
  </div>
</section>

<div className="modal fade" id="contact-us-modal">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title">Contact Us</h3>
      </div>
      <form action="#" className="form form-vertical contact-us-form">
        <div className="modal-body">
          <div className="form-group">
            <label for="name-input">Name</label>
            <input type="text" name="name"/>
          </div>
          <div className="form-group">
            <label for="name-input">Email</label>
            <input type="email" name="email"/>
          </div>
          <div className="form-group">
            <label for="message-input">Message</label>
            <textarea rows="6" type="text" name="message"></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  </div>
</div>

<footer className="footer">
  <ul className="nav footer-nav">
    <li><a href="#" data-toggle="modal" data-target="#contact-us-modal">Contact Us</a></li>
    <li><a href="https://www.goodybag.com/legal">Terms of service</a></li>
    <li><a href="https://www.goodybag.com/privacy">Privacy policy</a></li>
  </ul>
</footer>

    
    
    
  

    </body>
  );
}