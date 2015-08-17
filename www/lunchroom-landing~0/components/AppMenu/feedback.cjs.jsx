module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="container outro-header-section">

  <h3 className="outro-header">To give feedback or ask questions, please email us at <a href="mailto:support@goodybag.com">support@goodybag.com</a></h3>

    </div>
  );
}