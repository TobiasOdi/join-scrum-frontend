/* =============================================================================== VARIABLES =================================================================== */
let allTasks = [];
let userChar = [];
let allUsers = [];
let currentDraggedElement;
let priorityValueEdit;
let startWithLetter = [];
let selectedUsersEdit = [];
let subtasksEdit = [];

/* ============================================================================ INIT BOARD ======================================================================== */
/**
 * This function runs the function to render the tasks.
 */
function initBoard() {
    updateHTML();
}

/* ============================================================================ BOARD FUNCTIONS ======================================================================== */
/**
 * This function renders the tasks to the correct category.
 */
function updateHTML() {
    //filterToDo();
    //filterInProgress();
    //filterAwaitingFeedback();
    //filterDone();

    filterTasks('toDo');
    filterTasks('inProgress');
    filterTasks('awaitingFeedback');
    filterTasks('done');
    createBubbles();
    checkForEmptyCategories();
}

/**
 * This function filters all the tasks to the correct status.
 * @param {string} taskStatus - name of the task status
 */
function filterTasks(taskStatus) {
    let currentStatus = tasks.filter(t => t["statusCategory"] == taskStatus);
    document.getElementById(taskStatus).innerHTML = ``;
    for (let i = 0; i < currentStatus.length; i++) {
        let element = currentStatus[i]; 
        if(taskStatus == "toDo") {
            document.getElementById(taskStatus).innerHTML += generateToDoHTMLToDo(element, taskStatus);
        } else if(taskStatus == "inProgress" || taskStatus == "awaitingFeedback") {
            document.getElementById(taskStatus).innerHTML += generateToDoHTML(element, taskStatus);
        } else if(taskStatus == "done") {
            document.getElementById(taskStatus).innerHTML += generateToDoHTMLDone(element, taskStatus);
        }
        calculateProgressbar(element);
    }
}

/**
 * This function filters all the tasks that have the category "toDo".
 */
/* function filterToDo() {
    let toDo = tasks.filter(t => t["statusCategory"] == "toDo");
    document.getElementById("toDo").innerHTML = ``;
    for (let i = 0; i < toDo.length; i++) {
        let element = toDo[i]; 
        document.getElementById("toDo").innerHTML += generateToDoHTMLToDo(element, 'toDo');
        calculateProgressbar(element);
    }
} */

/**
 * This function filters all the tasks that have the category "inProgress".
 */
/* function filterInProgress() {
    let inProgress = tasks.filter(t => t["statusCategory"] == "inProgress");
    document.getElementById("inProgress").innerHTML = ``;
    for (let i = 0; i < inProgress.length; i++) {
        let element = inProgress[i];
        document.getElementById("inProgress").innerHTML += generateToDoHTML(element, 'inProgress');
        calculateProgressbar(element);
    }
} */

/**
 * This function filters all the tasks that have the category "awaitingFeedback".
 */
/* function filterAwaitingFeedback() {
    let awaitingFeedback = tasks.filter(t => t["statusCategory"] == "awaitingFeedback");
    document.getElementById("awaitingFeedback").innerHTML = ``;
    for (let i = 0; i < awaitingFeedback.length; i++) {
        let element = awaitingFeedback[i];
        document.getElementById("awaitingFeedback").innerHTML += generateToDoHTML(element, 'awaitingFeedback');
        calculateProgressbar(element);
    }
} */


/**
 * This function filters all the tasks that have the category "done".
 */
/* function filterDone() {
    let done = tasks.filter(t => t["statusCategory"] == "done");
    document.getElementById("done").innerHTML = ``;
    for (let i = 0; i < done.length; i++) {
        let element = done[i];
        document.getElementById("done").innerHTML += generateToDoHTMLDone(element, 'done');
        calculateProgressbar(element);
    }
} */

/**
 * This function calculates the values for the progressbar of the subtasks.
 * @param {index} element - index of the current task in the respective category array (toDo, inProgress etc.)
 */
function calculateProgressbar(element) {
    let numerator = 0;
    let subtasksCalculate = subtasksLoad.filter(s => s["parent_task_id"] == element.id);
    let denominator = subtasksCalculate.length;

    if(subtasksCalculate.length !== 0) {
        for (let j = 0; j < subtasksCalculate.length; j++) {
            if(!subtasksCalculate[j]['status'].includes('undone')) {
                numerator++;
            }
        }
        let progress = numerator / denominator;
        progress = progress * 100;
        generateProgressbarHtml(element, progress, numerator, denominator, subtasksCalculate);
    }
}

/**
 * This function renders the progressbar of the subtasks.
 * @param {index} element - index of the current task in the respective category array (toDo, inProgress etc.)
 * @param {%} progress - percentage of the done subtasks
 * @param {number} numerator - value "0"
 * @param {number} denominator - length of the subtask array of the current task
 */
function generateProgressbarHtml(element, progress, numerator, denominator, subtasksCalculate) {
    if(subtasksCalculate.length === 1) {
        document.getElementById(`boardContainerProgress(${element["id"]})`).innerHTML = progressbarTaskTemplate(progress, numerator, denominator);
    } else {
        document.getElementById(`boardContainerProgress(${element["id"]})`).innerHTML = progressbarTasksTemplate(progress, numerator, denominator);
    }
}

/**
 * This function renders the assigend users.
 */
function createBubbles() {
    for (let j = 0; j < tasks.length; j++) {
        let bubbleTaskId = tasks[j]["id"];
        let assignedUsers = assignedContacts.filter(c => c["parent_task_id"] == tasks[j]["id"])
        if(assignedUsers.length <= 3) {
            let bubbleCount = assignedUsers.length;
            
            userBubbles(j, bubbleTaskId, bubbleCount, assignedUsers);
        } else if (assignedUsers.length > 3) {
            let bubbleCount = 2;
            userBubbles(j, bubbleTaskId, bubbleCount, assignedUsers);
            getRemainingCount(j, bubbleTaskId);
        }
    }
}

/**
 * This function renders the bubbles of the assigend users.
 * @param {index} j - index of the current task
 * @param {number} bubbleTaskId - id of the current task
 * @param {number} bubbleCount - count how many bubbles need to be rendered
 */
function userBubbles(j, bubbleTaskId, bubbleCount, assignedUsers) {
    for (let i = 0; i < bubbleCount; i++) {
        //let assignedUsers = tasks[j]['assignTo'];
        getName(assignedUsers, i);
        let name = firstLetters;
        document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
            <div class="userBubbleOne" id="userBubbleOne${[j]}${[i]}">${name}</div>`;
        let userBubble = document.getElementById(`userBubbleOne${[j]}${[i]}`);
        userBubble.style.backgroundColor = getUserColor(assignedUsers, i);
    }
}

/**
 * This function returns the first letter of the name and surname.
 * @param {array} assignedUsers - array of the assigned users ot the current task
 * @param {index} i - index
 * @returns 
 */
function getName(assignedUsers, i) {
    firstLetters = "";
    let x = assignedUsers[i]['name'];
    x = x.split(' ').map(word => word.charAt(0)).join('');
    let y = assignedUsers[i]['surname'];
    y = y.split(' ').map(word => word.charAt(0)).join('');
    firstLetters = x.toUpperCase() + y.toUpperCase();
    return firstLetters;
}


/**
 * This function returns the color of the user.
 * @param {array} assignedUsers - array of the assigned users ot the current task
 * @param {index} i - index
 * @returns 
 */
function getUserColor(assignedUsers, i) {
    let assignedUser = assignedUsers[i];
    //let existingUser = contacts.find(u => u.contactId == parseInt(assignedUser));
    //let correctUser = contacts.indexOf(existingUser);
    //let assignColor = contacts[correctUser]['contactColor'];
    let assignColor = assignedUser['contactColor'];
    return assignColor;
}

/**
 * This function renders the bubble of the remaining count of the users that are not beeing rendered.
 * @param {index} j - index of the current task
 * @param {number} bubbleTaskId - id of the bubble
 */
function getRemainingCount(j, bubbleTaskId) {
    let remainingCount = tasks[j]["assignTo"].length - 2;
    document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
        <div class="userBubbleOne" id="userBubbleOne${[j]}${[2]}">+${remainingCount}</div>
        `;
    let userBubbleOne = document.getElementById(`userBubbleOne${[j]}${[2]}`);
    userBubbleOne.style.backgroundColor = "black";
}

/**
 * This function generates and returns a random color.
 * @returns 
 */
function generateRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * This function renders a placeholder if a category has no tasks.
 */
function checkForEmptyCategories() {
    let toDoCategory = document.getElementById('toDo');
    let inProgressCategory = document.getElementById('inProgress');
    let awaitingFeedbackCategory = document.getElementById('awaitingFeedback');
    let doneCategory = document.getElementById('done');
    checkForEmptyCategory(toDoCategory, 'to do');
    checkForEmptyCategory(inProgressCategory, 'in progress');
    checkForEmptyCategory(awaitingFeedbackCategory, 'awaiting feedback');
    checkForEmptyCategory(doneCategory, 'done');
}

/**
 * This function checks if a category is empty and renders the placeholder.
 * @param {string} category - task category
 * @param {string} categoryText - task category text for the placeholder text
 */
function checkForEmptyCategory(category, categoryText) {
    if(category.innerHTML == ""){
        category.innerHTML += `
            <div class="emptyCategory">
                <div class="emptyCategoryText">No tasks ${categoryText}</div>
            </div>
        `;
    } 
}

/* ============================================================================ DRAG & DROP ======================================================================== */
//Source: www.w3schools.com/html/html5_draganddrop.asp
/**
 * This function allows you to drag an element.
 * @param {number} id - id of the task
 */
function startDragging(id) {
    currentDraggedElement = tasks.findIndex(obj => obj.taskId === id);
}

/**
 * This function changes the category to the 
 * @param {string} statusCategory - new category
 */
function moveTo(statusCategory) {
    tasks[currentDraggedElement]["statusCategory"] = statusCategory;
    saveTasks();
    updateHTML();
}

/**
 * This function highlights the container if element is hovering over.
 * @param {number} id - id of the current task 
 */
function highlight(id) {
    if(document.getElementById(id) !== id)
    document.getElementById(id).classList.add('dragAreahighlight');
}

/**
 * This function removes the highlight of the container if element is dragged away or placed.
 * @param {*} id - id of the current task
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('dragAreahighlight');
}

/**
 * This function allows you to drop an element into a container.
 * @param {*} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This function prevents an a function of a parent elemtn beeing executed when clicking on a child element.
 * @param {*} event 
 */
function doNotOpenTask(event) {
    event.stopPropagation();
}

/* ======================================================================= BOARD TASK FUNCTIONS ================================================================================= */
/**
 * This function pushes the task to the previous category.
 * @param {string} category - current category of the task
 * @param {number} taskId - id of the task
 */
async function pushToPreviousCategory(category, taskId) {
    let currentTaskId = tasks.find(t => t.taskId == taskId);
    let currentTask = tasks.indexOf(currentTaskId);
    if(category == 'done') {
        tasks[currentTask]['statusCategory'] = 'awaitingFeedback';
    } else if(category == 'awaitingFeedback') {
        tasks[currentTask]['statusCategory'] = 'inProgress'; 
    } else if(category == 'inProgress') {
        tasks[currentTask]['statusCategory'] = 'toDo';
    } 
    await saveTasks();
    updateHTML();
}

/**
 * This function pushes the task to the next category.
 * @param {*} category - current category of the task
 * @param {*} taskId - id of the task
 */
async function pushToNextCategory(category, taskId) {
    let currentTaskId = tasks.find(t => t.taskId == taskId);
    let currentTask = tasks.indexOf(currentTaskId);
    if(category == 'toDo') {
        tasks[currentTask]['statusCategory'] = 'inProgress';
    } else if(category == 'inProgress') {
        tasks[currentTask]['statusCategory'] = 'awaitingFeedback'; 
    } else if(category == 'awaitingFeedback') {
        tasks[currentTask]['statusCategory'] = 'done';
    }
    await saveTasks();
    updateHTML();
}

/* ======================================================================= OPEN TASK ================================================================================= */
/**
 * This function opens a task and displays the task information.
 * @param {number} currentTaskId - id of the task
 */
function openTask(currentTaskId) {
    document.getElementById('openTaskBackground').style.display = 'flex';
    let existingTask = tasks.find(u => u.taskId == currentTaskId)
    let currentTask = tasks.indexOf(existingTask);
    let openTaskContainer = document.getElementById('openTaskContainer');
    openTaskContainer.innerHTML = '';
    openTaskContainer.innerHTML = openTaskTemplate(currentTask);
    renderprioritySymbol(currentTask);
    renderAssignedUsers(currentTask);
    renderSubtasks(currentTask);
}

/**
 * This function renders the priority of the current task.
 * @param {index} currentTask - index of the current task
 */
function renderprioritySymbol(currentTask) {
    let currentPriority = tasks[currentTask]['priorityValue'];
    let priorityOpenTask = document.getElementById('priorityOpenTask');
    if (currentPriority == 'urgent') {
        priorityOpenTask.innerHTML += `<img id="openTaskImgPriority" src="./img/urgent.svg">`;
    } else if (currentPriority == 'medium') {
        priorityOpenTask.innerHTML += `<img id="openTaskImgPriority" src="./img/medium.svg">`;
    } else if (currentPriority == 'low') {
        priorityOpenTask.innerHTML += `<img id="openTaskImgPriority" src="./img/low.svg">`;
    }
}

/**
 * This function renders the users of the current task.
 * @param {index} currentTask - index of the current task
 */
function renderAssignedUsers(currentTask) {
    let assignedUsers = tasks[currentTask]['assignTo'];
    for (let i = 0; i < assignedUsers.length; i++) {
        let assignedUser = assignedUsers[i];
        let existingAssignUser = contacts.find(u => u.contactId == assignedUser)
        let currentAssignUser = contacts.indexOf(existingAssignUser);
        getFirstletter(currentAssignUser);
        let assignName = contacts[currentAssignUser]['name'];
        let assignSurname = contacts[currentAssignUser]['surname'];
        //let assignFirstLetters = assignName.charAt(0) + assignSurname.charAt(0);
        let assignColor = contacts[currentAssignUser]['contactColor'];
        document.getElementById('assignedToContainer').innerHTML += renderAssignedUserTemplate(assignColor, firstLetters, assignName, assignSurname);
    }
}

/**
 * This function renders the subtasks of the current task.
 * @param {index} currentTask - index of the current task
 */
function renderSubtasks(currentTask){
    let userSubtasks = tasks[currentTask]['subtasks'];
    if(userSubtasks == "") {
        document.getElementById('subtaskContainer').innerHTML += `
            <div>No subtasks</div>
        `;
    } else {
        for (let j = 0; j < userSubtasks.length; j++) {
            let subtask = userSubtasks[j]['subtaskName'];
            let subtaskStatus = userSubtasks[j]['status'];
            if(subtaskStatus == 'undone') {
                document.getElementById('subtaskContainer').innerHTML += renderSubtasksUndoneTemplate(subtask);
            } else {
                document.getElementById('subtaskContainer').innerHTML += renderSubtasksTemplate(subtask);
            }
        }
    }
}

/**
 * This function deletes the current task.
 * @param {index} currentTask - index of the current task
 */
async function deleteTask(currentTask) {
    if(tasks.length > 1) {
        tasks.splice(currentTask, 1);
        await saveTasks();
        await init();
        await initBoard();
        document.getElementById('openTaskBackground').style.display = 'none';
    } else {
        tasks.splice(currentTask, 1);
        await saveTasks();
        await includeHTML()
        await initBoard();
        document.getElementById('openTaskBackground').style.display = 'none';
    }
}

/* ======================================================================= EDIT TASK ================================================================================= */
/**
 * This function retrieves the task data and lets you edit tehm.
 * @param {index} currentTask - index of the current task
 */
function editTask(currentTask) {
    subtasksEdit = tasks[currentTask]['subtasks'];
    document.getElementById('openTaskContainer').innerHTML = editOpenTaskTemplate(currentTask);
    let selectCategoryContainer = document.getElementById('selectCategoryContainer');
    selectCategoryContainer.style.backgroundColor = tasks[currentTask]['categoryColor'];
    let titleEdit = document.getElementById('titleEdit');
    titleEdit.value = tasks[currentTask]['title'];
    let descriptionEdit = document.getElementById('descriptionEdit');
    descriptionEdit.value = tasks[currentTask]['description'];
    renderEditCategories();
    document.getElementById('editSelectCategory').value = tasks[currentTask]['category'];
    renderUrgency(currentTask);
    renderSubtasksEdit(currentTask);
    renderAssignedUsersEdit(currentTask);
    changeCategoryColor();
    editDateInput();
}

/**
 * This function prevents the selection of pasted dates.
 */
function editDateInput() {
        var dateToday = new Date();
        var month = dateToday.getMonth() + 1;
        var day = dateToday.getDate();
        var year = dateToday.getFullYear();
        if (month < 10)
          month = '0' + month.toString();
        if (day < 10)
          day = '0' + day.toString();
        var maxDate = year + '-' + month + '-' + day;
        document.getElementById('editDueDate').setAttribute('min', maxDate);
}

/**
 * This function renders the alle the categories from the "categories" array.
 */
function renderEditCategories() {
    document.getElementById('editSelectCategory').innerHTML = "";
    for (let i = 0; i < categories.length; i++) {
        let categoryName = categories[i]['categoryName'];
        let categoryColor = categories[i]['color'];
        document.getElementById('editSelectCategory').innerHTML += editCategoryTemplate(categoryName, categoryColor);
    }
}

/**
 * This function renders the priority buttons to set the priority.
 * @param {index} currentTask - index of the current task
 */
function renderUrgency(currentTask) {
    if (tasks[currentTask]['priorityValue'] == 'urgent') {
        selectUrgentEdit();
    } else if (tasks[currentTask]['priorityValue'] == 'medium') {
        selectMediumEdit();
    } else if (tasks[currentTask]['priorityValue'] == 'low') {
        selectLowEdit();
    }
    priorityValueEdit = tasks[currentTask]['priorityValue'];
}

/**
 * This function checks if a value form the dropdown is beeing selected and sets the background color.
 */
function changeCategoryColor() {
    document.getElementById('editSelectCategory').addEventListener("click", function() {
        let existingCategory = categories.find(c => c.categoryName == document.getElementById('editSelectCategory').value);
        let currentCategory = categories.indexOf(existingCategory);
        let currentCategoryColor = categories[currentCategory]['color'];
        document.getElementById('selectCategoryContainer').style.backgroundColor = currentCategoryColor;
    });
}

/**
 * This function renders the subtasks and lets you mark them as done.
 * @param {index} currentTask - index of the current task
 */
function renderSubtasksEdit(currentTask){
    document.getElementById('subtaskContainerEdit').innerHTML = "";
    if(subtasksEdit == "") {
        document.getElementById('subtaskContainerEdit').innerHTML += `
            <div>No subtasks</div>
        `;
    } else {
        renderAllSubtasks(currentTask, subtasksEdit);
    }
};

function renderAllSubtasks(currentTask, subtasksEdit) {
    for (let j = 0; j < subtasksEdit.length; j++) {
        let subtask = subtasksEdit[j]['subtaskName'];
        let subtaskStatus = subtasksEdit[j]['status'];
        if (!subtaskStatus.includes('undone')) {
            document.getElementById('subtaskContainerEdit').innerHTML += subtasksEditUndoneTemplate(j, currentTask, subtask);
        } else {
            document.getElementById('subtaskContainerEdit').innerHTML += subtasksEditTemplate(j, currentTask, subtask);
        }
    }
}

/**
 * This function adds a subtask to the the subtask array.
 */
async function addSubtaskEdit(currentTask) {
    let subtaskEdit = document.getElementById('addSubtaskEdit');
    if (subtaskEdit !== '') {
        subtasksEdit.push({'subtaskName': subtaskEdit.value, 'status': 'undone'});
        document.getElementById('addSubtaskEdit').value = '';
        renderSubtasksEdit(currentTask);
        displaySnackbar('newSubtaskAdded');
    } else {
        displaySnackbar('missingInput');
    }
}

/**
 * This function deletes the subtask.
 */
function deleteSubtaskEdit(j) {
    subtasksEdit.splice(j, 1);
    renderSubtasksEdit();
}

/**
 * This function renders the users of the current task to select more or deselect them.
 * @param {index} currentTask - index of the current task
 */
function renderAssignedUsersEdit(currentTask) {
    selectedUsersEdit = [];
    let assignedUsersToCurrentTask = tasks[currentTask]['assignTo'];
    for (let i = 0; i < assignedUsersToCurrentTask.length; i++) {
        let assignedUser = assignedUsersToCurrentTask[i];
        selectedUsersEdit.push(assignedUser);
    }
    for (let i = 0; i < contacts.length; i++) {
        let contactId = contacts[i]['contactId'];
        //let assignName = contacts[i]['name'];
        //let assignSurname = contacts[i]['surname'];
        //let assignFirstLetters = assignName.charAt(0).toUpperCase() + assignSurname.charAt(0).toUpperCase();
        getFirstletter(i);
        if (assignedUsersToCurrentTask.includes(contactId)) {
            document.getElementById('assignedToContainerEdit').innerHTML += selectedAssignedUsersEditTemplate(contactId, i, firstLetters);
        } else {
            document.getElementById('assignedToContainerEdit').innerHTML += notSelectedAssignedUsersEditTemplate(contactId, i, firstLetters);
        }
    }
}

/**
 * This function selects a user. Adds classes to the div's and pushes the user id to the "selectedUsersEdit" array.
 * @param {number} availableUserId - id of the user
 */
function saveSelectedUsersEdit(availableUserId) {
    let user = document.getElementById('edit' + availableUserId);
    let userIcon = document.getElementById('editIcon' + availableUserId);
    user.classList.toggle('avatarSelected');
    userIcon.classList.toggle('avatarSelectedIcon');
    if(selectedUsersEdit.includes(availableUserId)){
        selectedUsersEdit = selectedUsersEdit.filter(a => a != availableUserId);
    } else {
        selectedUsersEdit.push(availableUserId);
    }
}

/**
 * This function saves a completed subtask and.
 * @param {index} subtaskIndex - index of the current subtask
 * @param {index} currentTask - index of the current task
 */
async function saveCompletedSubtasks(j, currentTask) {
    let currentSubtask = document.getElementById('subtask' + j);
    if(!currentSubtask.checked == true) {
        subtasksEdit[j]['status'] = 'undone';
    } 
    if(currentSubtask.checked == true) {
        subtasksEdit[j]['status'] = 'done';
    } 
};

/**
 * This function saves the data of the changed task on the ftp server.
 * @param {index} currentTask - index of the current task
 */
async function saveEditedTask(currentTask) {
    if(document.getElementById('titleEdit').value !== "" && selectedUsersEdit.length !== 0) {
        let editCategory = document.getElementById('editSelectCategory').value;
        tasks[currentTask]['category'] = editCategory;
        tasks[currentTask]['categoryColor'] = addBackgroundColorCategory(editCategory);
        tasks[currentTask]['title'] = document.getElementById('titleEdit').value;
        tasks[currentTask]['description'] = document.getElementById('descriptionEdit').value;
        tasks[currentTask]['dueDate'] = document.getElementById('editDueDate').value;
        tasks[currentTask]['priorityValue'] = priorityValueEdit;
        tasks[currentTask]['assignTo'] = selectedUsersEdit;
        tasks[currentTask]['subtasks'] = subtasksEdit;
        await saveTasks();
        updateHTML();
        priority = "";
        selectedUsersEdit = [];
        subtasksEdit = [];
        document.getElementById('openTaskBackground').style.display = 'none';
    } else {
        highlightInputsEditTask(); 
    }
}

/**
 * This function returns the current category color.
 * @param {string} editCategory - name of the chosen category
 * @returns 
 */
function addBackgroundColorCategory(editCategory) {
    let existingCategory = categories.find(c => c.categoryName == editCategory);
    let currentCategory = categories.indexOf(existingCategory);
    let currentCategoryColor = categories[currentCategory]['color'];
    return currentCategoryColor;
}

/**
 * This function saves the chosen priority.
 * @param {string} priority - priority of the task
 * @param {index} currentTask - index of the current task
 */
function savePriorityValueEdit(priority, currentTask) {
    priorityValueEdit = priority;
}

/**
 * This function closes the task.
 * @param {string} priority - priority of the task
 * @param {index} currentTask - index of the current task
 */
function closeTask(priority, currentTask) {
    savePriorityValueEdit(priority, currentTask);
    document.getElementById('openTaskBackground').style.display = 'none';
}

/**
 * This function runs the highlight functions.
 */
function highlightInputsEditTask() {
    highlightEmptyTitleInputEdit();
    highlightEmptySelectedUsersInputEdit();
    displaySnackbar('missingInput');
}


/**
 * This function highlights the title input field if empty when the form is beeing submitted.
 */
function highlightEmptyTitleInputEdit() {
    if(!document.getElementById('titleEdit').value) {
        document.getElementById('titleEdit').classList.add('redBorder');
    } else if(document.getElementById('titleEdit').value) {
        document.getElementById('titleEdit').classList.remove('redBorder');
    } 
}

/**
 * This function highlights the selected users input field if empty when the form is beeing submitted.
 */
function highlightEmptySelectedUsersInputEdit() {
    if(selectedUsersEdit.length == 0){
        document.getElementById('assignedToContainerEdit').classList.add('redBorder');
    } else if(selectedUsersEdit.length !== 0){
        document.getElementById('assignedToContainerEdit').classList.remove('redBorder');
    } 
}


/* ======================================================================= SEARCH FUNCTION ================================================================================= */
/**
 * This function shows only the tasks (title, description or category) that contain the serach value.
 */
function searchFunction() {
    let originalTasks = tasks;

    if(document.getElementById('searchValue').value !== "") {
        let newSearchArray = tasks.filter( task =>  {
            return task.title.toLowerCase().includes(document.getElementById('searchValue').value) || task.description.toLowerCase().includes(document.getElementById('searchValue').value) || task.category.toLowerCase().includes(document.getElementById('searchValue').value);
        });
        tasks = newSearchArray;
        console.log(newSearchArray);
        console.log(tasks);
        updateHTML();
        tasks = originalTasks;
    } else {
        tasks = originalTasks;
        updateHTML();
    }
}
