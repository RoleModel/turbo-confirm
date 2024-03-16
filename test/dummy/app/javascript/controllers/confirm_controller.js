import { Controller } from "@hotwired/stimulus"
import { TurboConfirm } from "@rolemodel/turbo-confirm"

export default class extends Controller {
  #hasAccepted = false

  connect() {
    this.turboConfirm = new TurboConfirm()
  }

  async perform(event) {
    if (this.#hasAccepted) {
      this.#hasAccepted = false
      return
    }

    event.preventDefault()
    event.stopImmediatePropagation()

    if (await this.turboConfirm.confirm(event.params.message)) {
      this.#hasAccepted = true
      this.dispatch('accepted')
      event.target.click()
    } else {
      this.dispatch('rejected')
    }
  }
}
