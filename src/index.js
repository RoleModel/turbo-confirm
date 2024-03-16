import {dispatch} from './lib/utils.js'
import ConfirmationController from './lib/ConfirmationController.js'

const confirm = async (message, _formElement, submitter) => {
  if (!window._TurboConfirm) init()

  const confirmationResponse = await window._TurboConfirm.perform(message, submitter)

  if (confirmationResponse) {
    dispatch('confirm-accept', submitter)
  } else {
    dispatch('confirm-reject', submitter)
  }

  return confirmationResponse
}

const init = (options) => {
  window._TurboConfirm = new ConfirmationController(options)
}

export default {init, confirm, dispatch}
