/*  selector */
const $ = (selector) => document.querySelector(selector)

/* adding and removing class elements */
const addClass = (element, nameClass) => element.classList.add(nameClass)
const removeClass = (element, nameClass) => element.classList.remove(nameClass)

/* adding filter */
const addBrightness = (element, filterName) => element.style.filter = (filterName)


$("#remove-category").addEventListener("click", () => {
    removeClass($("#modal-delete-operation"), "hidden")
    addBrightness($("header"), "brightness(0.5)")
    addBrightness($("main"), "brightness(0.5)")
    addBrightness($("footer"), "brightness(0.5)")
})

$("#delete-category").addEventListener("click", () => {
    addClass($("#modal-delete-operation"), "hidden")
    addBrightness($("header"), "brightness()")
    addBrightness($("main"), "brightness()")
    addBrightness($("footer"), "brightness()")
})

$("#no-delete-category").addEventListener("click", () => {
    addClass($("#modal-delete-operation"), "hidden")
    addBrightness($("header"), "brightness()")
    addBrightness($("main"), "brightness()")
    addBrightness($("footer"), "brightness()")
})


/* new operation */

$("#new-operation-btn").addEventListener("click", () => {
    addClass($("#balance-container"), "hidden")
    removeClass($("#new-operation-container"), "hidden")
})

/* modal operation check  */
$("#add-operation-btn").addEventListener("click", () => {
    removeClass($("#modal-new-operation-done"), "hidden")
    addBrightness($("header"), "brightness(0.5)")
    addBrightness($("main"), "brightness(0.5)")
    addBrightness($("footer"), "brightness(0.5)")
})


/* modal operation added ok */
$("#operation-added-btn").addEventListener("click", () => {
    addClass($("#new-operation-container"), "hidden")
    removeClass($("#balance-container"), "hidden")
    addClass($("#modal-new-operation-done"), "hidden")
    addBrightness($("header"), "brightness()")
    addBrightness($("main"), "brightness()")
    addBrightness($("footer"), "brightness()")
})


/* btn back to balance */
$("#cancel-add-operation-btn").addEventListener("click", () => {
    addClass($("#new-operation-container"), "hidden")
    removeClass($("#balance-container"), "hidden")
})


/* edit button in balance*/

$("#pencil-edit-btn").addEventListener("click", () => {
    removeClass($("#edit-operation-container"), "hidden")
    addClass($("#balance-container"), "hidden")
})



 //    ------------ edit container buttons

/* cancel edit operation */
$("#edit-cancel-btn").addEventListener("click", () => {
    addClass($("#edit-operation-container"), "hidden")
    removeClass($("#balance-container"), "hidden")
})


/* edit operation */
$("#edit-btn").addEventListener("click", () => {
    removeClass($("#modal-edited-operation"), "hidden")
    addBrightness($("header"), "brightness(0.5)")
    addBrightness($("main"), "brightness(0.5)")
    addBrightness($("footer"), "brightness(0.5)")
})


/* modal operation edited */
$("#operation-edited-btn").addEventListener("click", () => {
    addClass($("#modal-edited-operation"), "hidden")
    addClass($("#edit-operation-container"), "hidden")
    removeClass($("#balance-container"), "hidden")
    addBrightness($("header"), "brightness()")
    addBrightness($("main"), "brightness()")
    addBrightness($("footer"), "brightness()")
})
