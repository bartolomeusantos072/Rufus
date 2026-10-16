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

        // Abre o File Explorer passando a lista de ISOs do data.json
        const chosenIso = await openFileExplorer(configData.isoImages);

        if (chosenIso) {
          // CORRIGIDO: Usa elements.bootSelect em vez de bootSelect solto
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

      // 1. Modal de Confirmação (Aviso)
      const confirmed = await showModal({
        title: "Rufus - Aviso de Formatação",
        icon: "⚠️",
        message: "AVISO: TODOS OS DADOS NO DISPOSITIVO SERÃO APAGADOS!",
        subtext: "Para continuar com esta operação, clique em OK. Para sair, clique em CANCELAR.",
        showCancel: true
      });

      if (!confirmed) return;

      isWriting = true;
      elements.btnStart.disabled = true;
      resetProgress(elements.progressBar, elements.progressText);

      try {
        currentTask = simulateWriting(elements.progressBar, elements.progressText);
        await currentTask.promise;

        elements.progressText.textContent = "PRONTO";

        // 2. Modal de Conclusão (Substitui o alert)
        await showModal({
          title: "Rufus - Concluído",
          icon: "✅",
          message: "Simulação concluída com sucesso!",
          subtext: "O pendrive bootável fictício está pronto para uso.",
          showCancel: false
        });

      } catch (err) {
        console.error(err);
        elements.progressText.textContent = "Erro durante a gravação.";
      } finally {
        isWriting = false;
        elements.btnStart.disabled = false;
      }
    });
  }

  init();
});