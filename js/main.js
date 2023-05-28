/* selector */
const $ = (selector) => document.querySelector(selector)

/* adding and removing class elements */
const hideElement = (selector) => $(selector).classList.add("hidden")
const showElement = (selector) => $(selector).classList.remove("hidden")

/* adding filter */
const addBrightness = (selector) => $(selector).style.filter = ("brightness(0.5)")
const removeBrightness = (selector) => $(selector).style.filter = ("brightness()")

//apply autofocus
const setFocus = (selector) => $(selector).focus()

// hamburguer menu 
$("#hamburger-menu").addEventListener("click", () => {
    if (!$("#hamburger-menu").classList.contains("hidden")) {
        $(".nav-ul").classList.toggle("hidden")
        $("main").classList.toggle("mt-[130px]")
    }
})

$("#hide-filters").addEventListener("click", () => {
    $("#toggle-filters").classList.toggle("hidden")
})

/* modal operation check  */
$("#add-operation-btn").addEventListener("click", (e) => {
    e.preventDefault()
    if (validateNewOperation()) {
        showElement("#modal-new-operation-done")
        addBrightness("header")
        addBrightness("main")
        addBrightness("footer")
        hideElement(".invalid-name-operation")
        hideElement(".invalid-amount")
    }
})

/* btn back to balance */
$("#cancel-operation-btn").addEventListener("click", (e) => {
    e.preventDefault()
    hideElement("#new-operation-container")
    showElement("#balance-container")
    if (!validateNewOperation()) {
        hideElement(".invalid-name-operation")
        hideElement(".invalid-amount")
    }
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

//random id generator
const randomId = () => self.crypto.randomUUID()

//localStorage
const getDataStorage = (key) => JSON.parse(localStorage.getItem(key))
const setDataStorage = (key, array) => localStorage.setItem(key, JSON.stringify(array))

//cleanContainer
const cleanContainer = (selector) => $(selector).innerHTML = ""

//default categories options select
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
    //filtered operations
    const filteredOperations = []
    const typeSelected = $("#filter-type").value
    const categorySelectedForm = $("#filter-category").value
    const date = $("#filter-date").value
    const order = $("#filter-order").value
    const orderDate = dateToString(date)
    //balance
    let expense = 0
    let profit = 0
    let balance = 0

    // filters type, category and date
    for (const operation of operations){
        const categorySelected = getDataStorage("categories").find(currentCategory => currentCategory.id === operation.category)
        if((typeSelected === "Todos" || typeSelected === operation.type) && (categorySelectedForm === "Todas" || categorySelectedForm === categorySelected.type) && (orderDate <= operation.dateInput)){
            filteredOperations.push(operation)
        }
    }

    let sortedOperations = []
    switch (order) {
        case 'mas-recientes':
            sortedOperations = filteredOperations.sort((a, b) => a.dateInput.localeCompare(b.dateInput))
            break 
        case 'menos-recientes':
            sortedOperations = filteredOperations.sort((a, b) => b.dateInput.localeCompare(a.dateInput))
            break
        case 'mayor-monto':
            sortedOperations = filteredOperations.sort((a, b) => a.amountInput + b.amountInput)
            break
        case 'menor-monto':
            sortedOperations = filteredOperations.sort((a, b) => a.amountInput - b.amountInput)
             break
        case 'a/z':
            sortedOperations = filteredOperations.sort((a, b) => a.descriptionInput.localeCompare(b.descriptionInput))
            break
        case 'z/a':
            sortedOperations = filteredOperations.sort((a, b) => b.descriptionInput.localeCompare(a.descriptionInput))
            break
    }
    cleanContainer("#operations-table")
    cleanContainer("#show-profit")
    cleanContainer("#show-expense")
    cleanContainer("#show-balance")
    if (sortedOperations.length) {
        hideElement("#balance-no-results")
        showElement("#balance-results")
        for (const { id, descriptionInput, category, amountInput, dateInput, type } of sortedOperations) {
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
            //render balance
            if(type === "Ganancia"){
                profit += parseFloat(amountInput)
                balance += parseFloat(amountInput)
            }
            if(type === "Gasto"){
                expense -= parseFloat(amountInput)
                balance -= parseFloat(amountInput)
            }
        }

    } else {
        showElement("#balance-no-results")
        hideElement("#balance-results")
    }
    $("#show-profit").innerHTML = `$`+ profit
    $("#show-expense").innerHTML = `$`+ expense
    $("#show-balance").innerHTML = `$`+ balance
    console.log(sortedOperations)
}

//validate new operation
const validateNewOperation = () => {
    const operationName = $("#description-input").value.trim()
    const regAmount = new RegExp("^(0|[1-9]\\d*)(\\.\\d+)?$")
    const amount = $("#amount-input").value

    if (operationName == "") {
        showElement(".invalid-name-operation")
    } else {
        hideElement(".invalid-name-operation")
    }

    if (!regAmount.test(amount) || amount == "0") {
        showElement(".invalid-amount")
    } else {
        hideElement(".invalid-amount")
    }

    const validateOk = operationName !== "" && regAmount.test(amount) && amount !== "0"
    return validateOk
}

//get date 
const getFullDate = (date) => {
    const currentDate = new Date()
    let dayDate = String(currentDate.getDate()).padStart(2, '0')
    let monthDate = String(currentDate.getMonth() + 1).padStart(2, '0')
    const yearDate = currentDate.getFullYear()

    return date(yearDate, monthDate, dayDate)
}

//input date new operation: current day
const currentDate = (year, month, day) => `${year}-${month}-${day}`

//input date: filter balance 
const firstDayMonth = (year, month) => {
    const firstDay = "01"
    return `${year}-${month}-${firstDay}`
}

const dateToString = (date) => {
    const splitDate = date.split("-")
    return `${splitDate[0]}-${splitDate[1]}-${splitDate[2]}`
}

//save new operation data
const saveOperationData = (operationId) => {
    const typeValue = $("#type-operation").value
    const categoryId = $("#categories-select").options[$("#categories-select").selectedIndex].getAttribute("data-id")
    const date =  $("#date-input").value
    const orderDate = dateToString(date)

    return {
        id: operationId ? operationId : randomId(),
        descriptionInput: $("#description-input").value,
        amountInput: $("#amount-input").value,
        dateInput: orderDate,
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

//edit operation data array in local
const editOperationForm = (id) => {
    showElement("#new-operation-container")
    hideElement("#balance-container")
    hideElement("#add-operation-btn")
    showElement("#edit-operation-btn")
    $("#operation-edited-btn").setAttribute("data-id", id)
    const operationSelected = getDataStorage("operations").find(operation => operation.id === id)
    let date = operationSelected.dateInput.split("-")
    let orderDate = `${date[2]}-${date[1]}-${date[0]}`
    $("#description-input").value = operationSelected.descriptionInput
    $("#amount-input").value = operationSelected.amountInput
    $("#type-operation").value = operationSelected.type
    //find category selected
    $("#categories-select").value = findCategorySelected(operationSelected)
    $("#date-input").value = orderDate
}

//find category selected
const findCategorySelected = (operationSelected) => {
    const categories = getDataStorage("categories")
    const category = categories.find(category => category.id == operationSelected.category)
    return category ? category.type : categories[0].type
}

//Total operations by category
const totalOperationsCategory = (categoryId) => getDataStorage("operations").filter(operation => operation.category === categoryId).length

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
            return saveOperationData(operationId)
        }
        return operation
    })
    setDataStorage("operations", editedOperations)
    renderOperations(editedOperations)
}

//Category
const renderCategoriesList = (categories) => {
    cleanContainer("#category-list")
    if (categories.length) {
        for (const {id, type} of categories) {
            $("#category-list").innerHTML += `
            <li class="mb-8 flex justify-between"><span class="text-[#00947e] bg-[#ebfffc] p-1 rounded">${type}</span>
            <div>
                <button class="mr-6" onclick="editCategory('${id}')"><i class="fa-solid fa-pencil"></i></button>
                <button  onclick="modalDeteleCategory('${id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
            </li>`
        }
    }
}

//render categories options
const renderCategoriesOptions = (categories) => {
    cleanContainer("#categories-select")
    cleanContainer("#filter-category")
    //adding category "Todas" to lists
    $("#filter-category").innerHTML += `
        <option value="Todas">Todas</option>`
    for (const category of categories) {
        $("#categories-select").innerHTML += `
        <option value="${category.type}" data-id="${category.id}">${category.type}</option>`
        $("#filter-category").innerHTML += `
        <option value="${category.type}" data-id="${category.id}">${category.type}</option>`
    }
}

// save category , for add new category and edit category
const saveCategory = (categoryId) => {
    const inputField = (categoryId ? "#edit-category-input" : "#category-input")
    const type = $(inputField).value
    return {
      id: (categoryId ? categoryId : randomId()),
      type: type
    }
  }
  
// add new category
const addNewCategory = () => {
    const currentCategory = getDataStorage("categories")
    const newCategory = saveCategory()
    currentCategory.push(newCategory)
    setDataStorage("categories", currentCategory)
    renderCategoriesList(currentCategory)
    renderCategoriesOptions(currentCategory)
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
            return saveCategory(idCategorySelected)
        }
        return category
    })
    setDataStorage("categories", editedCategory)
    renderCategoriesOptions(editedCategory)
    renderCategoriesList(editedCategory)
}

//modal delete category
const modalDeteleCategory = (id) => {
    addBrightness("header")
    addBrightness("main")
    addBrightness("footer")
    $("#delete-category-current").setAttribute("data-id", id)
    const categorySelected = getDataStorage("categories").find(category => category.id === id)

    if (totalOperationsCategory(id) > 0) {
        showElement("#modal-cant-delete-category")
        $("#modal-cant-delete-category-name").innerHTML = categorySelected.type
        $("#modal-cant-delete-total").innerHTML = totalOperationsCategory(id)
    } else {
        showElement("#modal-delete-category")
        $("#modal-category-name").innerHTML = categorySelected.type
    }
}


//delete category
const deleteCategory = () => {
    const categoryId = $("#delete-category-current").getAttribute("data-id")
    const deletedCategory = getDataStorage("categories").filter(category => category.id !== categoryId)
    setDataStorage("categories", deletedCategory)
    renderCategoriesList(deletedCategory)
    renderCategoriesOptions(deletedCategory)
}

//Reports
const renderReports = () =>{
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
                profit += parseFloat(operation.amount)
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
                expense += parseFloat(operation.amount)
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

//totals by categories
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
        </tr>`
    }
}

// totals by month
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
    $("#filter-date").value = getFullDate(firstDayMonth)
    setDataStorage("operations", allOperations)
    setDataStorage("categories", allCategories)
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
        setFocus("#category-input")
    })

    // click btn reports
    $("#btn-reports").addEventListener("click", () =>{
        renderReports()
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
        $("#date-input").value = getFullDate(currentDate)
        setFocus("#description-input")
    })

    /* amount input check */
    $("#amount-input").addEventListener("input", (e) => {
        const amountValue = e.target.valueAsNumber
        if (isNaN(amountValue)) {
            $("#amount-input").value = ""
        }
    })

    // filters
    $("#filters-container").addEventListener("change", () => {
        const currentOperations = getDataStorage("operations")
        renderOperations(currentOperations)
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

    //no delete category
    $("#no-delete-category-current").addEventListener("click", () => {
        hideElement("#modal-delete-category")
        removeBrightness("header")
        removeBrightness("main")
        removeBrightness("footer")
    })

    $("#cant-delete-category-current").addEventListener("click", () => {
        hideElement("#modal-cant-delete-category")
        removeBrightness("header")
        removeBrightness("main")
        removeBrightness("footer")
    })

    //delete category ok
    $("#delete-category-current").addEventListener("click", () => {
        hideElement("#modal-delete-category")
        removeBrightness("header")
        removeBrightness("main")
        removeBrightness("footer")
        deleteCategory()
    })


    renderOperations(allOperations)
}

window.addEventListener("load", initializeApp)