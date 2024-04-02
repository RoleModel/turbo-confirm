import { TurboConfirmError } from './utils.js'

export default class ConfirmationController {
  initialContent
  #resolve

  constructor(delegate) {
    this.delegate = delegate

    this.accept = this.accept.bind(this)
    this.deny = this.deny.bind(this)
  }

  showConfirm(contentMap) {
    this.#storeInitialContent()

    for(const [selector, content] of Object.entries(contentMap)) {
      const target = this.element.querySelector(selector)
      if (target && content) target.innerHTML = content
    }

    this.#setupListeners()
    this.delegate.showConfirm(this.element)

    return new Promise(resolve => this.#resolve = resolve)
  }

  accept() {
    this.#resolve(true)
    this.#teardown()
  }

  deny() {
    this.#resolve(false)
    this.#teardown()
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
    this.#resolve = null
    this.delegate.hideConfirm(this.element)
    this.#teardownListeners()

    setTimeout(this.#restoreInitialContent.bind(this), this.delegate.animationDuration)
  }

  #setupListeners() {
    this.acceptButtons.forEach(element => element.addEventListener('click', this.accept))
    this.denyButtons.forEach(element => element.addEventListener('click', this.deny))
    this.element.addEventListener('cancel', this.deny)
  }

  #teardownListeners() {
    this.acceptButtons.forEach(element => element.removeEventListener('click', this.accept))
    this.denyButtons.forEach(element => element.removeEventListener('click', this.deny))
    this.element.removeEventListener('cancel', this.deny)
  }

  #storeInitialContent() {
    try {
      this.initialContent = this.element.innerHTML
    } catch (error) {
      throw TurboConfirmError.missingDialog(this.delegate.dialogSelector, error)
    }
  }

  #restoreInitialContent() {
    try {
      this.element.innerHTML = this.initialContent
    } catch {
      /**
       * this happens when accepting the confirmation challenge results in visiting a page
       * without a confirmation template. If one is truly needed on the new page, a helpful
       * error message will be thrown on the next go round (during #storeInitialContent).
       */
    }
  }
}
