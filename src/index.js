import {dispatch} from './lib/utils.js'
export { TurboConfirm } from './lib/TurboConfirm'

const confirm = async (message, formElement, submitter) => {
  if (!window._TurboConfirm) init()

  const confirmationResponse = await window._TurboConfirm.confirm(message, formElement, submitter)

  if (confirmationResponse) {
    dispatch('confirm-accept', submitter)
  } else {
    dispatch('confirm-reject', submitter)
  }

  return confirmationResponse
}

const init = (options) => {
  window._TurboConfirm = new TurboConfirm(options)
}

export default { init, confirm }
