const getElements = () => {
  const { journey, groups } = journeyApp
  const itemsGroups = ['circleItems', 'middleItems', 'infoItems']

  for (const [index, itemsGroup] of itemsGroups.entries()) {
    if (!groups[index]) {
      groups[index] = {}
    }

    const children = journey.querySelector(`.${itemsGroup}`).children

    groups[index].items = children
  }

  const firstItems = Array.from(groups[0].items)
  journeyApp.itemsLength = firstItems.length

  setActiveElements()
}

const setActiveElements = () => {
  journeyApp.activeItem = null

  journeyApp.groups.forEach((group, groupIndex) => {
    const itemsArray = Array.from(group.items)

    itemsArray.forEach((item, index) => {
      item.classList.remove('active')

      if (index === journeyApp.shiftOffset) {
        item.classList.add('active')

        if (groupIndex === 0) {
          journeyApp.activeItem = item
          item.style.setProperty('--progress', '0')
          updateProgress(item, 6500)
        }
      }
    })
  })
}

const clearJourney = () => {
  window.journeyApp = window.journeyApp || {}
  journeyApp.groups = []
  journeyApp.activeItem = null
  journeyApp.itemsLength = 0
  journeyApp.shiftOffset = 0
  journeyApp.loopId = null
  journeyApp.progressintervalId = null
}

const cancleLoop = () => {
  clearInterval(journeyApp.loopId)
}

const updateProgress = (item, duration) => {
  let startTime = Date.now()
  const intervalDuration = 16

  clearInterval(journeyApp.progressintervalId)

  journeyApp.progressintervalId = setInterval(() => {
    const elapsed = Date.now() - startTime
    let progress = Math.min((elapsed / duration) * 100, 100)

    progress = Math.round(progress * 100) / 100

    item.style.setProperty('--progress', progress)

    if (progress >= 99) {
      progress = 99
      clearProgress(item)
      return
    }
  }, intervalDuration)
}

const clearProgress = (item) => {
  item.style.removeProperty('--progress')

  if (item.getAttribute('style') === '') {
    item.removeAttribute('style')
  }
}

const move = (direction) => {
  const itemsLength = journeyApp.itemsLength

  journeyApp.shiftOffset =
    (journeyApp.shiftOffset +
      (direction === 'forward' ? 1 : -1) +
      itemsLength) %
    itemsLength

  setActiveElements()
}

const handleItemClick = (event) => {
  const clickedItem = event.currentTarget

  const firstItems = Array.from(journeyApp.groups[0].items)

  const clickedItemIndex = firstItems.indexOf(clickedItem)

  if (clickedItemIndex > -1) {
    journeyApp.shiftOffset = clickedItemIndex
  } else {
    return
  }

  cancleLoop()
  clearInterval(journeyApp.progressintervalId)
  clearProgress(journeyApp.activeItem)

  setActiveElements()
  startLoop()
}

const attachClickHandlers = () => {
  for (const group of journeyApp.groups) {
    for (const item of group.items) {
      item.addEventListener('click', handleItemClick)
      item.addEventListener('touchend', handleItemClick)
    }
  }
}

const startLoop = () => {
  if (journeyApp.loopId) {
    cancleLoop()
  }

  journeyApp.loopId = setInterval(() => {
    if (!document.querySelector('#productJourney')) {
      clearInterval(journeyApp.loopId)
      return
    }

    move('forward')
  }, 6500)
}

const initJourneyCycle = () => {
  clearJourney()

  journeyApp.journey = document.querySelector('#productJourney')

  getElements()
  attachClickHandlers()
  startLoop()
}

initJourneyCycle()

// const grid = document.querySelector('.circle-grid')
// const items = Array.from(grid.children)
// const duration = 2500

// function makeEaseInOut(timing) {
//   return function (timeFraction) {
//     return timing(timeFraction)
//   }
// }

// function easeInOut(timeFraction) {
//   return timeFraction < 0.5
//     ? 4 * timeFraction * timeFraction * timeFraction
//     : 1 - Math.pow(-2 * timeFraction + 2, 3) / 2
// }

// let smoothEaseInOut = makeEaseInOut(easeInOut)

// function animate(options) {
//   let iterationCount = 0

//   let startTime = performance.now()

//   function animateFrame(time) {
//     let timeFraction = (time - startTime) / options.duration
//     if (timeFraction > 1) timeFraction = 1

//     if (iterationCount + 1 > options.reset) iterationCount = 0

//     const progress = options.timing(timeFraction) + iterationCount
//     options.draw(progress)

//     if (timeFraction < 1) {
//       requestAnimationFrame(animateFrame)
//     } else {
//       iterationCount++

//       if (
//         options.iterations === Infinity ||
//         iterationCount < options.iterations
//       ) {
//         setTimeout(() => {
//           startTime = performance.now()
//           requestAnimationFrame(animateFrame)
//         }, options.delay)
//       }
//     }
//   }

//   requestAnimationFrame(animateFrame)
// }

// items.forEach((item, index) => {
//   animate({
//     duration: 1500,
//     timing: smoothEaseInOut,
//     draw: function (progress) {
//       item.style.setProperty('--index', index + progress + 1)
//     },
//     iterations: Infinity,
//     delay: 3000,
//     reset: items.length,
//   })
// })

// let currentIndex = 1
// let animationInterval

// items.forEach((item, index) => {
//   const elIndex =
//     parseFloat(item.style.getPropertyValue('--index')) || index + 1
//   animate(item, elIndex)
// })

// function animate(item, index) {
//   let currentIndex = index
//   const interval = setInterval(incrementIndex, 100)

//   function incrementIndex() {
//     currentIndex += increment
//     item.style.setProperty('--index', currentIndex)
//   }

//   // function incrementNumber() {
//   //   currentIndex += increment
//   //   item.style.setProperty('--index', currentIndex)

//   //   if (roundToDecimalPlaces(currentIndex, 1) % 1 === 0) {
//   //     setTimeout(() => {
//   //       incrementNumber()
//   //     }, pauseDuration)
//   //   } else {
//   //     setTimeout(incrementNumber, 100)
//   //   }
//   // }

//   // incrementNumber()
// }

// function roundToDecimalPlaces(value, decimalPlaces) {
//   const factor = Math.pow(10, decimalPlaces)
//   return Math.round(value * factor) / factor
// }

// const element = document.getElementById('some-element-you-want-to-animate')
// let start

// function step(timestamp) {
//   if (start === undefined) {
//     start = timestamp
//   }
//   const elapsed = timestamp - start

//   // Math.min() is used here to make sure the element stops at exactly 200px
//   const shift = Math.min(0.1 * elapsed, 200)
//   element.style.transform = `translateX(${shift}px)`

//   console.log('timestam: ' + timestamp)
//   console.log('start: ' + start)
//   console.log('elapse: ' + elapsed)
//   console.log('shift: ' + shift)
//   console.log('------------------')

//   if (shift < 200) {
//     requestAnimationFrame(step)
//   }
// }

// requestAnimationFrame(step)
