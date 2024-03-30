import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["message"]

  accepted() {
    this.messageTarget.innerHTML = 'Confirm Accepted'
  }

  rejected() {
    this.messageTarget.innerHTML = 'Confirm Rejected'
  }
}
