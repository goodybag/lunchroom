module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <section className="page-section" id="section-order-success">

  <div className="container order-success">
    <img src="/lunchroom-landing~0/resources/assets/img~success-d84e5c8.png" alt="" className="success-img"/>
    <p className="order-success-note">Your order is placed and will be <strong>delivered today between <span data-component-prop="pickupTime">12:00-12:30pm</span></strong>.</p>
    <p className="order-success-note">We'll send you an email when it arrives.</p>

    <div className="menu-share">
      <h4 className="menu-share-title">Share this link</h4>
      <p className="menu-share-followup">with coworkers to let them view the menu and place their own order!</p>
      <input className="menu-share-input" type="text" value="http://lunchroom.goodybag.com/bazaarvoice"/>
    </div>
  </div>

    </section>
  );
}