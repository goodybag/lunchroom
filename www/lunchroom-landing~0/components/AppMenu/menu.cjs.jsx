module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="container items-container">

  <h1 className="menu-provider-name">Dos Batos Wood Fired Tacos
    <span className="no-tip-note">No tips. Just a flat $2.99 fee</span>
  </h1>
  <div className="tiles item-tiles" data-component-section="items">
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
          <div className="item-tile-quantity-wrapper">
            <div className="item-tile-quantity"></div>
            in your cart
          </div>
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$10.90</div>
          <div className="item-tile-actions">
            <button className="btn btn-default btn-add" data-component-elm="addButton" data-component-view="orderable">Add</button>
          </div>
        </div>
      </div>
      <div className="tile item-tile is-in-cart" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
          <div className="item-tile-quantity-wrapper">
            <div className="item-tile-quantity">2</div>
            in your cart
          </div>
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-vegan" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-vegetarian" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$12.00</div>
          <div className="item-tile-actions">
            <button className="btn btn-default btn-remove">-</button>
            <button className="btn btn-default btn-add" data-component-elm="addButton" data-component-view="orderable">Add</button>
          </div>
        </div>
      </div>
      <div className="tile item-tile is-in-cart" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
          <div className="item-tile-quantity-wrapper">
            <div className="item-tile-quantity">1</div>
            in your cart
          </div>
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
          </ul>
          <div className="item-price" data-component-prop="price">$10.90</div>
          <div className="item-tile-actions">
            <button className="btn btn-default btn-remove">-</button>
            <button className="btn btn-default btn-add" data-component-elm="addButton" data-component-view="orderable">Add</button>
          </div>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
          <div className="item-tile-quantity-wrapper">
            <div className="item-tile-quantity"></div>
            in your cart
          </div>
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Poop Taco Box but this one is a really long title</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$12.00</div>
          <div className="item-tile-actions">
            <button className="btn btn-default btn-add" data-component-elm="addButton" data-component-view="orderable">Add</button>
          </div>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
          <div className="item-tile-quantity-wrapper">
            <div className="item-tile-quantity"></div>
            in your cart
          </div>
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$12.00</div>
          <div className="item-tile-actions">
            <button className="btn btn-default btn-add" data-component-elm="addButton" data-component-view="orderable">Add</button>
          </div>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
          <div className="item-tile-quantity-wrapper">
            <div className="item-tile-quantity"></div>
            in your cart
          </div>
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$10.90</div>
          <div className="item-tile-actions">
            <button className="btn btn-default btn-add" data-component-elm="addButton" data-component-view="orderable">Add</button>
          </div>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
          <div className="item-tile-quantity-wrapper">
            <div className="item-tile-quantity"></div>
            in your cart
          </div>
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$12.00</div>
          <div className="item-tile-actions">
            <button className="btn btn-default btn-add" data-component-elm="addButton" data-component-view="orderable">Add</button>
          </div>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
          <div className="item-tile-quantity-wrapper">
            <div className="item-tile-quantity"></div>
            in your cart
          </div>
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$12.00</div>
          <div className="item-tile-actions">
            <button className="btn btn-default btn-add" data-component-elm="addButton" data-component-view="orderable">Add</button>
          </div>
        </div>
      </div>
      <div className="tile item-tile" data-component-section="items" data-component-view="default">
        <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-component-elm="showDetailsLink" data-toggle="modal" data-target="#item-modal">
          <div className="item-tile-quantity-wrapper">
            <div className="item-tile-quantity"></div>
            in your cart
          </div>
        </div>
        <div className="tile-info">
          <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
          <ul className="diet-tags" data-component-section="diet-tags">
              <li className="diet-tag diet-tag-gluten-free" data-component-section="diet-tags" data-component-view="default"></li>
              <li className="diet-tag diet-tag-spicy" data-component-section="diet-tags" data-component-view="default"></li>
          </ul>
          <div className="item-price" data-component-prop="price">$10.90</div>
          <div className="item-tile-actions">
            <button className="btn btn-default btn-add" data-component-elm="addButton" data-component-view="orderable">Add</button>
          </div>
        </div>
      </div>
  </div>

    </div>
  );
}