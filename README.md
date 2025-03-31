# Turbo Confirm

<div>
  <img src="https://github.com/RoleModel/turbo-confirm/actions/workflows/playwright.yml/badge.svg" alt="CI">
  <img src="https://img.shields.io/npm/dw/@rolemodel/turbo-confirm?label=npm" alt="npm">
  <img src="https://data.jsdelivr.com/v1/package/npm/@rolemodel/turbo-confirm/badge?style=rounded" alt="jsDelivr">
</div>
<br/>

A drop-in upgrade for Rails `data-turbo-confirm`.

![title image](title_image.png)

## Installation

```bash
npm install @rolemodel/turbo-confirm
```

or

```bash
yarn add @rolemodel/turbo-confirm
```

## Setup

In your application's JavaScript entry point file. (usually _app/javascript/application.js_)

```js
import "@hotwired/turbo-rails"
import TC from "@rolemodel/turbo-confirm"

TC.start()
```

**note:** `@hotwired/turbo-rails` must be imported prior to calling the `start` function. This is so **Turbo-Confirm** can coordinate with Turbo regarding confirmation handling. The `start` function is also where you may override default behavior by passing a configuration object. See [configuration docs](#configuration) for available options and their default values.

## Usage

Turbo's confirmation interface is exercised most commonly via `button_to` (examples shown in [slim] templating syntax)

```ruby
  = button_to 'Delete ToDo', todo_path(todo),
    class: 'btn btn--danger',
    method: :delete,
    data: { turbo_confirm: 'Are you sure?' }
```

or `link_to` with a `data-turbo-method` attribute.

```ruby
  = link_to 'Delete ToDo', todo_path(todo),
    class: 'btn btn--danger',
    data: { \
      turbo_method: :delete,
      turbo_confirm: 'Are you sure?',
    }
```

Then add markup to `app/views/layouts/application.html.slim` to render a dialog. See the [Example Template](#example-template) section below.

### Customizing more than just a message

**Turbo-Confirm** supports other custom content beyond a simple message, by setting additional data attributes on the confirmation trigger. Henceforth referred to as _contentSlots_, this feature is both infinitely configurable and completely optional. Out of the box **Turbo-Confirm** supports two:

- **body** activated by a `data-confirm-details` attribute on the confirmation trigger. The attribute's value will be assigned to the element matching the `#confirm-body` selector.
- **acceptText** activated by a `data-confirm-button` attribute on the confirmation trigger. The attribute's value will be assigned to the element matching the `#confirm-accept` selector (same as the default value of the `acceptSelector` configuration property)

example usage of default _contentSlots_ via `button_to` in [slim] templating syntax:

```ruby
  = button_to 'Delete ToDo', todo_path(todo),
    method: :delete,
    data: { \
      turbo_confirm: 'The following ToDo will be permanently deleted.',
      confirm_details: simple_format(todo.content),
      confirm_button: 'Delete ToDo',
    }
```

**note:** It's recommended that you have sensible default content already populating each of your configured _contentSlots_ within your app's confirmation dialog template. Such that every confirmation trigger is not required to supply custom content for every _contentSlot_. See our [example template](#example-template) for a good starting point.

### Manual Usage

Though **Turbo-Confirm** was primarily designed to serve as [turbo-rails]' confirmation interface, it may also be invoked directly by application code. In almost the same manner as the native `window.confirm`.  While native confirm pauses execution until the user accepts or declines, **Turbo-Confirm** is [Promise][mdn-promise] based.

e.g.

```js
import { TurboConfirm } from "@rolemodel/turbo-confirm"

const tc = new TurboConfirm()
tc.confirm('Are you sure?').then(response => { response ? /* accepted */ : /* denied */ })
```

The message itself is optional as well.  Simply call `confirm()` with **no** arguments and your dialog's default content will be displayed un-altered. e.g.

```js
import { TurboConfirm } from "@rolemodel/turbo-confirm"

const tc = new TurboConfirm({ /* Any Custom Configuration */ })
tc.confirm()
```

**Turbo-Confirm** has an additional public method, `confirmWithContent` that expects a _contentMap_ object where the keys are content slot selectors and the values are the content you want displayed in each selected element.

e.g.

```js
import { TurboConfirm } from "@rolemodel/turbo-confirm"

const tc = new TurboConfirm()
tc.confirmWithContent({
  '#confirm-title': 'Are you sure?',
  '#confirm-accept': 'Do it!'
}).then(response => { response ? /* accepted */ : /* denied */ })
```

**note:** The `TurboConfirm` constructor creates a brand new instance that will not share configuration with the one Turbo-Rails is using.  For that reason, a config object may be passed into the `TurboConfirm` constructor. See [configuration docs](#configuration) for available options and their default values.

### Stimulus Example

While Turbo will invoke **Turbo-Confirm** for you in the case of a form submission (like `button_to`) or form link (like `link_to` with a `data-turbo-method`), in the case of a regular link or a button that does not submit a form, you're on your own.  But **Turbo-Confirm** can help.

For those cases, a simple [Stimulus] wrapper around **Turbo-Confirm** is a good solution.

e.g.

```js
import { Controller } from "@hotwired/stimulus"
import { TurboConfirm } from "@rolemodel/turbo-confirm"

export default class extends Controller {
  #hasAccepted = false

  connect() {
    this.tc = new TurboConfirm({ /* Any Custom Configuration */ })
  }

  async perform(event) {
    if (this.#hasAccepted) {
      this.#hasAccepted = false
      return
    }

    event.preventDefault()
    event.stopImmediatePropagation()

    if (await this.tc.confirm(event.params.message)) {
      this.#hasAccepted = true
      event.target.click()
    }
  }
}

```

```HTML

<a href="https://rolemodelsoftware.com" data-controller="confirm" data-confirm-message-param="Do you need custom software?" data-action="confirm#perform">Click me</a>

```

## Configuration

|  Option               | description                                                                                                                                       | default value                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `dialogSelector`      | Global CSS selector used to locate your dialog HTML (an ID selector is recommended)                                                               | `'#confirm'`                        |
| `activeClass`         | HTML class that causes your dialog element to become visible. (note: you're responsible for defining necessary style rules)                       | `'modal--active'`                   |
| `acceptSelector`      | CSS selector identifying the button within your dialog HTML which should trigger acceptance of a confirmation challenge                           | `'#confirm-accept'`                 |
| `denySelector`        | CSS selector identifying the button(s) within your dialog HTML which should trigger rejection of a confirmation challenge                         | `'.confirm-cancel'`                 |
| `animationDuration`   | approximate number of miliseconds **Turbo-Confirm** should wait for your dialog's CSS to transition to/from a visible state                           | `300`                               |
| `showConfirmCallback` | a function, called on show with 1 argument (the dialog). The default provides support for native [dialog elements][mdn-dialog]                     | [see below](#default-config-object) |
| `hideConfirmCallback` | a function, called on accept or reject with 1 argument (the dialog). The default provides support for native [dialog elements][mdn-dialog]         | [see below](#default-config-object) |
| `messageSlotSelector` | CSS selector of the element within your dialog HTML where the value of `data-turbo-confirm` (or supplied message) should be rendered              | `'#confirm-title'`                  |
| `contentSlots`        | an object describing additional customization points. See [contentSlots](#customizing-more-than-just-a-message) for a more detailed description.  | [see below](#default-config-object) |

### Default Config Object

```js
{
    dialogSelector: '#confirm',
    activeClass: 'modal--active',
    acceptSelector: '#confirm-accept',
    denySelector: '.confirm-cancel',
    animationDuration: 300,
    showConfirmCallback: element => element.showModal && element.showModal(),
    hideConfirmCallback: element => element.close && element.close(),
    messageSlotSelector: '#confirm-title',
    contentSlots: {
      body: {
        contentAttribute: 'confirm-details',
        slotSelector: '#confirm-body'
      },
      acceptText: {
        contentAttribute: 'confirm-button',
        slotSelector: '#confirm-accept'
      }
    }
  }
```

## Example Template

Based on the default configuration, the following template is suitable.

```HTML
  <!-- not visible until a 'modal--active' class is applied to the #confirm element -->
  <div id="confirm" class="modal">
    <div class="modal__backdrop confirm-cancel"></div>
    <div class="modal__content">
      <h3 id="confirm-title">Replaced by `data-turbo-confirm` attribute</h3>
      <div id="confirm-body">
        <p>Default confirm message.</p>
        <p>Optionally replaced by `data-confirm-details` attribute</p>
      </div>
      <div class="modal-actions">
        <button class="confirm-cancel">Cancel</button>
        <button id="confirm-accept">Yes, I'm Sure</button>
      </div>
    </div>
  </div>
```

### Native Dialogs

If you're not already using a CSS or style component framework. I suggest checking out [Optics].  Alternatively, the native [dialog][mdn-dialog] element is fully supported by modern browsers and removes much of the styling burden that would otherwise be required to emulate such behavior with only a `div`.

**Turbo-Confirm** fully supports the native dialog element, including dismissal via `esc` key.

```HTML
  <!-- not visible without an [open] attribute, which **Turbo-Confirm** will handle for you -->
  <dialog id="confirm" class="modal">
    <div class="modal__content">
      <h3 id="confirm-title">Replaced by `data-turbo-confirm` attribute</h3>
      <div id="confirm-body">
        <p>Default confirm message.</p>
        <p>Optionally replaced by `data-confirm-details` attribute</p>
      </div>
      <div class="modal-actions">
        <button class="confirm-cancel">Cancel</button>
        <button id="confirm-accept">Yes, I'm Sure</button>
      </div>
    </div>
  </dialog>
```

## Development

After cloning the repository, you'll need to install dependencies by running `yarn install`.

The test suite can be run with `yarn test`. Or open the [Playwright] GUI application with `yarn test:ui`

Finally, the test app's server can be run on PORT 3000 with `yarn dev`.

Each of these tasks is also accessible via [Rake], if you prefer. Run `rake -T` for details.

## Acknowledgments

**Turbo-Confirm** is [MIT-licensed](LICENSE), open-source software from [RoleModel Software][rms].

[RoleModel Software][rms] is a world-class, collaborative software development team dedicated to delivering the highest quality custom web and mobile software solutions while cultivating a work environment where community, family, learning, and mentoring flourish.

[slim]: https://github.com/slim-template/slim
[turbo-rails]: https://github.com/hotwired/turbo-rails/
[Stimulus]: https://github.com/hotwired/stimulus/
[mdn-promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[mdn-dialog]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog/
[Optics]: https://github.com/RoleModel/optics/
[Playwright]: https://playwright.dev/
[Rake]: https://github.com/ruby/rake/
[rms]: https://rolemodelsoftware.com/
