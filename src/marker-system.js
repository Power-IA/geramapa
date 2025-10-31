// ===== SISTEMA DE MARCADOR SIMPLIFICADO =====

// Variáveis globais do marcador
let markerActive = false;
let markerColor = '#ffff00';
let markerStrokeWidth = 8; // Espessura padrão (médio)
let isDrawing = false;
let currentPath = null;
let allPaths = [];

// ===== SISTEMA DE LÁPIS INDEPENDENTE =====

// Variáveis globais do lápis
let lapisActive = false;
let lapisColor = '#000000'; // Preto para lápis
let lapisStrokeWidth = 6; // Espessura padrão do lápis
let isLapisDrawing = false;
let currentLapisPath = null;
let allLapisPaths = [];
let lapisPanelVisible = false;

// Função principal para ativar/desativar marcador
function toggleMarker() {
  console.log('🖍️ Toggle marcador - Estado atual:', markerActive);
  
  markerActive = !markerActive;
  
  if (markerActive) {
    activateMarker();
  } else {
    deactivateMarker();
  }
}

// Função principal para ativar/desativar lápis
function toggleLapis() {
  console.log('✏️ Toggle lápis - Estado atual:', lapisActive);
  
  lapisActive = !lapisActive;
  
  if (lapisActive) {
    activateLapis();
  } else {
    deactivateLapis();
  }
}

// Ativar marcador
function activateMarker() {
  console.log('🖍️ Ativando marcador');
  
  // Atualizar botão
  const btn = document.getElementById('markerBtn');
  if (btn) {
    btn.style.backgroundColor = '#ff6b35';
    btn.style.color = 'white';
    btn.classList.add('active');
  }
  
  // Atualizar cursor
  const container = document.getElementById('mapContainer');
  if (container) {
    container.style.cursor = 'crosshair';
  }
  
  // Mostrar painel de cores
  showColorPanel();
  
  // Adicionar listeners
  addMarkerListeners();
  addMarkerListenersToPopups();
  
  updateStatus('Marcador ATIVADO - Arraste para desenhar');
}

// Desativar marcador
function deactivateMarker() {
  console.log('🖍️ Desativando marcador');
  
  // Atualizar botão
  const btn = document.getElementById('markerBtn');
  if (btn) {
    btn.style.backgroundColor = '';
    btn.style.color = '';
    btn.classList.remove('active');
  }
  
  // Atualizar cursor
  const container = document.getElementById('mapContainer');
  if (container) {
    container.style.cursor = '';
  }
  
  // Esconder painel
  hideColorPanel();
  
  // Remover listeners
  removeMarkerListeners();
  removeMarkerListenersFromPopups();
  
  // Finalizar desenho atual
  if (isDrawing) {
    finishDrawing();
  }
  
  updateStatus('Marcador DESATIVADO');
}

// Ativar lápis
function activateLapis() {
  console.log('✏️ Ativando lápis');
  
  // Desativar marcador se estiver ativo
  if (markerActive) {
    deactivateMarker();
  }
  
  // Atualizar botão
  const btn = document.getElementById('lapisBtn');
  if (btn) {
    btn.style.backgroundColor = '#2c3e50';
    btn.style.color = 'white';
    btn.classList.add('active');
  }
  
  // Atualizar cursor
  const container = document.getElementById('mapContainer');
  if (container) {
    container.style.cursor = 'crosshair';
  }
  
  // Mostrar painel de controles do lápis
  showLapisPanel();
  
  // Adicionar listeners
  addLapisListeners();
  addLapisListenersToPopups();
  
  updateStatus('Lápis ATIVADO - Desenhe livremente');
}

// Desativar lápis
function deactivateLapis() {
  console.log('✏️ Desativando lápis');
  
  // Atualizar botão
  const btn = document.getElementById('lapisBtn');
  if (btn) {
    btn.style.backgroundColor = '';
    btn.style.color = '';
    btn.classList.remove('active');
  }
  
  // Atualizar cursor
  const container = document.getElementById('mapContainer');
  if (container) {
    container.style.cursor = '';
  }
  
  // Esconder painel
  hideLapisPanel();
  
  // Remover listeners
  removeLapisListeners();
  removeLapisListenersFromPopups();
  
  // Finalizar desenho atual
  if (isLapisDrawing) {
    finishLapisDrawing();
  }
  
  updateStatus('Lápis DESATIVADO');
}

// Mostrar painel de cores
function showColorPanel() {
  hideColorPanel(); // Remove existente
  
  const panel = document.createElement('div');
  panel.id = 'markerColorPanel';
  panel.className = 'marker-color-panel';
  
  // Posicionar de forma inteligente para não tampar menus
  const smartPosition = getSmartPosition();
  
  panel.style.cssText = `
    position: fixed;
    top: ${smartPosition.top}px;
    left: ${smartPosition.left}px;
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,248,248,0.95));
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 107, 53, 0.3);
    border-radius: 50%;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    cursor: move;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: scale(0.8);
    opacity: 0;
  `;
  
  panel.innerHTML = `
    <div class="color-panel-header">
      <div class="color-picker-container">
        <input type="color" id="colorPicker" value="${markerColor}" class="color-picker-input">
        <div class="current-color-display" style="background: ${markerColor}"></div>
      </div>
    </div>
    
     <div class="stroke-width-controls">
       <div class="stroke-width-label">Espessura</div>
       <div class="stroke-width-options">
         <div class="stroke-width-btn" data-width="4" title="Fino (4px)">
           <div class="stroke-preview" style="width: 4px; height: 4px;"></div>
         </div>
         <div class="stroke-width-btn" data-width="8" title="Médio (8px)">
           <div class="stroke-preview" style="width: 8px; height: 8px;"></div>
         </div>
         <div class="stroke-width-btn" data-width="12" title="Grosso (12px)">
           <div class="stroke-preview" style="width: 12px; height: 12px;"></div>
         </div>
         <div class="stroke-width-btn" data-width="16" title="Mais Grosso (16px)">
           <div class="stroke-preview" style="width: 16px; height: 16px;"></div>
         </div>
       </div>
     </div>
    
    <div class="color-palette">
      <div class="color-circle" data-color="#ffff00" style="background: #ffff00" title="Amarelo"></div>
      <div class="color-circle" data-color="#ff6b6b" style="background: #ff6b6b" title="Rosa"></div>
      <div class="color-circle" data-color="#4ecdc4" style="background: #4ecdc4" title="Verde Água"></div>
      <div class="color-circle" data-color="#45b7d1" style="background: #45b7d1" title="Azul"></div>
      <div class="color-circle" data-color="#96ceb4" style="background: #96ceb4" title="Verde"></div>
      <div class="color-circle" data-color="#feca57" style="background: #feca57" title="Laranja"></div>
    </div>
    
    <div class="color-panel-actions">
      <button id="clearMarkers" class="clear-btn">
        <span class="clear-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </span>
        <span class="clear-text">Limpar</span>
      </button>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Animar entrada
  requestAnimationFrame(() => {
    panel.style.transform = 'scale(1)';
    panel.style.opacity = '1';
  });
  
  // Event listeners
  setupColorPanelEvents(panel);
  setupDragFunctionality(panel);
}

// Função para posicionamento inteligente
function getSmartPosition() {
  const panelSize = 200;
  const margin = 20;
  
  // Verificar se há elementos que podem ser tampados
  const header = document.querySelector('.app-header');
  const statusBar = document.querySelector('.status-bar');
  const floatingChat = document.getElementById('floatingChat');
  
  let top = margin;
  let left = window.innerWidth - panelSize - margin;
  
  // Evitar tampar o header
  if (header) {
    const headerRect = header.getBoundingClientRect();
    if (top < headerRect.bottom + margin) {
      top = headerRect.bottom + margin;
    }
  }
  
  // Evitar tampar a barra de status
  if (statusBar) {
    const statusRect = statusBar.getBoundingClientRect();
    if (top + panelSize > statusRect.top - margin) {
      top = statusRect.top - panelSize - margin;
    }
  }
  
  // Evitar tampar o chat flutuante
  if (floatingChat && floatingChat.style.display !== 'none') {
    const chatRect = floatingChat.getBoundingClientRect();
    if (left < chatRect.right + margin) {
      left = chatRect.right + margin;
    }
  }
  
  // Garantir que não saia da tela
  if (left + panelSize > window.innerWidth - margin) {
    left = window.innerWidth - panelSize - margin;
  }
  
  if (top + panelSize > window.innerHeight - margin) {
    top = window.innerHeight - panelSize - margin;
  }
  
  return { top, left };
}

// Configurar funcionalidade de arrastar
function setupDragFunctionality(panel) {
  let isDragging = false;
  let startX, startY, initialX, initialY;
  
  panel.addEventListener('mousedown', (e) => {
    if (e.target.closest('.color-circle') || 
        e.target.closest('.clear-btn') || 
        e.target.closest('#colorPicker') ||
        e.target.closest('.stroke-width-btn')) {
      return; // Não arrastar se clicou em elementos interativos
    }
    
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = panel.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    panel.style.cursor = 'grabbing';
    panel.style.transition = 'none';
    
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    let newX = initialX + deltaX;
    let newY = initialY + deltaY;
    
    // Manter dentro da tela
    const panelSize = 200;
    const margin = 10;
    
    newX = Math.max(margin, Math.min(newX, window.innerWidth - panelSize - margin));
    newY = Math.max(margin, Math.min(newY, window.innerHeight - panelSize - margin));
    
    panel.style.left = newX + 'px';
    panel.style.top = newY + 'px';
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      panel.style.cursor = 'move';
      panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  });
  
  // Touch events para mobile
  panel.addEventListener('touchstart', (e) => {
    if (e.target.closest('.color-circle') || 
        e.target.closest('.clear-btn') || 
        e.target.closest('#colorPicker') ||
        e.target.closest('.stroke-width-btn')) {
      return;
    }
    
    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    
    const rect = panel.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    panel.style.transition = 'none';
    e.preventDefault();
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    let newX = initialX + deltaX;
    let newY = initialY + deltaY;
    
    const panelSize = 200;
    const margin = 10;
    
    newX = Math.max(margin, Math.min(newX, window.innerWidth - panelSize - margin));
    newY = Math.max(margin, Math.min(newY, window.innerHeight - panelSize - margin));
    
    panel.style.left = newX + 'px';
    panel.style.top = newY + 'px';
    
    e.preventDefault();
  });
  
  document.addEventListener('touchend', () => {
    if (isDragging) {
      isDragging = false;
      panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  });
}

// Configurar eventos do painel
function setupColorPanelEvents(panel) {
  // Color picker
  const picker = panel.querySelector('#colorPicker');
  const currentColorDisplay = panel.querySelector('.current-color-display');
  
  if (picker) {
    picker.addEventListener('change', (e) => {
      markerColor = e.target.value;
      if (currentColorDisplay) {
        currentColorDisplay.style.background = markerColor;
      }
      console.log('🖍️ Cor alterada:', markerColor);
    });
  }
  
  // Controles de espessura
  panel.querySelectorAll('.stroke-width-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Usar currentTarget para pegar o botão correto, não o elemento filho
      const button = e.currentTarget;
      markerStrokeWidth = parseInt(button.dataset.width);
      
      // Destacar espessura selecionada
      panel.querySelectorAll('.stroke-width-btn').forEach(b => {
        b.style.transform = 'scale(1)';
        b.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      });
      button.style.transform = 'scale(1.1)';
      button.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
      
      console.log('🖍️ Espessura alterada:', markerStrokeWidth);
    });
    
    // Destacar espessura padrão (médio = 8)
    if (parseInt(btn.dataset.width) === markerStrokeWidth) {
      btn.style.transform = 'scale(1.1)';
      btn.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
    }
  });
  
  // Botões de cor circulares
  panel.querySelectorAll('.color-circle').forEach(circle => {
    circle.addEventListener('click', (e) => {
      markerColor = e.target.dataset.color;
      if (picker) picker.value = markerColor;
      if (currentColorDisplay) {
        currentColorDisplay.style.background = markerColor;
      }
      
      // Destacar cor selecionada
      panel.querySelectorAll('.color-circle').forEach(c => {
        c.style.transform = 'scale(1)';
        c.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      });
      e.target.style.transform = 'scale(1.2)';
      e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
      
      console.log('🖍️ Cor selecionada:', markerColor);
    });
  });
  
  // Botão limpar
  const clearBtn = panel.querySelector('#clearMarkers');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearAllMarkers();
    });
  }
}

// Esconder painel de cores
function hideColorPanel() {
  const panel = document.getElementById('markerColorPanel');
  if (panel) {
    // Animar saída
    panel.style.transform = 'scale(0.8)';
    panel.style.opacity = '0';
    
    setTimeout(() => {
      panel.remove();
    }, 300);
  }
}

// Mostrar painel de controles do lápis
function showLapisPanel() {
  hideLapisPanel(); // Remove existente
  
  const panel = document.createElement('div');
  panel.id = 'lapisControlPanel';
  panel.className = 'lapis-control-panel';
  
  // Posicionar de forma inteligente
  const smartPosition = getLapisSmartPosition();
  
  panel.style.cssText = `
    position: fixed;
    top: ${smartPosition.top}px;
    left: ${smartPosition.left}px;
    width: 180px;
    height: 180px;
    background: linear-gradient(135deg, rgba(44,62,80,0.95), rgba(52,73,94,0.95));
    backdrop-filter: blur(10px);
    border: 2px solid rgba(44, 62, 80, 0.5);
    border-radius: 50%;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 1001;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    cursor: move;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: scale(0.8);
    opacity: 0;
  `;
  
  panel.innerHTML = `
    <div class="lapis-panel-header">
      <div class="lapis-title">✏️ Lápis</div>
    </div>
    
    <div class="lapis-stroke-controls">
      <div class="lapis-stroke-label">Espessura</div>
      <div class="lapis-stroke-options">
        <div class="lapis-stroke-btn" data-width="3" title="Muito Fino (3px)">
          <div class="lapis-stroke-preview" style="width: 3px; height: 3px;"></div>
        </div>
        <div class="lapis-stroke-btn" data-width="6" title="Fino (6px)">
          <div class="lapis-stroke-preview" style="width: 6px; height: 6px;"></div>
        </div>
        <div class="lapis-stroke-btn" data-width="9" title="Médio (9px)">
          <div class="lapis-stroke-preview" style="width: 9px; height: 9px;"></div>
        </div>
        <div class="lapis-stroke-btn" data-width="12" title="Grosso (12px)">
          <div class="lapis-stroke-preview" style="width: 12px; height: 12px;"></div>
        </div>
      </div>
    </div>
    
    <div class="lapis-panel-actions">
      <button id="clearLapis" class="lapis-clear-btn">
        <span class="lapis-clear-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </span>
        <span class="lapis-clear-text">Limpar</span>
      </button>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Animar entrada
  requestAnimationFrame(() => {
    panel.style.transform = 'scale(1)';
    panel.style.opacity = '1';
  });
  
  // Event listeners
  setupLapisPanelEvents(panel);
  setupLapisDragFunctionality(panel);
  
  lapisPanelVisible = true;
}

// Esconder painel do lápis
function hideLapisPanel() {
  const panel = document.getElementById('lapisControlPanel');
  if (panel) {
    // Animar saída
    panel.style.transform = 'scale(0.8)';
    panel.style.opacity = '0';
    
    setTimeout(() => {
      panel.remove();
    }, 300);
  }
  lapisPanelVisible = false;
}

// Função para posicionamento inteligente do painel do lápis
function getLapisSmartPosition() {
  const panelSize = 180;
  const margin = 20;
  
  // Verificar se há elementos que podem ser tampados
  const header = document.querySelector('.app-header');
  const statusBar = document.querySelector('.status-bar');
  const floatingChat = document.getElementById('floatingChat');
  const markerPanel = document.getElementById('markerColorPanel');
  
  let top = margin;
  let left = window.innerWidth - panelSize - margin;
  
  // Evitar tampar o header
  if (header) {
    const headerRect = header.getBoundingClientRect();
    if (top < headerRect.bottom + margin) {
      top = headerRect.bottom + margin;
    }
  }
  
  // Evitar tampar a barra de status
  if (statusBar) {
    const statusRect = statusBar.getBoundingClientRect();
    if (top + panelSize > statusRect.top - margin) {
      top = statusRect.top - panelSize - margin;
    }
  }
  
  // Evitar tampar o chat flutuante
  if (floatingChat && floatingChat.style.display !== 'none') {
    const chatRect = floatingChat.getBoundingClientRect();
    if (left < chatRect.right + margin) {
      left = chatRect.right + margin;
    }
  }
  
  // Evitar tampar o painel do marcador
  if (markerPanel) {
    const markerRect = markerPanel.getBoundingClientRect();
    if (Math.abs(left - markerRect.left) < panelSize + margin) {
      left = markerRect.left - panelSize - margin;
    }
  }
  
  // Garantir que não saia da tela
  if (left + panelSize > window.innerWidth - margin) {
    left = window.innerWidth - panelSize - margin;
  }
  
  if (top + panelSize > window.innerHeight - margin) {
    top = window.innerHeight - panelSize - margin;
  }
  
  return { top, left };
}

// Configurar eventos do painel do lápis
function setupLapisPanelEvents(panel) {
  // Controles de espessura
  panel.querySelectorAll('.lapis-stroke-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Usar currentTarget para pegar o botão correto
      const button = e.currentTarget;
      lapisStrokeWidth = parseInt(button.dataset.width);
      
      // Destacar espessura selecionada
      panel.querySelectorAll('.lapis-stroke-btn').forEach(b => {
        b.style.transform = 'scale(1)';
        b.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      });
      button.style.transform = 'scale(1.1)';
      button.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      
      console.log('✏️ Espessura do lápis alterada:', lapisStrokeWidth);
    });
    
    // Destacar espessura padrão (fino = 6)
    if (parseInt(btn.dataset.width) === lapisStrokeWidth) {
      btn.style.transform = 'scale(1.1)';
      btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    }
  });
  
  // Botão limpar
  const clearBtn = panel.querySelector('#clearLapis');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearAllLapis();
    });
  }
}

// Configurar funcionalidade de arrastar do painel do lápis
function setupLapisDragFunctionality(panel) {
  let isDragging = false;
  let startX, startY, initialX, initialY;
  
  panel.addEventListener('mousedown', (e) => {
    if (e.target.closest('.lapis-stroke-btn') || 
        e.target.closest('.lapis-clear-btn')) {
      return; // Não arrastar se clicou em elementos interativos
    }
    
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = panel.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    panel.style.cursor = 'grabbing';
    panel.style.transition = 'none';
    
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    let newX = initialX + deltaX;
    let newY = initialY + deltaY;
    
    // Manter dentro da tela
    const panelSize = 180;
    const margin = 10;
    
    newX = Math.max(margin, Math.min(newX, window.innerWidth - panelSize - margin));
    newY = Math.max(margin, Math.min(newY, window.innerHeight - panelSize - margin));
    
    panel.style.left = newX + 'px';
    panel.style.top = newY + 'px';
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      panel.style.cursor = 'move';
      panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  });
  
  // Touch events para mobile
  panel.addEventListener('touchstart', (e) => {
    if (e.target.closest('.lapis-stroke-btn') || 
        e.target.closest('.lapis-clear-btn')) {
      return;
    }
    
    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    
    const rect = panel.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    panel.style.transition = 'none';
    e.preventDefault();
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    let newX = initialX + deltaX;
    let newY = initialY + deltaY;
    
    const panelSize = 180;
    const margin = 10;
    
    newX = Math.max(margin, Math.min(newX, window.innerWidth - panelSize - margin));
    newY = Math.max(margin, Math.min(newY, window.innerHeight - panelSize - margin));
    
    panel.style.left = newX + 'px';
    panel.style.top = newY + 'px';
    
    e.preventDefault();
  });
  
  document.addEventListener('touchend', () => {
    if (isDragging) {
      isDragging = false;
      panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  });
}

// Adicionar listeners de desenho
function addMarkerListeners() {
  const container = document.getElementById('mapContainer');
  if (container) {
    container.addEventListener('mousedown', startDrawing);
    container.addEventListener('mousemove', draw);
    container.addEventListener('mouseup', finishDrawing);
    container.addEventListener('mouseleave', finishDrawing);
  }
}

// Remover listeners de desenho
function removeMarkerListeners() {
  const container = document.getElementById('mapContainer');
  if (container) {
    container.removeEventListener('mousedown', startDrawing);
    container.removeEventListener('mousemove', draw);
    container.removeEventListener('mouseup', finishDrawing);
    container.removeEventListener('mouseleave', finishDrawing);
  }
}

// Adicionar listeners de desenho do lápis
function addLapisListeners() {
  const container = document.getElementById('mapContainer');
  if (container) {
    container.addEventListener('mousedown', startLapisDrawing);
    container.addEventListener('mousemove', drawLapis);
    container.addEventListener('mouseup', finishLapisDrawing);
    container.addEventListener('mouseleave', finishLapisDrawing);
  }
}

// Remover listeners de desenho do lápis
function removeLapisListeners() {
  const container = document.getElementById('mapContainer');
  if (container) {
    container.removeEventListener('mousedown', startLapisDrawing);
    container.removeEventListener('mousemove', drawLapis);
    container.removeEventListener('mouseup', finishLapisDrawing);
    container.removeEventListener('mouseleave', finishLapisDrawing);
  }
}

// Adicionar listeners do marcador aos popups
function addMarkerListenersToPopups() {
  // Popup de informação
  const infoPopup = document.querySelector('.info-popup');
  if (infoPopup) {
    infoPopup.addEventListener('mousedown', startDrawingInPopup);
    infoPopup.addEventListener('mousemove', drawInPopup);
    infoPopup.addEventListener('mouseup', finishDrawingInPopup);
    infoPopup.addEventListener('mouseleave', finishDrawingInPopup);
  }
  
  // Popup de expansão (node slider)
  const nodeSlider = document.querySelector('.node-slider');
  if (nodeSlider) {
    nodeSlider.addEventListener('mousedown', startDrawingInPopup);
    nodeSlider.addEventListener('mousemove', drawInPopup);
    nodeSlider.addEventListener('mouseup', finishDrawingInPopup);
    nodeSlider.addEventListener('mouseleave', finishDrawingInPopup);
  }
  
  // Qualquer outro popup que possa aparecer
  const allPopups = document.querySelectorAll('.popup, .modal, .overlay');
  allPopups.forEach(popup => {
    popup.addEventListener('mousedown', startDrawingInPopup);
    popup.addEventListener('mousemove', drawInPopup);
    popup.addEventListener('mouseup', finishDrawingInPopup);
    popup.addEventListener('mouseleave', finishDrawingInPopup);
  });
}

// Remover listeners do marcador dos popups
function removeMarkerListenersFromPopups() {
  // Popup de informação
  const infoPopup = document.querySelector('.info-popup');
  if (infoPopup) {
    infoPopup.removeEventListener('mousedown', startDrawingInPopup);
    infoPopup.removeEventListener('mousemove', drawInPopup);
    infoPopup.removeEventListener('mouseup', finishDrawingInPopup);
    infoPopup.removeEventListener('mouseleave', finishDrawingInPopup);
  }
  
  // Popup de expansão (node slider)
  const nodeSlider = document.querySelector('.node-slider');
  if (nodeSlider) {
    nodeSlider.removeEventListener('mousedown', startDrawingInPopup);
    nodeSlider.removeEventListener('mousemove', drawInPopup);
    nodeSlider.removeEventListener('mouseup', finishDrawingInPopup);
    nodeSlider.removeEventListener('mouseleave', finishDrawingInPopup);
  }
  
  // Qualquer outro popup que possa aparecer
  const allPopups = document.querySelectorAll('.popup, .modal, .overlay');
  allPopups.forEach(popup => {
    popup.removeEventListener('mousedown', startDrawingInPopup);
    popup.removeEventListener('mousemove', drawInPopup);
    popup.removeEventListener('mouseup', finishDrawingInPopup);
    popup.removeEventListener('mouseleave', finishDrawingInPopup);
  });
}

// Adicionar listeners do lápis aos popups
function addLapisListenersToPopups() {
  // Popup de informação
  const infoPopup = document.querySelector('.info-popup');
  if (infoPopup) {
    infoPopup.addEventListener('mousedown', startLapisDrawingInPopup);
    infoPopup.addEventListener('mousemove', drawLapisInPopup);
    infoPopup.addEventListener('mouseup', finishLapisDrawingInPopup);
    infoPopup.addEventListener('mouseleave', finishLapisDrawingInPopup);
  }
  
  // Popup de expansão (node slider)
  const nodeSlider = document.querySelector('.node-slider');
  if (nodeSlider) {
    nodeSlider.addEventListener('mousedown', startLapisDrawingInPopup);
    nodeSlider.addEventListener('mousemove', drawLapisInPopup);
    nodeSlider.addEventListener('mouseup', finishLapisDrawingInPopup);
    nodeSlider.addEventListener('mouseleave', finishLapisDrawingInPopup);
  }
  
  // Qualquer outro popup que possa aparecer
  const allPopups = document.querySelectorAll('.popup, .modal, .overlay');
  allPopups.forEach(popup => {
    popup.addEventListener('mousedown', startLapisDrawingInPopup);
    popup.addEventListener('mousemove', drawLapisInPopup);
    popup.addEventListener('mouseup', finishLapisDrawingInPopup);
    popup.addEventListener('mouseleave', finishLapisDrawingInPopup);
  });
}

// Remover listeners do lápis dos popups
function removeLapisListenersFromPopups() {
  // Popup de informação
  const infoPopup = document.querySelector('.info-popup');
  if (infoPopup) {
    infoPopup.removeEventListener('mousedown', startLapisDrawingInPopup);
    infoPopup.removeEventListener('mousemove', drawLapisInPopup);
    infoPopup.removeEventListener('mouseup', finishLapisDrawingInPopup);
    infoPopup.removeEventListener('mouseleave', finishLapisDrawingInPopup);
  }
  
  // Popup de expansão (node slider)
  const nodeSlider = document.querySelector('.node-slider');
  if (nodeSlider) {
    nodeSlider.removeEventListener('mousedown', startLapisDrawingInPopup);
    nodeSlider.removeEventListener('mousemove', drawLapisInPopup);
    nodeSlider.removeEventListener('mouseup', finishLapisDrawingInPopup);
    nodeSlider.removeEventListener('mouseleave', finishLapisDrawingInPopup);
  }
  
  // Qualquer outro popup que possa aparecer
  const allPopups = document.querySelectorAll('.popup, .modal, .overlay');
  allPopups.forEach(popup => {
    popup.removeEventListener('mousedown', startLapisDrawingInPopup);
    popup.removeEventListener('mousemove', drawLapisInPopup);
    popup.removeEventListener('mouseup', finishLapisDrawingInPopup);
    popup.removeEventListener('mouseleave', finishLapisDrawingInPopup);
  });
}

// Iniciar desenho
function startDrawing(e) {
  if (!markerActive) return;
  
  console.log('🖍️ Iniciando desenho');
  e.preventDefault();
  e.stopPropagation();
  
  isDrawing = true;
  
  const container = document.getElementById('mapContainer');
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Criar elemento SVG
  currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  currentPath.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 40;
  `;
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke', markerColor);
  path.setAttribute('stroke-width', markerStrokeWidth);
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('fill', 'none');
  path.setAttribute('opacity', '0.7');
  path.setAttribute('d', `M ${x} ${y}`);
  
  console.log('🖍️ Criando traço com espessura:', markerStrokeWidth);
  
  currentPath.appendChild(path);
  container.appendChild(currentPath);
  
  // Armazenar referências
  currentPath._path = path;
  currentPath._data = `M ${x} ${y}`;
}

// Continuar desenho
function draw(e) {
  if (!markerActive || !isDrawing || !currentPath) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const container = document.getElementById('mapContainer');
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Adicionar ponto ao caminho
  currentPath._data += ` L ${x} ${y}`;
  currentPath._path.setAttribute('d', currentPath._data);
}

// Finalizar desenho
function finishDrawing(e) {
  if (!isDrawing || !currentPath) return;
  
  console.log('🖍️ Finalizando desenho');
  
  isDrawing = false;
  
  // Adicionar à lista
  allPaths.push(currentPath);
  
  // Adicionar evento de duplo clique para remover
  currentPath.addEventListener('dblclick', () => {
    removeMarker(currentPath);
  });
  
  currentPath = null;
  updateStatus('Marcação concluída');
}

// Iniciar desenho do lápis
function startLapisDrawing(e) {
  if (!lapisActive) return;
  
  console.log('✏️ Iniciando desenho do lápis');
  e.preventDefault();
  e.stopPropagation();
  
  isLapisDrawing = true;
  
  const container = document.getElementById('mapContainer');
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Criar elemento SVG
  currentLapisPath = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  currentLapisPath.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 50;
  `;
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke', lapisColor);
  path.setAttribute('stroke-width', lapisStrokeWidth);
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('fill', 'none');
  path.setAttribute('opacity', '0.9');
  path.setAttribute('d', `M ${x} ${y}`);
  
  console.log('✏️ Criando traço do lápis com espessura:', lapisStrokeWidth);
  
  currentLapisPath.appendChild(path);
  container.appendChild(currentLapisPath);
  
  // Armazenar referências
  currentLapisPath._path = path;
  currentLapisPath._data = `M ${x} ${y}`;
}

// Continuar desenho do lápis
function drawLapis(e) {
  if (!lapisActive || !isLapisDrawing || !currentLapisPath) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const container = document.getElementById('mapContainer');
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Adicionar ponto ao caminho
  currentLapisPath._data += ` L ${x} ${y}`;
  currentLapisPath._path.setAttribute('d', currentLapisPath._data);
}

// Finalizar desenho do lápis
function finishLapisDrawing(e) {
  if (!isLapisDrawing || !currentLapisPath) return;
  
  console.log('✏️ Finalizando desenho do lápis');
  
  isLapisDrawing = false;
  
  // Adicionar à lista
  allLapisPaths.push(currentLapisPath);
  
  // Adicionar evento de duplo clique para remover
  currentLapisPath.addEventListener('dblclick', () => {
    removeLapisPath(currentLapisPath);
  });
  
  currentLapisPath = null;
  updateStatus('Desenho do lápis concluído');
}

// Funções específicas para desenhar dentro dos popups (marcador)
function startDrawingInPopup(e) {
  if (!markerActive) return;
  
  console.log('🖍️ Iniciando desenho do marcador no popup');
  e.preventDefault();
  e.stopPropagation();
  
  isDrawing = true;
  
  // Usar o popup como container
  const popup = e.currentTarget;
  const rect = popup.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Criar elemento SVG
  currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  currentPath.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 40;
  `;
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke', markerColor);
  path.setAttribute('stroke-width', markerStrokeWidth);
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('fill', 'none');
  path.setAttribute('opacity', '0.7');
  path.setAttribute('d', `M ${x} ${y}`);
  
  console.log('🖍️ Criando traço do marcador no popup com espessura:', markerStrokeWidth);
  
  currentPath.appendChild(path);
  popup.appendChild(currentPath);
  
  // Armazenar referências
  currentPath._path = path;
  currentPath._data = `M ${x} ${y}`;
  currentPath._container = popup;
}

function drawInPopup(e) {
  if (!markerActive || !isDrawing || !currentPath) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  // Usar o container armazenado
  const container = currentPath._container;
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Adicionar ponto ao caminho
  currentPath._data += ` L ${x} ${y}`;
  currentPath._path.setAttribute('d', currentPath._data);
}

function finishDrawingInPopup(e) {
  if (!isDrawing || !currentPath) return;
  
  console.log('🖍️ Finalizando desenho do marcador no popup');
  
  isDrawing = false;
  
  // Adicionar à lista
  allPaths.push(currentPath);
  
  // Adicionar evento de duplo clique para remover
  currentPath.addEventListener('dblclick', () => {
    removeMarker(currentPath);
  });
  
  currentPath = null;
  updateStatus('Marcação no popup concluída');
}

// Funções específicas para desenhar dentro dos popups (lápis)
function startLapisDrawingInPopup(e) {
  if (!lapisActive) return;
  
  console.log('✏️ Iniciando desenho do lápis no popup');
  e.preventDefault();
  e.stopPropagation();
  
  isLapisDrawing = true;
  
  // Usar o popup como container
  const popup = e.currentTarget;
  const rect = popup.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Criar elemento SVG
  currentLapisPath = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  currentLapisPath.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 50;
  `;
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke', lapisColor);
  path.setAttribute('stroke-width', lapisStrokeWidth);
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('fill', 'none');
  path.setAttribute('opacity', '0.9');
  path.setAttribute('d', `M ${x} ${y}`);
  
  console.log('✏️ Criando traço do lápis no popup com espessura:', lapisStrokeWidth);
  
  currentLapisPath.appendChild(path);
  popup.appendChild(currentLapisPath);
  
  // Armazenar referências
  currentLapisPath._path = path;
  currentLapisPath._data = `M ${x} ${y}`;
  currentLapisPath._container = popup;
}

function drawLapisInPopup(e) {
  if (!lapisActive || !isLapisDrawing || !currentLapisPath) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  // Usar o container armazenado
  const container = currentLapisPath._container;
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Adicionar ponto ao caminho
  currentLapisPath._data += ` L ${x} ${y}`;
  currentLapisPath._path.setAttribute('d', currentLapisPath._data);
}

function finishLapisDrawingInPopup(e) {
  if (!isLapisDrawing || !currentLapisPath) return;
  
  console.log('✏️ Finalizando desenho do lápis no popup');
  
  isLapisDrawing = false;
  
  // Adicionar à lista
  allLapisPaths.push(currentLapisPath);
  
  // Adicionar evento de duplo clique para remover
  currentLapisPath.addEventListener('dblclick', () => {
    removeLapisPath(currentLapisPath);
  });
  
  currentLapisPath = null;
  updateStatus('Desenho do lápis no popup concluído');
}

// Remover marcação específica
function removeMarker(path) {
  const index = allPaths.indexOf(path);
  if (index > -1) {
    allPaths.splice(index, 1);
  }
  path.remove();
}

// Remover desenho específico do lápis
function removeLapisPath(path) {
  const index = allLapisPaths.indexOf(path);
  if (index > -1) {
    allLapisPaths.splice(index, 1);
  }
  path.remove();
}

// Limpar todas as marcações
function clearAllMarkers() {
  console.log('🖍️ Limpando todas as marcações');
  
  allPaths.forEach(path => path.remove());
  allPaths = [];
  
  if (currentPath) {
    currentPath.remove();
    currentPath = null;
  }
  
  isDrawing = false;
  updateStatus('Todas as marcações removidas');
}

// Limpar todos os desenhos do lápis
function clearAllLapis() {
  console.log('✏️ Limpando todos os desenhos do lápis');
  
  allLapisPaths.forEach(path => path.remove());
  allLapisPaths = [];
  
  if (currentLapisPath) {
    currentLapisPath.remove();
    currentLapisPath = null;
  }
  
  isLapisDrawing = false;
  updateStatus('Todos os desenhos do lápis removidos');
}

// Função auxiliar para atualizar status
function updateStatus(message) {
  const status = document.getElementById('statusText');
  if (status) {
    status.textContent = message;
  }
  console.log('📊 Status:', message);
}

// Inicializar sistema quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('🖍️ Sistema de marcador carregado');
  console.log('✏️ Sistema de lápis carregado');
  
  // Testar espessuras
  testStrokeWidths();
  
  // Adicionar event listener ao botão do marcador
  const markerBtn = document.getElementById('markerBtn');
  if (markerBtn) {
    markerBtn.addEventListener('click', toggleMarker);
    console.log('✅ Event listener do marcador adicionado');
  } else {
    console.error('❌ Botão de marcador não encontrado!');
  }
  
  // Adicionar event listener ao botão do lápis
  const lapisBtn = document.getElementById('lapisBtn');
  if (lapisBtn) {
    lapisBtn.addEventListener('click', toggleLapis);
    console.log('✅ Event listener do lápis adicionado');
  } else {
    console.error('❌ Botão de lápis não encontrado!');
  }
});

// Função para testar espessuras
function testStrokeWidths() {
  console.log('🧪 Testando espessuras:');
  const widths = [4, 8, 12, 16];
  widths.forEach(width => {
    console.log(`- ${width}px: ${width === 4 ? 'Fino' : width === 8 ? 'Médio' : width === 12 ? 'Grosso' : 'Mais Grosso'}`);
  });
  console.log('✅ Espessura atual:', markerStrokeWidth);
}

// Exportar funções para uso global
window.MarkerSystem = {
  toggle: toggleMarker,
  activate: activateMarker,
  deactivate: deactivateMarker,
  clearAll: clearAllMarkers,
  setColor: function(color) { markerColor = color; },
  getColor: function() { return markerColor; },
  setStrokeWidth: function(width) { markerStrokeWidth = width; },
  getStrokeWidth: function() { return markerStrokeWidth; },
  testWidths: testStrokeWidths
};

window.LapisSystem = {
  toggle: toggleLapis,
  activate: activateLapis,
  deactivate: deactivateLapis,
  clearAll: clearAllLapis,
  setColor: function(color) { lapisColor = color; },
  getColor: function() { return lapisColor; },
  setStrokeWidth: function(width) { lapisStrokeWidth = width; },
  getStrokeWidth: function() { return lapisStrokeWidth; }
};

// Função para atualizar listeners quando novos popups aparecem
window.updateDrawingListeners = function() {
  if (markerActive) {
    addMarkerListenersToPopups();
  }
  if (lapisActive) {
    addLapisListenersToPopups();
  }
};
