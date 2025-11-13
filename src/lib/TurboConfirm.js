import ConfirmationController from './ConfirmationController.js'

export class TurboConfirm {
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
      this.#config[key] = value
    }

    this.#controller = new ConfirmationController(this)
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
    const clickTarget = this.#clickTarget(submitter)
    const contentMap = this.#contentMap(message, clickTarget)

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
    element.inert = false
    element.classList.add(this.#config.activeClass)
    if (typeof this.#config.showConfirmCallback === 'function') {
      this.#config.showConfirmCallback(element)
    }
  }

  /**
   * a function for #controller to call before teardown
   * @private
   */
  hideConfirm(element) {
    element.inert = true
    element.classList.remove(this.#config.activeClass)
    if (typeof this.#config.hideConfirmCallback === 'function') {
      this.#config.hideConfirmCallback(element)
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
    const contentMap = {}
    if (message) contentMap[this.#config.messageSlotSelector] = message
    if (sourceElement) {
      for(const slotName of Object.keys(this.#config.contentSlots)) {
        contentMap[this.#slotSelector(slotName)] = this.#slotContent(slotName, sourceElement)
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
    const element = target ?? document.activeElement

    return element.closest('[data-turbo-confirm]')
  }
}
