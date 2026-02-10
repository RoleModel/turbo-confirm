// Correctly handle redirects after successful form submission.

document.addEventListener('turbo:frame-missing', (event) => {
  if (event.target.id === 'modal') {
    event.preventDefault()
    /**
     * A *replace* visit to the page from which the modal/panel was originally opened is considered
     * to be a *Page Refresh* by Turbo. This makes it eligible for morphing & scroll preservation.
     */
    event.detail.visit(event.detail.response.url, { action: 'replace' })
  }
})
