module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="container order-success">

  <div className="menu-share">
    <h4 className="menu-share-title">Share this link</h4>
    <p className="menu-share-followup">with coworkers to let them view the menu and place their own order!</p>
    <input className="menu-share-input" type="text" value="http://lunchroom.goodybag.com/bazaarvoice" data-component-elm="shareUrl"/>
  </div>

    </div>
  );
}