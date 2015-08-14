module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <section className="page-section" id="section-order-reviewer">

  <div className="container">
    <div className="order-reviewer">
      <h3 className="order-reviewer-header">Today's order
        <a href="#" className="order-reviewer-item-add-link" data-component-elm="addItemsLink">Add items</a>
      </h3>

      <div className="order-reviewer-items" data-component-section="items">
          <div className="order-reviewer-item" data-component-section="items" data-component-view="default">
            <div className="order-reviewer-item-col photo-col">
              <img src="https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=352&amp;h=210&amp;fit=crop" alt="Pirata Dos Tacos" data-component-prop="photo" data-component-prop-target="src"/>
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
              <img src="https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=352&amp;h=210&amp;fit=crop" alt="Poop Taco Box" data-component-prop="photo" data-component-prop-target="src"/>
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
  );
}