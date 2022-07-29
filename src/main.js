import './main.css'
import './checkbox.css'

// add hamburger menu to form for mobile devices

// create a function that sorts each task based on priority and
// due date

// whenever u click edit icon, bring same modal up
// and change the inputs with the current value

const listForm = document.querySelector('[data-new-list-form]')
const listFormInput = document.querySelector('[data-new-list-form-input]')
const listsContainer = document.querySelector('.lists')

const taskForm = document.querySelector('[data-new-task-form]')
const taskFormOverlay = document.querySelector('.form-overlay')
const taskModalOverlay = document.querySelector('.modal-overlay')
const taskFormInputDesc = document.querySelector('[data-new-task-form-input-desc]')

const listNameDisplay = document.querySelector('[data-task-list]')
const tasksContainer = document.querySelector('.tasks')

const deleteListBtn = document.querySelector('[data-delete-list-btn]')
const clearTasksBtn = document.querySelector('[data-clear-task-btn]')
const newTaskBtn = document.querySelector('[data-new-task-btn]')
const taskFormExitBtn = document.querySelector('.exit-form')


const LOCAL_STORAGE_LIST_KEY = 'lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'selectedListId'

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

let completedTasks = []

class List {
    constructor(name) {
        this.id = Date.now().toString()
        this.name = name
        this.tasks = []
    }
}

class Task {
    constructor(title, description, dueDate = null, priority) {
        this.id = Date.now().toString()
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
    }
}

listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId
        saveAndRender()
        console.log(selectedListId)
    }
})

listForm.addEventListener('submit', e => {
    e.preventDefault()
    if (listFormInput.value === '') return
    const list = new List(listFormInput.value)
    lists.push(list)
    selectedListId = list.id
    saveAndRender()
    listForm.reset()
    console.log(lists)
})

deleteListBtn.addEventListener('click', () => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    console.log(selectedListId)
    saveAndRender()
})


newTaskBtn.addEventListener('click', () => {
    taskFormOverlay.style.visibility = 'visible'
    taskForm.style.visibility = 'visible'
})

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li' ||
        e.target.tagName.toLowerCase() === 'h3') {
        const selectedTaskId = e.target.dataset.taskId
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === selectedTaskId)
        createTaskModal(selectedTask)
        taskModalOverlay.style.visibility = 'visible'
    }
    else if (e.target.tagName.toLowerCase() === 'input') {
        const completedTaskId = e.target.dataset.taskId
        completedTasks.push(completedTaskId)
    }
    else if (e.target.dataset.icon === 'edit') {
        const selectedList = lists.find(list => list.id === selectedListId)
        alert('I was too lazy to do this part. I am satisfied with my work though so I am calling it quits until I get better')
    }
    else if (e.target.dataset.icon === 'delete') {
        const selectedList = lists.find(list => list.id === selectedListId)
        selectedList.tasks = selectedList.tasks.filter(task => task.id !== e.target.dataset.taskId)
        saveAndRender()
    }
})

taskForm.addEventListener('submit', e => {
    e.preventDefault()
    const task = new Task
        (
            taskForm.title.value,
            taskFormInputDesc.value,
            taskForm.due_date.value,
            taskForm.priority.value,
        )
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    console.log(selectedList.tasks)
    saveAndRender()
    exitTaskForm()
})

taskFormExitBtn.addEventListener('click', () => {
    taskFormOverlay.style.visibility = 'hidden'
    taskForm.style.visibility = 'hidden'
    taskForm.reset()
})

clearTasksBtn.addEventListener('click', () => {
    if (!selectedListId || selectedListId == 'null') return
    else {
        const selectedList = lists.find(list => list.id === selectedListId)
        for (let i in completedTasks) {
            selectedList.tasks = selectedList.tasks.filter(task => task.id !== completedTasks[i])
        }
        saveAndRender()
    }
})

function showLists() {
    appendLists()
    showCurrentList()
}

function showTasks() {
    appendTasks()
}

function showCurrentList() {
    if (!selectedListId || selectedListId === 'null') {
        listNameDisplay.textContent = 'Create a List'
    }
    else {
        updateCurrentListDisplay()
        showTasks()
    }
}

function updateCurrentListDisplay() {
    const selectedList = lists.find(list => list.id === selectedListId)
    listNameDisplay.style.display = ''
    listNameDisplay.textContent = selectedList.name
}

function appendLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add('list')
        listElement.textContent = list.name
        if (list.id == selectedListId) {
            listElement.classList.add('active-list')
        }
        listsContainer.append(listElement)
    })
}

function appendTasks() {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.forEach(task => {
        const taskElement = document.createElement('li')
        const leftContainer = document.createElement('div')
        const rightContainer = document.createElement('div')
        const taskCheckbox = document.createElement('input')
        const taskHeader = document.createElement('h3')
        const priorityIcon = document.createElement('span')
        const editIcon = document.createElement('span')
        const deleteIcon = document.createElement('span')

        taskCheckbox.type = 'checkbox'

        taskElement.dataset.taskId = task.id
        taskCheckbox.dataset.taskId = task.id
        taskHeader.dataset.taskId = task.id
        editIcon.dataset.taskId = task.id
        editIcon.dataset.icon = 'edit'
        deleteIcon.dataset.taskId = task.id
        deleteIcon.dataset.icon = 'delete'

        taskElement.classList.add('task')
        leftContainer.classList.add('left')
        rightContainer.classList.add('right')
        priorityIcon.classList.add
            ('material-symbols-outlined', 'priority-icon', 'icon', `${task.priority}`)
        editIcon.classList.add
            ('material-symbols-outlined', 'edit-icon', 'icon')
        deleteIcon.classList.add
            ('material-symbols-outlined', 'delete-icon', 'icon')

        taskHeader.textContent = `${task.title} | ${task.dueDate}`
        priorityIcon.textContent = 'circle'
        editIcon.textContent = 'edit'
        deleteIcon.textContent = 'delete'

        leftContainer.append(taskCheckbox, taskHeader)
        rightContainer.append(priorityIcon, editIcon, deleteIcon)
        taskElement.append(leftContainer, rightContainer)
        tasksContainer.append(taskElement)
    })
}

function createTaskModal(task) {
    const modalContainer = document.createElement('div')
    const headerContainer = document.createElement('div')
    const taskTitle = document.createElement('h4')
    const modalExit = document.createElement('div')
    const taskDueDate = document.createElement('div')
    const taskDesc = document.createElement('div')
    const taskPrior = document.createElement('div')

    modalContainer.classList.add('task-modal-container')
    headerContainer.classList.add('modal-header-container')
    modalExit.classList.add('exit-modal', 'exit')

    taskTitle.textContent = task.title
    modalExit.textContent = '[X]'
    taskDueDate.textContent = `Due Date: ${task.dueDate}`
    taskDesc.textContent = `Description: ${task.description}`
    taskPrior.textContent = `Priority: ${task.priority}`

    modalExit.addEventListener('click', () => {
        modalContainer.remove()
        taskModalOverlay.style.visibility = 'hidden'
    })

    headerContainer.append(taskTitle, modalExit)
    modalContainer.append(
        headerContainer,
        taskDueDate,
        taskDesc,
        taskPrior
    )
    taskModalOverlay.append(modalContainer)
}

function saveAndRender() {
    save()
    render()
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
    clearElements(listsContainer)
    clearElements(tasksContainer)
    showLists()
    if (!selectedListId || selectedListId === 'null') {
        newTaskBtn.classList.add('disabled-btn')
    }
    else {
        newTaskBtn.classList.remove('disabled-btn')
    }
}

function clearElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()