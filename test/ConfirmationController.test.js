import ConfirmationController from '../src/lib/ConfirmationController';

const event = new CustomEvent('mockTrigger')

describe('ConfirmationController', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="confirm" class="modal">
        <div class="modal__backdrop confirm-cancel"></div>
        <div class="modal__content">
          <h3 id="confirm-title">Original Title Content</h3>
          <div id="confirm-body">
            <p>a paragraph inside #confirm-body</p>
          </div>
          <div class="modal-actions">
            <button id="cancel-button" class="confirm-cancel">Cancel</button>
            <button id="confirm-accept">Yes, I'm Sure</button>
          </div>
        </div>
      </div>


      <button id="trigger" data-turbo-confirm="test content" data-confirm-button="Do it!">Trigger</button>
    `

    const triggeringElement = document.getElementById('trigger')
    triggeringElement.dispatchEvent(event)
  })

  describe('setup & teardown of the dialog', () => {
    it('should add and then remove the activeClass from the dialog', () => {
      const cancelButton = document.getElementById('cancel-button')
      const controller = new ConfirmationController()
      controller.perform(event)

      expect(document.querySelector('#confirm').classList.contains('modal--active')).toBe(true)

      cancelButton.click()

      expect(document.querySelector('#confirm').classList.contains('modal--active')).toBe(false)
    })

    it('should apply contentAttribute values to dialog slots and then restore the original content on teardown', done => {
      const cancelButton = document.getElementById('cancel-button')
      const controller = new ConfirmationController({animationDuration: 0})
      controller.perform(event)

      expect(document.querySelector('#confirm-title').innerHTML).toBe('test content')
      expect(document.querySelector('#confirm-accept').innerHTML).toBe('Do it!')

      cancelButton.click()

      setTimeout(() => {
        // next tick
        expect(document.querySelector('#confirm-title').innerHTML).toBe('Original Title Content')
        expect(document.querySelector('#confirm-accept').innerHTML).toBe("Yes, I'm Sure")
        done()
      }, 0)
    })
  })

  describe('accepting the confirmation', () => {
    it('clicking accept re-triggers the original submitter', () => {
      const testState = { success: false }
      const acceptButton = document.getElementById('confirm-accept')
      const originalSubmitter = document.getElementById('trigger')
      originalSubmitter.onclick = () => { testState.success = true }

      const controller = new ConfirmationController()
      controller.perform(event)

      expect(testState.success).toBe(false)

      acceptButton.click()

      expect(testState.success).toBe(true)
    })

    it('clicking accept tears down the dialog', () => {
      const dialog = document.getElementById('confirm')
      const acceptButton = document.getElementById('confirm-accept')

      const controller = new ConfirmationController()
      controller.perform(event)

      expect(dialog.classList.contains('modal--active')).toBe(true)

      acceptButton.click()

      expect(dialog.classList.contains('modal--active')).toBe(false)
    })

    it('clicking accepts dispatches a custom event if the original submitter opted out of reclick behavior', () => {
      const testState = { success: false }
      const acceptButton = document.getElementById('confirm-accept')
      const originalSubmitter = document.getElementById('trigger')
      originalSubmitter.setAttribute('data-confirm-click', 'false')
      originalSubmitter.onclick = () => { testState.success = 'click' }
      originalSubmitter.addEventListener('rms:confirm-accept', () => {
        testState.success = 'custom'
      })

      const controller = new ConfirmationController()
      controller.perform(event)

      expect(testState.success).toBe(false)

      acceptButton.click()

      expect(testState.success).toBe('custom')
    })
  })

  describe('denying the confirmation', () => {

    it('with the dialog cancel event', () => {
      const controller = new ConfirmationController()
      const dialog = document.getElementById('confirm')
      controller.perform(event)

      expect(dialog.classList.contains('modal--active')).toBe(true)

      dialog.dispatchEvent(new CustomEvent('cancel'))

      expect(dialog.classList.contains('modal--active')).toBe(false)
    })

    it('dispatches a custom event on the submitter', () => {
      const testState = { success: false }

      const controller = new ConfirmationController()

      const cancelButton = document.getElementById('cancel-button')

      const dialog = document.getElementById('confirm')
      controller.perform(event)

      const originalSubmitter = document.getElementById('trigger')
      originalSubmitter.onclick = () => { testState.success = 'click' }

      originalSubmitter.addEventListener('rms:confirm-deny', () => {
        testState.success = 'denied'
      })

      cancelButton.click()

      expect(testState.success).toBe('denied')
    })
  })
})
