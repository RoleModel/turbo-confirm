/**
 * Turbo-Confirm v2.0.2
 * Copyright © 2024 RoleModel Software
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const dispatch = (name, target = document, {bubbles = true, cancelable = true, prefix = 'rms', detail} = {}) => {
  const event = new CustomEvent(`${prefix}:${name}`, {bubbles, cancelable, detail});
  target.dispatchEvent(event);
  return !event.defaultPrevented
};

class TurboConfirmError extends Error {
  name = 'TurboConfirmError'

  static missingDialog(selector, typeError) {
    return new this(`No element matching dialogSelector: '${selector}'`, { cause: typeError })
  }

  static noTurbo() {
    return new this('Turbo is not defined. Be sure to import "@hotwired/turbo-rails" before calling the `start()` function')
  }
}

class ConfirmationController {
  initialContent
  #resolve

  constructor(delegate) {
    this.delegate = delegate;

    this.accept = this.accept.bind(this);
    this.deny = this.deny.bind(this);
  }

  showConfirm(contentMap) {
    this.#storeInitialContent();

    for(const [selector, content] of Object.entries(contentMap)) {
      const target = this.element.querySelector(selector);
      if (target && content) target.innerHTML = content;
    }

    this.#setupListeners();
    this.delegate.showConfirm(this.element);

    return new Promise(resolve => this.#resolve = resolve)
  }

  accept() {
    this.#resolve(true);
    this.#teardown();
  }

  deny() {
    this.#resolve(false);
    this.#teardown();
  }

  get acceptButtons() {
    return this.element.querySelectorAll(this.delegate.acceptSelector)
  }

  get denyButtons() {
    return this.element.querySelectorAll(this.delegate.denySelector)
  }

  get element() {
    return document.querySelector(this.delegate.dialogSelector)
  }

  #teardown() {
    this.#resolve = null;
    this.delegate.hideConfirm(this.element);
    this.#teardownListeners();

    setTimeout(this.#restoreInitialContent.bind(this), this.delegate.animationDuration);
  }

  #setupListeners() {
    this.acceptButtons.forEach(element => element.addEventListener('click', this.accept));
    this.denyButtons.forEach(element => element.addEventListener('click', this.deny));
    this.element.addEventListener('cancel', this.deny);
  }

  #teardownListeners() {
    this.acceptButtons.forEach(element => element.removeEventListener('click', this.accept));
    this.denyButtons.forEach(element => element.removeEventListener('click', this.deny));
    this.element.removeEventListener('cancel', this.deny);
  }

  #storeInitialContent() {
    try {
      this.initialContent = this.element.innerHTML;
    } catch (error) {
      throw TurboConfirmError.missingDialog(this.delegate.dialogSelector, error)
    }
  }

  #restoreInitialContent() {
    try {
      this.element.innerHTML = this.initialContent;
    } catch {
      /**
       * this happens when accepting the confirmation challenge results in visiting a page
       * without a confirmation template. If one is truly needed on the new page, a helpful
       * error message will be thrown on the next go round (during #storeInitialContent).
       */
    }
  }
}

class TurboConfirm {
  #controller
  #config = {
    dialogSelector: '#confirm',
    activeClass: 'modal--active',
    acceptSelector: '#confirm-accept',
    denySelector: '.confirm-cancel',
    animationDuration: 300,
    showConfirmCallback: element => element.showModal && element.showModal(),
    hideConfirmCallback: element => element.close && element.close(),
    messageSlotSelector: '#confirm-title',
    contentSlots: {
      body: {
        contentAttribute: 'confirm-details',
        slotSelector: '#confirm-body'
      },
      acceptText: {
        contentAttribute: 'confirm-button',
        slotSelector: '#confirm-accept'
      }
    }
  }

  constructor(options = {}) {
    for(const [key, value] of Object.entries(options)) {
      this.#config[key] = value;
    }

    this.#controller = new ConfirmationController(this);
  }

  /**
   * Present a confirmation challenge to the user.
   * @public
   * @param {string} [message] - The main challenge message; Value of `data-turbo-confirm` attribute.
   * @param {HTMLFormElement} [_formElement] - (ignored) `form` element that contains the submitter.
   * @param {HTMLElement} [submitter] - button of input of type submit that triggered the form submission.
   * @returns {Promise<boolean>} - A promise that resolves to true if the user accepts the challenge or false if they deny it.
   */
  confirm(message, _formElement, submitter) {
    const clickTarget = this.#clickTarget(submitter);
    const contentMap = this.#contentMap(message, clickTarget);

    return this.confirmWithContent(contentMap)
  }

  /**
   * Present a confirmation challenge to the user.
   * @public
   * @param {Object} contentMap - A map of CSS selectors to HTML content to be inserted into the dialog.
   * @returns {Promise<boolean>} - A promise that resolves to true if the user accepts the challenge or false if they deny it.
   */
  confirmWithContent(contentMap) {
    return this.#controller.showConfirm(contentMap)
  }

  /**
   * a function for #controller to call after setup
   * @private
   */
  showConfirm(element) {
    element.classList.add(this.#config.activeClass);
    if (typeof this.#config.showConfirmCallback === 'function') {
      this.#config.showConfirmCallback(element);
    }
  }

  /**
   * a function for #controller to call before teardown
   * @private
   */
  hideConfirm(element) {
    element.classList.remove(this.#config.activeClass);
    if (typeof this.#config.hideConfirmCallback === 'function') {
      this.#config.hideConfirmCallback(element);
    }
  }

  get dialogSelector() {
    return this.#config.dialogSelector
  }

  get acceptSelector() {
    return this.#config.acceptSelector
  }

  get denySelector() {
    return this.#config.denySelector
  }

  get animationDuration() {
    return this.#config.animationDuration
  }

  #contentMap(message, sourceElement) {
    const contentMap = {};
    if (message) contentMap[this.#config.messageSlotSelector] = message;
    if (sourceElement) {
      for(const slotName of Object.keys(this.#config.contentSlots)) {
        contentMap[this.#slotSelector(slotName)] = this.#slotContent(slotName, sourceElement);
      }
    }

    return contentMap
  }

  #slotSelector(slotName) {
    return this.#config.contentSlots[slotName].slotSelector
  }

  #slotContent(slotName, element) {
    return element.getAttribute(`data-${this.#config.contentSlots[slotName].contentAttribute}`)
  }

  #clickTarget(target) {
    // in the case of a turbo form link, Turbo fails to forward the submitter.
    const element = target ?? document.activeElement;

    return element.closest('[data-turbo-confirm]')
  }
}

const start = (options) => {
  const tc = new TurboConfirm(options);

  if (!window.Turbo) throw TurboConfirmError.noTurbo()

  window.Turbo.setConfirmMethod(async (message, formElement, submitter) => {
    const response = await tc.confirm(message, formElement, submitter);

    if (response) {
      dispatch('confirm-accept', submitter);
    } else {
      dispatch('confirm-reject', submitter);
    }

    return response
  });
};

var index = { start };

exports.TurboConfirm = TurboConfirm;
exports.default = index;
