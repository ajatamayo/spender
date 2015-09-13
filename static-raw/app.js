var SPENDER = (function(SPENDER) {

  /**
   * Utility function declarations
   */

  var addClass = function(el, className) {
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
  }

  var removeClass = function(el, className) {
    if (el.classList)
      el.classList.remove(className);
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }

  /**
   * Start of actual cool stuff
   */

  SPENDER.init = function() {
    document.addEventListener('DOMContentLoaded', function () {
      SPENDER.initializeControls();
      SPENDER.initializeStack();
    });
  };

  SPENDER.initializeControls = function() {
    SPENDER.body = document.querySelector('body');
    SPENDER.main_form = document.querySelector('#main-form');
  };

  SPENDER.initializeStack = function() {
    // Prepare the cards in the stack for iteration.
    cards = [].slice.call(document.querySelectorAll('.stack--card'))

    // An instance of the Stack is used to attach event listeners.
    stack = gajus.Swing.Stack();

    cards.forEach(function (targetElement) {
      // Add card element to the Stack.
      stack.createCard(targetElement);
    });

    // Add event listener for when a card is thrown out of the stack.
    stack.on('throwout', SPENDER.onThrowout);

    // Add event listener for when a card is thrown in the stack, including the spring back into place effect.
    stack.on('throwin', SPENDER.onThrowin);

    // Add event listener for when the card is moved to determine what form should be shown below
    stack.on('dragmove', SPENDER.onDragmove);
  };

  SPENDER.onThrowout = function (e) {
    // e.target Reference to the element that has been thrown out of the stack.
    // e.throwDirection Direction in which the element has been thrown (Card.DIRECTION_LEFT, Card.DIRECTION_RIGHT).

    console.log('Card has been thrown out of the stack.');
    console.log('Throw direction: ' + (e.throwDirection == gajus.Swing.Card.DIRECTION_LEFT ? 'left' : 'right'));
  };

  SPENDER.onThrowin = function (e) {
    removeClass(SPENDER.body, 'g-alert');
    removeClass(SPENDER.body, 'g-okaygo');
  };

  SPENDER.onDragmove = function (e) {
    var direction = e.throwDirection == gajus.Swing.Card.DIRECTION_RIGHT ? 'right' : 'left';

    if (direction == 'right') {
      SPENDER.onSwiperight();
    } else {
      SPENDER.onSwipeleft();
    }
  };

  SPENDER.onSwiperight = function() {
    removeClass(SPENDER.body, 'g-alert');
    addClass(SPENDER.body, 'g-okaygo');
    removeClass(SPENDER.main_form, 'stack--form__expense');
    addClass(SPENDER.main_form, 'stack--form__income');
  };

  SPENDER.onSwipeleft = function() {
    removeClass(SPENDER.body, 'g-okaygo');
    addClass(SPENDER.body, 'g-alert');
    removeClass(SPENDER.main_form, 'stack--form__income');
    addClass(SPENDER.main_form, 'stack--form__expense');
  };

  return SPENDER;

}(SPENDER || {}));

SPENDER.init();
