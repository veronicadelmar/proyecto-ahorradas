/*  selector */
const $ = (selector) => document.querySelector(selector)

/* adding and removing class elements */
const hideElement = (selector) => $(selector).classList.add("hidden")
const showElement = (selector) => $(selector).classList.remove("hidden")

/* adding filter */
const addBrightness = (selector) => $(selector).style.filter = ("brightness(0.5)")
const removeBrightness = (selector) => $(selector).style.filter = ("brightness()")

$("#hide-filters").addEventListener("click", () => {
    $("#toggle-filters").classList.toggle("hidden")
})



/* modal operation check  */
$("#add-operation-btn").addEventListener("click", (e) => {
    e.preventDefault()
    showElement("#modal-new-operation-done")
    addBrightness("header")
    addBrightness("main")
    addBrightness("footer")
})



/* btn back to balance */
$("#cancel-operation-btn").addEventListener("click", (e) => {
    e.preventDefault()
    hideElement("#new-operation-container")
    showElement("#balance-container")
})



 //    ------------ edit container buttons

/* edit operation */
$("#edit-operation-btn").addEventListener("click", (e) => {
    e.preventDefault()
    showElement("#modal-edited-operation")
    addBrightness("header")
    addBrightness("main")
    addBrightness("footer")
})



// click btn balance
$("#btn-balance").addEventListener("click", () =>{
    showElement("#balance-container")
    hideElement("#categories")
    hideElement("#reports")
})
// click btn categories
$("#btn-categories").addEventListener("click", () =>{
    showElement("#categories")
    hideElement("#balance-container")
    hideElement("#reports")
})
// click btn reports
$("#btn-reports").addEventListener("click", () =>{
    showElement("#reports")
    hideElement("#balance-container")
    hideElement("#categories")
})


// edit and delete category
$("#pencil-edit-category-btn").addEventListener("click", () =>{
    showElement("#edit-category-container")
    hideElement("#new-category-container")
})

$("#add-editCategory-btn").addEventListener("click", () =>{
    showElement("#modal-edited-category")
    addBrightness("header")
    addBrightness("main")
    addBrightness("footer")
})

$("#category-edited-btn").addEventListener("click", () =>{
    hideElement("#modal-edited-category")
    showElement("#new-category-container")
    hideElement("#edit-category-container")
    removeBrightness("header")
    removeBrightness("main")
    removeBrightness("footer")
})

$("#cancel-editCategory-btn").addEventListener("click", () =>{
    hideElement("#modal-edited-category")
    showElement("#new-category-container")
    hideElement("#edit-category-container")
    removeBrightness("header")
    removeBrightness("main")
    removeBrightness("footer")
})

/* $("#deleted-operation-btn").addEventListener("click", () =>{
    showElement("#modal-deleted-operation")
    addBrightness("header")
    addBrightness("main")
    addBrightness("footer")
}) */

/* $("#deleted-operation-current").addEventListener("click", () =>{
    hideElement("#modal-deleted-operation")
    showElement("#new-category-container")
    hideElement("#edit-category-container")
    removeBrightness("header")
    removeBrightness("main")
    removeBrightness("footer")
}) */

/* $("#no-deleted-operation-current").addEventListener("click", () =>{
    hideElement("#modal-deleted-operation")
    showElement("#new-category-container")
    hideElement("#edit-category-container")
    removeBrightness("header")
    removeBrightness("main")
    removeBrightness("footer")
}) */

/// JS PURO INICIO

//random id generator
const randomId = () => self.crypto.randomUUID()

//localStorage
const getDataStorage = (key) => JSON.parse(localStorage.getItem(key))
const setDataStorage = (key, array) => localStorage.setItem(key, JSON.stringify(array))

//cleanContainer
const cleanContainer = (selector) => $(selector).innerHTML = ""

//default type options SELECT
const defaultTypeOptions = [
    {
        id: randomId(),
        type: "Gasto"
    },
    {
        id: randomId(),
        type: "Ganancia"
    }
]

//default categories options SELECT
const defaultCategoriesOptions = [
    {
        id: randomId(),
        type: "Comida"
    },
    {
        id: randomId(),
        type: "Servicios"
    },
    {
        id: randomId(),
        type: "Salidas"
    },
    {
        id: randomId(),
        type: "Educación"
    },
    {
        id: randomId(),
        type: "Transporte"
    },
    {
        id: randomId(),
        type: "Trabajo"
    }
]


const allOperations = getDataStorage("operations") || []
const allType = getDataStorage("type") || defaultTypeOptions
const allCategories = getDataStorage("categories") || defaultCategoriesOptions

if (!getDataStorage("operations")) {
    setDataStorage("operations", [])
}


const renderOperations = (operations) => {
    cleanContainer("#operationsTable")
    if (operations.length) {
        hideElement("#balance-no-results")
        showElement("#balance-results")
        for (const { id, descriptionInput, amountInput, dateInput } of operations) {
            $("#operationsTable").innerHTML += `
            <tr class="flex flex-wrap justify-between md:flex-nowrap md:items-center">
                <td class="w-1/2 font-medium p-3 md:py-3 md:px-0 md:w-3/12 md:flex md:justify-start">${descriptionInput}</td>
                <td class="w-1/2 text-2xl p-3 text-[#48c774] font-bold md:flex md:justify-end md:w-2/12 md:text-base md:py-3 md:px-0">+${amountInput}</td>
                <td class="hidden w-1/2 md:flex md:justify-end md:w-2/12 md:py-3 md:px-0">${dateInput}</td>
                <td class="w-1/2 text-end p-3 md:flex md:justify-end md:w-2/12 md:py-3 md:px-0">
                    <button id="pencil-edit-btn" class="cursor-pointer" onclick="editOperationForm('${id}')"><i class="fa-solid fa-pencil"></i></button>
                    <button id="trash-delete-btn" class="ml-2.5 md:ml-[1.875rem] cursor-pointer" onclick="deleteOperationForm('${id}')"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            </tr>
            `
        }
    } else {
        showElement("#balance-no-results")
        hideElement("#balance-results")
    }
}

//save new operation data
const saveOperationData = () => {
    return {
        id: randomId(),
        descriptionInput: $("#descriptionInput").value,
        amountInput: $("#amountInput").value,
        dateInput: $("#dateInput").value
    }
}

//add new operation data array in local
const addOperationForm = () => {
    const currentOperations = getDataStorage("operations")
    const newOperation = saveOperationData()
    currentOperations.push(newOperation)
    setDataStorage("operations", currentOperations)
    console.log(currentOperations)
    renderOperations(currentOperations)
}

/*   ---------DELETED OPERATION---------------------DELETED OPERATION-------------------------    DELETED OPERATION  */

//delete operation data array in local
const deleteOperationForm = (id) => {
    showElement("#modal-delete-operation")
    addBrightness("header")
    addBrightness("main")
    addBrightness("footer")
    $("#deleted-operation").setAttribute("data-id", id)
}

//operation deleted
const deletedOperation = () => {
    hideElement("#modal-delete-operation")
    removeBrightness("header")
    removeBrightness("main")
    removeBrightness("footer")
    const operationId = $("#deleted-operation").getAttribute("data-id")
    const currentOperations = getDataStorage("operations").filter(operation => operation.id !== operationId)
    setDataStorage("operations", currentOperations)
    renderOperations(currentOperations)
}

/*   ---------DELETED OPERATION---------------------DELETED OPERATION-------------------------    DELETED OPERATION  */
//HIJODE PERRAAAAA


//edit operation data array in local
const editOperationForm = (id) => {
    showElement("#new-operation-container")
    hideElement("#balance-container")
    hideElement("#new-operation-title")
    showElement("#edit-operation-title")
    hideElement("#add-operation-btn")
    showElement("#edit-operation-btn")
    $("#operation-edited-btn").setAttribute("data-id", id)
    const operationSelected = getDataStorage("operations").find(operation => operation.id === id)
    $("#descriptionInput").value = operationSelected.descriptionInput
    $("#amountInput").value = operationSelected.amountInput
    $("#dateInput").value = operationSelected.dateInput
}

//edited operation
const editedOperation = () => {
    hideElement("#modal-edited-operation")
    hideElement("#new-operation-container")
    showElement("#balance-container")
    removeBrightness("header")
    removeBrightness("main")
    removeBrightness("footer")
    const operationId = $("#operation-edited-btn").getAttribute("data-id")
    const editedOperations = getDataStorage("operations").map(operation => {
        if (operation.id === operationId) {
            return saveOperationData()
        }
        return operation
    })
    setDataStorage("operations", editedOperations)
    renderOperations(editedOperations)
}


const initializeApp = () => {
    setDataStorage("operations", allOperations)
    setDataStorage("categories", allCategories)
    setDataStorage("type", allType)
    renderOperations(allOperations)

    /* new operation */
    $("#new-operation-btn").addEventListener("click", () => {
        showElement("#add-operation-btn")
        hideElement("#edit-operation-btn")
        hideElement("#balance-container")
        showElement("#new-operation-container")
        hideElement("#edit-operation-title")
        showElement("#new-operation-title")
    })

    /* modal operation added ok */
    $("#operation-added-btn").addEventListener("click", () => {
        hideElement("#new-operation-container")
        showElement("#balance-container")
        hideElement("#modal-new-operation-done")
        removeBrightness("header")
        removeBrightness("main")
        removeBrightness("footer")
        addOperationForm()
    })


    /* modal edited operation btn ok */
    $("#operation-edited-btn").addEventListener("click", () => {
        editedOperation()
    })
    

    /* modal deleted operation btn ok*/
    $("#deleted-operation").addEventListener("click", deletedOperation)

    /* modal no deleted operation btn ok */
    $("#no-deleted-operation").addEventListener("click", () => {
        hideElement("#modal-delete-operation")
        removeBrightness("header")
        removeBrightness("main")
        removeBrightness("footer")
    })
}

window.addEventListener("load", initializeApp)