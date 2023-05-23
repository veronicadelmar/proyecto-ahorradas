/*  selector */
const $ = (selector) => document.querySelector(selector)

/* adding and removing class elements */
const hideElement = (selector) => $(selector).classList.add("hidden")
const showElement = (selector) => $(selector).classList.remove("hidden")

/* adding filter */
const addBrightness = (selector) => $(selector).style.filter = ("brightness(0.5)")
const removeBrightness = (selector) => $(selector).style.filter = ("brightness()")

//MENU HAMBURGUESA 

$("#hamburger-menu").addEventListener("click", () => {
    $(".nav-ul").classList.toggle("hidden")
    $(".nav-ul").classList.toggle("text-[#4a4a4a]")
    $("main").classList.toggle("mt-[130px]")
    $(".header-section").classList.toggle("relative")
    $(".nav-bar").classList.toggle("absolute")
    $(".nav-bar").classList.toggle("top-[50px]")
    $(".nav-bar").classList.toggle("left-[5px]")
    $("nav").classList.toggle("p-2.5")
    $(".nav-ul").classList.toggle("flex-col")
    $("#btn-balance").classList.toggle("mb-[15px]")
    $("#btn-categories").classList.toggle("mb-[15px]")
    $("#btn-reports").classList.toggle("mb-[15px]")
})


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


const renderOperations = (operations) => {
    cleanContainer("#operations-table")
    if (operations.length) {
        hideElement("#balance-no-results")
        showElement("#balance-results")
        for (const { id, descriptionInput, category, amountInput, dateInput, type } of operations) {
            const spentAmount = type === "Ganancia" ? "text-[#48c774]" : "text-[#f14668]"
            const gainAmount = type === "Ganancia" ? "+" : "-"
            const categorySelected = getDataStorage("categories").find(currentCategory => currentCategory.id === category)
            $("#operations-table").innerHTML += `
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
    cleanContainer("#categories-select")
    cleanContainer("#filter-category")
    for (const category of categories) {
        $("#categories-select").innerHTML += `
        <option value="${category.type}" data-id="${category.id}">${category.type}</option>`
        $("#filter-category").innerHTML += `
        <option value="${category.type}" data-id="${category.id}">${category.type}</option>`
    }
}

//save new operation data
const saveOperationData = () => {
    const typeValue = $("#type-operation").value
    const categoryId = $("#categories-select").options[$("#categories-select").selectedIndex].getAttribute("data-id")
    return {
        id: randomId(),
        descriptionInput: $("#description-input").value,
        amountInput: $("#amount-input").value,
        dateInput: $("#date-input").value,
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

//edit operation data array in local
const editOperationForm = (id) => {
    showElement("#new-operation-container")
    hideElement("#balance-container")
    hideElement("#add-operation-btn")
    showElement("#edit-operation-btn")
    $("#operation-edited-btn").setAttribute("data-id", id)
    const operationSelected = getDataStorage("operations").find(operation => operation.id === id)
    $("#description-input").value = operationSelected.descriptionInput
    $("#amount-input").value = operationSelected.amountInput
    $("#date-input").value = operationSelected.dateInput
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

//category
const renderCategoriesList = (categories) => {
    cleanContainer("#category-list")
    if (categories.length) {
        for (const {id, type} of categories) {
            $("#category-list").innerHTML += `
            <li class="mb-8 flex justify-between"><span class="text-[#00947e] bg-[#ebfffc] p-1 rounded">${type}</span>
            <div>
                <button class="mr-6" onclick="editCategory('${id}')"><i class="fa-solid fa-pencil"></i></button>
                <button class="delete-category-btn" onclick="deleteCategory('${id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
            </li>
            `
        }
    }
}



//save new category
const saveNewCategory = () => {
    return {
        id: randomId(),
        type: $("#category-input").value
    }
}

// add new category
const addNewCategory = () => {
    const currentCategory = getDataStorage("categories")
    const newCategory = saveNewCategory()
    currentCategory.push(newCategory)
    setDataStorage("categories", currentCategory)
    renderCategoriesList(currentCategory)
    renderCategoriesOptions(currentCategory)
}


//delete category
const deleteCategory = (id) => {
    const deletedCategory = getDataStorage("categories").filter(category => category.id !== id)
    setDataStorage("categories", deletedCategory)
    renderCategoriesList(deletedCategory)
    renderCategoriesOptions(deletedCategory)
}


//edit category
//esta funcion hace lo mismo que saveNewCategory(), a mejorar y utilizar parametros y ternario para combinar
const saveEditedCategory = (categoryId) => {
    return {
        id: categoryId,
        type: $("#edit-category-input").value
    }
}


const editCategory = (id) => {
    hideElement("#new-category-container")
    showElement("#edit-category-container")
    const idCategorySelected = id
    const editCategorySelected = getDataStorage("categories").find(category => category.id === idCategorySelected)
    $("#edit-category-input").value = editCategorySelected.type
    $("#add-editCategory-btn").setAttribute("data-id", id)
}


const editedCategory = (id) => {
    const idCategorySelected = id
    const editedCategory = getDataStorage("categories").map(category => {
        if (category.id === idCategorySelected) {
            return saveEditedCategory(idCategorySelected)
        }
        return category
    })
    setDataStorage("categories", editedCategory)
    renderCategoriesOptions(editedCategory)
    renderCategoriesList(editedCategory)
}


// render summary
const renderSummary = () =>{
    const currentOperations = getDataStorage("operations")
    const listCategories = getDataStorage("categories")
    if (currentOperations.length >= 2){
        hideElement(".insufficientOperations")
        showElement(".summaryContainer")
        bestProfitCategory(currentOperations)
        higherExpenseCategory(currentOperations)
        bestBalance(currentOperations)
        bestProfitMonths(currentOperations)
        higherExpenseMonths(currentOperations)
        renderReportsCategories(currentOperations, listCategories)
        totalsForMonths(currentOperations)
    } else {
        showElement(".insufficientOperations")
        hideElement(".summaryContainer")
    }
}

// best profit category
const bestProfitCategory = (operations) => {
    const categories = getDataStorage("categories")
    let profitCategory = 0
    let categoryId = ""

    for (const category of categories) {
      const profit = operations.reduce((total, operation) => {
        if (operation.category === category.id && operation.type === "Ganancia") {
          return total + parseFloat(operation.amountInput)
        }
        return total
      }, 0)
  
      if (profit > profitCategory) {
        profitCategory = profit
        categoryId = category.id
      }
    }
    $("#best-profit").innerHTML = categories.find((category) => category.id === categoryId)?.type || ""
    $("#best-profit-amount").innerHTML = "+$"+profitCategory
  }

// higher expense category
const higherExpenseCategory = (operations) => {
    const categories = getDataStorage("categories")
    let expenseCategory = 0
    let categoryId = ""

    for (const category of categories) {
        const expense = operations.reduce((total, operation) => {
          if (operation.category === category.id && operation.type === "Gasto") {
            return total + parseFloat(operation.amountInput)
          }
          return total
        }, 0)
    
        if (expense > expenseCategory) {
            expenseCategory = expense
            categoryId = category.id
        }
      }
    $("#higher-expense").innerHTML = categories.find((category) => category.id === categoryId)?.type || ""
    $("#higher-expense-category").innerHTML = "-$"+expenseCategory
  }
  
  // best balance category
  const bestBalance = (operations) => {
    const categories = getDataStorage("categories")
    let maxBalance = 0
    let categoryId = ""
    for (const category of categories) {
        const balance = operations.reduce((total, operation) => {
            if (operation.category === category.id && operation.type === "Ganancia") {
                return total + parseFloat(operation.amountInput)
            }
            if (operation.category === category.id && operation.type === "Gasto") {
                return total - parseFloat(operation.amountInput)
            }  
            return total
        }, 0)

    if (balance > maxBalance) {
        maxBalance = balance
        categoryId = category.id
      }
    }


    $("#best-balance").innerHTML = categories.find((category) => category.id === categoryId)?.type || ""
    $("#balance-category").innerHTML = maxBalance
}


// best profit months
const bestProfitMonths = (operations) => {
    let bestMonths = ""
    let bestProfit = 0
    let operationsWithoutDays = []
    let uniqueMonths = []
    for (const operation of operations) {
        const dateInput = new Date(operation.dateInput)
        let month = dateInput.getUTCMonth() + 1
        let year = dateInput.getFullYear()
        const yearMonth = year + "/" + month
        if (!uniqueMonths.includes(yearMonth)) {
            uniqueMonths.push(yearMonth)
        }
        operationsWithoutDays.push({
            dateWithoutDays: yearMonth,
            amount: operation.amountInput,
            type: operation.type
        })
    }

    for (let i = 0; i < uniqueMonths.length; i++) {
        let profit = 0
        for (const operation of operationsWithoutDays) {
            if (uniqueMonths[i] === operation.dateWithoutDays && operation.type === "Ganancia") {
                profit += parseInt(operation.amount)
            }
        }
        if (profit > bestProfit) {
            bestProfit = profit
            bestMonths = uniqueMonths[i]
        }
    }
    $("#best-month-profit").innerHTML = bestMonths
    $("#best-month-profit-amount").innerHTML = "+$"+bestProfit
}

// higher expense months
const higherExpenseMonths = (operations) => {
    let higherMonths = ""
    let higherExpense = 0
    let operationsWithoutDays = []
    let uniqueMonths = []
    for (const operation of operations) {
        const dateInput = new Date(operation.dateInput)
        let month = dateInput.getUTCMonth() + 1
        let year = dateInput.getFullYear()
        const yearMonth = year + "/" + month
        if (!uniqueMonths.includes(yearMonth)) {
            uniqueMonths.push(yearMonth)
        }
        operationsWithoutDays.push({
            dateWithoutDays: yearMonth,
            amount: operation.amountInput,
            type: operation.type
        })
    }

    for (let i = 0; i < uniqueMonths.length; i++) {
        let expense = 0
        for (const operation of operationsWithoutDays) {
            if (uniqueMonths[i] === operation.dateWithoutDays && operation.type === "Gasto") {
                expense += parseInt(operation.amount)
            }
        }
        if (expense > higherExpense) {
            higherExpense = expense
            higherMonths = uniqueMonths[i]
        }
    }
    $("#higher-month-expense").innerHTML = higherMonths
    $("#higher-month-expense-amount").innerHTML = "-$"+ higherExpense
}

//total por categorias
const renderReportsCategories = (operations, categories) => {
    const categoriesWithOperations = []
    for (const category of categories) {
        let profit = 0
        let expense = 0
        let balance = 0
        
        for(const operation of operations){
            if(category.id === operation.category){
                if(operation.type === "Ganancia"){
                    profit += parseFloat(operation.amountInput)
                    balance += parseFloat(operation.amountInput)
                }
                if(operation.type === "Gasto"){
                    expense += parseFloat(operation.amountInput)
                    balance -= parseFloat(operation.amountInput)
                }
            }
        }
        if(profit > 0 || expense >0){
            categoriesWithOperations.push({
                name: category.type,
                profit: profit,
                expense: expense,
                balance: balance
            })
        }
    }
    cleanContainer("#totalsByCategories")
    $("#totalsByCategories").innerHTML += `
    <tr class="hidden sm:flex sm:text-left sm:justify-between">
        <th class="mb-2 p-1 w-1/4">Categoria</th>
        <th class="mb-2 p-1 w-1/4">Ganancia</th>
        <th class="mb-2 p-1 w-1/4">Gastos</th>
        <th class="mb-2 p-1 w-1/4">Balance</th>
    </tr>
        `
    for (const {name, profit, expense, balance} of categoriesWithOperations){
        $("#totalsByCategories").innerHTML += `
        <tr class="flex flex-col text-center mb-5 sm:flex-row sm:text-left sm:justify-between sm:mb-2">
            <th class="mb-2 w-1/4">${name}</th>
            <td class="text-[#48c774] font-semibold mb-2 w-1/4">$${profit}</td>
            <td class="text-[#f14668] font-semibold mb-2 w-1/4">$${expense}</td>
            <td class="font-semibold mb-2 w-1/4">$${balance}</td>
        </tr>
        `
    }
}

// total por mes
const totalsForMonths = (operations) => {
    let operationsWithoutDays = []
    let uniqueMonths = []
    for (const operation of operations) {
        const dateInput = new Date(operation.dateInput)
        let month = dateInput.getUTCMonth() + 1
        let year = dateInput.getFullYear()
        const yearMonth = year + "/" + month
        if (!uniqueMonths.includes(yearMonth)) {
            uniqueMonths.push(yearMonth)
        }
        operationsWithoutDays.push({
            dateWithoutDays: yearMonth,
            amount: operation.amountInput,
            type: operation.type
        })
    }

    cleanContainer("#totalsByMonth")
    $("#totalsByMonth").innerHTML += `
    <tr class="hidden sm:flex sm:text-left sm:justify-between">
         <th class="mb-2 p-1 w-1/4">Mes</th>
         <th class="mb-2 p-1 w-1/4">Ganancia</th>
         <th class="mb-2 p-1 w-1/4">Gastos</th>
         <th class="mb-2 p-1 w-1/4">Balance</th>
    </tr> `


    for (let i = 0; i < uniqueMonths.length; i++) {
        let name = uniqueMonths[i]
        let profit = 0
        let expense = 0
        let balance = 0
        for(const operation of operationsWithoutDays){
            if(name === operation.dateWithoutDays){
                if(operation.type === "Ganancia"){
                    profit += parseFloat(operation.amount)
                    balance += parseFloat(operation.amount)
                }
                if(operation.type === "Gasto"){
                    expense += parseFloat(operation.amount)
                    balance -= parseFloat(operation.amount)
                }
            }
        }
        $("#totalsByMonth").innerHTML += `
        <tr class="flex flex-col text-center mb-5 sm:flex-row sm:text-left sm:justify-between sm:mb-2">
             <th class="mb-2 w-1/4">${name}</th>
             <td class="text-[#48c774] font-semibold mb-2 w-1/4">$${profit}</td>
             <td class="text-[#f14668] font-semibold mb-2 w-1/4">$${expense}</td>
             <td class="font-semibold mb-2 w-1/4">$${balance}</td>
        </tr>`
    }
   
}




const initializeApp = () => {
    setDataStorage("operations", allOperations)
    setDataStorage("categories", allCategories)
    renderOperations(allOperations)
    renderCategoriesOptions(allCategories)
    renderCategoriesList(allCategories)
    

    // click btn balance
    $("#btn-balance").addEventListener("click", () =>{
        showElement("#balance-container")
        hideElement("#categories")
        hideElement("#reports")
        hideElement("#new-operation-container")
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

        renderSummary()
        showElement("#reports")
        hideElement("#balance-container")
        hideElement("#categories")
        hideElement("#new-operation-container")

    })

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

    //add category btn
    $("#add-category-btn").addEventListener("click", () => {
        addNewCategory()
        $("#category-input").value = ""
    })

    //candel edit category
    $("#cancel-editCategory-btn").addEventListener("click", () => {
        showElement("#new-category-container")
        hideElement("#edit-category-container")
    })

    //edited category ok
    $("#add-editCategory-btn").addEventListener("click", () => {
        showElement("#new-category-container")
        hideElement("#edit-category-container")
        editedCategory($("#add-editCategory-btn").getAttribute("data-id"))
    })

}

window.addEventListener("load", initializeApp)