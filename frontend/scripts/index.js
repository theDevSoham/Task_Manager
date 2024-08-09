document.addEventListener('DOMContentLoaded', function () {
	function fetchTasks() {
		const completedCol = document.getElementById("completed-column")
		const inProgresCol = document.getElementById("in-progress-column")
		const pendingCol = document.getElementById("pending-column")

		fetch("http://localhost:3000/api/tasks", {
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

	function renderTaskList(arrayOfTasks = [], targetElement) {

		if (arrayOfTasks.length > 0) {

			let output = ``

			arrayOfTasks.forEach((task, index) => {
				output += `
				<article class="task-card" data-status="${task.status.split(" ").join("-").toLowerCase()}">
					<header>
						<h3>${task.title}</h3>
						<div>
							<button>&#x270E;</button>
							<button class="danger">&#128465;</button>
						</div>
					</header
					<p>${task.description.length > 20 ? `${task.description.slice(0, 21)}...` : task.description}</p>
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

	fetchTasks()
});
