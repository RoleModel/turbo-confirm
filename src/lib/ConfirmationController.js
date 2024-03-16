export default class ConfirmationController {
  #resolve
  #dialogSelector
  #initialContent

  constructor(selector, delegate) {
    this.#dialogSelector = selector
    this.delegate = delegate

    this.accept = this.accept.bind(this)
    this.deny = this.deny.bind(this)
  }

  showConfirm(contentMap, resolver) {
    this.#resolve = resolver.bind(this)
    if (!this.#initialContent) this.#initialContent = this.element.innerHTML

    for(const [selector, content] of Object.entries(contentMap)) {
      const target = this.element.querySelector(selector)
      if (target && content) {
        target.innerHTML = content
      }
    }

    this.#setupListeners()
    this.delegate.showConfirm(this.element)
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
    return document.querySelector(this.#dialogSelector)
  }

  #teardown() {
    this.#resolve = null
    this.delegate.hideConfirm(this.element)
    this.#teardownListeners()
    // allow for hide animation to complete before removing content
    setTimeout(() => this.element.innerHTML = this.#initialContent, this.delegate.animationDuration)
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
}
