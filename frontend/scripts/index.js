document.addEventListener('DOMContentLoaded', function () {
	const taskCards = document.querySelectorAll('.task-card');
	const columns = document.querySelectorAll('.column');

	taskCards.forEach(card => {
		card.addEventListener('dragstart', handleDragStart);
		card.addEventListener('dragend', handleDragEnd);
	});

	columns.forEach(column => {
		column.addEventListener('dragover', handleDragOver);
		column.addEventListener('dragenter', handleDragEnter);
		column.addEventListener('dragleave', handleDragLeave);
		column.addEventListener('drop', handleDrop);
	});

	function handleDragStart(e) {
		e.dataTransfer.setData('text/plain', e.target.dataset.status);
		e.dataTransfer.setData('text/html', e.target.outerHTML);
		this.classList.add('dragging');
	}

	function handleDragEnd() {
		this.classList.remove('dragging');
	}

	function handleDragOver(e) {
		e.preventDefault();
	}

	function handleDragEnter() {
		this.classList.add('drag-over');
	}

	function handleDragLeave() {
		this.classList.remove('drag-over');
	}

	function handleDrop(e) {
		e.preventDefault();
		const status = e.dataTransfer.getData('text/plain');
		const html = e.dataTransfer.getData('text/html');
		const dropTarget = e.target.closest('.column');

		if (dropTarget && dropTarget.id !== `${status}-column`) {
			const draggedElement = document.querySelector(`[data-status="${status}"].dragging`);
			if (draggedElement) {
				draggedElement.remove();
				dropTarget.insertAdjacentHTML('beforeend', html);
				const newCard = dropTarget.querySelector('.task-card:last-child');
				newCard.dataset.status = dropTarget.id.split('-')[0];
				newCard.classList.remove('dragging');
				newCard.querySelector('.status').textContent = `Status: ${newCard.dataset.status.charAt(0).toUpperCase() + newCard.dataset.status.slice(1)}`;

				if (dropTarget.id.split('-')[1] === "progress") {
					newCard.querySelector('.status').textContent += `-${dropTarget.id.split('-')[1]}`
				}
				newCard.classList.remove(status);
				newCard.classList.add(newCard.dataset.status);

				// Re-add event listeners
				newCard.addEventListener('dragstart', handleDragStart);
				newCard.addEventListener('dragend', handleDragEnd);
			}
		}
		this.classList.remove('drag-over');
	}
});
