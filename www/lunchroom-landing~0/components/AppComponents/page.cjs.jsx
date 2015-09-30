module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="page page-kitchen-sink">

      <header className="navbar collapsed" data-component-id="header">
        <div className="container">
          <a href="/">
            <img src="https://d3bqck8kwfkhx5.cloudfront.net/img/logo.png" alt="Goodybag.com" className="navbar-logo"/>
          </a>
          <ul className="nav">
            <li><a href="/pages/register">Sign Up</a></li>
            <li><a href="/pages/login">Login</a></li>
          </ul>
        </div>
      </header>

      
<section className="page-section" id="section-lunchroom-header" data-component-id="navbar">
  <div className="lunchroom-header">
    <div className="container">
      <div className="modules">
        <div className="module">
          Deliver to: <small data-component-prop="deliverTo">Bazaarvoice</small>
        </div>
        <div className="module">
          Delivery Time: <small data-component-prop="deliveryTime">12:00-12:30 PM</small>
        </div>
        <div className="module">
          Time left to order:
          <small className="text-important" data-component-prop="timeLeftToOrder">1 hr 26min</small>
        </div>
        <div className="module module-right module-unpadded">
          <a data-component-elm="checkoutButton" className="btn btn-primary" href="checkout">Checkout (<span data-component-prop="cartItemCount">1</span>)</a>
        </div>
      </div>
      <div className="tabs" data-component-section="tabs">
        <a data-component-section="tabs" data-component-view="active" className="active" href="#"><span data-component-prop="tabDay">Mon</span><small data-component-prop="tabDate">Jan 26</small></a>
        <a data-component-section="tabs" data-component-view="default" href="#"><span data-component-prop="tabDay">Tues</span><small data-component-prop="tabDate">Jan 27</small></a>
        <a href="#"><span data-component-prop="tabDay">Weds</span><small data-component-prop="tabDate">Jan 28</small></a>
        <a href="#"><span data-component-prop="tabDay">Thurs</span><small data-component-prop="tabDate">Jan 29</small></a>
        <a href="#"><span data-component-prop="tabDay">Fri</span><small data-component-prop="tabDate">Jan 30</small></a>
      </div>
    </div>
  </div>
</section>



<section className="page-section" id="section-item-tiles" data-component-id="share">
  <div className="container">
    <div className="panel-wrapper" style={{"maxWidth":"620px"}}>
      <div className="panel panel-dark panel-share-link">
        <p className="panel-text">
          <strong>Share this link</strong> with coworkers to let them view the menu and place their own order!
        </p><!--
        --><input type="text" className="panel-input form-control" value="https://lunchroom.goodybag.com/bazaar-voice"/>
      </div>
    </div>
  </div>
</section>


<section className="page-section" id="section-loading-indicator">
  <div className="container">
    <h2 className="section-title">Loading indicator
      <button className="btn btn-primary" id="loading-indicator-demo">Start Loading</button>
    </h2>
  </div>
</section>


<footer className="footer" data-component-id="footer">
  <ul className="nav footer-nav">
    <li><a href="#" data-toggle="modal" data-target="#contact-us-modal">Contact Us</a></li>
    <li><a href="https://www.goodybag.com/legal">Terms of service</a></li>
    <li><a href="https://www.goodybag.com/privacy">Privacy policy</a></li>
  </ul>
</footer>

<div className="loading-indicator" data-component-id="loading-indicator">
  <div className="loading-indicator-graphic">
    <img src="/lunchroom-landing~0/resources/assets/img~cupcake-happy-9574e8b.png"/>
  </div>
  <div className="loading-indicator-text">Loading...</div>
</div>

    
    </div>
  );
}