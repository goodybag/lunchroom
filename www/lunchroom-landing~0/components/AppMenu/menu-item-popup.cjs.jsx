module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="modal item-modal fade" id="item-modal">

  <div className="modal-dialog">
    <div className="close">
      <span data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></span>
    </div>
    <div className="modal-content">
      <div className="modal-photo-wrapper">
        <img className="modal-photo" src="https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=430&amp;h=400&amp;fit=crop" data-component-prop="modalPhotoUrl" data-component-prop-target="src"/>
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
  );
}