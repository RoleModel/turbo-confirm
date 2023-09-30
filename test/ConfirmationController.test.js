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

  })
})
