module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="page page-login">

      <header className="navbar collapsed" data-component-id="header">
        <div className="container">
          <a href="/">
            <img src="https://d3bqck8kwfkhx5.cloudfront.net/img/logo.png" alt="Goodybag.com" className="navbar-logo"/>
          </a>
          <ul className="nav">
            <li><a href="/pages/register" data-component-elm="signupLink">Sign Up</a></li>
            <li><a href="/pages/login" data-component-elm="loginLink">Login</a></li>
          </ul>
        </div>
      </header>
      
      <div className="page-section-standalone" data-component-id="login">
  <div className="medium-container">
    <form id="login-form" className="login-form form-vertical" action="/login" method="POST">
      <h2 className="page-title">Login</h2>
      <div className="errors">
      </div>
      <div className="form-group">
        <label for="login-email">Email</label>
        <input type="email" name="email" id="login-email"/>
      </div>
      
      <div className="form-group">
        <label for="login-password">Password</label>
        <input type="password" name="password" id="login-password"/>
      </div>
      
      <div className="form-group form-group-submit">
        <button className="btn btn-primary btn-submit btn-large">Login</button>
      </div>
      <p className="login-footnote">Don't have an account? <a href="/register">Sign up</a></p>
    </form>
    <div className="supporting-graphic">
      <img src="https://d3bqck8kwfkhx5.cloudfront.net/img/login-takeout.png"/>
    </div>
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