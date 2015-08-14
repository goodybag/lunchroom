module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="page-section-standalone">

  <div className="medium-container">
    <form id="register-form" className="register-form form-vertical" action="/join?" method="POST">
      <h2 className="page-title">Get your free account</h2>
      <p>Sign up to get delicious food delivered to your office</p>
      <div className="errors">
      </div>
      
      <div className="form-group">
        <label for="register-email">Email</label>
        <input type="email" name="email" id="register-email"/>
      </div>
      
      <div className="form-group">
        <label for="register-phone">Phone Number (optional)</label>
        <input type="tel" name="phone" id="register-phone"/>
      </div>
      
      <div className="form-group">
        <label for="login-region">Delivery Location:</label>
        <select name="region_id" id="login-region">
          <option value="1" selected="">BazaarVoice</option>
          <option value="3">Some other lunchroom</option>
          <option value="4">Another lunchroom</option>
        </select>
      </div>
      
      <div className="form-group">
        <label for="register-password">Password</label>
        <input type="password" name="password" id="register-password"/>
      </div>
      
      <div className="form-group">
        <label for="register-confirm-password">Confirm password</label>
        <input type="password" name="password2" id="register-confirm-password"/>
      </div>
      
      <div className="form-group form-group-submit">
        <button className="btn btn-primary btn-submit btn-large">Start using Goodybag</button>
      </div>
      <p className="already-user">Already have an account? <a href="/login">Sign in</a></p>
    </form>
    <div className="supporting-graphic">
      <img src="https://d3bqck8kwfkhx5.cloudfront.net/img/login-takeout.png"/>
    </div>
  </div>

    </div>
  );
}