document.addEventListener('DOMContentLoaded', function () {
	const formRadio = document.getElementById('fill-form');
	const excelRadio = document.getElementById('upload-excel');
	const taskForm = document.getElementById('task-form');
	const excelForm = document.getElementById('excel-form');
	const fileInput = document.getElementById('excel-file');
	const filePlaceholder = document.getElementById('file-placeholder');

	formRadio.addEventListener('change', toggleForms);
	excelRadio.addEventListener('change', toggleForms);

	fileInput.addEventListener('change', function () {
		if (fileInput.files.length > 0) {
			filePlaceholder.textContent = fileInput.files[0].name;
		} else {
			filePlaceholder.textContent = "Choose Excel file...";
		}
	});

	function toggleForms() {
		if (formRadio.checked) {
			taskForm.style.display = 'block';
			excelForm.style.display = 'none';
		} else if (excelRadio.checked) {
			taskForm.style.display = 'none';
			excelForm.style.display = 'block';
		}
	}

	toggleForms(); // Initialize the form display on page load

	// Custom form submission for preventing default form behavior
	taskForm.addEventListener('submit', function (event) {
		event.preventDefault(); // Prevent the default form submission

		const formData = new FormData(taskForm);
		fetch(taskForm.action, {
			method: 'POST',
			body: formData
		})
			.then(response => response.json())
			.then(result => {
				console.log('Success:', result);
				Swal.fire({
					title: 'Success!',
					text: 'Task form data submitted successully',
					icon: 'success',
					confirmButtonText: 'Go to home'
				}).then((result) => {
					if (result.isConfirmed) window.location.href = "/"
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

	// Excel form submission
	excelForm.addEventListener('submit', function (event) {
		event.preventDefault(); // Prevent the default form submission

		const formData = new FormData(excelForm);
		fetch(excelForm.action, {
			method: 'POST',
			body: formData
		})
			.then(response => response.json())
			.then(result => {
				console.log('Success:', result);
				Swal.fire({
					title: 'Success!',
					text: 'Task form data submitted successully',
					icon: 'success',
					confirmButtonText: 'Go to home'
				}).then((result) => {
					if (result.isConfirmed) window.location.href = "/"
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
});
