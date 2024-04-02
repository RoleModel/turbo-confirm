export const dispatch = (name, target = document, {bubbles = true, cancelable = true, prefix = 'rms', detail} = {}) => {
  const event = new CustomEvent(`${prefix}:${name}`, {bubbles, cancelable, detail})
  target.dispatchEvent(event)
  return !event.defaultPrevented
}

export class TurboConfirmError extends Error {
  name = 'TurboConfirmError'

  static missingDialog(selector, typeError) {
    return new this(`No element matching dialogSelector: '${selector}'`, { cause: typeError })
  }

  static noTurbo() {
    return new this('Turbo is not defined. Be sure to import "@hotwired/turbo-rails" before calling the `start()` function')
  }
}
