export const dispatch = (name, target = document, {bubbles = true, cancelable = true, prefix = 'rms', detail} = {}) => {
  const event = new CustomEvent(`${prefix}:${name}`, {bubbles, cancelable, detail})
  target.dispatchEvent(event)
  return !event.defaultPrevented
}