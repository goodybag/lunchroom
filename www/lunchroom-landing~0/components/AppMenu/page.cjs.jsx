module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="page page-menu">

      <header className="navbar collapsed" data-component-id="header">
        <div className="container">
          <a href="/">
            <img src="https://d3bqck8kwfkhx5.cloudfront.net/img/logo.png" alt="Goodybag.com" className="navbar-logo"/>
          </a>
        </div>
      </header>
      
      <div className="lunchroom-header" data-component-id="navbar">
  <div className="container">
    <div className="tabs" data-component-section="tabs">
      <a data-component-section="tabs" data-component-view="active" className="active" href="#"><span data-component-prop="tabDay">Mon</span><small data-component-prop="tabDate">Jan 26</small></a>
      <a data-component-section="tabs" data-component-view="default" href="#"><span data-component-prop="tabDay">Tues</span><small data-component-prop="tabDate">Jan 27</small></a>
      <a href="#"><span data-component-prop="tabDay">Weds</span><small data-component-prop="tabDate">Jan 28</small></a>
      <a href="#"><span data-component-prop="tabDay">Thurs</span><small data-component-prop="tabDate">Jan 29</small></a>
      <a href="#"><span data-component-prop="tabDay">Fri</span><small data-component-prop="tabDate">Jan 30</small></a>
    </div>
    <div className="module" data-component-view="menuAvailable">
      Delivery to: <small data-component-prop="deliverTo">Bazaarvoice</small>
    </div>
    <div className="module" data-component-view="menuAvailable">
      Delivery Time: <small data-component-prop="deliveryTime">12:00-12:30 PM</small>
    </div>
    <div className="module" data-component-view="orderCountdown">
      Time left to order:
      <small className="text-important" data-component-prop="timeLeftToOrder">1 hr 26min</small>
    </div>
    <div className="module module-right module-unpadded">
      <a data-component-elm="checkoutButton" data-component-view="not-on-checkout" className="btn btn-primary" href="checkout">Checkout (<span data-component-prop="cartItemCount">1</span>)</a>
    </div>
  </div>
</div>

<section className="page-section" id="section-warning-section" data-component-id="menu-not-created">
  <div className="container">
    <div className="warning-section" data-component-id="warning-section">
      <img src="/lunchroom-landing~0/resources/assets/img~cupcake-shocked-9c195d3.png" alt="" className="warning-section-supporting-graphic"/>
      <h2 className="warning-section-header">This menu has not been created yet!</h2>
      <p>Either this is an error with Goodybag, or the menu hasn't been created yet. Please check again later.</p>
    </div>
  </div>
</section>

<section className="page-section" id="section-warning-section" data-component-id="too-late">
  <div className="container">
    <div className="warning-section" data-component-id="warning-section">
      <img src="/lunchroom-landing~0/resources/assets/img~cupcake-shocked-9c195d3.png" alt="" className="warning-section-supporting-graphic"/>
      <h2 className="warning-section-header">Sorry, time’s up :(.</h2>
      <p>You must place your order by <span data-component-prop="orderBy">10am</span>.</p>
    </div>
  </div>
</section>

<div className="container items-container" data-component-id="menu">
  <div className="tiles item-tiles" data-component-section="items">
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$10.90</div>
          <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton" data-component-view="orderable">Add</button>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-vegan" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-vegetarian" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$12.00</div>
          <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton" data-component-view="orderable">Add</button>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
          </ul>
          <div className="item-price" data-component-prop="price">$10.90</div>
          <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton" data-component-view="orderable">Add</button>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Poop Taco Box but this one is a really long title</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$12.00</div>
          <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton" data-component-view="orderable">Add</button>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$12.00</div>
          <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton" data-component-view="orderable">Add</button>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$10.90</div>
          <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton" data-component-view="orderable">Add</button>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$12.00</div>
          <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton" data-component-view="orderable">Add</button>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$12.00</div>
          <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton" data-component-view="orderable">Add</button>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$10.90</div>
          <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton" data-component-view="orderable">Add</button>
        </div>
      </div>
  </div>
</div>

<div className="modal item-modal fade" id="item-modal" data-component-id="menu-item-popup">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-photo-wrapper">
        <img className="modal-photo" src="https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=430&amp;h=400&amp;fit=crop" data-component-prop="photoUrl" data-component-prop-target="src"/>
      </div>
      <div className="modal-main-content">
        <div className="modal-main-content-body">
          <h3 className="item-modal-title" data-component-prop="title">Fajita Torta
            <span className="item-modal-price" data-component-prop="price">$12.00</span>
          </h3>
          <p className="item-modal-description" data-component-prop="description">Mexican sandwich with top sirloin steak, bell peppers, mushrooms, and onions. Topped with queso, avocado, tomatoes, and Mexican mayo dressing.</p>
          <ul className="diet-tags" data-component-section="diet-tags">
            <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
        </div>
        <div className="item-modal-actions">
          <button className="btn btn-primary
            item-modal-save-btn" data-component-elm="addButton" data-component-view="orderable">Add to Order</button>
        </div>
      </div>
    </div>
  </div>
</div>

      
      <div className="modal fade" id="contact-us-modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Contact Us</h3>
            </div>
            <form action="#" className="form form-vertical contact-us-form">
              <div className="modal-body">
                <div className="form-group">
                  <label for="name-input">Name</label>
                  <input type="text" name="name"/>
                </div>
                <div className="form-group">
                  <label for="name-input">Email</label>
                  <input type="email" name="email"/>
                </div>
                <div className="form-group">
                  <label for="message-input">Message</label>
                  <textarea rows="6" type="text" name="message"></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
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
    
    </div>
  );
}