module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <section className="page-section" id="section-checkout-info">

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
  );
}