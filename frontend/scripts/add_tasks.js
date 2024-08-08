document.addEventListener('DOMContentLoaded', function () {
	const formRadio = document.getElementById('fill-form');
	const excelRadio = document.getElementById('upload-excel');
	const formSection = document.getElementById('form-section');
	const excelSection = document.getElementById('excel-section');

	formRadio.addEventListener('change', toggleForm);
	excelRadio.addEventListener('change', toggleForm);

	function toggleForm() {
		if (formRadio.checked) {
			formSection.style.display = 'block';
			excelSection.style.display = 'none';
		} else if (excelRadio.checked) {
			formSection.style.display = 'none';
			excelSection.style.display = 'block';
		}
	}

	toggleForm(); // Initialize the form display on page load
});
