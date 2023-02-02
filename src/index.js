import {dispatch} from './lib/utils.js'
import ConfirmationController from './lib/ConfirmationController.js'

const confirm = (_message, _formElement, submitter) => {
  const confirmationResponse = dispatch('confirm', submitter)

  dispatch('after-confrim', submitter, {detail: confirmationResponse})
  return confirmationResponse
}

const init = (options) => {
  const controller = new ConfirmationController(options)
  document.addEventListener('rms:confirm', (event) => controller.perform(event))
}

export default {init, confirm, dispatch}
