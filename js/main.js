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

// click btn balance
$("#btn-balance").addEventListener("click", () =>{
    removeClass($("#balance-container"), "hidden")
    addClass($("#categories"), "hidden")
    addClass($("#reports"), "hidden")
})
// click btn categories
$("#btn-categories").addEventListener("click", () =>{
    removeClass($("#categories"), "hidden")
    addClass($("#balance-container"), "hidden")
    addClass($("#reports"), "hidden")
})
// click btn reports
$("#btn-reports").addEventListener("click", () =>{
    removeClass($("#reports"), "hidden")
    addClass($("#balance-container"), "hidden")
    addClass($("#categories"), "hidden")
})


// edit and delete category
$("#pencil-edit-category-btn").addEventListener("click", () =>{
    removeClass($("#edit-category-container"), "hidden")
    addClass($("#new-category-container"), "hidden")
})

$("#add-editCategory-btn").addEventListener("click", () =>{
    removeClass($("#modal-edited-category"), "hidden")
    addBrightness($("header"), "brightness(0.5)")
    addBrightness($("main"), "brightness(0.5)")
    addBrightness($("footer"), "brightness(0.5)")
})

$("#category-edited-btn").addEventListener("click", () =>{
    addClass($("#modal-edited-category"), "hidden")
    removeClass($("#new-category-container"), "hidden")
    addClass($("#edit-category-container"), "hidden")
    addBrightness($("header"), "brightness()")
    addBrightness($("main"), "brightness()")
    addBrightness($("footer"), "brightness()")
})

$("#cancel-editCategory-btn").addEventListener("click", () =>{
    addClass($("#modal-edited-category"), "hidden")
    removeClass($("#new-category-container"), "hidden")
    addClass($("#edit-category-container"), "hidden")
    addBrightness($("header"), "brightness()")
    addBrightness($("main"), "brightness()")
    addBrightness($("footer"), "brightness()")
})

$("#delete-category-btn").addEventListener("click", () =>{
    removeClass($("#modal-delete-category"), "hidden")
    addBrightness($("header"), "brightness(0.5)")
    addBrightness($("main"), "brightness(0.5)")
    addBrightness($("footer"), "brightness(0.5)")
})

$("#delete-category-current").addEventListener("click", () =>{
    addClass($("#modal-delete-category"), "hidden")
    removeClass($("#new-category-container"), "hidden")
    addClass($("#edit-category-container"), "hidden")
    addBrightness($("header"), "brightness()")
    addBrightness($("main"), "brightness()")
    addBrightness($("footer"), "brightness()")
})

$("#no-delete-category-current").addEventListener("click", () =>{
    addClass($("#modal-delete-category"), "hidden")
    removeClass($("#new-category-container"), "hidden")
    addClass($("#edit-category-container"), "hidden")
    addBrightness($("header"), "brightness()")
    addBrightness($("main"), "brightness()")
    addBrightness($("footer"), "brightness()")
})



