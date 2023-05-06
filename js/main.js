/*  selector */
const $ = (selector) => document.querySelector(selector)

/* adding and removing class elements */
const addClass = (element, nameClass) => element.classList.add(nameClass)
const removeClass = (element, nameClass) => element.classList.remove(nameClass)

/* adding filter */
const addBrightness = (element, filterName) => element.style.filter = (filterName)


$("#remove-category").addEventListener("click", () => {
    removeClass($("#modal"), "hidden")
    addBrightness($("header"), "brightness(0.5)")
    addBrightness($("main"), "brightness(0.5)")
    addBrightness($("footer"), "brightness(0.5)")
})

$("#delete-category").addEventListener("click", () => {
    addClass($("#modal"), "hidden")
    addBrightness($("header"), "brightness()")
    addBrightness($("main"), "brightness()")
    addBrightness($("footer"), "brightness()")
})

$("#no-delete-category").addEventListener("click", () => {
    addClass($("#modal"), "hidden")
    addBrightness($("header"), "brightness()")
    addBrightness($("main"), "brightness()")
    addBrightness($("footer"), "brightness()")
})


/* new operation */

$("#new-operation-btn").addEventListener("click", () => {
    addClass($("#balance-container"), "hidden")
    removeClass($("#new-operation-container"), "hidden")
})

$("#operation-check").addEventListener("click", () => {
    removeClass($("#operation-checked"), "hidden")
    addBrightness($("header"), "brightness(0.5)")
    addBrightness($("main"), "brightness(0.5)")
    addBrightness($("footer"), "brightness(0.5)")

    /* hacer aparecer una nueva modal informando que se agrego la operacion */
})

$("#operation-ok").addEventListener("click", () => {
    addClass($("#new-operation-container"), "hidden")
    removeClass($("#balance-container"), "hidden")
    addClass($("#operation-checked"), "hidden")
    addBrightness($("header"), "brightness()")
    addBrightness($("main"), "brightness()")
    addBrightness($("footer"), "brightness()")
})

$("#operation-cancel").addEventListener("click", () => {
    addClass($("#new-operation-container"), "hidden")
    removeClass($("#balance-container"), "hidden")
})

