export default class ConfirmationController {
  #resolve
  #initialContent
  #config = {
    dialogSelector: '#confirm',
    activeClass: 'modal--active',
    acceptSelector: '#confirm-accept',
    denySelector: '.confirm-cancel',
    animationDuration: 300,
    showConfirmCallback: null,
    messageSlotTarget: 'title',
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

  perform(message, submitter) {
    const promise = new Promise((resolve) => this.#resolve = resolve.bind(this))
    this.#showConfirm(message, submitter)

    return promise
  }

  accept() {
    this.#resolve(true)
    this.#teardown()
  }

  deny() {
    this.#resolve(false)
    this.#teardown()
  }

  get dialogTarget() {
    return document.querySelector(this.#config.dialogSelector)
  }

  get acceptButtons() {
    return this.dialogTarget.querySelectorAll(this.#config.acceptSelector)
  }

  get denyButtons() {
    return this.dialogTarget.querySelectorAll(this.#config.denySelector)
  }

  #showConfirm(message, submitter) {
    // if this is the first time, store the HTML of the dialog.
    // We'll use this to restore the dialog to its original state on teardown.
    if (!this.#initialContent) {
      this.#initialContent = this.dialogTarget.innerHTML
    }

    // TurboConfirm can be triggered manually with an optional message, or by Turbo via form submission.
    if (submitter) {
      this.#fillSlots(this.#clickTarget(submitter))
    } else if (message) {
      this.#slotTarget(this.#config.messageSlotTarget).innerHTML = message
    }

    // toggle activeClass to show the dialog
    this.dialogTarget.classList.add(this.#config.activeClass)

    // showConfirmCallback was added to support the dialog element, which require JavaScript to open.
    // However, it also provides a hook for executing any custom code you like on modal show.
    if (this.#config.showConfirmCallback) {
      this.#config.showConfirmCallback(this.dialogTarget)
    }

    // setup listeners for the confirm and cancel buttons in the dialog
    this.#setupListeners()
  }

  #teardown() {
    // clear the promise resolver
    this.#resolve = null
    // hide the dialog
    this.dialogTarget.classList.remove(this.#config.activeClass)
    // remove listeners for the confirm and cancel buttons in the dialog
    this.#teardownListeners()
    // restore the dialog to its original state
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

  #slotTarget(slotName) {
    return document.querySelector(this.#config.contentSlots[slotName].slotSelector)
  }

  #slotContent(slotName, element) {
    return element.getAttribute(`data-${this.#config.contentSlots[slotName].contentAttribute}`)
  }

  #restoreDialog() {
    // allow for hide animation to complete before removing content
    setTimeout(()=> {
      this.dialogTarget.innerHTML = this.#initialContent
    }, this.#config.animationDuration)
  }

  #clickTarget(target) {
    // in the case of a turbo link intercept, the target is the document.
    // Form submissions still have the original submitter as the target.
    const element = target.activeElement ?? target

    return element.closest('[data-turbo-confirm]')
  }

  #setupListeners() {
    this.acceptButtons.forEach(element => element.addEventListener('click', this.accept))
    this.denyButtons.forEach(element => element.addEventListener('click', this.deny))
    this.dialogTarget.addEventListener('cancel', this.deny)
  }

  #teardownListeners() {
    this.acceptButtons.forEach(element => element.removeEventListener('click', this.accept))
    this.denyButtons.forEach(element => element.removeEventListener('click', this.deny))
    this.dialogTarget.removeEventListener('cancel', this.deny)
  }
}
