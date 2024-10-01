import { dispatch, TurboConfirmError } from './lib/utils.js'
import { TurboConfirm } from './lib/TurboConfirm.js'

const start = (options) => {
  if (!window.Turbo) throw TurboConfirmError.noTurbo()
  const tc = new TurboConfirm(options)

  window.Turbo.config.forms.confirm = async (message, formElement, submitter) => {
    const response = await tc.confirm(message, formElement, submitter)

    if (response) {
      dispatch('confirm-accept', submitter)
    } else {
      dispatch('confirm-reject', submitter)
    }

    return response
  }
}

export default { start }
export { TurboConfirm }
