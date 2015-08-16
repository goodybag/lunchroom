module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="warning-section">

    <img src="/lunchroom-landing~0/resources/assets/img~cupcake-shocked-2-4bc6fb3.png" alt="" className="warning-section-supporting-graphic"/>
    <h2 className="warning-section-header">Sorry, time’s up :(.</h2>
    <p>You must place your order by <span data-component-prop="orderBy">10am</span>.</p>
  
    </div>
  );
}