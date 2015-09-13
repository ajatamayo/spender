document.addEventListener('DOMContentLoaded', function () {
  // Get the stuffs
  body = document.querySelector('body');
  main_form = document.querySelector('#main-form');

  // Prepare the cards in the stack for iteration.
  cards = [].slice.call(document.querySelectorAll('.stack--card'))

  // An instance of the Stack is used to attach event listeners.
  stack = gajus.Swing.Stack();

  cards.forEach(function (targetElement) {
    // Add card element to the Stack.
    stack.createCard(targetElement);
  });

  // Add event listener for when a card is thrown out of the stack.
  stack.on('throwout', function (e) {
    // e.target Reference to the element that has been thrown out of the stack.
    // e.throwDirection Direction in which the element has been thrown (Card.DIRECTION_LEFT, Card.DIRECTION_RIGHT).

    console.log('Card has been thrown out of the stack.');
    console.log('Throw direction: ' + (e.throwDirection == gajus.Swing.Card.DIRECTION_LEFT ? 'left' : 'right'));
  });

  // Add event listener for when a card is thrown in the stack, including the spring back into place effect.
  stack.on('throwin', function (e) {
    removeClass(body, 'g-alert');
    removeClass(body, 'g-okaygo');
  });

  // Add event listener for when the card is moved to determine what form should be shown below
  stack.on('dragmove', function (e) {
    var direction = e.throwDirection == gajus.Swing.Card.DIRECTION_RIGHT ? 'right' : 'left';

    if (direction == 'right') {
      // Like! Income!
      removeClass(body, 'g-alert');
      addClass(body, 'g-okaygo');
      removeClass(body, 'stack--form__expense');
      addClass(body, 'stack--form__income');
    } else {
      // Dislike! Expense!
      removeClass(body, 'g-okaygo');
      addClass(body, 'g-alert');
      removeClass(body, 'stack--form__income');
      addClass(body, 'stack--form__expense');
    }
  });
});

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
