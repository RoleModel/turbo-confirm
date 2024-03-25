import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["message"]

  accepted({params: { newMessage }}) {
    this.messageTarget.innerHTML = newMessage
  }

  rejected() {
    this.messageTarget.innerHTML = 'Confirm Rejected'
  }
}
