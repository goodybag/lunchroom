(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(function(){
  $('[data-role="popover"]').popover();
  // @component:id checkout-form
  $('[name="card_number"]').payment('formatCardNumber');
  // @component:id checkout-form
  $('[name="card_cvv"]').payment('formatCardCVC');
  // @component:id checkout-form
  $('[name="phone"]').intlTelInput({
    autoFormat: true
  , utilsScript: '/dist/utils.js'
  , preventInvalidNumbers: true
  });
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJChmdW5jdGlvbigpe1xuICAkKCdbZGF0YS1yb2xlPVwicG9wb3ZlclwiXScpLnBvcG92ZXIoKTtcbiAgLy8gQGNvbXBvbmVudDppZCBjaGVja291dC1mb3JtXG4gICQoJ1tuYW1lPVwiY2FyZF9udW1iZXJcIl0nKS5wYXltZW50KCdmb3JtYXRDYXJkTnVtYmVyJyk7XG4gIC8vIEBjb21wb25lbnQ6aWQgY2hlY2tvdXQtZm9ybVxuICAkKCdbbmFtZT1cImNhcmRfY3Z2XCJdJykucGF5bWVudCgnZm9ybWF0Q2FyZENWQycpO1xuICAvLyBAY29tcG9uZW50OmlkIGNoZWNrb3V0LWZvcm1cbiAgJCgnW25hbWU9XCJwaG9uZVwiXScpLmludGxUZWxJbnB1dCh7XG4gICAgYXV0b0Zvcm1hdDogdHJ1ZVxuICAsIHV0aWxzU2NyaXB0OiAnL2Rpc3QvdXRpbHMuanMnXG4gICwgcHJldmVudEludmFsaWROdW1iZXJzOiB0cnVlXG4gIH0pO1xufSk7Il19
