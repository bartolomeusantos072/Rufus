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
    if (!customModal) {
      console.warn("Elemento 'custom-modal' não foi encontrado no DOM.");
      return resolve(false);
    }

    // Preenche o modal dinamicamente
    if (modalTitle) modalTitle.textContent = title;
    if (modalIcon) modalIcon.textContent = icon;
    if (modalMessage) {
      modalMessage.innerHTML = `<strong>${message}</strong>${subtext ? `<p style="margin-top: 8px; font-weight: normal;">${subtext}</p>` : ''}`;
    }

    // Exibe ou oculta o botão Cancelar
    if (modalBtnCancel) {
      modalBtnCancel.style.display = showCancel ? "inline-block" : "none";
    }

    // Exibe o modal
    customModal.classList.remove("hidden");

    // Coloca o foco no botão OK para usabilidade rápida por teclado
    if (modalBtnOk) modalBtnOk.focus();

    function handleOk() {
      cleanup();
      resolve(true);
    }

    function handleCancel() {
      cleanup();
      resolve(false);
    }

    // Suporte aos atalhos de teclado (Enter e ESC)
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        handleCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleOk();
      }
    }

    function cleanup() {
      customModal.classList.add("hidden");
      if (modalBtnOk) modalBtnOk.removeEventListener("click", handleOk);
      if (modalBtnCancel) modalBtnCancel.removeEventListener("click", handleCancel);
      if (modalBtnX) modalBtnX.removeEventListener("click", handleCancel);
      document.removeEventListener("keydown", handleKeyDown);
    }

    // Registra os escutadores de eventos
    if (modalBtnOk) modalBtnOk.addEventListener("click", handleOk);
    if (modalBtnCancel) modalBtnCancel.addEventListener("click", handleCancel);
    if (modalBtnX) modalBtnX.addEventListener("click", handleCancel);
    document.addEventListener("keydown", handleKeyDown);
  });
}