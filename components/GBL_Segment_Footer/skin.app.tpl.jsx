module.exports = function (Context) {

    // TODO: Remove this once we can inject 'React' automatically at build time.
    var React = Context.REACT;

console.log("get footer skin tpl");

    return (
        <header class="navbar collapsed">

          <div class="container">
            <a href="/">
              <img src="https://d3bqck8kwfkhx5.cloudfront.net/img/logo.png" alt="Goodybag.com" class="navbar-logo"/>
            </a>
          </div>
        
        </header>
    );
}
