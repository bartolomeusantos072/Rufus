// Funções auxiliares de interface e preenchimento de formulário
export function updateClock(clockElement) {
  const now = new Date();
  clockElement.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function populateForm(configData, elements) {
  const { deviceSelect, bootSelect, partitionSelect, targetSelect, filesystemSelect } = elements;

  // Dispositivos
  deviceSelect.innerHTML = "";
  configData.drives.forEach(drive => {
    const opt = document.createElement("option");
    opt.value = drive.id;
    opt.textContent = drive.label;
    deviceSelect.appendChild(opt);
  });

  // ISOs
  bootSelect.innerHTML = "";
  configData.isoImages.forEach(iso => {
    const opt = document.createElement("option");
    opt.value = iso.id;
    opt.textContent = iso.label;
    bootSelect.appendChild(opt);
  });

  // Partições
  partitionSelect.innerHTML = "";
  configData.partitionSchemes.forEach(scheme => {
    const opt = document.createElement("option");
    opt.value = scheme;
    opt.textContent = scheme;
    partitionSelect.appendChild(opt);
  });

  // Sistemas Alvo
  targetSelect.innerHTML = "";
  configData.targetSystems.forEach(sys => {
    const opt = document.createElement("option");
    opt.value = sys;
    opt.textContent = sys;
    targetSelect.appendChild(opt);
  });

  // Sistemas de Arquivo
  filesystemSelect.innerHTML = "";
  configData.fileSystems.forEach(fs => {
    const opt = document.createElement("option");
    opt.value = fs;
    opt.textContent = fs;
    filesystemSelect.appendChild(opt);
  });
}

export function makeWindowDraggable(win, handle) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  handle.onmousedown = (event) => {
    event.preventDefault();
    win.style.transform = "none";

    pos3 = event.clientX;
    pos4 = event.clientY;

    document.onmouseup = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };

    document.onmousemove = (e) => {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      let newTop = win.offsetTop - pos2;
      let newLeft = win.offsetLeft - pos1;

      const maxX = window.innerWidth - win.offsetWidth;
      const maxY = window.innerHeight - win.offsetHeight - 48;

      win.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
      win.style.left = `${Math.max(0, Math.min(newLeft, maxX))}px`;
    };
  };
}