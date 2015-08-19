module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="container">

  <div className="warning-section" data-component-id="warning-section">
    <img src="/lunchroom-landing~0/resources/assets/img~cupcake-happy-9574e8b.png" alt="" className="warning-section-supporting-graphic"/>
    <h2 className="warning-section-header">You can order in advance for the rest of the week!</h2>
    <p>I'm a cupcake; I can't do it! You can, though :)</p>
  </div>

    </div>
  );
}