module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <footer className="footer">

        <ul className="nav footer-nav">
          <li><a href="#" data-toggle="modal" data-target="#contact-us-modal">Contact Us</a></li>
          <li><a href="https://www.goodybag.com/legal">Terms of service</a></li>
          <li><a href="https://www.goodybag.com/privacy">Privacy policy</a></li>
        </ul>

        <div className="modal fade" id="contact-us-modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Contact Us</h3>
              </div>
              <form action="#" className="form form-vertical contact-us-form" id="contact-us-form">
                <div className="modal-body">
                  <div className="form-group">
                    <label for="name-input">Name</label>
                    <input type="text" name="name" data-component-elm="name"/>
                  </div>
                  <div className="form-group">
                    <label for="name-input">Email</label>
                    <input type="email" name="email" data-component-elm="email"/>
                  </div>
                  <div className="form-group">
                    <label for="message-input">Message</label>
                    <textarea rows="6" type="text" name="message" data-component-elm="message"></textarea>
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
      
    </footer>
  );
}