module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <body className="page">


    <header className="navbar collapsed" data-component-id="header">
      <div className="container">
        <a href="/">
          <img src="https://d3bqck8kwfkhx5.cloudfront.net/img/logo.png" alt="Goodybag.com" className="navbar-logo"/>
        </a>
      </div>
    </header>

    
<section className="page-section" id="section-lunchroom-header" data-component-id="navbar">
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
        <a data-component-elm="checkoutButton" className="btn btn-primary" href="checkout">Checkout (<span data-component-prop="cartItemCount">1</span>)</a>
      </div>
    </div>
  </div>
</section>

<section className="page-section" id="section-item-tiles" data-component-id="menu">
  <div className="container">
    <div className="tiles item-tiles">
        <div className="tile item-tile" data-component-id="menu-item">
          <div className="tile-cover" style="background-image: url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp;h=195&amp;fit=crop');">
          </div>
          <div className="tile-info">
            <h3 className="tile-title">Pirata Dos Tacos</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price">$10.90</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-id="menu-item">
          <div className="tile-cover" style="background-image: url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp;h=195&amp;fit=crop');">
          </div>
          <div className="tile-info">
            <h3 className="tile-title">Poop Taco Box</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-vegan"></li>
                <li className="diet-tag diet-tag-vegetarian"></li>
            </ul>
            <div className="item-price">$12.00</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-id="menu-item">
          <div className="tile-cover" style="background-image: url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp;h=195&amp;fit=crop');">
          </div>
          <div className="tile-info">
            <h3 className="tile-title">Pirata Dos Tacos</h3>
            <ul className="diet-tags">
            </ul>
            <div className="item-price">$10.90</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-id="menu-item">
          <div className="tile-cover" style="background-image: url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp;h=195&amp;fit=crop');">
          </div>
          <div className="tile-info">
            <h3 className="tile-title">Poop Taco Box</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price">$12.00</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-id="menu-item">
          <div className="tile-cover" style="background-image: url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp;h=195&amp;fit=crop');">
          </div>
          <div className="tile-info">
            <h3 className="tile-title">Poop Taco Box</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price">$12.00</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-id="menu-item">
          <div className="tile-cover" style="background-image: url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp;h=195&amp;fit=crop');">
          </div>
          <div className="tile-info">
            <h3 className="tile-title">Pirata Dos Tacos</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price">$10.90</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-id="menu-item">
          <div className="tile-cover" style="background-image: url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp;h=195&amp;fit=crop');">
          </div>
          <div className="tile-info">
            <h3 className="tile-title">Poop Taco Box</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price">$12.00</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-id="menu-item">
          <div className="tile-cover" style="background-image: url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp;h=195&amp;fit=crop');">
          </div>
          <div className="tile-info">
            <h3 className="tile-title">Poop Taco Box</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price">$12.00</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-id="menu-item">
          <div className="tile-cover" style="background-image: url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp;h=195&amp;fit=crop');">
          </div>
          <div className="tile-info">
            <h3 className="tile-title">Pirata Dos Tacos</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price">$10.90</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal">Add</button>
          </div>
        </div>
    </div>
  </div>
</section>

<section className="page-section" id="section-item-tiles" data-component-id="share">
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

<section className="page-section" id="section-checkout-info" data-component-id="checkout-form">
  <div className="container">
    <fieldset className="checkout-info form-vertical">
      <div className="user-info">
        <h3 className="section-title">Your Info</h3>
        <div className="form-group">
          <label for="">Name</label>
          <input type="text" className="form-control" data-component-elm="info[name]"/>
        </div>
        <div className="form-group">
          <label for="">Email</label>
          <input type="email" className="form-control" data-component-elm="info[email]"/>
        </div>
        <div className="form-group">
          <label for="">Phone Number</label>
          <input type="tel" className="form-control" data-component-elm="info[phone]"/>
        </div>
        <p className="checkout-info-note">We'll email/text you when your meal has arrived!</p>
      </div>
      <div className="payment-info">
        <h3 className="section-title">Payment Info</h3>
          <div className="form-group form-group-member-name">
            <label for="">Name on card</label>
            <input type="text" className="form-control" name="card_member_name" data-component-elm="card[name]"/>
          </div>
          <div className="inline-form-group-list">
            <div className="form-group form-group-card-number">
              <label for="">Card number</label>
              <input type="text" className="form-control" name="card_number" data-component-elm="card[number]"/>
            </div>
            <div className="form-group form-group-card-cvv">
              <label for="">CVV</label>
              <input type="text" className="form-control" name="card_cvv" data-component-elm="card[cvc]"/>
            </div>
            <div className="form-group form-group-expiration">
              <label for="">Expiration date</label>
              <input type="text" className="form-control" placeholder="MM" name="card_expiration_month" data-component-elm="card[expire-month]"/>
              /
              <input type="text" className="form-control" placeholder="YY" name="card_expiration_year" data-component-elm="card[expire-year]"/>
            </div>
          </div>
      </div>
    </fieldset>
  </div>
</section>

<section className="page-section" id="section-order-reviewer" data-component-id="checkout-items">
  <div className="container">
    <div className="order-reviewer">
      <h3 className="order-reviewer-header">Today's order
        <a href="#" className="order-reviewer-item-add-link" data-component-elm="addItemsLink">Add items</a>
      </h3>

      <div className="order-reviewer-items" data-component-section="items">
          <div className="order-reviewer-item" data-component-section="items" data-component-view="default">
            <div className="order-reviewer-item-col photo-col">
              <img src="https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=352&amp;h=210&amp;fit=crop" alt="Pirata Dos Tacos" data-component-prop="photo"/>
            </div>
            <div className="order-reviewer-item-col item-desc">
              <div className="order-reviewer-item-description-wrapper">
                <div className="order-reviewer-item-description">
                  <h4 className="order-reviewer-item-title" data-component-prop="title">Pirata Dos Tacos</h4>
                </div>
                <ul className="order-reviewer-item-actions">
                  <li className="action"><a href="#" data-component-elm="removeLink">remove</a></li>
                </ul>
              </div>
            </div>
            <div className="order-reviewer-item-col">
              <strong>Quantity:</strong> <span data-component-prop="quantity">1</span>
            </div>
            <div className="order-reviewer-item-col price-col" data-component-prop="price">
              $10.90
            </div>
            <div className="order-reviewer-item-col price-col" data-component-prop="amount">
              $10.90
            </div>
          </div>
          <div className="order-reviewer-item" data-component-section="items" data-component-view="default">
            <div className="order-reviewer-item-col photo-col">
              <img src="https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=352&amp;h=210&amp;fit=crop" alt="Poop Taco Box" data-component-prop="photo"/>
            </div>
            <div className="order-reviewer-item-col item-desc">
              <div className="order-reviewer-item-description-wrapper">
                <div className="order-reviewer-item-description">
                  <h4 className="order-reviewer-item-title" data-component-prop="title">Poop Taco Box</h4>
                </div>
                <ul className="order-reviewer-item-actions">
                  <li className="action"><a href="#" data-component-elm="removeLink">remove</a></li>
                </ul>
              </div>
            </div>
            <div className="order-reviewer-item-col">
              <strong>Quantity:</strong> <span data-component-prop="quantity">1</span>
            </div>
            <div className="order-reviewer-item-col price-col" data-component-prop="price">
              $12.00
            </div>
            <div className="order-reviewer-item-col price-col" data-component-prop="amount">
              $12.00
            </div>
          </div>
      </div>
    </div>
  </div>
</section>

<section className="page-section" id="section-order-summary" data-component-id="checkout-summary">
  <div className="container">
    <div className="order-summary-wrapper">
      <div className="order-summary">
        <div className="order-summary-item">
          <div className="order-summary-col order-summary-key">Subtotal</div>
          <div className="order-summary-col order-summary-value" data-component-prop="subtotal">$8.80</div>
        </div>
        <div className="order-summary-item">
          <div className="order-summary-col order-summary-key">Tax (<span data-component-prop="taxRate">5%</span>)</div>
          <div className="order-summary-col order-summary-value" data-component-prop="taxAmount">$0.73</div>
        </div>
        <div className="order-summary-item">
          <div className="order-summary-col order-summary-key">Goodybag Fee</div>
          <div className="order-summary-col order-summary-value" data-component-prop="goodybagFee">$2.99</div>
        </div>
        <div className="order-summary-item order-summary-item-total">
          <div className="order-summary-col order-summary-key">Total</div>
          <div className="order-summary-col order-summary-value" data-component-prop="total">$12.37</div>
        </div>
      </div>
      <button className="btn btn-primary btn-place-order" data-component-elm="placeOrderButton">Place Order</button>
    </div>
  </div>
</section>

<section className="page-section" id="section-order-success" data-component-id="order-success">
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

<div className="modal item-modal fade" id="item-modal" data-component-id="menu-item-popup">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-photo-wrapper">
        <img className="modal-photo" src="https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=430&amp;h=400&amp;fit=crop"/>
      </div>
      <div className="modal-main-content">
        <div className="modal-main-content-body">
          <h3 className="item-modal-title">Fajita Torta
            <span className="item-modal-price">$12.00</span>
          </h3>
          <p className="item-modal-description">Mexican sandwich with top sirloin steak, bell peppers, mushrooms, and onions. Topped with queso, avocado, tomatoes, and Mexican mayo dressing.</p>
          <ul className="diet-tags">
            <li className="diet-tag diet-tag-spicy"></li>
          </ul>
        </div>
        <div className="item-modal-actions">
          <div className="form-group item-modal-quantity-form-group">
            <label className="item-modal-quantity-label">Quantity:</label>
            <input type="number" value="1" className="item-modal-quantity-input"/>
          </div>
          <button className="btn btn-primary item-modal-save-btn">Add to Order</button>
        </div>
      </div>
    </div>
  </div>
</div>

<footer className="footer" data-component-id="footer">
  <ul className="nav footer-nav">
    <li><a href="#" data-toggle="modal" data-target="#contact-us-modal">Contact Us</a></li>
    <li><a href="https://www.goodybag.com/legal">Terms of service</a></li>
    <li><a href="https://www.goodybag.com/privacy">Privacy policy</a></li>
  </ul>
</footer>


    
    
  

    </body>
  );
}