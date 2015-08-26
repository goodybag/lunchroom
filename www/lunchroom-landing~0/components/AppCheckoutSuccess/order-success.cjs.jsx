module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="container order-success">

  <img src="/lunchroom-landing~0/resources/assets/img~success-d84e5c8.png" alt="" className="success-img"/>

  <p className="order-success-note">Your order is placed and will be <strong>delivered today between <span data-component-prop="pickupTime">12:00-12:30pm</span></strong>.</p>

  <p className="order-success-note">Your meal will be delivered <strong data-component-prop="deliveryLocation">in the Bazaarvoice Lobby</strong>.</p>

  <p className="order-success-note">We'll send you an email and text you when it arrives.</p>

    </div>
  );
}