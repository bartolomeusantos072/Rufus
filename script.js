import { showModal } from "./modal.js";
import { updateClock, populateForm, makeWindowDraggable } from "./ui.js";
import { simulateWriting, resetProgress } from "./writer.js";
import { openFileExplorer } from "./explorer.js";

document.addEventListener("DOMContentLoaded", () => {
  let configData = null;
  let isWriting = false;
  let currentTask = null;

  // Seleção de elementos DOM
  const elements = {
    deviceSelect: document.getElementById("device-select"),
    bootSelect: document.getElementById("boot-select"),
    partitionSelect: document.getElementById("partition-select"),
    targetSelect: document.getElementById("target-select"),
    filesystemSelect: document.getElementById("filesystem-select"),
    btnStart: document.getElementById("btn-start"),
    btnCloseWindow: document.getElementById("btn-close-window"),
    btnCloseApp: document.getElementById("btn-close-app"),
    progressBar: document.getElementById("progress-bar"),
    progressText: document.getElementById("progress-text"),
    clockElement: document.getElementById("clock"),
    windowRufus: document.querySelector(".window-rufus"),
    windowHeader: document.querySelector(".window-header"),
    desktopRufusIcon: document.getElementById("desktop-rufus-icon"),
    startRufusIcon: document.getElementById("start-rufus-icon"),
    taskbarRufusIcon: document.getElementById("taskbar-rufus-icon")
  };

  async function init() {
    try {
      elements.btnStart.disabled = true;

      updateClock(elements.clockElement);
      setInterval(() => updateClock(elements.clockElement), 1000);

      await loadConfig();
      makeWindowDraggable(elements.windowRufus, elements.windowHeader);
      setupEventListeners();

      elements.btnStart.disabled = false;
    } catch (error) {
      console.error("Erro na inicialização:", error);
      elements.progressText.textContent = "Erro ao carregar dados.";
    }
  }

  async function loadConfig() {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Erro ao ler data.json");
    configData = await response.json();
    populateForm(configData, elements);
  }

  function openRufus() {
    elements.windowRufus.classList.remove("hidden");
    if (!elements.windowRufus.style.top) {
      elements.windowRufus.style.top = "100px";
      elements.windowRufus.style.left = "calc(50vw - 190px)";
    }
    elements.windowRufus.style.transform = "none";
    if (elements.taskbarRufusIcon) elements.taskbarRufusIcon.classList.remove("hidden");
  }

  function closeRufus() {
    if (isWriting) {
      const confirmClose = confirm("A gravação está em andamento. Deseja cancelar?");
      if (!confirmClose) return;

      if (currentTask) currentTask.stop();
      isWriting = false;
      elements.btnStart.disabled = false;
      resetProgress(elements.progressBar, elements.progressText);
    }

    elements.windowRufus.classList.add("hidden");
    if (elements.taskbarRufusIcon) elements.taskbarRufusIcon.classList.add("hidden");
  }

  function setupEventListeners() {
    const btnSelectIso = document.getElementById("btn-select-iso");

    if (btnSelectIso) {
      btnSelectIso.addEventListener("click", async () => {
        if (!configData || !configData.isoImages) return;

        const chosenIso = await openFileExplorer(configData.isoImages);

        if (chosenIso) {
          elements.bootSelect.value = chosenIso.id;
        }
      });
    }

    if (elements.desktopRufusIcon) elements.desktopRufusIcon.addEventListener("dblclick", openRufus);
    if (elements.startRufusIcon) elements.startRufusIcon.addEventListener("click", openRufus);
    if (elements.btnCloseWindow) elements.btnCloseWindow.addEventListener("click", closeRufus);
    if (elements.btnCloseApp) elements.btnCloseApp.addEventListener("click", closeRufus);

elements.btnStart.addEventListener("click", async () => {
  if (isWriting) return;

  // =========================================================
  // 1. VALIDAÇÕES DE SELEÇÃO E REGRA DE NEGÓCIO
  // =========================================================
  const selectedDeviceId = elements.deviceSelect ? elements.deviceSelect.value : "";
  const selectedIsoId = elements.bootSelect ? elements.bootSelect.value : "";

  // Validação do Dispositivo USB
  if (!selectedDeviceId || selectedDeviceId === "0") {
    await showModal({
      title: "Rufus - Erro de Seleção",
      icon: "❌",
      message: "Por favor, selecione um Dispositivo USB válido antes de continuar.",
      showCancel: false
    });
    return;
  }

  // Validação da Imagem ISO / Boot
  if (!selectedIsoId || selectedIsoId === "0") {
    await showModal({
      title: "Rufus - Erro de Seleção",
      icon: "❌",
      message: "Por favor, selecione uma Imagem ISO ou Utilitário de Boot.",
      showCancel: false
    });
    return;
  }

  // Busca dos objetos no JSON carregado
  const chosenIsoObj = configData && configData.isoImages
    ? configData.isoImages.find(iso => iso.id === selectedIsoId)
    : null;

  const chosenDriveObj = configData && configData.drives
    ? configData.drives.find(drive => drive.id === selectedDeviceId)
    : null;

  // Validação da Capacidade Mínima do Pen Drive
  if (chosenIsoObj && chosenDriveObj) {
    const driveCapacityGb = parseInt(chosenDriveObj.capacity, 10) || 0;
    const minRequiredGb = chosenIsoObj.minUsbSize || 0;

    if (driveCapacityGb < minRequiredGb) {
      await showModal({
        title: "Rufus - Erro de Capacidade",
        icon: "⚠️",
        message: `O pen drive selecionado (${chosenDriveObj.capacity}) é insuficiente.`,
        subtext: `Esta imagem exige um dispositivo de no mínimo ${minRequiredGb} GB.`,
        showCancel: false
      });
      return;
    }
  }

  // =========================================================
  // 2. MODAL DE CONFIRMAÇÃO DE FORMATAÇÃO
  // =========================================================
  const confirmed = await showModal({
    title: "Rufus - Aviso de Formatação",
    icon: "⚠️",
    message: "AVISO: TODOS OS DADOS NO DISPOSITIVO SERÃO APAGADOS!",
    subtext: "Para continuar com esta operação, clique em OK. Para sair, clique em CANCELAR.",
    showCancel: true
  });

  if (!confirmed) return;

  // =========================================================
  // 3. EXECUÇÃO DA GRAVAÇÃO
  // =========================================================
  isWriting = true;
  elements.btnStart.disabled = true;
  resetProgress(elements.progressBar, elements.progressText);

  try {
    currentTask = simulateWriting(elements.progressBar, elements.progressText);
    await currentTask.promise;

    elements.progressText.textContent = "PRONTO";

    // =========================================================
    // 4. PERSISTÊNCIA DE DADOS NO LOCALSTORAGE (Integração do Lab)
    // =========================================================
    localStorage.setItem("lab_boot_ready", "true");
    localStorage.setItem("lab_selected_iso", chosenIsoObj ? chosenIsoObj.label : "Imagem Desconhecida");
    localStorage.setItem("lab_partition_scheme", elements.partitionSelect ? elements.partitionSelect.value : "GPT");
    localStorage.setItem("lab_target_system", elements.targetSelect ? elements.targetSelect.value : "UEFI");
    localStorage.setItem("lab_file_system", elements.filesystemSelect ? elements.filesystemSelect.value : "FAT32");

    // =========================================================
    // 5. MODAL DE CONCLUSÃO E REDIRECIONAMENTO
    // =========================================================
    const restartNow = await showModal({
      title: "Rufus - Concluído",
      icon: "✅",
      message: "Simulação de gravação concluída com sucesso!",
      subtext: "Deseja reiniciar o computador fictício agora e abrir o Setup da BIOS/UEFI (Aula 3)?",
      showCancel: true
    });

    if (restartNow) {
      window.location.href = "../bios/index.html";
    }

  } catch (err) {
    console.error("Erro durante a gravação:", err);
    elements.progressText.textContent = "Erro durante a gravação.";
  } finally {
    isWriting = false;
    elements.btnStart.disabled = false;
  }
});
  }

  init();
});