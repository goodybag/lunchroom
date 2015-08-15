module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <section className="page-section" id="section-warning-section">

  <div className="container">
    <div className="warning-section" data-component-id="warning-section">
      <img src="/lunchroom-landing~0/resources/assets/img~cupcake-shocked-9c195d3.png" alt="" className="warning-section-supporting-graphic"/>
      <h2 className="warning-section-header">You have nothing in your cart!</h2>
      <p><a href="#" data-component-elm="addItemsLink">Add items</a></p>
    </div>
  </div>

    </section>
  );
}