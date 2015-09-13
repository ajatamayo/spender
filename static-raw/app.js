var SPENDER = (function(SPENDER) {

  /**
   * Utility function declarations
   */

  var addClass = function(el, className) {
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
  };

  var removeClass = function(el, className) {
    if (el.classList)
      el.classList.remove(className);
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  };

  var hasClass = function(el, className) {
    if (el.classList)
      return el.classList.contains(className);
    else
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  };

  /**
   * Retrieves element transformation as a matrix
   *
   * Note that this will only take translate and rotate in account,
   * also it always reports px and deg, never % or turn!
   * 
   * @param element
   * @return string matrix
   */
  var cssToMatrix = function(elementId) {
    var element = document.getElementById(elementId),
        style = window.getComputedStyle(element);

    return style.getPropertyValue("-webkit-transform") ||
           style.getPropertyValue("-moz-transform") ||
           style.getPropertyValue("-ms-transform") ||
           style.getPropertyValue("-o-transform") ||
           style.getPropertyValue("transform");
  }

  /**
   * Transforms matrix into an object
   * 
   * @param string matrix
   * @return object
   */
  var matrixToTransformObj = function(matrix) {
    // this happens when there was no rotation yet in CSS
    if(matrix === 'none') {
      matrix = 'matrix(0,0,0,0,0)';
    }
    var obj = {},
        values = matrix.match(/([-+]?[\d\.]+)/g);

    obj.rotate = (Math.round(
      Math.atan2(
        parseFloat(values[1]), 
        parseFloat(values[0])) * (180/Math.PI)) || 0
    ).toString() + 'deg';
    obj.translate = values[5] ? values[4] + 'px, ' + values[5] + 'px' : (values[4] ? values[4] + 'px' : '');

    obj.translateX = values[4] ? parseInt(values[4]) : 0;
    obj.translateY = values[5] ? parseInt(values[5]) : 0;

    return obj;
  }

  /**
   * Start of actual cool stuff
   */

  SPENDER.init = function() {
    document.addEventListener('DOMContentLoaded', function () {
      SPENDER.initializeControls();
      SPENDER.initializeStack();
      SPENDER.initializeFormSubmissionHandlers();
    });
  };

  SPENDER.initializeControls = function() {
    SPENDER.body = document.querySelector('body');
    SPENDER.main_form = document.querySelector('#main-form');
    SPENDER.submit_button = document.querySelector('#submit-button');
    SPENDER.money_input = document.querySelector('#money-input');
  };

  SPENDER.initializeStack = function() {
    // Prepare the cards in the stack for iteration.
    cards = [].slice.call(document.querySelectorAll('.stack--card'))

    // An instance of the Stack is used to attach event listeners.
    stack = gajus.Swing.Stack();

    cards.forEach(function (targetElement) {
      // Add card element to the Stack.
      SPENDER.card = stack.createCard(targetElement);
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

  SPENDER.initializeFormSubmissionHandlers = function() {
    SPENDER.main_form.addEventListener('submit', SPENDER.onFormsubmit);
  };

  SPENDER.onFormsubmit = function(e) {
    console.log('Form was submitted!');

    e.preventDefault();

    SPENDER.processInput();

    SPENDER.throwTheCardBackIn();
  };

  SPENDER.processInput = function() {
    var is_income = hasClass(SPENDER.main_form, 'stack--form__income');
    var value = parseFloat(SPENDER.money_input.value);
    if (isFinite(value)) {
      if (is_income) {
        SPENDER.addIncome(value);
      } else {
        SPENDER.addExpense(value);
      }
    }
    SPENDER.money_input.value = '';
  };

  SPENDER.throwTheCardBackIn = function() {
    var matrix = cssToMatrix('card'),
        transformObj = matrixToTransformObj(matrix);

    SPENDER.card.throwIn(transformObj.translateX, transformObj.translateY);
  };

  SPENDER.addIncome = function(value) {
    var total_incomes = localStorage.getItem('total_incomes');
    if (total_incomes == null) {
      total_incomes = 0;
    } else {
      total_incomes = parseFloat(total_incomes);
    }

    total_incomes += value;
    localStorage.setItem('total_incomes', total_incomes);
  };

  SPENDER.addExpense = function(value) {
    var total_expenses = localStorage.getItem('total_expenses');
    if (total_expenses == null) {
      total_expenses = 0;
    } else {
      total_expenses = parseFloat(total_expenses);
    }
    total_expenses += value;
    localStorage.setItem('total_expenses', total_expenses);
  };

  SPENDER.getTotalIncome = function() {
    var total_incomes = localStorage.getItem('total_incomes');
    if (total_incomes == null) total_incomes = 0;
    return parseFloat(total_incomes);
  };

  SPENDER.getTotalExpenses = function() {
    var total_expenses = localStorage.getItem('total_expenses');
    if (total_expenses == null) total_expenses = 0;
    return parseFloat(total_expenses);
  };

  return SPENDER;

}(SPENDER || {}));

SPENDER.init();
