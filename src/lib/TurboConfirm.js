import ConfirmationController from './ConfirmationController'

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

    this.#controller = new ConfirmationController(this.#config.dialogSelector, this)
  }

  confirm(message, _formElement, submitter) {
    const clickTarget = this.#clickTarget(submitter)
    const contentMap = this.#contentMap(message, clickTarget)

    return this.confirmWithContent(contentMap)
  }

  confirmWithContent(contentMap) {
    return new Promise(resolve => this.#controller.showConfirm(contentMap, resolve))
  }

  showConfirm(element) {
    element.classList.add(this.#config.activeClass)
    if (this.#config.showConfirmCallback) {
      this.#config.showConfirmCallback(element)
    }
  }

  hideConfirm(element) {
    element.classList.remove(this.#config.activeClass)
    if (this.#config.hideConfirmCallback) {
      this.#config.hideConfirmCallback(element)
    }
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
    if (!target) return
    // in the case of a turbo form link, the target is the document.
    // normal form submissions still have the original submitter as the target.
    const element = target.activeElement ?? target

    return element.closest('[data-turbo-confirm]')
  }
}
