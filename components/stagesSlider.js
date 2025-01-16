const DEFAULTS = {
  transitionDuration: 100,
  containerSelector: '.stages__list',
  itemSelector: '.stages__item',
  paginationItemSelector: '.pagination__item',
  slidesAmountVar: '--slides',
  currentSlideVar: '--current'
};

export class stageSlider {
  constructor(element, controls) {
    this._root = element;
    this._options = Object.assign({}, DEFAULTS);
    this._setControls(controls);
    this._reset();
  }

  _reset() {
    this._container = this._root.querySelector(this._options.containerSelector);

    this._timer = null;

    setTimeout(() => {
      this._options.transitionDuration = this._getTransitionDuration();
      this._update();
    });
  }

  _setControls(controls) {
    this._controls = new Map();
    for (const { element, onStateChange, onAction } of controls) {
      this._controls.set(element, {
        onStateChange,
        onAction
      });

      element.addEventListener("click", (event) => {
        if (!this._timer) {
          onAction.call(this, {
            action: element,
            slider: this,
            event
          });
        }
      });
    }
  }

  _getTransitionDuration() {
    return (
      parseFloat(
        window
          .getComputedStyle(this._container)
          .getPropertyValue("transition-duration")
      ) * 1000
    );
  }

  _update() {
    this._controls.forEach(({ onStateChange }, element) =>
      onStateChange.call(this, {
        action: element,
        slider: this
      })
    );

    const paginationItem = this._root.querySelectorAll(this._options.paginationItemSelector);
    paginationItem.forEach((item) => {
      item.classList.remove('pagination__item_active');
    });
    paginationItem[this.current - 1].classList.add('pagination__item_active');
    
    this._timer = null;
  }

  get slides() {
    return parseInt(this._root.style.getPropertyValue('--slides'));
  }

  get current() {
    return parseInt(this._root.style.getPropertyValue('--current'));
  }

  set current(value) {
    const delay =
      Math.abs(this.current - value) * this._options.transitionDuration;
    this._root.style.setProperty('--current', value);
    this._timer = setTimeout(this._update.bind(this), delay);
  }

  static actionLeft(button) {
    return {
      element: button,
      onStateChange: ({ action, slider }) => {
        action.disabled = slider.current === 1;
        action.disabled ? 
          action.classList.add('button_disabled') : 
          action.classList.remove('button_disabled');
      },
      onAction: ({ slider }) => {
        slider.current = slider.current - 1;
      }
    };
  }

  static actionRight(button) {
    return {
      element: button,
      onStateChange: ({ action, slider }) => {
        action.disabled = slider.current === slider.slides;
        action.disabled ? 
          action.classList.add('button_disabled') : 
          action.classList.remove('button_disabled');

      },
      onAction: ({ slider }) => {
        slider.current = slider.current + 1;
      }
    };
  }
}