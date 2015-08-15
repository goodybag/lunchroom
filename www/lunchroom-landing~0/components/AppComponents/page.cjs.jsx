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

<section className="page-section" id="section-warning-section" data-component-id="menu-not-created">
  <div className="container">
    <div className="warning-section" data-component-id="warning-section">
      <img src="/lunchroom-landing~0/resources/assets/img~cupcake-shocked-9c195d3.png" alt="" className="warning-section-supporting-graphic"/>
      <h2 className="warning-section-header">This menu has not been created yet!</h2>
      <p>Either this is an error with Goodybag, or the menu hasn't been created yet. Please check again later.</p>
    </div>
  </div>
</section>

<section className="page-section" id="section-item-tiles" data-component-id="menu">
  <div className="container">
    <div className="tiles item-tiles" data-component-section="items">
        <div className="tile item-tile" data-component-section="items" data-component-view="default">
          <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-toggle="modal" data-target="#item-modal">
          </div>
          <div className="tile-info">
            <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price" data-component-prop="price">$10.90</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-section="items" data-component-view="default">
          <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-toggle="modal" data-target="#item-modal">
          </div>
          <div className="tile-info">
            <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-vegan"></li>
                <li className="diet-tag diet-tag-vegetarian"></li>
            </ul>
            <div className="item-price" data-component-prop="price">$12.00</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-section="items" data-component-view="default">
          <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-toggle="modal" data-target="#item-modal">
          </div>
          <div className="tile-info">
            <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
            <ul className="diet-tags">
            </ul>
            <div className="item-price" data-component-prop="price">$10.90</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-section="items" data-component-view="default">
          <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-toggle="modal" data-target="#item-modal">
          </div>
          <div className="tile-info">
            <h3 className="tile-title" data-component-prop="title">Poop Taco Box but this one is a really long title</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price" data-component-prop="price">$12.00</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-section="items" data-component-view="default">
          <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-toggle="modal" data-target="#item-modal">
          </div>
          <div className="tile-info">
            <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price" data-component-prop="price">$12.00</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-section="items" data-component-view="default">
          <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-toggle="modal" data-target="#item-modal">
          </div>
          <div className="tile-info">
            <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price" data-component-prop="price">$10.90</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-section="items" data-component-view="default">
          <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-toggle="modal" data-target="#item-modal">
          </div>
          <div className="tile-info">
            <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price" data-component-prop="price">$12.00</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-section="items" data-component-view="default">
          <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-toggle="modal" data-target="#item-modal">
          </div>
          <div className="tile-info">
            <h3 className="tile-title" data-component-prop="title">Poop Taco Box</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price" data-component-prop="price">$12.00</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton">Add</button>
          </div>
        </div>
        <div className="tile item-tile" data-component-section="items" data-component-view="default">
          <div className="tile-cover" style={{"backgroundImage":"url('https://www.filepicker.io/api/file/SZoK9zUvTPWXzmK81aGg/convert?w=400&amp"}} data-component-prop="photoUrl" data-component-prop-target="style/background-image" data-toggle="modal" data-target="#item-modal">
          </div>
          <div className="tile-info">
            <h3 className="tile-title" data-component-prop="title">Pirata Dos Tacos</h3>
            <ul className="diet-tags">
                <li className="diet-tag diet-tag-gluten-free"></li>
                <li className="diet-tag diet-tag-spicy"></li>
            </ul>
            <div className="item-price" data-component-prop="price">$10.90</div>
            <button className="btn btn-default btn-add" data-toggle="modal" data-target="#item-modal" data-component-elm="addButton">Add</button>
          </div>
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

<section className="page-section" id="section-checkout-info">
  <div className="container">
    <h2 className="section-header">Checkout Form (new user)</h2>
    <fieldset className="checkout-info form-vertical" data-component-id="checkout-form" copmonent:view="default">
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
          <div className="intl-tel-input"><div className="flag-dropdown"><div tabindex="0" className="selected-flag" title="United States: +1"><div className="iti-flag us"></div><div className="arrow"></div></div><ul className="country-list hide"><li className="country preferred active" data-dial-code="1" data-country-code="us"><div className="flag"><div className="iti-flag us"></div></div><span className="country-name">United States</span><span className="dial-code">+1</span></li><li className="country preferred" data-dial-code="44" data-country-code="gb"><div className="flag"><div className="iti-flag gb"></div></div><span className="country-name">United Kingdom</span><span className="dial-code">+44</span></li><li className="divider"></li><li className="country" data-dial-code="93" data-country-code="af"><div className="flag"><div className="iti-flag af"></div></div><span className="country-name">Afghanistan (‫افغانستان‬‎)</span><span className="dial-code">+93</span></li><li className="country" data-dial-code="355" data-country-code="al"><div className="flag"><div className="iti-flag al"></div></div><span className="country-name">Albania (Shqipëri)</span><span className="dial-code">+355</span></li><li className="country" data-dial-code="213" data-country-code="dz"><div className="flag"><div className="iti-flag dz"></div></div><span className="country-name">Algeria (‫الجزائر‬‎)</span><span className="dial-code">+213</span></li><li className="country" data-dial-code="1684" data-country-code="as"><div className="flag"><div className="iti-flag as"></div></div><span className="country-name">American Samoa</span><span className="dial-code">+1684</span></li><li className="country" data-dial-code="376" data-country-code="ad"><div className="flag"><div className="iti-flag ad"></div></div><span className="country-name">Andorra</span><span className="dial-code">+376</span></li><li className="country" data-dial-code="244" data-country-code="ao"><div className="flag"><div className="iti-flag ao"></div></div><span className="country-name">Angola</span><span className="dial-code">+244</span></li><li className="country" data-dial-code="1264" data-country-code="ai"><div className="flag"><div className="iti-flag ai"></div></div><span className="country-name">Anguilla</span><span className="dial-code">+1264</span></li><li className="country" data-dial-code="1268" data-country-code="ag"><div className="flag"><div className="iti-flag ag"></div></div><span className="country-name">Antigua and Barbuda</span><span className="dial-code">+1268</span></li><li className="country" data-dial-code="54" data-country-code="ar"><div className="flag"><div className="iti-flag ar"></div></div><span className="country-name">Argentina</span><span className="dial-code">+54</span></li><li className="country" data-dial-code="374" data-country-code="am"><div className="flag"><div className="iti-flag am"></div></div><span className="country-name">Armenia (Հայաստան)</span><span className="dial-code">+374</span></li><li className="country" data-dial-code="297" data-country-code="aw"><div className="flag"><div className="iti-flag aw"></div></div><span className="country-name">Aruba</span><span className="dial-code">+297</span></li><li className="country" data-dial-code="61" data-country-code="au"><div className="flag"><div className="iti-flag au"></div></div><span className="country-name">Australia</span><span className="dial-code">+61</span></li><li className="country" data-dial-code="43" data-country-code="at"><div className="flag"><div className="iti-flag at"></div></div><span className="country-name">Austria (Österreich)</span><span className="dial-code">+43</span></li><li className="country" data-dial-code="994" data-country-code="az"><div className="flag"><div className="iti-flag az"></div></div><span className="country-name">Azerbaijan (Azərbaycan)</span><span className="dial-code">+994</span></li><li className="country" data-dial-code="1242" data-country-code="bs"><div className="flag"><div className="iti-flag bs"></div></div><span className="country-name">Bahamas</span><span className="dial-code">+1242</span></li><li className="country" data-dial-code="973" data-country-code="bh"><div className="flag"><div className="iti-flag bh"></div></div><span className="country-name">Bahrain (‫البحرين‬‎)</span><span className="dial-code">+973</span></li><li className="country" data-dial-code="880" data-country-code="bd"><div className="flag"><div className="iti-flag bd"></div></div><span className="country-name">Bangladesh (বাংলাদেশ)</span><span className="dial-code">+880</span></li><li className="country" data-dial-code="1246" data-country-code="bb"><div className="flag"><div className="iti-flag bb"></div></div><span className="country-name">Barbados</span><span className="dial-code">+1246</span></li><li className="country" data-dial-code="375" data-country-code="by"><div className="flag"><div className="iti-flag by"></div></div><span className="country-name">Belarus (Беларусь)</span><span className="dial-code">+375</span></li><li className="country" data-dial-code="32" data-country-code="be"><div className="flag"><div className="iti-flag be"></div></div><span className="country-name">Belgium (België)</span><span className="dial-code">+32</span></li><li className="country" data-dial-code="501" data-country-code="bz"><div className="flag"><div className="iti-flag bz"></div></div><span className="country-name">Belize</span><span className="dial-code">+501</span></li><li className="country" data-dial-code="229" data-country-code="bj"><div className="flag"><div className="iti-flag bj"></div></div><span className="country-name">Benin (Bénin)</span><span className="dial-code">+229</span></li><li className="country" data-dial-code="1441" data-country-code="bm"><div className="flag"><div className="iti-flag bm"></div></div><span className="country-name">Bermuda</span><span className="dial-code">+1441</span></li><li className="country" data-dial-code="975" data-country-code="bt"><div className="flag"><div className="iti-flag bt"></div></div><span className="country-name">Bhutan (འབྲུག)</span><span className="dial-code">+975</span></li><li className="country" data-dial-code="591" data-country-code="bo"><div className="flag"><div className="iti-flag bo"></div></div><span className="country-name">Bolivia</span><span className="dial-code">+591</span></li><li className="country" data-dial-code="387" data-country-code="ba"><div className="flag"><div className="iti-flag ba"></div></div><span className="country-name">Bosnia and Herzegovina (Босна и Херцеговина)</span><span className="dial-code">+387</span></li><li className="country" data-dial-code="267" data-country-code="bw"><div className="flag"><div className="iti-flag bw"></div></div><span className="country-name">Botswana</span><span className="dial-code">+267</span></li><li className="country" data-dial-code="55" data-country-code="br"><div className="flag"><div className="iti-flag br"></div></div><span className="country-name">Brazil (Brasil)</span><span className="dial-code">+55</span></li><li className="country" data-dial-code="246" data-country-code="io"><div className="flag"><div className="iti-flag io"></div></div><span className="country-name">British Indian Ocean Territory</span><span className="dial-code">+246</span></li><li className="country" data-dial-code="1284" data-country-code="vg"><div className="flag"><div className="iti-flag vg"></div></div><span className="country-name">British Virgin Islands</span><span className="dial-code">+1284</span></li><li className="country" data-dial-code="673" data-country-code="bn"><div className="flag"><div className="iti-flag bn"></div></div><span className="country-name">Brunei</span><span className="dial-code">+673</span></li><li className="country" data-dial-code="359" data-country-code="bg"><div className="flag"><div className="iti-flag bg"></div></div><span className="country-name">Bulgaria (България)</span><span className="dial-code">+359</span></li><li className="country" data-dial-code="226" data-country-code="bf"><div className="flag"><div className="iti-flag bf"></div></div><span className="country-name">Burkina Faso</span><span className="dial-code">+226</span></li><li className="country" data-dial-code="257" data-country-code="bi"><div className="flag"><div className="iti-flag bi"></div></div><span className="country-name">Burundi (Uburundi)</span><span className="dial-code">+257</span></li><li className="country" data-dial-code="855" data-country-code="kh"><div className="flag"><div className="iti-flag kh"></div></div><span className="country-name">Cambodia (កម្ពុជា)</span><span className="dial-code">+855</span></li><li className="country" data-dial-code="237" data-country-code="cm"><div className="flag"><div className="iti-flag cm"></div></div><span className="country-name">Cameroon (Cameroun)</span><span className="dial-code">+237</span></li><li className="country" data-dial-code="1" data-country-code="ca"><div className="flag"><div className="iti-flag ca"></div></div><span className="country-name">Canada</span><span className="dial-code">+1</span></li><li className="country" data-dial-code="238" data-country-code="cv"><div className="flag"><div className="iti-flag cv"></div></div><span className="country-name">Cape Verde (Kabu Verdi)</span><span className="dial-code">+238</span></li><li className="country" data-dial-code="599" data-country-code="bq"><div className="flag"><div className="iti-flag bq"></div></div><span className="country-name">Caribbean Netherlands</span><span className="dial-code">+599</span></li><li className="country" data-dial-code="1345" data-country-code="ky"><div className="flag"><div className="iti-flag ky"></div></div><span className="country-name">Cayman Islands</span><span className="dial-code">+1345</span></li><li className="country" data-dial-code="236" data-country-code="cf"><div className="flag"><div className="iti-flag cf"></div></div><span className="country-name">Central African Republic (République centrafricaine)</span><span className="dial-code">+236</span></li><li className="country" data-dial-code="235" data-country-code="td"><div className="flag"><div className="iti-flag td"></div></div><span className="country-name">Chad (Tchad)</span><span className="dial-code">+235</span></li><li className="country" data-dial-code="56" data-country-code="cl"><div className="flag"><div className="iti-flag cl"></div></div><span className="country-name">Chile</span><span className="dial-code">+56</span></li><li className="country" data-dial-code="86" data-country-code="cn"><div className="flag"><div className="iti-flag cn"></div></div><span className="country-name">China (中国)</span><span className="dial-code">+86</span></li><li className="country" data-dial-code="57" data-country-code="co"><div className="flag"><div className="iti-flag co"></div></div><span className="country-name">Colombia</span><span className="dial-code">+57</span></li><li className="country" data-dial-code="269" data-country-code="km"><div className="flag"><div className="iti-flag km"></div></div><span className="country-name">Comoros (‫جزر القمر‬‎)</span><span className="dial-code">+269</span></li><li className="country" data-dial-code="243" data-country-code="cd"><div className="flag"><div className="iti-flag cd"></div></div><span className="country-name">Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)</span><span className="dial-code">+243</span></li><li className="country" data-dial-code="242" data-country-code="cg"><div className="flag"><div className="iti-flag cg"></div></div><span className="country-name">Congo (Republic) (Congo-Brazzaville)</span><span className="dial-code">+242</span></li><li className="country" data-dial-code="682" data-country-code="ck"><div className="flag"><div className="iti-flag ck"></div></div><span className="country-name">Cook Islands</span><span className="dial-code">+682</span></li><li className="country" data-dial-code="506" data-country-code="cr"><div className="flag"><div className="iti-flag cr"></div></div><span className="country-name">Costa Rica</span><span className="dial-code">+506</span></li><li className="country" data-dial-code="225" data-country-code="ci"><div className="flag"><div className="iti-flag ci"></div></div><span className="country-name">Côte d’Ivoire</span><span className="dial-code">+225</span></li><li className="country" data-dial-code="385" data-country-code="hr"><div className="flag"><div className="iti-flag hr"></div></div><span className="country-name">Croatia (Hrvatska)</span><span className="dial-code">+385</span></li><li className="country" data-dial-code="53" data-country-code="cu"><div className="flag"><div className="iti-flag cu"></div></div><span className="country-name">Cuba</span><span className="dial-code">+53</span></li><li className="country" data-dial-code="599" data-country-code="cw"><div className="flag"><div className="iti-flag cw"></div></div><span className="country-name">Curaçao</span><span className="dial-code">+599</span></li><li className="country" data-dial-code="357" data-country-code="cy"><div className="flag"><div className="iti-flag cy"></div></div><span className="country-name">Cyprus (Κύπρος)</span><span className="dial-code">+357</span></li><li className="country" data-dial-code="420" data-country-code="cz"><div className="flag"><div className="iti-flag cz"></div></div><span className="country-name">Czech Republic (Česká republika)</span><span className="dial-code">+420</span></li><li className="country" data-dial-code="45" data-country-code="dk"><div className="flag"><div className="iti-flag dk"></div></div><span className="country-name">Denmark (Danmark)</span><span className="dial-code">+45</span></li><li className="country" data-dial-code="253" data-country-code="dj"><div className="flag"><div className="iti-flag dj"></div></div><span className="country-name">Djibouti</span><span className="dial-code">+253</span></li><li className="country" data-dial-code="1767" data-country-code="dm"><div className="flag"><div className="iti-flag dm"></div></div><span className="country-name">Dominica</span><span className="dial-code">+1767</span></li><li className="country" data-dial-code="1" data-country-code="do"><div className="flag"><div className="iti-flag do"></div></div><span className="country-name">Dominican Republic (República Dominicana)</span><span className="dial-code">+1</span></li><li className="country" data-dial-code="593" data-country-code="ec"><div className="flag"><div className="iti-flag ec"></div></div><span className="country-name">Ecuador</span><span className="dial-code">+593</span></li><li className="country" data-dial-code="20" data-country-code="eg"><div className="flag"><div className="iti-flag eg"></div></div><span className="country-name">Egypt (‫مصر‬‎)</span><span className="dial-code">+20</span></li><li className="country" data-dial-code="503" data-country-code="sv"><div className="flag"><div className="iti-flag sv"></div></div><span className="country-name">El Salvador</span><span className="dial-code">+503</span></li><li className="country" data-dial-code="240" data-country-code="gq"><div className="flag"><div className="iti-flag gq"></div></div><span className="country-name">Equatorial Guinea (Guinea Ecuatorial)</span><span className="dial-code">+240</span></li><li className="country" data-dial-code="291" data-country-code="er"><div className="flag"><div className="iti-flag er"></div></div><span className="country-name">Eritrea</span><span className="dial-code">+291</span></li><li className="country" data-dial-code="372" data-country-code="ee"><div className="flag"><div className="iti-flag ee"></div></div><span className="country-name">Estonia (Eesti)</span><span className="dial-code">+372</span></li><li className="country" data-dial-code="251" data-country-code="et"><div className="flag"><div className="iti-flag et"></div></div><span className="country-name">Ethiopia</span><span className="dial-code">+251</span></li><li className="country" data-dial-code="500" data-country-code="fk"><div className="flag"><div className="iti-flag fk"></div></div><span className="country-name">Falkland Islands (Islas Malvinas)</span><span className="dial-code">+500</span></li><li className="country" data-dial-code="298" data-country-code="fo"><div className="flag"><div className="iti-flag fo"></div></div><span className="country-name">Faroe Islands (Føroyar)</span><span className="dial-code">+298</span></li><li className="country" data-dial-code="679" data-country-code="fj"><div className="flag"><div className="iti-flag fj"></div></div><span className="country-name">Fiji</span><span className="dial-code">+679</span></li><li className="country" data-dial-code="358" data-country-code="fi"><div className="flag"><div className="iti-flag fi"></div></div><span className="country-name">Finland (Suomi)</span><span className="dial-code">+358</span></li><li className="country" data-dial-code="33" data-country-code="fr"><div className="flag"><div className="iti-flag fr"></div></div><span className="country-name">France</span><span className="dial-code">+33</span></li><li className="country" data-dial-code="594" data-country-code="gf"><div className="flag"><div className="iti-flag gf"></div></div><span className="country-name">French Guiana (Guyane française)</span><span className="dial-code">+594</span></li><li className="country" data-dial-code="689" data-country-code="pf"><div className="flag"><div className="iti-flag pf"></div></div><span className="country-name">French Polynesia (Polynésie française)</span><span className="dial-code">+689</span></li><li className="country" data-dial-code="241" data-country-code="ga"><div className="flag"><div className="iti-flag ga"></div></div><span className="country-name">Gabon</span><span className="dial-code">+241</span></li><li className="country" data-dial-code="220" data-country-code="gm"><div className="flag"><div className="iti-flag gm"></div></div><span className="country-name">Gambia</span><span className="dial-code">+220</span></li><li className="country" data-dial-code="995" data-country-code="ge"><div className="flag"><div className="iti-flag ge"></div></div><span className="country-name">Georgia (საქართველო)</span><span className="dial-code">+995</span></li><li className="country" data-dial-code="49" data-country-code="de"><div className="flag"><div className="iti-flag de"></div></div><span className="country-name">Germany (Deutschland)</span><span className="dial-code">+49</span></li><li className="country" data-dial-code="233" data-country-code="gh"><div className="flag"><div className="iti-flag gh"></div></div><span className="country-name">Ghana (Gaana)</span><span className="dial-code">+233</span></li><li className="country" data-dial-code="350" data-country-code="gi"><div className="flag"><div className="iti-flag gi"></div></div><span className="country-name">Gibraltar</span><span className="dial-code">+350</span></li><li className="country" data-dial-code="30" data-country-code="gr"><div className="flag"><div className="iti-flag gr"></div></div><span className="country-name">Greece (Ελλάδα)</span><span className="dial-code">+30</span></li><li className="country" data-dial-code="299" data-country-code="gl"><div className="flag"><div className="iti-flag gl"></div></div><span className="country-name">Greenland (Kalaallit Nunaat)</span><span className="dial-code">+299</span></li><li className="country" data-dial-code="1473" data-country-code="gd"><div className="flag"><div className="iti-flag gd"></div></div><span className="country-name">Grenada</span><span className="dial-code">+1473</span></li><li className="country" data-dial-code="590" data-country-code="gp"><div className="flag"><div className="iti-flag gp"></div></div><span className="country-name">Guadeloupe</span><span className="dial-code">+590</span></li><li className="country" data-dial-code="1671" data-country-code="gu"><div className="flag"><div className="iti-flag gu"></div></div><span className="country-name">Guam</span><span className="dial-code">+1671</span></li><li className="country" data-dial-code="502" data-country-code="gt"><div className="flag"><div className="iti-flag gt"></div></div><span className="country-name">Guatemala</span><span className="dial-code">+502</span></li><li className="country" data-dial-code="224" data-country-code="gn"><div className="flag"><div className="iti-flag gn"></div></div><span className="country-name">Guinea (Guinée)</span><span className="dial-code">+224</span></li><li className="country" data-dial-code="245" data-country-code="gw"><div className="flag"><div className="iti-flag gw"></div></div><span className="country-name">Guinea-Bissau (Guiné Bissau)</span><span className="dial-code">+245</span></li><li className="country" data-dial-code="592" data-country-code="gy"><div className="flag"><div className="iti-flag gy"></div></div><span className="country-name">Guyana</span><span className="dial-code">+592</span></li><li className="country" data-dial-code="509" data-country-code="ht"><div className="flag"><div className="iti-flag ht"></div></div><span className="country-name">Haiti</span><span className="dial-code">+509</span></li><li className="country" data-dial-code="504" data-country-code="hn"><div className="flag"><div className="iti-flag hn"></div></div><span className="country-name">Honduras</span><span className="dial-code">+504</span></li><li className="country" data-dial-code="852" data-country-code="hk"><div className="flag"><div className="iti-flag hk"></div></div><span className="country-name">Hong Kong (香港)</span><span className="dial-code">+852</span></li><li className="country" data-dial-code="36" data-country-code="hu"><div className="flag"><div className="iti-flag hu"></div></div><span className="country-name">Hungary (Magyarország)</span><span className="dial-code">+36</span></li><li className="country" data-dial-code="354" data-country-code="is"><div className="flag"><div className="iti-flag is"></div></div><span className="country-name">Iceland (Ísland)</span><span className="dial-code">+354</span></li><li className="country" data-dial-code="91" data-country-code="in"><div className="flag"><div className="iti-flag in"></div></div><span className="country-name">India (भारत)</span><span className="dial-code">+91</span></li><li className="country" data-dial-code="62" data-country-code="id"><div className="flag"><div className="iti-flag id"></div></div><span className="country-name">Indonesia</span><span className="dial-code">+62</span></li><li className="country" data-dial-code="98" data-country-code="ir"><div className="flag"><div className="iti-flag ir"></div></div><span className="country-name">Iran (‫ایران‬‎)</span><span className="dial-code">+98</span></li><li className="country" data-dial-code="964" data-country-code="iq"><div className="flag"><div className="iti-flag iq"></div></div><span className="country-name">Iraq (‫العراق‬‎)</span><span className="dial-code">+964</span></li><li className="country" data-dial-code="353" data-country-code="ie"><div className="flag"><div className="iti-flag ie"></div></div><span className="country-name">Ireland</span><span className="dial-code">+353</span></li><li className="country" data-dial-code="972" data-country-code="il"><div className="flag"><div className="iti-flag il"></div></div><span className="country-name">Israel (‫ישראל‬‎)</span><span className="dial-code">+972</span></li><li className="country" data-dial-code="39" data-country-code="it"><div className="flag"><div className="iti-flag it"></div></div><span className="country-name">Italy (Italia)</span><span className="dial-code">+39</span></li><li className="country" data-dial-code="1876" data-country-code="jm"><div className="flag"><div className="iti-flag jm"></div></div><span className="country-name">Jamaica</span><span className="dial-code">+1876</span></li><li className="country" data-dial-code="81" data-country-code="jp"><div className="flag"><div className="iti-flag jp"></div></div><span className="country-name">Japan (日本)</span><span className="dial-code">+81</span></li><li className="country" data-dial-code="962" data-country-code="jo"><div className="flag"><div className="iti-flag jo"></div></div><span className="country-name">Jordan (‫الأردن‬‎)</span><span className="dial-code">+962</span></li><li className="country" data-dial-code="7" data-country-code="kz"><div className="flag"><div className="iti-flag kz"></div></div><span className="country-name">Kazakhstan (Казахстан)</span><span className="dial-code">+7</span></li><li className="country" data-dial-code="254" data-country-code="ke"><div className="flag"><div className="iti-flag ke"></div></div><span className="country-name">Kenya</span><span className="dial-code">+254</span></li><li className="country" data-dial-code="686" data-country-code="ki"><div className="flag"><div className="iti-flag ki"></div></div><span className="country-name">Kiribati</span><span className="dial-code">+686</span></li><li className="country" data-dial-code="965" data-country-code="kw"><div className="flag"><div className="iti-flag kw"></div></div><span className="country-name">Kuwait (‫الكويت‬‎)</span><span className="dial-code">+965</span></li><li className="country" data-dial-code="996" data-country-code="kg"><div className="flag"><div className="iti-flag kg"></div></div><span className="country-name">Kyrgyzstan (Кыргызстан)</span><span className="dial-code">+996</span></li><li className="country" data-dial-code="856" data-country-code="la"><div className="flag"><div className="iti-flag la"></div></div><span className="country-name">Laos (ລາວ)</span><span className="dial-code">+856</span></li><li className="country" data-dial-code="371" data-country-code="lv"><div className="flag"><div className="iti-flag lv"></div></div><span className="country-name">Latvia (Latvija)</span><span className="dial-code">+371</span></li><li className="country" data-dial-code="961" data-country-code="lb"><div className="flag"><div className="iti-flag lb"></div></div><span className="country-name">Lebanon (‫لبنان‬‎)</span><span className="dial-code">+961</span></li><li className="country" data-dial-code="266" data-country-code="ls"><div className="flag"><div className="iti-flag ls"></div></div><span className="country-name">Lesotho</span><span className="dial-code">+266</span></li><li className="country" data-dial-code="231" data-country-code="lr"><div className="flag"><div className="iti-flag lr"></div></div><span className="country-name">Liberia</span><span className="dial-code">+231</span></li><li className="country" data-dial-code="218" data-country-code="ly"><div className="flag"><div className="iti-flag ly"></div></div><span className="country-name">Libya (‫ليبيا‬‎)</span><span className="dial-code">+218</span></li><li className="country" data-dial-code="423" data-country-code="li"><div className="flag"><div className="iti-flag li"></div></div><span className="country-name">Liechtenstein</span><span className="dial-code">+423</span></li><li className="country" data-dial-code="370" data-country-code="lt"><div className="flag"><div className="iti-flag lt"></div></div><span className="country-name">Lithuania (Lietuva)</span><span className="dial-code">+370</span></li><li className="country" data-dial-code="352" data-country-code="lu"><div className="flag"><div className="iti-flag lu"></div></div><span className="country-name">Luxembourg</span><span className="dial-code">+352</span></li><li className="country" data-dial-code="853" data-country-code="mo"><div className="flag"><div className="iti-flag mo"></div></div><span className="country-name">Macau (澳門)</span><span className="dial-code">+853</span></li><li className="country" data-dial-code="389" data-country-code="mk"><div className="flag"><div className="iti-flag mk"></div></div><span className="country-name">Macedonia (FYROM) (Македонија)</span><span className="dial-code">+389</span></li><li className="country" data-dial-code="261" data-country-code="mg"><div className="flag"><div className="iti-flag mg"></div></div><span className="country-name">Madagascar (Madagasikara)</span><span className="dial-code">+261</span></li><li className="country" data-dial-code="265" data-country-code="mw"><div className="flag"><div className="iti-flag mw"></div></div><span className="country-name">Malawi</span><span className="dial-code">+265</span></li><li className="country" data-dial-code="60" data-country-code="my"><div className="flag"><div className="iti-flag my"></div></div><span className="country-name">Malaysia</span><span className="dial-code">+60</span></li><li className="country" data-dial-code="960" data-country-code="mv"><div className="flag"><div className="iti-flag mv"></div></div><span className="country-name">Maldives</span><span className="dial-code">+960</span></li><li className="country" data-dial-code="223" data-country-code="ml"><div className="flag"><div className="iti-flag ml"></div></div><span className="country-name">Mali</span><span className="dial-code">+223</span></li><li className="country" data-dial-code="356" data-country-code="mt"><div className="flag"><div className="iti-flag mt"></div></div><span className="country-name">Malta</span><span className="dial-code">+356</span></li><li className="country" data-dial-code="692" data-country-code="mh"><div className="flag"><div className="iti-flag mh"></div></div><span className="country-name">Marshall Islands</span><span className="dial-code">+692</span></li><li className="country" data-dial-code="596" data-country-code="mq"><div className="flag"><div className="iti-flag mq"></div></div><span className="country-name">Martinique</span><span className="dial-code">+596</span></li><li className="country" data-dial-code="222" data-country-code="mr"><div className="flag"><div className="iti-flag mr"></div></div><span className="country-name">Mauritania (‫موريتانيا‬‎)</span><span className="dial-code">+222</span></li><li className="country" data-dial-code="230" data-country-code="mu"><div className="flag"><div className="iti-flag mu"></div></div><span className="country-name">Mauritius (Moris)</span><span className="dial-code">+230</span></li><li className="country" data-dial-code="52" data-country-code="mx"><div className="flag"><div className="iti-flag mx"></div></div><span className="country-name">Mexico (México)</span><span className="dial-code">+52</span></li><li className="country" data-dial-code="691" data-country-code="fm"><div className="flag"><div className="iti-flag fm"></div></div><span className="country-name">Micronesia</span><span className="dial-code">+691</span></li><li className="country" data-dial-code="373" data-country-code="md"><div className="flag"><div className="iti-flag md"></div></div><span className="country-name">Moldova (Republica Moldova)</span><span className="dial-code">+373</span></li><li className="country" data-dial-code="377" data-country-code="mc"><div className="flag"><div className="iti-flag mc"></div></div><span className="country-name">Monaco</span><span className="dial-code">+377</span></li><li className="country" data-dial-code="976" data-country-code="mn"><div className="flag"><div className="iti-flag mn"></div></div><span className="country-name">Mongolia (Монгол)</span><span className="dial-code">+976</span></li><li className="country" data-dial-code="382" data-country-code="me"><div className="flag"><div className="iti-flag me"></div></div><span className="country-name">Montenegro (Crna Gora)</span><span className="dial-code">+382</span></li><li className="country" data-dial-code="1664" data-country-code="ms"><div className="flag"><div className="iti-flag ms"></div></div><span className="country-name">Montserrat</span><span className="dial-code">+1664</span></li><li className="country" data-dial-code="212" data-country-code="ma"><div className="flag"><div className="iti-flag ma"></div></div><span className="country-name">Morocco (‫المغرب‬‎)</span><span className="dial-code">+212</span></li><li className="country" data-dial-code="258" data-country-code="mz"><div className="flag"><div className="iti-flag mz"></div></div><span className="country-name">Mozambique (Moçambique)</span><span className="dial-code">+258</span></li><li className="country" data-dial-code="95" data-country-code="mm"><div className="flag"><div className="iti-flag mm"></div></div><span className="country-name">Myanmar (Burma) (မြန်မာ)</span><span className="dial-code">+95</span></li><li className="country" data-dial-code="264" data-country-code="na"><div className="flag"><div className="iti-flag na"></div></div><span className="country-name">Namibia (Namibië)</span><span className="dial-code">+264</span></li><li className="country" data-dial-code="674" data-country-code="nr"><div className="flag"><div className="iti-flag nr"></div></div><span className="country-name">Nauru</span><span className="dial-code">+674</span></li><li className="country" data-dial-code="977" data-country-code="np"><div className="flag"><div className="iti-flag np"></div></div><span className="country-name">Nepal (नेपाल)</span><span className="dial-code">+977</span></li><li className="country" data-dial-code="31" data-country-code="nl"><div className="flag"><div className="iti-flag nl"></div></div><span className="country-name">Netherlands (Nederland)</span><span className="dial-code">+31</span></li><li className="country" data-dial-code="687" data-country-code="nc"><div className="flag"><div className="iti-flag nc"></div></div><span className="country-name">New Caledonia (Nouvelle-Calédonie)</span><span className="dial-code">+687</span></li><li className="country" data-dial-code="64" data-country-code="nz"><div className="flag"><div className="iti-flag nz"></div></div><span className="country-name">New Zealand</span><span className="dial-code">+64</span></li><li className="country" data-dial-code="505" data-country-code="ni"><div className="flag"><div className="iti-flag ni"></div></div><span className="country-name">Nicaragua</span><span className="dial-code">+505</span></li><li className="country" data-dial-code="227" data-country-code="ne"><div className="flag"><div className="iti-flag ne"></div></div><span className="country-name">Niger (Nijar)</span><span className="dial-code">+227</span></li><li className="country" data-dial-code="234" data-country-code="ng"><div className="flag"><div className="iti-flag ng"></div></div><span className="country-name">Nigeria</span><span className="dial-code">+234</span></li><li className="country" data-dial-code="683" data-country-code="nu"><div className="flag"><div className="iti-flag nu"></div></div><span className="country-name">Niue</span><span className="dial-code">+683</span></li><li className="country" data-dial-code="672" data-country-code="nf"><div className="flag"><div className="iti-flag nf"></div></div><span className="country-name">Norfolk Island</span><span className="dial-code">+672</span></li><li className="country" data-dial-code="850" data-country-code="kp"><div className="flag"><div className="iti-flag kp"></div></div><span className="country-name">North Korea (조선 민주주의 인민 공화국)</span><span className="dial-code">+850</span></li><li className="country" data-dial-code="1670" data-country-code="mp"><div className="flag"><div className="iti-flag mp"></div></div><span className="country-name">Northern Mariana Islands</span><span className="dial-code">+1670</span></li><li className="country" data-dial-code="47" data-country-code="no"><div className="flag"><div className="iti-flag no"></div></div><span className="country-name">Norway (Norge)</span><span className="dial-code">+47</span></li><li className="country" data-dial-code="968" data-country-code="om"><div className="flag"><div className="iti-flag om"></div></div><span className="country-name">Oman (‫عُمان‬‎)</span><span className="dial-code">+968</span></li><li className="country" data-dial-code="92" data-country-code="pk"><div className="flag"><div className="iti-flag pk"></div></div><span className="country-name">Pakistan (‫پاکستان‬‎)</span><span className="dial-code">+92</span></li><li className="country" data-dial-code="680" data-country-code="pw"><div className="flag"><div className="iti-flag pw"></div></div><span className="country-name">Palau</span><span className="dial-code">+680</span></li><li className="country" data-dial-code="970" data-country-code="ps"><div className="flag"><div className="iti-flag ps"></div></div><span className="country-name">Palestine (‫فلسطين‬‎)</span><span className="dial-code">+970</span></li><li className="country" data-dial-code="507" data-country-code="pa"><div className="flag"><div className="iti-flag pa"></div></div><span className="country-name">Panama (Panamá)</span><span className="dial-code">+507</span></li><li className="country" data-dial-code="675" data-country-code="pg"><div className="flag"><div className="iti-flag pg"></div></div><span className="country-name">Papua New Guinea</span><span className="dial-code">+675</span></li><li className="country" data-dial-code="595" data-country-code="py"><div className="flag"><div className="iti-flag py"></div></div><span className="country-name">Paraguay</span><span className="dial-code">+595</span></li><li className="country" data-dial-code="51" data-country-code="pe"><div className="flag"><div className="iti-flag pe"></div></div><span className="country-name">Peru (Perú)</span><span className="dial-code">+51</span></li><li className="country" data-dial-code="63" data-country-code="ph"><div className="flag"><div className="iti-flag ph"></div></div><span className="country-name">Philippines</span><span className="dial-code">+63</span></li><li className="country" data-dial-code="48" data-country-code="pl"><div className="flag"><div className="iti-flag pl"></div></div><span className="country-name">Poland (Polska)</span><span className="dial-code">+48</span></li><li className="country" data-dial-code="351" data-country-code="pt"><div className="flag"><div className="iti-flag pt"></div></div><span className="country-name">Portugal</span><span className="dial-code">+351</span></li><li className="country" data-dial-code="1" data-country-code="pr"><div className="flag"><div className="iti-flag pr"></div></div><span className="country-name">Puerto Rico</span><span className="dial-code">+1</span></li><li className="country" data-dial-code="974" data-country-code="qa"><div className="flag"><div className="iti-flag qa"></div></div><span className="country-name">Qatar (‫قطر‬‎)</span><span className="dial-code">+974</span></li><li className="country" data-dial-code="262" data-country-code="re"><div className="flag"><div className="iti-flag re"></div></div><span className="country-name">Réunion (La Réunion)</span><span className="dial-code">+262</span></li><li className="country" data-dial-code="40" data-country-code="ro"><div className="flag"><div className="iti-flag ro"></div></div><span className="country-name">Romania (România)</span><span className="dial-code">+40</span></li><li className="country" data-dial-code="7" data-country-code="ru"><div className="flag"><div className="iti-flag ru"></div></div><span className="country-name">Russia (Россия)</span><span className="dial-code">+7</span></li><li className="country" data-dial-code="250" data-country-code="rw"><div className="flag"><div className="iti-flag rw"></div></div><span className="country-name">Rwanda</span><span className="dial-code">+250</span></li><li className="country" data-dial-code="590" data-country-code="bl"><div className="flag"><div className="iti-flag bl"></div></div><span className="country-name">Saint Barthélemy (Saint-Barthélemy)</span><span className="dial-code">+590</span></li><li className="country" data-dial-code="290" data-country-code="sh"><div className="flag"><div className="iti-flag sh"></div></div><span className="country-name">Saint Helena</span><span className="dial-code">+290</span></li><li className="country" data-dial-code="1869" data-country-code="kn"><div className="flag"><div className="iti-flag kn"></div></div><span className="country-name">Saint Kitts and Nevis</span><span className="dial-code">+1869</span></li><li className="country" data-dial-code="1758" data-country-code="lc"><div className="flag"><div className="iti-flag lc"></div></div><span className="country-name">Saint Lucia</span><span className="dial-code">+1758</span></li><li className="country" data-dial-code="590" data-country-code="mf"><div className="flag"><div className="iti-flag mf"></div></div><span className="country-name">Saint Martin (Saint-Martin (partie française))</span><span className="dial-code">+590</span></li><li className="country" data-dial-code="508" data-country-code="pm"><div className="flag"><div className="iti-flag pm"></div></div><span className="country-name">Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)</span><span className="dial-code">+508</span></li><li className="country" data-dial-code="1784" data-country-code="vc"><div className="flag"><div className="iti-flag vc"></div></div><span className="country-name">Saint Vincent and the Grenadines</span><span className="dial-code">+1784</span></li><li className="country" data-dial-code="685" data-country-code="ws"><div className="flag"><div className="iti-flag ws"></div></div><span className="country-name">Samoa</span><span className="dial-code">+685</span></li><li className="country" data-dial-code="378" data-country-code="sm"><div className="flag"><div className="iti-flag sm"></div></div><span className="country-name">San Marino</span><span className="dial-code">+378</span></li><li className="country" data-dial-code="239" data-country-code="st"><div className="flag"><div className="iti-flag st"></div></div><span className="country-name">São Tomé and Príncipe (São Tomé e Príncipe)</span><span className="dial-code">+239</span></li><li className="country" data-dial-code="966" data-country-code="sa"><div className="flag"><div className="iti-flag sa"></div></div><span className="country-name">Saudi Arabia (‫المملكة العربية السعودية‬‎)</span><span className="dial-code">+966</span></li><li className="country" data-dial-code="221" data-country-code="sn"><div className="flag"><div className="iti-flag sn"></div></div><span className="country-name">Senegal (Sénégal)</span><span className="dial-code">+221</span></li><li className="country" data-dial-code="381" data-country-code="rs"><div className="flag"><div className="iti-flag rs"></div></div><span className="country-name">Serbia (Србија)</span><span className="dial-code">+381</span></li><li className="country" data-dial-code="248" data-country-code="sc"><div className="flag"><div className="iti-flag sc"></div></div><span className="country-name">Seychelles</span><span className="dial-code">+248</span></li><li className="country" data-dial-code="232" data-country-code="sl"><div className="flag"><div className="iti-flag sl"></div></div><span className="country-name">Sierra Leone</span><span className="dial-code">+232</span></li><li className="country" data-dial-code="65" data-country-code="sg"><div className="flag"><div className="iti-flag sg"></div></div><span className="country-name">Singapore</span><span className="dial-code">+65</span></li><li className="country" data-dial-code="1721" data-country-code="sx"><div className="flag"><div className="iti-flag sx"></div></div><span className="country-name">Sint Maarten</span><span className="dial-code">+1721</span></li><li className="country" data-dial-code="421" data-country-code="sk"><div className="flag"><div className="iti-flag sk"></div></div><span className="country-name">Slovakia (Slovensko)</span><span className="dial-code">+421</span></li><li className="country" data-dial-code="386" data-country-code="si"><div className="flag"><div className="iti-flag si"></div></div><span className="country-name">Slovenia (Slovenija)</span><span className="dial-code">+386</span></li><li className="country" data-dial-code="677" data-country-code="sb"><div className="flag"><div className="iti-flag sb"></div></div><span className="country-name">Solomon Islands</span><span className="dial-code">+677</span></li><li className="country" data-dial-code="252" data-country-code="so"><div className="flag"><div className="iti-flag so"></div></div><span className="country-name">Somalia (Soomaaliya)</span><span className="dial-code">+252</span></li><li className="country" data-dial-code="27" data-country-code="za"><div className="flag"><div className="iti-flag za"></div></div><span className="country-name">South Africa</span><span className="dial-code">+27</span></li><li className="country" data-dial-code="82" data-country-code="kr"><div className="flag"><div className="iti-flag kr"></div></div><span className="country-name">South Korea (대한민국)</span><span className="dial-code">+82</span></li><li className="country" data-dial-code="211" data-country-code="ss"><div className="flag"><div className="iti-flag ss"></div></div><span className="country-name">South Sudan (‫جنوب السودان‬‎)</span><span className="dial-code">+211</span></li><li className="country" data-dial-code="34" data-country-code="es"><div className="flag"><div className="iti-flag es"></div></div><span className="country-name">Spain (España)</span><span className="dial-code">+34</span></li><li className="country" data-dial-code="94" data-country-code="lk"><div className="flag"><div className="iti-flag lk"></div></div><span className="country-name">Sri Lanka (ශ්‍රී ලංකාව)</span><span className="dial-code">+94</span></li><li className="country" data-dial-code="249" data-country-code="sd"><div className="flag"><div className="iti-flag sd"></div></div><span className="country-name">Sudan (‫السودان‬‎)</span><span className="dial-code">+249</span></li><li className="country" data-dial-code="597" data-country-code="sr"><div className="flag"><div className="iti-flag sr"></div></div><span className="country-name">Suriname</span><span className="dial-code">+597</span></li><li className="country" data-dial-code="268" data-country-code="sz"><div className="flag"><div className="iti-flag sz"></div></div><span className="country-name">Swaziland</span><span className="dial-code">+268</span></li><li className="country" data-dial-code="46" data-country-code="se"><div className="flag"><div className="iti-flag se"></div></div><span className="country-name">Sweden (Sverige)</span><span className="dial-code">+46</span></li><li className="country" data-dial-code="41" data-country-code="ch"><div className="flag"><div className="iti-flag ch"></div></div><span className="country-name">Switzerland (Schweiz)</span><span className="dial-code">+41</span></li><li className="country" data-dial-code="963" data-country-code="sy"><div className="flag"><div className="iti-flag sy"></div></div><span className="country-name">Syria (‫سوريا‬‎)</span><span className="dial-code">+963</span></li><li className="country" data-dial-code="886" data-country-code="tw"><div className="flag"><div className="iti-flag tw"></div></div><span className="country-name">Taiwan (台灣)</span><span className="dial-code">+886</span></li><li className="country" data-dial-code="992" data-country-code="tj"><div className="flag"><div className="iti-flag tj"></div></div><span className="country-name">Tajikistan</span><span className="dial-code">+992</span></li><li className="country" data-dial-code="255" data-country-code="tz"><div className="flag"><div className="iti-flag tz"></div></div><span className="country-name">Tanzania</span><span className="dial-code">+255</span></li><li className="country" data-dial-code="66" data-country-code="th"><div className="flag"><div className="iti-flag th"></div></div><span className="country-name">Thailand (ไทย)</span><span className="dial-code">+66</span></li><li className="country" data-dial-code="670" data-country-code="tl"><div className="flag"><div className="iti-flag tl"></div></div><span className="country-name">Timor-Leste</span><span className="dial-code">+670</span></li><li className="country" data-dial-code="228" data-country-code="tg"><div className="flag"><div className="iti-flag tg"></div></div><span className="country-name">Togo</span><span className="dial-code">+228</span></li><li className="country" data-dial-code="690" data-country-code="tk"><div className="flag"><div className="iti-flag tk"></div></div><span className="country-name">Tokelau</span><span className="dial-code">+690</span></li><li className="country" data-dial-code="676" data-country-code="to"><div className="flag"><div className="iti-flag to"></div></div><span className="country-name">Tonga</span><span className="dial-code">+676</span></li><li className="country" data-dial-code="1868" data-country-code="tt"><div className="flag"><div className="iti-flag tt"></div></div><span className="country-name">Trinidad and Tobago</span><span className="dial-code">+1868</span></li><li className="country" data-dial-code="216" data-country-code="tn"><div className="flag"><div className="iti-flag tn"></div></div><span className="country-name">Tunisia (‫تونس‬‎)</span><span className="dial-code">+216</span></li><li className="country" data-dial-code="90" data-country-code="tr"><div className="flag"><div className="iti-flag tr"></div></div><span className="country-name">Turkey (Türkiye)</span><span className="dial-code">+90</span></li><li className="country" data-dial-code="993" data-country-code="tm"><div className="flag"><div className="iti-flag tm"></div></div><span className="country-name">Turkmenistan</span><span className="dial-code">+993</span></li><li className="country" data-dial-code="1649" data-country-code="tc"><div className="flag"><div className="iti-flag tc"></div></div><span className="country-name">Turks and Caicos Islands</span><span className="dial-code">+1649</span></li><li className="country" data-dial-code="688" data-country-code="tv"><div className="flag"><div className="iti-flag tv"></div></div><span className="country-name">Tuvalu</span><span className="dial-code">+688</span></li><li className="country" data-dial-code="1340" data-country-code="vi"><div className="flag"><div className="iti-flag vi"></div></div><span className="country-name">U.S. Virgin Islands</span><span className="dial-code">+1340</span></li><li className="country" data-dial-code="256" data-country-code="ug"><div className="flag"><div className="iti-flag ug"></div></div><span className="country-name">Uganda</span><span className="dial-code">+256</span></li><li className="country" data-dial-code="380" data-country-code="ua"><div className="flag"><div className="iti-flag ua"></div></div><span className="country-name">Ukraine (Україна)</span><span className="dial-code">+380</span></li><li className="country" data-dial-code="971" data-country-code="ae"><div className="flag"><div className="iti-flag ae"></div></div><span className="country-name">United Arab Emirates (‫الإمارات العربية المتحدة‬‎)</span><span className="dial-code">+971</span></li><li className="country" data-dial-code="44" data-country-code="gb"><div className="flag"><div className="iti-flag gb"></div></div><span className="country-name">United Kingdom</span><span className="dial-code">+44</span></li><li className="country" data-dial-code="1" data-country-code="us"><div className="flag"><div className="iti-flag us"></div></div><span className="country-name">United States</span><span className="dial-code">+1</span></li><li className="country" data-dial-code="598" data-country-code="uy"><div className="flag"><div className="iti-flag uy"></div></div><span className="country-name">Uruguay</span><span className="dial-code">+598</span></li><li className="country" data-dial-code="998" data-country-code="uz"><div className="flag"><div className="iti-flag uz"></div></div><span className="country-name">Uzbekistan (Oʻzbekiston)</span><span className="dial-code">+998</span></li><li className="country" data-dial-code="678" data-country-code="vu"><div className="flag"><div className="iti-flag vu"></div></div><span className="country-name">Vanuatu</span><span className="dial-code">+678</span></li><li className="country" data-dial-code="39" data-country-code="va"><div className="flag"><div className="iti-flag va"></div></div><span className="country-name">Vatican City (Città del Vaticano)</span><span className="dial-code">+39</span></li><li className="country" data-dial-code="58" data-country-code="ve"><div className="flag"><div className="iti-flag ve"></div></div><span className="country-name">Venezuela</span><span className="dial-code">+58</span></li><li className="country" data-dial-code="84" data-country-code="vn"><div className="flag"><div className="iti-flag vn"></div></div><span className="country-name">Vietnam (Việt Nam)</span><span className="dial-code">+84</span></li><li className="country" data-dial-code="681" data-country-code="wf"><div className="flag"><div className="iti-flag wf"></div></div><span className="country-name">Wallis and Futuna</span><span className="dial-code">+681</span></li><li className="country" data-dial-code="967" data-country-code="ye"><div className="flag"><div className="iti-flag ye"></div></div><span className="country-name">Yemen (‫اليمن‬‎)</span><span className="dial-code">+967</span></li><li className="country" data-dial-code="260" data-country-code="zm"><div className="flag"><div className="iti-flag zm"></div></div><span className="country-name">Zambia</span><span className="dial-code">+260</span></li><li className="country" data-dial-code="263" data-country-code="zw"><div className="flag"><div className="iti-flag zw"></div></div><span className="country-name">Zimbabwe</span><span className="dial-code">+263</span></li></ul></div><input type="tel" className="form-control" name="phone" data-component-elm="info[phone]" autocomplete="off"/></div>
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
              <input type="tel" className="form-control" name="card_number" data-component-elm="card[number]"/>
            </div>
            <div className="form-group form-group-card-cvv">
              <label for="">CVV</label>
              <input type="tel" className="form-control" name="card_cvv" data-component-elm="card[cvc]"/>
            </div>
            <div className="form-group form-group-expiration">
              <label for="">Expiration date</label>
              <input type="tel" className="form-control" placeholder="MM" name="card_expiration_month" data-component-elm="card[expire-month]"/>
              /
              <input type="tel" className="form-control" placeholder="YY" name="card_expiration_year" data-component-elm="card[expire-year]"/>
            </div>
          </div>
      </div>
    </fieldset>
  </div>
</section>

<section className="page-section" id="section-checkout-info">
  <div className="container">
    <h2 className="section-header">Checkout Form (existing user)</h2>
    <fieldset className="checkout-info form-vertical" data-component-id="checkout-form" copmonent:view="existing-user">
      <div className="user-info">
        <h3 className="section-title">Your Info</h3>
        <div className="form-group">
          <label for="">Name</label>
          <input value="Jane Doe" type="text" className="form-control" data-component-elm="info[name]"/>
        </div>
        <div className="form-group">
          <label for="">Email</label>
          <input value="jane.doe@missingpeeps.com" type="email" className="form-control" data-component-elm="info[email]"/>
        </div>
        <div className="form-group">
          <label for="">Phone Number</label>
          <input value="(123) 456-7890" type="tel" className="form-control" data-component-elm="info[phone]"/>
        </div>
        <p className="checkout-info-note">We'll email/text you when your meal has arrived!</p>
      </div>
      <div className="payment-info">
        <h3 className="section-title">Payment Info</h3>
          <div className="form-group form-group-cc-selction">
            <label for="">Select a card</label>
            <select name="payment_method_id" className="form-control">
              <option value="1">* 1234 Exp. 07/17</option>
               <option value="2">* 5678 Exp. 11/19</option> 
            </select>
          </div>
          <h4 className="form-group-header">Or, add a new card</h4>
          <div className="form-group form-group-member-name">
            <label for="">Name on card</label>
            <input type="text" className="form-control" name="card_member_name" data-component-elm="card[name]"/>
          </div>
          <div className="inline-form-group-list">
            <div className="form-group form-group-card-number">
              <label for="">Card number</label>
              <input type="tel" className="form-control" name="card_number" data-component-elm="card[number]"/>
            </div>
            <div className="form-group form-group-card-cvv">
              <label for="">CVV</label>
              <input type="tel" className="form-control" name="card_cvv" data-component-elm="card[cvc]"/>
            </div>
            <div className="form-group form-group-expiration">
              <label for="">Expiration date</label>
              <input type="tel" className="form-control" placeholder="MM" name="card_expiration_month" data-component-elm="card[expire-month]"/>
              /
              <input type="tel" className="form-control" placeholder="YY" name="card_expiration_year" data-component-elm="card[expire-year]"/>
            </div>
            <div className="form-group form-group">
              <label>
                <input type="checkbox" name="save_card" checked=""/>
                Save card?
              </label>
            </div>
          </div>
      </div>
    </fieldset>
  </div>
</section>

<section className="page-section" id="section-order-reviewer">
  <div className="container">
    <div className="order-reviewer" data-component-id="checkout-items">
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
            <div className="order-reviewer-item-col price-col" data-component-prop="amount">
              $12.00
            </div>
          </div>
      </div>
    </div>
  </div>
</section>

<section className="page-section" id="section-order-summary">
  <div className="container">
    <div className="order-summary-wrapper" data-component-id="checkout-summary">
      <div className="order-summary">
        <div className="order-summary-item">
          <div className="order-summary-col order-summary-key">Subtotal</div>
          <div className="order-summary-col order-summary-value" data-component-prop="subtotal">$8.80</div>
        </div>
        <div className="order-summary-item">
          <div className="order-summary-col order-summary-key">Tax</div>
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
      <input className="menu-share-input" type="text" value="http://lunchroom.goodybag.com/bazaarvoice" data-component-elm="shareUrl"/>
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