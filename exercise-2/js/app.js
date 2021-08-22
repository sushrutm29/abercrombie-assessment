(function(){
  var taskInput = document.getElementById("new-task");
  var addButton = document.getElementsByTagName("button")[0];
  var incompleteTasksHolder = document.getElementById("incomplete-tasks");
  var completedTasksHolder = document.getElementById("completed-tasks");

  var incompleteTasks = [];
  var completedTasks = [];

  if (typeof(Storage) !== "undefined") {
    incompleteTasks = localStorage.getItem("incompleteTasks");
    if(!incompleteTasks)
      incompleteTasks = [];
    else
      incompleteTasks = JSON.parse(incompleteTasks);
    
    completedTasks = localStorage.getItem("completedTasks");
    if(!completedTasks)
      completedTasks = [];
    else
      completedTasks = JSON.parse(completedTasks);
  }


  // incompleteTasks = document.querySelectorAll('#incomplete-tasks li');
  // completeTasks = document.querySelectorAll('#completed-tasks li');
  incompleteTasksHolder.replaceChildren();
  completedTasksHolder.replaceChildren();

  var createNewTaskElement = function(taskString, completed) {
    listItem = document.createElement("li");
    checkBox = document.createElement("input");
    label = document.createElement("label");
    editInput = document.createElement("input");
    editButton = document.createElement("button");
    deleteButton = document.createElement("button");

    checkBox.type = "checkbox";
    editInput.type = "text";
    editButton.innerText = "Edit";
    editButton.className = "edit";
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";
    label.innerText = taskString;

    if(completed)
      checkBox.checked = true;

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
  };

  var addTask = function () {
    event.preventDefault();
    var listItemName = taskInput.value;
    if(listItemName == ""){
      alert("Please enter a name for your task!");
      return;
    }
    listItem = createNewTaskElement(listItemName)
    incompleteTasksHolder.appendChild(listItem)
    bindTaskEvents(listItem, taskCompleted)

    incompleteTasks.push(listItem.querySelector("label").innerText);
    if (typeof(Storage) !== "undefined")
      localStorage.setItem("incompleteTasks", JSON.stringify(incompleteTasks));
    taskInput.value = "";
  };

  var editTask = function () {
    var listItem = this.parentNode;
    var editInput = listItem.querySelectorAll("input[type=text")[0];
    var label = listItem.querySelector("label");
    var button = listItem.getElementsByTagName("button")[0];

    var containsClass = listItem.classList.contains("editMode");
    if (containsClass) {
        if(listItem.parentNode == incompleteTasksHolder){
          var storedListItemIndex = incompleteTasks.findIndex(function(x){
            return x == label.innerText;
          });

          incompleteTasks[storedListItemIndex] = editInput.value;

          if (typeof(Storage) !== "undefined")
            localStorage.setItem("incompleteTasks", JSON.stringify(incompleteTasks));
        }else{
          var storedListItemIndex = completedTasks.findIndex(function(x){
            return x == label.innerText;
          });

          completedTasks[storedListItemIndex] = editInput.value;
          
          if (typeof(Storage) !== "undefined")
            localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
        }

        label.innerText = editInput.value
        button.innerText = "Edit";
    } else {
      editInput.value = label.innerText
      button.innerText = "Save";
    }
    
    listItem.classList.toggle("editMode");
  };

  var deleteTask = function () {
    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    var label = listItem.querySelector("label");

    if(listItem.parentNode == incompleteTasksHolder){
      incompleteTasks = incompleteTasks.filter(function(x){
        return x != label.innerText;
      });

      if (typeof(Storage) !== "undefined")
        localStorage.setItem("incompleteTasks", JSON.stringify(incompleteTasks));
    }else{
      completedTasks = completedTasks.filter(function(x){
        return x != label.innerText;
      });

      if (typeof(Storage) !== "undefined")
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    }
    
    ul.removeChild(listItem);
  };

  var taskCompleted = function () {
    var listItem = this.parentNode;
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
    let label = listItem.querySelector("label");
    let index = incompleteTasks.indexOf(label.innerText);
    incompleteTasks.splice(index, 1);
    completedTasks.push(label.innerText);
    if (typeof(Storage) !== "undefined")
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
      localStorage.setItem("incompleteTasks", JSON.stringify(incompleteTasks));

  };

  var taskIncomplete = function() {
    var listItem = this.parentNode;
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
    let label = listItem.querySelector("label");
    let index = completedTasks.indexOf(label.innerText);
    completedTasks.splice(index, 1);
    incompleteTasks.push(label.innerText);
    if (typeof(Storage) !== "undefined")
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
      localStorage.setItem("incompleteTasks", JSON.stringify(incompleteTasks));
  };

  var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
    var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
    var editButton = taskListItem.querySelectorAll("button.edit")[0];
    var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = checkBoxEventHandler;
  };

  addButton.addEventListener("click", addTask);

  for(let i=0; i<incompleteTasks.length; i++){
    let task = createNewTaskElement(incompleteTasks[i]);
    incompleteTasksHolder.appendChild(task);
    bindTaskEvents(task, taskCompleted);
  }

  for(let i=0; i<completedTasks.length; i++){
    let task = createNewTaskElement(completedTasks[i], true);
    completedTasksHolder.appendChild(task);
    bindTaskEvents(task, taskIncomplete);
  }

  for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
  }

  for (var i = 0; i < completedTasksHolder.children.length; i++) {
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
  }
})();