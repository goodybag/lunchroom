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
    
    </footer>
  );
}