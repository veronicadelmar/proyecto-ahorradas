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
    hideElement("#new-operation-container")
})
// click btn reports
$("#btn-reports").addEventListener("click", () =>{
    showElement("#reports")
    hideElement("#balance-container")
    hideElement("#categories")
    hideElement("#new-operation-container")
})


// edit and delete category

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



/// JS PURO INICIO

//random id generator
const randomId = () => self.crypto.randomUUID()

//localStorage
const getDataStorage = (key) => JSON.parse(localStorage.getItem(key))
const setDataStorage = (key, array) => localStorage.setItem(key, JSON.stringify(array))

//cleanContainer
const cleanContainer = (selector) => $(selector).innerHTML = ""


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
const allCategories = getDataStorage("categories") || defaultCategoriesOptions

if (!getDataStorage("operations")) {
    setDataStorage("operations", [])
}


const renderOperations = (operations) => {
    cleanContainer("#operationsTable")
    if (operations.length) {
        hideElement("#balance-no-results")
        showElement("#balance-results")
        for (const { id, descriptionInput, category, amountInput, dateInput, type } of operations) {
            const spentAmount = type === "Ganancia" ? "text-[#48c774]" : "text-[#f14668]"
            const gainAmount = type === "Ganancia" ? "+" : "-"
            const categorySelected = getDataStorage("categories").find(currentCategory => currentCategory.id === category)
            $("#operationsTable").innerHTML += `
            <tr class="flex flex-wrap justify-between md:flex-nowrap md:items-center">
                <td class="w-1/2 font-medium p-3 md:py-3 md:px-0 md:w-3/12 md:flex md:justify-start">${descriptionInput}</td>
                <td class="flex justify-end w-1/2 text-xs p-3 text-[#00947e] md:w-3/12 md:justify-start md:py-3 md:px-0"><span class="bg-[#ebfffc] px-2 py-0.5 rounded">${categorySelected.type}</span></td>
                <td class="hidden w-1/2 md:flex md:justify-end md:w-2/12 md:py-3 md:px-0">${dateInput}</td>
                <td class="${spentAmount} w-1/2 text-2xl p-3 font-bold md:flex md:justify-end md:w-2/12 md:text-base md:py-3 md:px-0">${gainAmount}${amountInput}</td>
                <td class="w-1/2 text-end p-3 md:flex md:justify-end md:w-2/12 md:py-3 md:px-0">
                    <button class="pencil-edit-btn cursor-pointer" onclick="editOperationForm('${id}')"><i class="fa-solid fa-pencil"></i></button>
                    <button class="trash-delete-btn ml-2.5 md:ml-[1.875rem] cursor-pointer" onclick="deleteOperationForm('${id}')"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            </tr>
            `
        }
    } else {
        showElement("#balance-no-results")
        hideElement("#balance-results")
    }
}


//render categories options
const renderCategoriesOptions = (categories) => {
    cleanContainer("#categoriesSelect")
    for (const category of categories) {
        $("#categoriesSelect").innerHTML += `
        <option value="${category.type}" data-id="${category.id}">${category.type}</option>`
    }
}

//save new operation data
const saveOperationData = () => {
    const typeValue = $("#typeOperation").value
    const categoryId = $("#categoriesSelect").options[$("#categoriesSelect").selectedIndex].getAttribute("data-id")
    return {
        id: randomId(),
        descriptionInput: $("#descriptionInput").value,
        amountInput: $("#amountInput").value,
        dateInput: $("#dateInput").value,
        type: typeValue,
        category: categoryId
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
    const selectedOperation = getDataStorage("operations").find(operation => operation.id === id)
    $("#modal-operation-name").innerHTML = selectedOperation.descriptionInput
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
    renderOperations(allOperations)
    renderCategoriesOptions(allCategories)


    /* new operation */
    $("#new-operation-btn").addEventListener("click", () => {
        showElement("#add-operation-btn")
        hideElement("#edit-operation-btn")
        hideElement("#balance-container")
        showElement("#new-operation-container")
        $("#form-operation").reset()
        $("#operation-title").innerHTML = "Nueva operación"
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

    //pencil edit categoy container
/*     $(".pencil-edit-btn").addEventListener("click", () => {
        $("#operation-title").innerHTML = "Editar operación"
    }) */


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