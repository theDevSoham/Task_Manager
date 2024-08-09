document.addEventListener('DOMContentLoaded', function () {

	const params = new URLSearchParams(window.location.href.split("?")[1])
	const editTaskSection = document.getElementById("edit-task-section");

	const statusMap = {
		"Pending": "pending",
		"In Progress": "in-progress",
		"Completed": "completed",
	}

	function findData() {
		if (!params.has("id")) {
			Swal.fire({
				title: 'Error!',
				text: 'No editable instance found',
				icon: 'error',
				confirmButtonText: 'Cool'
			}).then((result) => {
				if (result.isConfirmed) window.location.href = "/frontend/index.html"
			})
		}

		fetch(`http://localhost:3000/api/task/${params.get("id")}`, {
			method: "GET"
		})
			.then(res => res.ok ? res.json() : Promise.reject("Error loading data"))
			.then(data => {
				const task = data.task
				console.log("Data: ", data)

				editTaskSection.innerHTML += `
				<!-- Task Form -->
					<form
						id="edit-task-form"
						action="http://localhost:3000/api/task/${params.get("id")}"
						method="PUT"
						enctype="multipart/form-data"
						style="display: block"
						>
						<div class="form-group">
							<label for="task-title">Task Title:</label>
							<input
							type="text"
							placeholder="Enter title of task"
							id="task-title"
							name="task-title"
							required
							value=${task.title}
							/>
						</div>

						<div class="form-group">
							<label for="task-desc">Description:</label>
							<textarea
							id="task-desc"
							placeholder="A slight description..."
							name="task-desc"
							rows="4"
							required
							>
								${task.description}
							</textarea>
						</div>

						<div class="form-group">
							<label for="task-status">Status:</label>
							<select id="task-status" name="task-status" required>
							<option value="pending" ${statusMap[task.status] === "pending" ? "selected" : ""}>Pending</option>
							<option value="in-progress" ${statusMap[task.status] === "in-progress" ? "selected" : ""}>In Progress</option>
							<option value="completed" ${statusMap[task.status] === "completed" ? "selected" : ""}>Completed</option>
							</select>
						</div>

						<button type="submit">Submit</button>
					</form>
			`
				addTaskEditSubmitEventListener()
			})
	}

	function addTaskEditSubmitEventListener() {
		const taskForm = document.getElementById('edit-task-form');

		taskForm.addEventListener('submit', function (event) {
			event.preventDefault();

			const formData = new FormData(taskForm);
			fetch(taskForm.action, {
				method: 'PUT',
				body: formData
			})
				.then(response => response.json())
				.then(result => {
					console.log('Success:', result);
					Swal.fire({
						title: 'Success!',
						text: 'Task form data submitted successfully',
						icon: 'success',
						confirmButtonText: 'Cool'
					}).then((result) => {
						if (result.isConfirmed) window.location.href = "/frontend/index.html"
					})
				})
				.catch(error => {
					console.error('Error:', error);
					Swal.fire({
						title: 'Error!',
						text: 'An error occurred while submitting the form. Do you want to continue',
						icon: 'error',
						confirmButtonText: 'Cool'
					})
				});
		});
	}

	findData()
})