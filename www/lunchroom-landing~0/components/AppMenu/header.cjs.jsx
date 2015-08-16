module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <header className="navbar collapsed">

        <div className="container">
          <a href="/">
            <img src="https://d3bqck8kwfkhx5.cloudfront.net/img/logo.png" alt="Goodybag.com" className="navbar-logo"/>
          </a>
        </div>
      
    </header>
  );
}