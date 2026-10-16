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
    // Renderiza os arquivos ISO da pasta Downloads
    fileListContainer.innerHTML = "";
    isoList.forEach(iso => {
      const item = document.createElement("div");
      item.className = "file-item";
      item.innerHTML = `
        <span>📀</span>
        <span>${iso.label}</span>
        <span style="margin-left: auto; color: #888; font-size: 11px;">${iso.size}</span>
      `;

      item.addEventListener("click", () => {
        document.querySelectorAll(".file-item").forEach(el => el.classList.remove("selected"));
        item.classList.add("selected");
        selectedIso = iso;
        selectedNameLabel.textContent = iso.label;
        btnOpen.disabled = false;
      });

      fileListContainer.appendChild(item);
    });

    modal.classList.remove("hidden");

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

    function cleanup() {
      modal.classList.add("hidden");
      btnOpen.disabled = true;
      selectedNameLabel.textContent = "Nenhum arquivo selecionado";
      btnOpen.removeEventListener("click", handleConfirm);
      btnCancel.removeEventListener("click", handleCancel);
      btnX.removeEventListener("click", handleCancel);
    }

    btnOpen.addEventListener("click", handleConfirm);
    btnCancel.addEventListener("click", handleCancel);
    btnX.addEventListener("click", handleCancel);
  });
}