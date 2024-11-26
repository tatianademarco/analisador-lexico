// Tabela de transições
const transitions = {};
let stateCount = 0;
const stateTable = document.getElementById("stateTable");
const errorDiv = document.getElementById("error");
const finalStates = new Set(); // Conjunto de estados finais

// Atualiza o estado conforme a digitação
document.getElementById("wordInput").addEventListener("input", highlightStates);

// Adiciona uma palavra à tabela de estados
function addWord() {
    const input = document.getElementById("wordInput").value.trim().toLowerCase();
  
    if (!input) {
      showError("Digite uma palavra válida.");
      return;
    }
  
    let currentState = "q0";
    for (const char of input) {
      if (!transitions[currentState]) {
        transitions[currentState] = {};
      }
      if (!transitions[currentState][char]) {
        const nextState = `q${++stateCount}`;
        transitions[currentState][char] = nextState;
        currentState = nextState;
      } else {
        currentState = transitions[currentState][char];
      }
    }
  
    // Marcar o estado final da palavra como um estado final
    finalStates.add(currentState);
  
    updateTable();
    clearError();
    document.getElementById("wordInput").value = ""; // Limpa o campo de entrada
  }
  

// Pesquisa se uma palavra é reconhecida pela tabela
function searchWord() {
  const input = document.getElementById("wordInput").value.trim().toLowerCase();

  if (!input) {
    showError("Digite uma palavra para pesquisar.");
    return;
  }

  let currentState = "q0";
  for (const char of input) {
    if (!transitions[currentState] || !transitions[currentState][char]) {
      showError(`A palavra "${input}" não é reconhecida.`);
      return;
    }
    currentState = transitions[currentState][char];
  }

  // Verificar se o estado final foi alcançado
  if (finalStates.has(currentState)) {
    showError(`A palavra "${input}" foi reconhecida com sucesso!`, true);
  } else {
    showError(`A palavra "${input}" não é reconhecida.`);
  }
}

// Atualiza a tabela de estados na interface
function updateTable() {
  stateTable.innerHTML = ""; // Limpa a tabela

  // Para cada estado, cria uma linha
  Object.keys(transitions).forEach((state) => {
    const row = stateTable.insertRow();
    const stateCell = row.insertCell();
    stateCell.textContent = state;

    // Preenche as colunas com as transições
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode(97 + i); // a-z
      const cell = row.insertCell();
      cell.textContent = transitions[state][char] || "-";
    }
  });
}

// Destaque os estados conforme o usuário digita
function highlightStates() {
  const input = document.getElementById("wordInput").value.trim().toLowerCase();
  let currentState = "q0";

  // Remove qualquer destaque existente
  clearHighlights();

  for (const char of input) {
    // Destaca o estado atual na tabela
    highlightState(currentState, char);
    currentState = transitions[currentState][char];
  }

  clearError(); // Limpa mensagens de erro se todas as transições forem válidas
}

// Limpa destaques na tabela
function clearHighlights() {
  const rows = stateTable.rows;
  for (let row of rows) {
    for (let cell of row.cells) {
      cell.style.backgroundColor = ""; // Remove o fundo
    }
  }
}

// Destaca um estado na tabela
function highlightState(state, char) {
  const rows = stateTable.rows;
  for (let row of rows) {
    if (row.cells[0].textContent === state) {
      const colIndex = char.charCodeAt(0) - 97 + 1; // Coluna correspondente ao caractere
      if (colIndex > 0 && colIndex < row.cells.length) {
        row.cells[colIndex].style.backgroundColor = "lightgreen";
      }
      break;
    }
  }
}

// Exibe mensagens de erro ou sucesso
function showError(message, isSuccess = false) {
  errorDiv.textContent = message;
  errorDiv.style.color = isSuccess ? "green" : "red";
}

function clearError() {
  errorDiv.textContent = "";
}
