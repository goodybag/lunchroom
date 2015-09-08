module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="container">

  <div className="warning-section" data-component-id="warning-section">
    <img src="/lunchroom-landing~0/resources/assets/img~cupcake-shocked-2-4bc6fb3.png" alt="" className="warning-section-supporting-graphic"/>
    <h2 className="warning-section-header">Sorry, we are closed today ... but feel free to order ahead for the rest of the week!</h2>
    <p>I'm a cupcake; I can't do it! You can, though :)</p>
  </div>

    </div>
  );
}