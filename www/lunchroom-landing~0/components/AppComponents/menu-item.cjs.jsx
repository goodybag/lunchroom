module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="tile item-tile">

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
  );
}