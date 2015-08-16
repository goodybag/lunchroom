module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="page page-order-submitted">

      <header className="navbar collapsed" data-component-id="header">
        <div className="container">
          <a href="/">
            <img src="https://d3bqck8kwfkhx5.cloudfront.net/img/logo.png" alt="Goodybag.com" className="navbar-logo"/>
          </a>
        </div>
      </header>
      
      <div className="container order-success" data-component-id="order-success">
  <img src="/lunchroom-landing~0/resources/assets/img~success-d84e5c8.png" alt="" className="success-img"/>

  <p className="order-success-note">Your order is placed and will be <strong>delivered today between <span data-component-prop="pickupTime">12:00-12:30pm</span></strong>.</p>

  <p className="order-success-note">Your meal will be delivered <strong data-component-prop="deliveryLocation">in the Bazaarvoice Lobby</strong>.</p>

  <p className="order-success-note">We'll send you an email and text you when it arrives.</p>

  <div className="menu-share">
    <h4 className="menu-share-title">Share this link</h4>
    <p className="menu-share-followup">with coworkers to let them view the menu and place their own order!</p>
    <input className="menu-share-input" type="text" value="http://lunchroom.goodybag.com/bazaarvoice" data-component-elm="shareUrl"/>
  </div>
</div>

      
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
      
      <footer className="footer" data-component-id="footer">
        <ul className="nav footer-nav">
          <li><a href="#" data-toggle="modal" data-target="#contact-us-modal">Contact Us</a></li>
          <li><a href="https://www.goodybag.com/legal">Terms of service</a></li>
          <li><a href="https://www.goodybag.com/privacy">Privacy policy</a></li>
        </ul>
      </footer>
    
    </div>
  );
}