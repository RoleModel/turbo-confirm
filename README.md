# RoleModel Confirm

Drop-in upgrade for rails `data-turbo-confirm` to support custom HTML dialogs and multiple content _slots_.

### Installation

```Bash
npm install @rolemodel/turbo-confirm
```

or

```Bash
yarn add @rolemodel/turbo-confirm
```

### Usage

In your applications JavaScript entrypoint file. (e.g.  _app/javascript/application.js_)

```JS
import {Turbo} from "@hotwired/turbo-rails"
import RoleModelConfirm from "@rolemodel/turbo-confirm"

Turbo.setConfirmMethod(RoleModelConfirm.confirm)

RoleModelConfirm.init()
```

And then exercise it via button / link in an erb/slim template:

```RUBY
  = button_to 'Delete ToDo', todo_path(todo),
    class: 'btn btn--danger',
    method: :delete,
    data: { \
      turbo_confirm: 'Are you sure?',
      confirm_details: tag.h2('This action cannot be undone'),
    }
```

### Configuration

RoleModel confirm is entirely configurable.  Override default configuration by passing an object into `init()`.

(e.g.  _app/javascript/application.js_)

```JS

/* ... */

const contentSlots = {
  title: {
    contentAttribute: 'confirm-title',
    slotSelector: '.title'
  },
  subtitle: {
    contentAttribute: 'confirm-subtitle',
    slotSelector: '.subtitle'
  },
  note: {
    contentAttribute: 'confirm-note',
    slotSelector: '#confirm-body'
  }
}

RoleModelConfirm.init({contentSlots})
```

### Default Config

```JS
{
    dialogSelector: '#confirm',
    activeClass: 'modal--active',
    acceptSelector: '#confirm-accept',
    denySelector: '.confirm-cancel',
    animationDuration: 300,
    contentSlots: {
      title: {
        contentAttribute: 'turbo-confirm',
        slotSelector: '#confirm-title'
      },
      body: {
        contentAttribute: 'confirm-details',
        slotSelector: '#confirm-body'
      }
    }
  }
```

### Example Template

Based on default configuration, the following template is suitable.

```HTML
<html>
  <head>
    <title>RoleModel Turbo-Confirm</title>
  </head>
  <body>

    <!-- Here is our dialog (not visible without a 'modal--active' class) -->
    <div id="confirm" class="modal">
      <div class="modal__backdrop confirm-cancel"></div>
      <div class="modal__content">
        <h3 id="confirm-title">Replaced by `data-turbo-confirm` text.</h3>
        <div id="confirm-body">
          <p>Replaced by `data-confirm-details` HTML.</p>
        </div>
        <div class="modal-actions">
          <button class="confirm-cancel">Cancel</button>
          <button id="confirm-accept">Yes, I'm Sure</button>
        </div>
      </div>
    </div>
  </body>
</html>
```