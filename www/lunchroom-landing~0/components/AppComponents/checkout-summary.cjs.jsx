module.exports = function (Context) {
  // TODO: Remove this once we can inject 'React' automatically at build time.
  var React = Context.REACT;
  return (
    <div className="order-summary-wrapper">

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
  );
}