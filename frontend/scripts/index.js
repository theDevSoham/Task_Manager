function renderTaskList(arrayOfTasks = [], targetElement) {

	if (arrayOfTasks.length > 0) {

		let output = ``

		arrayOfTasks.forEach((task, index) => {
			output += `
			<article class="task-card" data-status="${task.status.split(" ").join("-").toLowerCase()}">
				<header>
					<h3>${task.title}</h3>
					<div>
						<button onclick="updateTask('${task._id}')">&#x270E;</button>
						<button class="danger" onclick="deleteTask('${task._id}', this)">&#128465;</button>
					</div>
				</header
				<p>${task.description.length > 20 ? `${task.description.slice(0, 21)}...` : task.description}</p>
				<div>
					<a href="data:application/pdf;base64,${task.pdfContent}" download="${task.title}">Download pdf</a>
				</div>
				<p class="status ${task.status.split(" ").join("-").toLowerCase()}">Status: ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</p>
			</article>
		`
		})

		targetElement.innerHTML += output
	} else {
		targetElement.innerHTML += `
			<div class="no-task">
				<p>No Task list asigned!</p>
			</div>
		`
	}
}

function fetchTasks() {
	const completedCol = document.getElementById("completed-column")
	const inProgresCol = document.getElementById("in-progress-column")
	const pendingCol = document.getElementById("pending-column")

	fetch("https://taskmanager-production-0377.up.railway.app/api/tasks", {
		method: "GET"
	})
		.then(res => res.ok ? res.json() : null)
		.then(res => {
			console.log("Received response: ", res)
			renderTaskList(res.completed, completedCol)
			renderTaskList(res.inProgress, inProgresCol)
			renderTaskList(res.pending, pendingCol)
		})
}


function updateTask(taskId) {
	console.log(taskId);
	window.location.href = `/edit_task.html?id=${taskId}`;
}

function deleteTask(taskId, buttonInstance) {
	const cardInstance = buttonInstance.closest("article")
	console.log("Delete task: ", taskId, buttonInstance.closest("article"))

	Swal.fire({
		title: 'Warning!',
		text: 'Are you sure you want to delete the task?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Yes, I\'m sure'
	}).then((result) => {
		if (result.isConfirmed) {
			fetch(`https://taskmanager-production-0377.up.railway.app/api/task/${taskId}`, {
				method: "DELETE"
			})
				.then(res => res.ok ? res.json() : null)
				.then(res => {
					console.log("Deleted response: ", res)
					Swal.fire({
						title: 'Success!',
						text: `Task data with title ${res.deleted_task.title} deleted successfully`,
						icon: 'success',
						confirmButtonText: 'Cool'
					}).then((result) => {
						if (result.isConfirmed) cardInstance.remove()
					})
				}).catch(e => {
					console.log("Error while deleting task: ", e)
					Swal.fire({
						title: 'Error!',
						text: 'An error occurred while deleting the task.',
						icon: 'error',
						confirmButtonText: 'Cool'
					})
				})
		}
		else if (result.isDismissed) {
			console.log("Not deleted")
		}
	})
}

document.addEventListener('DOMContentLoaded', function () {
	fetchTasks()
});