module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <section className="page-section" id="section-item-tiles">

  <div className="container">
    <div className="panel-wrapper" style="max-width: 620px">
      <div className="panel panel-dark panel-share-link">
        <p className="panel-text">
          <strong>Share this link</strong> with coworkers to let them view the menu and place their own order!
        </p><!--
        --><input type="text" className="panel-input form-control" value="https://lunchroom.goodybag.com/bazaar-voice"/>
      </div>
    </div>
  </div>

    </section>
  );
}