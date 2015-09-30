module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="loading-indicator">

  <div className="loading-indicator-graphic">
    <img src="/lunchroom-landing~0/resources/assets/img~cupcake-happy-9574e8b.png"/>
  </div>
  <div className="loading-indicator-text">Loading...</div>

    </div>
  );
}