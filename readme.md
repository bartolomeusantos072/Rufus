# 📀 Simulador Rufus & Windows 11 — Laboratório Interativo

Este projeto é um simulador interativo desenvolvido em **JavaScript ES6+**, **HTML5** e **CSS3** para aulas práticas de **Fundamentos de Hardware e Sistemas Operacionais**.

O simulador reproduz a interface do **Rufus 4.4** dentro de um ambiente de Área de Trabalho do **Windows 11**, permitindo que alunos pratiquem a criação de mídias bootáveis (Sistemas Operacionais e Utilitários de Atualização de BIOS) com validações em tempo real.

---

## 🚀 Funcionalidades do Simulador

- **Carregamento Dinâmico de Dados (`data.json`)**: Lista imagens ISO, dispositivos USB e opções de partição.
- **Seletor de Arquivos (`explorer.js`)**: Simula o Gerenciador de Arquivos do Windows com suporte a clique duplo, atalhos de teclado (`Enter`/`ESC`) e seleção de ISOs.
- **Validações de Regra de Negócio**:
  - Impedimento de execução sem selecionar Pen Drive ou Imagem válida.
  - Verificação da capacidade mínima do Pen Drive (`minUsbSize`) antes da formatação.
  - Ajuste dinâmico de padrões de boot dependendo do tipo de imagem selecionada.
- **Simulação da Gravação (`writer.js`)**: Barra de progresso animada com etapas reais (limpeza MBR/GPT, formatação FAT32/NTFS, cópia de arquivos e escrita do Bootloader).
- **Persistência de Estado (`localStorage`)**: Salva as configurações aplicadas para integração direta com a aula seguinte (Setup da BIOS/UEFI).

---

## 🛠️ Regras de Negócio: Atualização de BIOS (Legacy 16/32-bit ➡️ UEFI 32/64-bit)

A atualização de firmware em placas-mãe antigas (como na transição de **Award/Legacy BIOS** para **UEFI** na arquitetura Intel Z68/H61) exige parâmetros específicos no Rufus que foram simulados nesta aplicação:

| Campo no Rufus | Valor Exigido | Motivo Técnico |
| :--- | :--- | :--- |
| **Eleição do Tipo de Inicialização** | `FreeDOS` / Utilitário DOS | Ambientes de flash antigos exigem execução via DOS (`FLASHEPI.EXE`). |
| **Esquema de Partição** | **`MBR`** | A BIOS antiga (modo Real 16-bit) só consegue dar boot em tabelas MBR. |
| **Sistema de Destino** | **`BIOS ou UEFI`** *(BIOS/CSM)* | A placa-mãe no momento da gravação ainda é Legacy e necessita do código de boot MBR. |
| **Sistema de Arquivos** | **`FAT32`** | O FreeDOS e os utilitários de flash de ROM da EPROM não conseguem ler NTFS. |

> **Nota:** Após a execução do flash via FreeDOS, o chip da placa-mãe é atualizado para UEFI nativo. Para instalações posteriores de sistemas como o Windows 11, o padrão mudará para **GPT** e **UEFI (não CSM)**.

---

## 📁 Arquitetura do Projeto