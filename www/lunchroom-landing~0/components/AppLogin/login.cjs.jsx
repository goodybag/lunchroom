module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="page-section-standalone">

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
  );
}