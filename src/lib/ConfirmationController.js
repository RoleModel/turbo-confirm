export default class ConfirmationController {
  #originalSubmitter
  #initialContent
  #config = {
    dialogSelector: '#confirm',
    activeClass: 'modal--active',
    acceptSelector: '#confirm-accept',
    denySelector: '.confirm-cancel',
    animationDuration: 300,
    showConfirmCallback: null,
    contentSlots: {
      title: {
        contentAttribute: 'turbo-confirm',
        slotSelector: '#confirm-title'
      },
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
    // override default config with any options passed in
    for(const [key, value] of Object.entries(options)) {
      this.#config[key] = value
    }
    // bind methods for use as event listeners
    this.accept = this.accept.bind(this)
    this.deny = this.deny.bind(this)
  }

  perform(event) {
    // If present, the confirmation dialog was already accepted.
    // We just need to clean up and the original action will proceed as normal.
    if (this.#originalSubmitter) return this.#teardown()
    // Otherwise, we need to prevent the default action
    event.preventDefault()
    // and store a reference to the original submitter
    this.#originalSubmitter = event.target
    // event.target might be an icon or other element nested inside the element we want.
    this.#showConfirm(this.#clickTarget(event))
  }

  accept() {
    // re-trigger the original action
    this.#originalSubmitter.click()
  }

  deny() {
    this.#teardown()
  }

  get dialogTarget() {
    return document.querySelector(this.#config.dialogSelector)
  }

  #slotTarget(slotName) {
    return document.querySelector(this.#config.contentSlots[slotName].slotSelector)
  }

  #slotContent(slotName, element) {
    return element.getAttribute(`data-${this.#config.contentSlots[slotName].contentAttribute}`)
  }

  #showConfirm(element) {
    // if this is the first time, store the HTML of the dialog.
    // We'll use this to restore the dialog to its original state on teardown.
    if (!this.#initialContent) this.#initialContent = this.dialogTarget.innerHTML
    this.#fillSlots(element)
    this.dialogTarget.classList.add(this.#config.activeClass)
    if (this.#config.showConfirmCallback) {
      this.#config.showConfirmCallback(this.dialogTarget)
    }

    this.#setupListeners()
  }

  #teardown() {
    this.dialogTarget.classList.remove(this.#config.activeClass)
    this.#originalSubmitter = undefined
    this.#teardownListeners()
    this.#restoreDialog()
  }

  #fillSlots(sourceElement) {
    // transfer content from source element's data attributes to dialog slots, defined by config object.
    for(const slotName of Object.keys(this.#config.contentSlots)) {
      const slotTarget = this.#slotTarget(slotName)
      const slotContent = this.#slotContent(slotName, sourceElement)
      if (slotTarget && slotContent) {
        slotTarget.innerHTML = slotContent
      }
    }
  }

  #restoreDialog() {
    // allow for hide animation to complete before removing content
    setTimeout(()=> {
      this.dialogTarget.innerHTML = this.#initialContent
    }, this.#config.animationDuration)
  }

  #clickTarget({currentTarget}) {
    if (currentTarget === document) {
      return currentTarget.activeElement.closest(`[data-turbo-confirm]`)
    } else {
      return currentTarget.closest(`[data-turbo-confirm]`)
    }
  }

  #setupListeners() {
    this.dialogTarget.querySelectorAll(this.#config.acceptSelector).forEach(element => element.addEventListener('click', this.accept))
    this.dialogTarget.querySelectorAll(this.#config.denySelector).forEach(element => element.addEventListener('click', this.deny))
  }

  #teardownListeners() {
    this.dialogTarget.querySelectorAll(this.#config.acceptSelector).forEach(element => element.removeEventListener('click', this.accept))
    this.dialogTarget.querySelectorAll(this.#config.denySelector).forEach(element => element.removeEventListener('click', this.deny))
  }
}
