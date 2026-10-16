// modal.js
export function showModal({ title, message, subtext, icon = "⚠️", showCancel = true }) {
  const customModal = document.getElementById("custom-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalIcon = document.getElementById("modal-icon");
  const modalMessage = document.getElementById("modal-message");
  const modalBtnOk = document.getElementById("modal-btn-ok");
  const modalBtnCancel = document.getElementById("modal-btn-cancel");
  const modalBtnX = document.getElementById("modal-btn-x");

  return new Promise((resolve) => {
    // Preenche o modal dinamicamente
    if (modalTitle) modalTitle.textContent = title;
    if (modalIcon) modalIcon.textContent = icon;
    if (modalMessage) {
      modalMessage.innerHTML = `<strong>${message}</strong>${subtext ? `<p>${subtext}</p>` : ''}`;
    }

    // Exibe ou oculta o botão Cancelar
    if (modalBtnCancel) {
      modalBtnCancel.style.display = showCancel ? "inline-block" : "none";
    }

    customModal.classList.remove("hidden");

    function handleOk() {
      cleanup();
      resolve(true);
    }

    function handleCancel() {
      cleanup();
      resolve(false);
    }

    function cleanup() {
      customModal.classList.add("hidden");
      if (modalBtnOk) modalBtnOk.removeEventListener("click", handleOk);
      if (modalBtnCancel) modalBtnCancel.removeEventListener("click", handleCancel);
      if (modalBtnX) modalBtnX.removeEventListener("click", handleCancel);
    }

    if (modalBtnOk) modalBtnOk.addEventListener("click", handleOk);
    if (modalBtnCancel) modalBtnCancel.addEventListener("click", handleCancel);
    if (modalBtnX) modalBtnX.addEventListener("click", handleCancel);
  });
}