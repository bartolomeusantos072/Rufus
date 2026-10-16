// explorer.js
export function openFileExplorer(isoList) {
  const modal = document.getElementById("file-explorer-modal");
  const fileListContainer = document.getElementById("iso-file-list");
  const selectedNameLabel = document.getElementById("selected-file-name");
  const btnOpen = document.getElementById("explorer-btn-open");
  const btnCancel = document.getElementById("explorer-btn-cancel");
  const btnX = document.getElementById("explorer-btn-x");

  let selectedIso = null;

  return new Promise((resolve) => {
    // 1. Limpa o container e reseta o botão 'Abrir'
    fileListContainer.innerHTML = "";
    btnOpen.disabled = true;
    selectedNameLabel.textContent = "Nenhum arquivo selecionado";

    // 2. Filtra a opção neutra (id: "0") para não exibir no Explorer
    const validIsos = isoList.filter(iso => iso.id !== "0" && iso.id !== 0);

    // 3. Renderiza os arquivos válidos
    validIsos.forEach(iso => {
      const item = document.createElement("div");
      item.className = "file-item";
      item.innerHTML = `
        <span class="file-icon">📀</span>
        <span class="file-name">${iso.label}</span>
        <span class="file-size" style="margin-left: auto; color: #888; font-size: 11px;">${iso.size}</span>
      `;

      // Clique simples: Seleciona o item
      item.addEventListener("click", () => {
        document.querySelectorAll(".file-item").forEach(el => el.classList.remove("selected"));
        item.classList.add("selected");
        selectedIso = iso;
        selectedNameLabel.textContent = iso.label;
        btnOpen.disabled = false;
      });

      // Duplo clique: Seleciona e abre imediatamente
      item.addEventListener("dblclick", () => {
        selectedIso = iso;
        handleConfirm();
      });

      fileListContainer.appendChild(item);
    });

    modal.classList.remove("hidden");

    // Handlers de confirmação e cancelamento
    function handleConfirm() {
      if (selectedIso) {
        cleanup();
        resolve(selectedIso);
      }
    }

    function handleCancel() {
      cleanup();
      resolve(null);
    }

    // Suporte para atalhos de teclado (Enter e ESC)
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        handleCancel();
      } else if (e.key === "Enter" && selectedIso) {
        handleConfirm();
      }
    }

    function cleanup() {
      modal.classList.add("hidden");
      btnOpen.disabled = true;
      selectedNameLabel.textContent = "Nenhum arquivo selecionado";

      // Remove listeners para evitar vazamento de memória e chamadas duplicadas
      btnOpen.removeEventListener("click", handleConfirm);
      btnCancel.removeEventListener("click", handleCancel);
      if (btnX) btnX.removeEventListener("click", handleCancel);
      document.removeEventListener("keydown", handleKeyDown);
    }

    // Registra os escutadores de eventos
    btnOpen.addEventListener("click", handleConfirm);
    btnCancel.addEventListener("click", handleCancel);
    if (btnX) btnX.addEventListener("click", handleCancel);
    document.addEventListener("keydown", handleKeyDown);
  });
}