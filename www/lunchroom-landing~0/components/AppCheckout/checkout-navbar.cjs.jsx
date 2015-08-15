module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="container page-nav-container">

  <ul className="page-nav">
    <li className="page-nav-item">
      <a href="/pages/menu" className="page-nav-item-link" data-component-elm="addItemsLink">&lt; Back to menu</a>
    </li>
  </ul>

    </div>
  );
}