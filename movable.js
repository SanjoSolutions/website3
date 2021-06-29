import { createDecorator } from "./createDecorator.js";

export function initMovable(target = document.body) {
  return new WeakMap(
    Array.from(target.querySelectorAll('[movable]'))
      .map(element => [element, makeMovable(element)])
  )
}

export const initMovable2 = createDecorator('movable', makeMovable)

function makeMovable(element) {
  let isMoving = false

  function pointerDown(event) {
    event.preventDefault()
    isMoving = true
  }

  element.addEventListener('pointerdown', pointerDown)

  function pointerMove(event) {
    if (isMoving) {
      const {x, y} = getTranslateCoordinates(element)
      updateTransform({
        x: x + event.movementX,
        y: y + event.movementY
      })
    }
  }

  function updateTransform({x, y}) {
    const transform = element.style.transform
    if (transform.includes('translate')) {
      element.style.transform = transform.replace(/translate\(.*?\)/, `translate(${x}px, ${y}px)`)
    } else if (transform.length >= 1) {
      element.style.transform = `translate(${x}px, ${y}px) ${transform}`
    } else {
      element.style.transform = `translate(${x}px, ${y}px)`
    }
  }

  window.addEventListener('pointermove', pointerMove)

  function pointerUp() {
    isMoving = false
  }

  window.addEventListener('pointerup', pointerUp)

  return {
    disconnect() {
      element.removeEventListener('pointerdown', pointerDown)
      window.removeEventListener('pointermove', pointerMove)
      window.removeEventListener('pointerup', pointerUp)
    }
  }
}

function getTranslateCoordinates(element) {
    if (element.style.transform) {
      const match = /translate\((-?\d+)px, (-?\d+)px\)/.exec(element.style.transform)
      if (match) {
        return {
          x: Number(match[1]),
          y: Number(match[2])
        }
      }
    }
    return {
      x: 0,
      y: 0
    }
  }

export function movable(element) {
  element.setAttribute('movable', '')
}
