module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <section className="page-section" id="section-warning-section">

  <div className="container">
    <div className="warning-section" data-component-id="warning-section">
      <img src="/lunchroom-landing~0/resources/assets/img~cupcake-shocked-9c195d3.png" alt="" className="warning-section-supporting-graphic"/>
      <h2 className="warning-section-header">This menu has not been created yet!</h2>
      <p>Either this is an error with Goodybag, or the menu hasn't been created yet. Please check again later.</p>
    </div>
  </div>

    </section>
  );
}