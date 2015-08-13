module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <form action="#" className="cta-form form">

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
  );
}