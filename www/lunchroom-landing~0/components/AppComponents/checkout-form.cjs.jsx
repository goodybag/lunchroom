module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <fieldset className="checkout-info form-vertical" copmonent:view="existing-user">

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
  );
}