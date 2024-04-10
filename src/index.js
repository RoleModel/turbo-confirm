import { dispatch, TurboConfirmError } from './lib/utils.js'
import { TurboConfirm } from './lib/TurboConfirm.js'

const start = (options) => {
  const tc = new TurboConfirm(options)

  if (!window.Turbo) throw TurboConfirmError.noTurbo()

  window.Turbo.setConfirmMethod(async (message, formElement, submitter) => {
    const response = await tc.confirm(message, formElement, submitter)

    if (response) {
      dispatch('confirm-accept', submitter)
    } else {
      dispatch('confirm-reject', submitter)
    }

    return response
  })
}

export default { start }
export { TurboConfirm }
