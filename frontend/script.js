function renderTask(task) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const taskSpan = document.createElement("span");
    taskSpan.textContent = task.title;

    if (task.completed) {
        taskSpan.classList.add("completed");
    }

    checkbox.addEventListener("change", () => {
        taskSpan.classList.toggle("completed", checkbox.checked);

        fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: checkbox.checked })
        });
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: "DELETE"
        })
        .then(() => {
            li.remove();
        })
        .catch(err => console.error(err));
    });

    li.appendChild(checkbox);
    li.appendChild(taskSpan);
    li.appendChild(deleteButton);

    list.appendChild(li);
}

const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-Btn");
const list = document.getElementById("task-list");

fetch("http://localhost:3000/tasks")
.then(res => res.json())
.then(tasks => {
    tasks.forEach(task => renderTask(task));
})
.catch(err => console.error(err));

addButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: taskText })
    })
    .then(res => res.json())
    .then(newTask => {
        renderTask(newTask);
        taskInput.value = "";
    })
    .catch(err => console.error(err));
});