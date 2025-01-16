const DEFAULTS = {
  transitionDuration: 100,
  containerSelector: '.members__list',
  itemSelector: '.members__item',
  paginationNumberSelector: '.pagination-slider__slide-number',
  paginationSliderSelector: '.pagination-slider__number-slides',
  slidesAmountVar: '--slides',
  currentSlideVar: '--current'
};

export class MembersSlider {
  constructor(element, controls = []) {
    this._root = element;
    this._options = Object.assign({}, DEFAULTS);
    this._container = element.querySelector(this._options.containerSelector);
    this._count = 1;
    this._setPaginationNumber();
    this._setControls(controls);
    this._reset();
  }

  _setPaginationNumber() {
    this._root.querySelector(this._options.paginationNumberSelector).textContent = this._count;
    this._root.querySelector(this._options.paginationSliderSelector).textContent = this.slides;
  }

  _reset() {
    [this._options.slidesAmountVar, this._options.currentSlideVar].forEach(
      (varName) => {
        this._container.style.setProperty(
          varName,
          this._root.style.getPropertyValue(varName)
        );
      }
    );

    this._timer = null;

    setTimeout(() => {
      this._options.transitionDuration = this._getTransitionDuration();
      this._update();
    });
  }

  _setControls(controls) {
    this.controls = new Map();
    for (const { element, onStateChange, onAction } of controls) {
      this.controls.set(element.name, {
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

    if (this.controls.get('right')) {
      setInterval(() => {
        if (!this._timer) {
          this.controls.get('right').onAction.call(this, {
            action: this.controls.get('right'),
            slider: this
          });
        }
      }, 4000);
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
    this.controls.forEach(({ onStateChange }, element) =>
      onStateChange.call(this, {
        action: element,
        slider: this
      })
    );
    this._timer = null;
  }

  mutate(callback) {
    const buffer = new MembersSlider(this._root.cloneNode(true));
    callback(buffer);

    this._container.replaceWith(buffer._container);
    this._container = buffer._container;
  }

  getSlide(n) {
    return this._root.querySelectorAll(this._options.itemSelector).item(n - 1);
  }

  get slides() {
    return parseInt(this._root.style.getPropertyValue('--slides'));
  }

  set slides(value) {
    this._root.style.setProperty('--slides', value);
  }

  get current() {
    return parseInt(this._container.style.getPropertyValue('--current'));
  }

  set current(value) {
    const delay =
      Math.abs(this.current - value) * this._options.transitionDuration;
    this._container.style.setProperty('--current', value);
    this._timer = setTimeout(this._update.bind(this), delay);
  }

  static actionLeft(button) {
    return {
      element: button,
      onStateChange: ({ slider }) => {
        if (slider.current === 1) {
          slider.mutate((buffer) => {
            const last = buffer.getSlide(buffer.slides);
            last.remove();
            buffer._container.prepend(last);
            buffer.current = 2;
          });
        }
      },
      onAction: ({ slider }) => {
        slider.current = slider.current - 1;
        if (slider._count === 1) {
          slider._count = 6
        } else {
          slider._count--;
        }
        slider._setPaginationNumber();
      }
    };
  }

  static actionRight(button) {
    return {
      element: button,
      onStateChange: ({ slider }) => {
        if (slider.current === slider.slides - 2) {
          slider.mutate((buffer) => {
            const first = buffer.getSlide(1);
            first.remove();
            buffer._container.append(first);
            buffer.current = buffer.slides - 3;
          });
        }
      },
      onAction: ({ slider }) => {
        slider.current = slider.current + 1;
        if (slider._count === slider.slides) {
          slider._count = 1
        } else {
          slider._count++;
        }
        slider._setPaginationNumber();
      }
    };
  }
}