/* --- HANDLERS ---S */
/* selector */
const $ = (selector) => document.querySelector(selector)

//hide elements 
const hideElements = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.add("hidden")
    }
}

//show elements
const showElements = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.remove("hidden")
    }
}

// adding brightness 
const addingBrigthness = (selectors) => {
    for (const selector of selectors) {
        $(selector).style.filter = ("brightness(0.5)")
    }
}

// removing brightness 
const removingBrigthness = (selectors) => {
    for (const selector of selectors) {
        $(selector).style.filter = ("brightness()")
    }
}

//apply autofocus
const setFocus = (selector) => $(selector).focus()

//random id generator
const randomId = () => self.crypto.randomUUID()

//localStorage
const getDataStorage = (key) => JSON.parse(localStorage.getItem(key))
const setDataStorage = (key, array) => localStorage.setItem(key, JSON.stringify(array))

//clean containers
const cleanContainers = (selectors) => {
    for (const selector of selectors) {
        $(selector).innerHTML = ""
    }
}

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
    const order = $("#filter-order").value
    const orderDate = new Date($("#filter-date").value)
    //balance
    let expense = 0
    let profit = 0
    let balance = 0

    // filters type, category and date
    for (const operation of operations) {
        const categorySelected = getDataStorage("categories").find(currentCategory => currentCategory.id === operation.category)
        let operationDate = stringToDate(operation.dateInput)
        if((typeSelected === "Todos" || typeSelected === operation.type) && (categorySelectedForm === "Todas" || categorySelectedForm === categorySelected.type) && (orderDate <= operationDate)) {
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
    
    cleanContainers(["#operations-table", "#show-profit", "#show-expense", "#show-balance"])

    if (sortedOperations.length) {
        hideElements(["#balance-no-results"])
        showElements(["#balance-results"])
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
        showElements(["#balance-no-results"])
        hideElements(["#balance-results"])
    }
    $("#show-profit").innerHTML = `$ +`+ profit
    $("#show-expense").innerHTML = `$ `+ expense
    $("#show-balance").innerHTML = `$`+ balance
}

//validate new operation
const validateNewOperation = () => {
    const operationName = $("#description-input").value.trim()
    const regAmount = new RegExp("^(0|[1-9]\\d*)(\\.\\d+)?$")
    const amount = $("#amount-input").value

    if (operationName == "") {
        showElements([".invalid-name-operation"])
    } else {
        hideElements([".invalid-name-operation"])
    }

    if (!regAmount.test(amount) || amount == "0") {
        showElements([".invalid-amount"])
    } else {
        hideElements([".invalid-amount"])
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
    return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`
}

const stringToDate = (dateString) => {
    const splitDate = dateString.split("-")
    const date = new Date(splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0])
    return date
}

const reportDate = (date) => {
    //return date with follow format MM/YYYY
    const month = ("0" + (date.getUTCMonth()+1)).slice(-2)
    const year = date.getFullYear()
    return month + "/" + year
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

//delete operation data array in local
const deleteOperationForm = (id) => {
    showElements(["#modal-delete-operation"])
    addingBrigthness(["header", "main", "footer"])
    $("#deleted-operation").setAttribute("data-id", id)
    const selectedOperation = getDataStorage("operations").find(operation => operation.id === id)
    $("#modal-operation-name").innerHTML = selectedOperation.descriptionInput
}

//operation deleted
const deletedOperation = () => {
    hideElements(["#modal-delete-operation"])
    removingBrigthness(["header", "main", "footer"])
    const operationId = $("#deleted-operation").getAttribute("data-id")
    const currentOperations = getDataStorage("operations").filter(operation => operation.id !== operationId)
    setDataStorage("operations", currentOperations)
    renderOperations(currentOperations)
}

//edit operation data array in local
const editOperationForm = (id) => {
    showElements(["#new-operation-container", "#edit-operation-btn"])
    hideElements(["#balance-container", "#add-operation-btn"])
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

//edited operation
const editedOperation = () => {
    hideElements(["#modal-edited-operation", "#new-operation-container"])
    showElements(["#balance-container"])
    removingBrigthness(["header", "main", "footer"])
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

//find category selected
const findCategorySelected = (operationSelected) => {
    const categories = getDataStorage("categories")
    const category = categories.find(category => category.id == operationSelected.category)
    return category ? category.type : categories[0].type
}

//Total operations by category
const totalOperationsCategory = (categoryId) => getDataStorage("operations").filter(operation => operation.category === categoryId).length


//Category
const renderCategoriesList = (categories) => {
    cleanContainers(["#category-list"])
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
    cleanContainers(["#categories-select", "#filter-category"])
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
    hideElements(["#new-category-container"])
    showElements(["#edit-category-container"])
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
    addingBrigthness(["header", "main", "footer"])
    $("#delete-category-current").setAttribute("data-id", id)
    const categorySelected = getDataStorage("categories").find(category => category.id === id)

    if (totalOperationsCategory(id) > 0) {
        showElements(["#modal-cant-delete-category"])
        $("#modal-cant-delete-category-name").innerHTML = categorySelected.type
        $("#modal-cant-delete-total").innerHTML = totalOperationsCategory(id)
    } else {
        showElements(["#modal-delete-category"])
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
    if (currentOperations.length >= 2) {
        hideElements([".insufficientOperations"])
        showElements([".summaryContainer"])
        bestProfitCategory(currentOperations)
        higherExpenseCategory(currentOperations)
        bestBalance(currentOperations)
        bestProfitMonths(currentOperations)
        higherExpenseMonths(currentOperations)
        renderReportsCategories(currentOperations, listCategories)
        totalsForMonths(currentOperations)
    } else {
        showElements([".insufficientOperations"])
        hideElements([".summaryContainer"])
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
        const dateInput = stringToDate(operation.dateInput)
        const yearMonth = reportDate(dateInput)
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
        const dateInput = stringToDate(operation.dateInput)
        const yearMonth = reportDate(dateInput)
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
    cleanContainers(["#totalsByCategories"])
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
        const dateInput = stringToDate(operation.dateInput)
        const yearMonth = reportDate(dateInput)
        if (!uniqueMonths.includes(yearMonth)) {
            uniqueMonths.push(yearMonth)
        }
        operationsWithoutDays.push({
            dateWithoutDays: yearMonth,
            amount: operation.amountInput,
            type: operation.type
        })
    }

    cleanContainers(["#totalsByMonth"])
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
        showElements(["#balance-container"])
        hideElements(["#categories", "#reports", "#new-operation-container"])
    })

    // click btn categories
    $("#btn-categories").addEventListener("click", () =>{
        showElements(["#categories"])
        hideElements(["#balance-container", "#reports", "#new-operation-container"])
        setFocus("#category-input")
    })

    // click btn reports
    $("#btn-reports").addEventListener("click", () =>{
        renderReports()
        showElements(["#reports"])
        hideElements(["#balance-container", "#categories", "#new-operation-container"])
    })

    // hamburguer menu 
    $("#hamburger-menu").addEventListener("click", () => {
        if (!$("#hamburger-menu").classList.contains("hidden")) {
            $(".nav-ul").classList.toggle("hidden")
            $("main").classList.toggle("mt-[130px]")
        }
    })

    //hide filters section
    $("#hide-filters").addEventListener("click", () => {
        $("#toggle-filters").classList.toggle("hidden")
    })

    /* new operation btn*/
    $("#new-operation-btn").addEventListener("click", () => {
        showElements(["#add-operation-btn", "#new-operation-container"])
        hideElements(["#edit-operation-btn", "#balance-container"])
        $("#form-operation").reset()
        $("#operation-title").innerHTML = "Nueva operación"
        $("#date-input").value = getFullDate(currentDate)
        setFocus("#description-input")
    })

    /* modal operation check  */
    $("#add-operation-btn").addEventListener("click", (e) => {
        e.preventDefault()
        if (validateNewOperation()) {
            showElements(["#modal-new-operation-done"])
            addingBrigthness(["header", "main", "footer"])
            hideElements([".invalid-name-operation", ".invalid-amount"])
        }
    })

    /* modal operation added ok */
    $("#operation-added-btn").addEventListener("click", () => {
        hideElements(["#new-operation-container", "#modal-new-operation-done"])
        showElements(["#balance-container"])
        removingBrigthness(["header", "main", "footer"])
        addOperationForm()
    })

    /* btn cancel operation */
    $("#cancel-operation-btn").addEventListener("click", (e) => {
        e.preventDefault()
        hideElements(["#new-operation-container"])
        showElements(["#balance-container"])
        if (!validateNewOperation()) {
            hideElements([".invalid-name-operation", ".invalid-amount"])
        }
    })

    /* edit operation */
    $("#edit-operation-btn").addEventListener("click", (e) => {
        e.preventDefault()
        showElements(["#modal-edited-operation"])
        addingBrigthness(["header", "main", "footer"])
    })

    /* modal edited operation btn ok */
    $("#operation-edited-btn").addEventListener("click", () => {
        editedOperation()
    })

    /* modal deleted operation btn ok*/
    $("#deleted-operation").addEventListener("click", deletedOperation)

    /* modal no deleted operation btn ok */
    $("#no-deleted-operation").addEventListener("click", () => {
        hideElements(["#modal-delete-operation"])
        removingBrigthness(["header", "main", "footer"])
    })

    /* amount input check value as number*/
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

    //add category btn
    $("#add-category-btn").addEventListener("click", () => {
        addNewCategory()
        $("#category-input").value = ""
    })

    //candel edit category
    $("#cancel-editCategory-btn").addEventListener("click", () => {
        showElements(["#new-category-container"])
        hideElements(["#edit-category-container"])
    })

    //edited category ok
    $("#add-editCategory-btn").addEventListener("click", () => {
        showElements(["#new-category-container"])
        hideElements(["#edit-category-container"])
        editedCategory($("#add-editCategory-btn").getAttribute("data-id"))
    })

    //cancel delete category
    $("#no-delete-category-current").addEventListener("click", () => {
        hideElements(["#modal-delete-category"])
        removingBrigthness(["header", "main", "footer"])
    })

    //cant delete category modal
    $("#cant-delete-category-current").addEventListener("click", () => {
        hideElements(["#modal-cant-delete-category"])
        removingBrigthness(["header", "main", "footer"])
    })

    //delete category ok
    $("#delete-category-current").addEventListener("click", () => {
        hideElements(["#modal-delete-category"])
        removingBrigthness(["header", "main", "footer"])
        deleteCategory()
    })

    renderOperations(allOperations)
}

window.addEventListener("load", initializeApp)