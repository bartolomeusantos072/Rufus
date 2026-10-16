// Funções auxiliares de interface e preenchimento de formulário

export function updateClock(clockElement) {
  if (!clockElement) return;
  const now = new Date();
  clockElement.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function populateForm(configData, elements) {
  const { deviceSelect, bootSelect, partitionSelect, targetSelect, filesystemSelect } = elements;

  if (!configData) return;

  // Dispositivos USB
  if (deviceSelect && configData.drives) {
    deviceSelect.innerHTML = "";
    configData.drives.forEach(drive => {
      const opt = document.createElement("option");
      opt.value = drive.id;
      opt.textContent = drive.label;
      deviceSelect.appendChild(opt);
    });
  }

  // Imagens ISO / Boot
  if (bootSelect && configData.isoImages) {
    bootSelect.innerHTML = "";
    configData.isoImages.forEach(iso => {
      const opt = document.createElement("option");
      opt.value = iso.id;
      opt.textContent = iso.label;
      bootSelect.appendChild(opt);
    });
  }

  // Esquemas de Partição
  if (partitionSelect && configData.partitionSchemes) {
    partitionSelect.innerHTML = "";
    configData.partitionSchemes.forEach(scheme => {
      const opt = document.createElement("option");
      opt.value = scheme;
      opt.textContent = scheme;
      partitionSelect.appendChild(opt);
    });
  }

  // Sistemas Alvo (BIOS / UEFI)
  if (targetSelect && configData.targetSystems) {
    targetSelect.innerHTML = "";
    configData.targetSystems.forEach(sys => {
      const opt = document.createElement("option");
      opt.value = sys;
      opt.textContent = sys;
      targetSelect.appendChild(opt);
    });
  }

  // Sistemas de Arquivo
  if (filesystemSelect && configData.fileSystems) {
    filesystemSelect.innerHTML = "";
    configData.fileSystems.forEach(fs => {
      const opt = document.createElement("option");
      opt.value = fs;
      opt.textContent = fs;
      filesystemSelect.appendChild(opt);
    });
  }
}

export function makeWindowDraggable(win, handle) {
  if (!win || !handle) return;

  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  const onPointerDown = (e) => {
    // Permite arrastar apenas pelo botão esquerdo do mouse ou toque
    if (e.type === "mousedown" && e.button !== 0) return;

    e.preventDefault();
    win.style.transform = "none";

    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    pos3 = clientX;
    pos4 = clientY;

    const onPointerMove = (moveEvent) => {
      moveEvent.preventDefault();

      const currentX = moveEvent.type === "touchmove" ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = moveEvent.type === "touchmove" ? moveEvent.touches[0].clientY : moveEvent.clientY;

      pos1 = pos3 - currentX;
      pos2 = pos4 - currentY;
      pos3 = currentX;
      pos4 = currentY;

      let newTop = win.offsetTop - pos2;
      let newLeft = win.offsetLeft - pos1;

      const maxX = window.innerWidth - win.offsetWidth;
      const maxY = window.innerHeight - win.offsetHeight - 48; // Desconta altura estimada da barra de tarefas

      win.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
      win.style.left = `${Math.max(0, Math.min(newLeft, maxX))}px`;
    };

    const onPointerUp = () => {
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
      document.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerUp);
    };

    document.addEventListener("mousemove", onPointerMove, { passive: false });
    document.addEventListener("mouseup", onPointerUp);
    document.addEventListener("touchmove", onPointerMove, { passive: false });
    document.addEventListener("touchend", onPointerUp);
  };

  handle.addEventListener("mousedown", onPointerDown);
  handle.addEventListener("touchstart", onPointerDown, { passive: false });
}