# RoleModel Confirm

Drop-in upgrade for rails `data-turbo-confirm` to support custom HTML dialogs and multiple content _slots_.

## Installation

```Bash
npm install @rolemodel/confirm
```

or

```Bash
yarn add @rolemodel/confirm
```

## Usage

In your applications JavaScript entrypoint file. (e.g.  _app/javascript/application.js_)

```JS
import {Turbo} from "@hotwired/turbo-rails"
import RoleModelConfirm from "@rolemodel/confirm"

Turbo.setConfirmMethod(RoleModelConfirm.confirm)

RoleModelConfirm.init()
```

## Configuration

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

### default configuration

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