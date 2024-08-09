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
			.then(response => response.json()) // or response.json() if your API returns JSON
			.then(result => {
				console.log('Success:', result);
				alert('Task form data submitted successfully!');
				window.location.href = "/frontend/index.html"
			})
			.catch(error => {
				console.error('Error:', error);
				alert('An error occurred while submitting the form.');
			});
	});
});
