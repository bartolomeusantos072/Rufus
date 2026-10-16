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

  const promise = new Promise((resolve, reject) => {
    let progress = 0;

    intervalId = setInterval(() => {
      try {
        progress += 2;
        progressBar.style.width = `${progress}%`;

        const currentStep = steps.find(step => progress >= step.start && progress < step.end);
        if (currentStep) {
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

  return { promise, stop: () => clearInterval(intervalId) };
}

export function resetProgress(progressBar, progressText) {
  progressBar.style.width = "0%";
  progressText.textContent = "Preparando...";
}