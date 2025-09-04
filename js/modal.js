const modalContainer = document.getElementById('modal-container');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalFooter = document.getElementById('modal-footer');

function openModal(title, bodyHtml, footerHtml = '') {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  modalFooter.innerHTML = footerHtml;
  modalContainer.classList.remove('hidden');
  modalContainer.classList.add('flex');
}

function closeModal() {
  modalContainer.classList.add('hidden');
  modalContainer.classList.remove('flex');
}
