module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="lunchroom-header">

  <div className="container">
    <div className="tabs" data-component-section="tabs">
      <a data-component-section="tabs" data-component-view="active" className="active" href="#"><span data-component-prop="tabDay">Mon</span><small data-component-prop="tabDate">Jan 26</small></a>
      <a data-component-section="tabs" data-component-view="default" href="#"><span data-component-prop="tabDay">Tues</span><small data-component-prop="tabDate">Jan 27</small></a>
      <a href="#"><span data-component-prop="tabDay">Weds</span><small data-component-prop="tabDate">Jan 28</small></a>
      <a href="#"><span data-component-prop="tabDay">Thurs</span><small data-component-prop="tabDate">Jan 29</small></a>
      <a href="#"><span data-component-prop="tabDay">Fri</span><small data-component-prop="tabDate">Jan 30</small></a>
    </div>
    <div className="module">
      Delivery to: <small data-component-prop="deliverTo">Bazaarvoice</small>
    </div>
    <div className="module">
      Delivery Time: <small data-component-prop="deliveryTime">12:00-12:30 PM</small>
    </div>
    <div className="module">
      Time left to order:
      <small className="text-important" data-component-prop="timeLeftToOrder">1 hr 26min</small>
    </div>
    <div className="module module-right module-unpadded">
      <a data-component-elm="checkoutButton" data-component-view="not-on-checkout" className="btn btn-primary" href="checkout">Checkout (<span data-component-prop="cartItemCount">1</span>)</a>
    </div>
  </div>

    </div>
  );
}