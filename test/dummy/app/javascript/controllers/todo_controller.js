import { Controller } from "@hotwired/stimulus"
import { TurboConfirm } from "@rolemodel/turbo-confirm"

export default class extends Controller {
  connect() {
    this.turboConfirm = new TurboConfirm(this.#config)
  }

  async confirmStatus({ currentTarget }) {
    if (await this.turboConfirm.confirm()) {
      currentTarget.innerHTML = 'Done'
    } else {
      currentTarget.innerHTML = 'Not Done'
    }
  }

  get #config() {
    return {
      dialogSelector: '#confirm-todo',
      acceptSelector: '#todo-complete',
      denySelector: '#todo-incomplete',
    }
  }
}
