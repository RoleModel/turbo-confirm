import { dispatch, TurboConfirmError } from './lib/utils.js'
import { TurboConfirm } from './lib/TurboConfirm.js'

const start = (options) => {
  if (!window.Turbo) throw TurboConfirmError.noTurbo()
  const tc = new TurboConfirm(options)

  const confirmationHandler = async (message, formElement, submitter) => {
    const response = await tc.confirm(message, formElement, submitter)

    if (response) {
      dispatch('confirm-accept', submitter)
    } else {
      dispatch('confirm-reject', submitter)
    }

    return response
  }

  if (window.Turbo.config) {
    window.Turbo.config.forms.confirm = confirmationHandler
  } else {
    window.Turbo.setConfirmMethod(confirmationHandler)
  }
}

export default { start }
export { TurboConfirm }
