export function createDecorator(attribute, decorate) {
  return function init(target = document.body) {
    const decoratedElements = new WeakMap(
      Array.from(target.querySelectorAll(`[${attribute}]`))
        .map(element => [element, decorate(element)])
    )

    const mutationObserver = new MutationObserver(function (mutations) {
      for (const mutation of mutations) {
        if (mutation.target.hasAttribute(attribute)) {
          decoratedElements.set(mutation.target, decorate(mutation.target))
        } else if (decoratedElements.has(mutation.target)) {
          decoratedElements.get(mutation.target).disconnect()
          decoratedElements.delete(mutation.target)
        }
      }
    })

    mutationObserver.observe(target, {
      subtree: true,
      attributes: true,
      attributeFilter: [attribute]
    })

    return mutationObserver
  }
}
