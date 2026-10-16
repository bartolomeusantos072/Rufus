// Simulação de gravação e controle da barra de progresso
export function simulateWriting(progressBar, progressText) {
  const steps = [
    { start: 0, end: 20, message: "Limpando estrutura de MBR/GPT..." },
    { start: 20, end: 40, message: "Formatando unidade..." },
    { start: 40, end: 85, message: "Copiando arquivos da ISO..." },
    { start: 85, end: 98, message: "Configurando gerenciador de inicialização (Bootloader)..." },
    { start: 98, end: 100, message: "Finalizando..." }
  ];

  let intervalId = null;
  let rejectPromise = null;

  const promise = new Promise((resolve, reject) => {
    rejectPromise = reject;
    let progress = 0;

    intervalId = setInterval(() => {
      try {
        progress += 2;
        if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;

        // Busca o passo correspondente (<= garante a leitura do último passo no 100%)
        const currentStep = steps.find(step => progress >= step.start && progress <= step.end);
        
        if (currentStep && progressText) {
          progressText.textContent = currentStep.message === "Copiando arquivos da ISO..."
            ? `${currentStep.message} (${progress}%)`
            : currentStep.message;
        }

        if (progress >= 100) {
          clearInterval(intervalId);
          resolve();
        }
      } catch (err) {
        clearInterval(intervalId);
        reject(err);
      }
    }, 150);
  });

  return {
    promise,
    stop: () => {
      if (intervalId) clearInterval(intervalId);
      if (rejectPromise) rejectPromise(new Error("Gravação cancelada pelo usuário."));
    }
  };
}

export function resetProgress(progressBar, progressText) {
  if (progressBar) progressBar.style.width = "0%";
  if (progressText) progressText.textContent = "PRONTO";
}