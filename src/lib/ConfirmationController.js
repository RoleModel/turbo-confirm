import { dispatch } from './utils.js'

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
    // and store a reference to the clicked element
    this.#originalSubmitter = this.#clickTarget(event)
    // and show the confirmation dialog
    this.#showConfirm()
  }

  accept() {
    const submitter = this.#originalSubmitter
    this.#teardown()

    if (submitter.getAttribute('data-confirm-click') === 'false') {
      dispatch('confirm-accept', submitter, {})
    } else {
      // re-trigger the original action
      submitter.click()
    }
  }

  deny() {
    const submitter = this.#originalSubmitter
    this.#teardown()

    dispatch('confirm-deny', submitter, {})
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

  #showConfirm() {
    // if this is the first time, store the HTML of the dialog.
    // We'll use this to restore the dialog to its original state on teardown.
    if (!this.#initialContent) {
      this.#initialContent = this.dialogTarget.innerHTML
    }

    this.#fillSlots(this.#originalSubmitter)
    this.dialogTarget.classList.add(this.#config.activeClass)

    // showConfirmCallback was added to support shoelace modal dialogs, which require a function to open.
    // However, it also provides a hook for executing any custom code you like.
    if (this.#config.showConfirmCallback) {
      this.#config.showConfirmCallback(this.dialogTarget)
    }

    // setup listeners for the confirm and cancel buttons in the dialog
    this.#setupListeners()
  }

  #teardown() {
    // hide the dialog
    this.dialogTarget.classList.remove(this.#config.activeClass)
    // remove the reference to the clicked element
    this.#originalSubmitter = undefined
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

  #clickTarget({target}) {
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
