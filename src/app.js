/* GeraMapas App - Convertido para JavaScript tradicional */

/* Constants for Short Scripts */
const SHORT_SCRIPT_MODELS = {
  impacto: {
    label: "IMPACTO",
    objective: "gerar reação imediata (engajar, converter, chamar à ação)",
    structure: [
      "1. Gancho emocional", 
      "2. Identificação rápida", 
      "3. Problema claro", 
      "4. Dor amplificada", 
      "5. Credibilidade breve", 
      "6. Solução prática", 
      "7. Barreira removida", 
      "8. Benefício transformador", 
      "9. CTA direta", 
      "10. Gancho de salvamento"
    ]
  },
  conhecimento: {
    label: "CONHECIMENTO",
    objective: "ensinar com profundidade",
    structure: [
      "1. Gancho conceitual", 
      "2. Reconhecimento do aprendiz", 
      "3. Equívoco comum", 
      "4. Custo do erro mental", 
      "5. Fonte do saber", 
      "6. Núcleo do insight", 
      "7. Verdade contra-intuitiva", 
      "8. Aplicação mental", 
      "9. Ganho cognitivo", 
      "10. CTA de valor duradouro", 
      "11. Frase de eco intelectual"
    ]
  },
  imersao: {
    label: "IMERSÃO",
    objective: "prender atenção com experiência mental envolvente",
    structure: [
      "1. Paradoxo inicial", 
      "2. Pergunta interna", 
      "3. Informação incompleta", 
      "4. Confirmação silenciosa", 
      "5. Virada de perspectiva", 
      "6. Desafio implícito", 
      "7. Pausa interativa", 
      "8. Regra universal", 
      "9. CTA mental", 
      "10. Retorno ao gancho", 
      "11. Promessa de utilidade futura"
    ]
  },
  clareza: {
    label: "CLAREZA EXTREMA",
    objective: "esclarecer com precisão, corrigir mitos",
    structure: [
      "1. Afirmação inegável", 
      "2. Mentira que todos acreditam", 
      "3. Por que essa mentira persiste", 
      "4. Princípio fundamental", 
      "5. Regra simples", 
      "6. Exemplo mental", 
      "7. Erro que anula tudo", 
      "8. Como aplicar em 10 segundos", 
      "9. Pergunta de autodiagnóstico", 
      "10. CTA de discernimento", 
      "11. Frase de fixação"
    ]
  }
};

/* Add style descriptions for script tone mapping */
const SCRIPT_STYLES = {
  normal: 'Balanced, clear and direct tone (no exaggeration).',
  'bem-humorado': 'Light, ironic, with quick jokes and smart self-deprecation.',
  tecnico: 'Precise, objective, with data and technical terms; focus on logic and structure.',
  'contador de histórias': 'Narrative with beginning, climax and resolution; uses characters and tension.',
  provocador: 'Challenging tone that questions beliefs and breaks taboos; bold and confrontational.',
  'calmo e sábio': 'Calm, reflective, with short profound sentences conveying serenity.',
  energetico: 'High-energy, enthusiastic and vibrant language.',
  minimalista: 'Very concise, few words, no ornamentation.',
  confidente: 'Friendly, confidential tone as a close friend giving sincere advice.',
  analitico: 'Analytical, breaks ideas step-by-step and explains underlying patterns.',
  motivacional: 'Inspiring, emotional calls to action and focus on overcoming challenges.',
  irreverente: 'Sarcastic, breaks conventions and surprises the reader.',
  didatico: 'Pedagogical, clear, patient and explanatory like a teacher.',
  misterioso: 'Mysterious, reveals little by little and uses suspense.'
};


/* App State */
const state = {
  provider: 'groq',
  apiKey: '',
  model: '',
  currentMap: null,
  cy: null,
  chat: [],
  currentModel: 'default'
};

// Expose state globally for debugging and testing with extension safety
if (typeof window !== 'undefined' && !window.state) {
  window.state = state;
}

// Safe DOM manipulation function with extension compatibility
function safeCreateElement(tag, className = '', innerHTML = '') {
  try {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  } catch (error) {
    console.warn(`Failed to create ${tag} element:`, error);
    return null;
  }
}

// Safe event listener addition with extension compatibility
function safeAddEventListener(element, event, handler, options = {}) {
  try {
    if (element && typeof handler === 'function') {
      element.addEventListener(event, handler, options);
      return true;
    }
    return false;
  } catch (error) {
    console.warn(`Failed to add ${event} listener:`, error);
    return false;
  }
}

// Safe DOM append function with extension compatibility
function safeAppendChild(parent, child) {
  try {
    if (parent && child) {
      parent.appendChild(child);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Failed to append child element:', error);
    return false;
  }
}

// Expose key functions globally for testing with extension safety
if (typeof window !== 'undefined' && !window.findNodeById) {
  window.findNodeById = function(obj, id) {
    if (!obj) return null;
    if (obj.id === id) return obj;
    for (const c of (obj.children || [])) { 
      const r = window.findNodeById(c, id); 
      if (r) return r; 
    }
    return null;
  };
}

// Global variables for tooltips and overlays
let currentTooltip = null;
let lastInfoClick = { nodeId: null, time: 0 };

/* Elements - Novo Layout */
const providerSelect = document.getElementById('providerSelect');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiBtn = document.getElementById('saveApiBtn');
const apiStatus = document.getElementById('apiStatus');
const modelSelect = document.getElementById('modelSelect');
const refreshModelsBtn = document.getElementById('refreshModelsBtn');
const modelsStatus = document.getElementById('modelsStatus');
const chatLog = document.getElementById('chatLog');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const mapContainer = document.getElementById('mapContainer');
const saveMapBtn = document.getElementById('saveMapBtn');
const deleteMapBtn = document.getElementById('deleteMapBtn');
const saveTitleInput = document.getElementById('saveTitleInput');
const savedMapsList = document.getElementById('savedMapsList');

// Novos elementos do layout
const chatBtn = document.getElementById('chatBtn');
const savedMapsBtn = document.getElementById('savedMapsBtn');
const settingsBtn = document.getElementById('settingsBtn');
const exportBtn = document.getElementById('exportBtn');
const specialistBtn = document.getElementById('specialistBtn');
const mapModelsBtn = document.getElementById('mapModelsBtn');

// Popups
const chatPopup = document.getElementById('chatPopup');
const savedMapsPopup = document.getElementById('savedMapsPopup');
const settingsPopup = document.getElementById('settingsPopup');
const exportPopup = document.getElementById('exportPopup');
const mapInfoPopup = document.getElementById('mapInfoPopup');

// Status bar
const statusText = document.getElementById('statusText');
const nodeCount = document.getElementById('nodeCount');
const edgeCount = document.getElementById('edgeCount');
const currentLayout = document.getElementById('currentLayout');
/* add model selector elements */
const modelSelector = document.createElement('div');
modelSelector.className = 'model-selector';
modelSelector.innerHTML = `
  <div class="model-selector-header" role="button" tabindex="0">
    <span>Modelos de Mapas</span>
    <span style="display:flex;gap:8px;align-items:center">
      <button class="model-selector-close" aria-label="Fechar">×</button>
      <span class="model-selector-arrow" aria-hidden="true">↓</span>
    </span>
  </div>
  <div class="accordion-content">
    <div class="model-selector-body">
      <div class="model-option" data-model="default">🌐 Padrão <span class="info-icon" data-tooltip="Layout padrão com organização automática">ℹ️</span></div>
      <div class="model-option" data-model="hierarchical">📊 Hierárquico <span class="info-icon" data-tooltip="Estrutura em camadas com hierarquia clara">ℹ️</span></div>
      <div class="model-option" data-model="radial">🌀 Radial <span class="info-icon" data-tooltip="Nós organizados em círculos concêntricos">ℹ️</span></div>
      <div class="model-option" data-model="organic">🌿 Orgânico <span class="info-icon" data-tooltip="Layout natural e fluido como crescimento orgânico">ℹ️</span></div>
      <div class="model-option" data-model="tree">🌳 Árvore <span class="info-icon" data-tooltip="Estrutura ramificada como uma árvore">ℹ️</span></div>
      <div class="model-option" data-model="teia">🕸️ Teia <span class="info-icon" data-tooltip="Rede interconectada como uma teia de aranha">ℹ️</span></div>
      <div class="model-option" data-model="estrela">⭐ Estrela <span class="info-icon" data-tooltip="Nó central com ramos radiais">ℹ️</span></div>
      <div class="model-option" data-model="polvo">🐙 Corpo do Polvo <span class="info-icon" data-tooltip="Ramos horizontais organizados como tentáculos">ℹ️</span></div>
    </div>
  </div>
`;
document.body.appendChild(modelSelector);
const modelOptions = modelSelector.querySelectorAll('.model-option');
const closeModelSelector = modelSelector.querySelector('.model-selector-close');


/* Init - aguarda carregamento das dependências */
function initApp() {
  if (!window.cytoscape || !window.AI || !window.MapEngine || !window.Storage || !window.LayoutAlgorithm) {
    console.error('Dependências não carregadas completamente');
    setTimeout(initApp, 100);
    return;
  }
  
  state.cy = window.MapEngine.initCy(mapContainer);
  
  // ========================================
  // VINCULAÇÃO DO POPUP DE EXPANSÃO AO MAPA
  // ========================================
  // Implementado por Lucius VII - Especialista GeraMapa
  // 
  // FUNCIONALIDADE: Fechar popup ao clicar no mapa
  // COMPORTAMENTO: 
  // 1. Usuário clica em qualquer lugar do mapa (não em nó)
  // 2. Sistema automaticamente fecha o popup de expansão
  // 3. Popup desaparece junto com o clique no mapa
  //
  // BENEFÍCIOS:
  // - Experiência mais intuitiva para o usuário
  // - Popup vinculado ao contexto do mapa
  // - Fechamento automático ao interagir com o mapa
  // ========================================
  
  // Adicionar listener para cliques no mapa (background)
  state.cy.on('tap', (evt) => {
    // Verificar se o clique foi no background (não em nó)
    if (evt.target === state.cy) {
      console.log('🖱️ Clique no mapa detectado - fechando popup de expansão');
      
      // Fechar node-slider se estiver aberto
      if (nodeSlider && nodeSlider.classList.contains('open')) {
        nodeSlider.classList.remove('open');
        console.log('✅ Popup de expansão fechado automaticamente');
      }
      
      // Alternativa: usar display none (se estiver usando essa estratégia)
      if (nodeSlider && nodeSlider.style.display === 'flex') {
        nodeSlider.style.display = 'none';
        console.log('✅ Popup de expansão fechado automaticamente (display)');
      }
    }
  });
  
  console.log('✅ Listener de clique no mapa adicionado - popup vinculado ao mapa');
  
state.currentMapId = null;

/* Load persisted */
const persisted = window.Storage.GeraMapas.loadSettings();
if (persisted) {
  state.provider = persisted.provider || state.provider;
  state.apiKey = persisted.apiKey || '';
  state.model = persisted.model || '';
  providerSelect.value = state.provider;
  apiKeyInput.value = state.apiKey ? '••••••••' : '';
}
updateModelsUI();

/* after state and DOM references are defined, add containers for overlays with extension safety */
let overlaysRoot = null;
try {
  overlaysRoot = document.createElement('div');
  overlaysRoot.style.position = 'absolute';
  overlaysRoot.style.inset = '0';
  overlaysRoot.style.pointerEvents = 'auto'; // allow overlay children (node icons/tooltips) to receive clicks
  overlaysRoot.style.zIndex = '20'; // ensure overlays are above nodes but under extensions
  mapContainer.style.position = 'relative';
  mapContainer.appendChild(overlaysRoot);
  console.log('✅ overlaysRoot created successfully');
} catch (error) {
  console.error('❌ Failed to create overlays root:', error);
}

/* Add slider panel container (insert near top-level initialization) with extension safety */
let nodeSlider = null;
try {
  nodeSlider = document.createElement('div');
  nodeSlider.className = 'node-slider';
  nodeSlider.innerHTML = `<div class="node-slider-inner">
    <div class="node-slider-header">
      <div class="node-slider-drag-area"></div>
      <button class="btn ghost node-slider-close" style="position: absolute; top: 10px; right: 12px; z-index: 1000; pointer-events: auto !important;">✕ Fechar</button>
      <strong class="node-slider-title"></strong>
    </div>
    <div class="node-slider-body"><div class="node-slider-content">Carregando...</div></div>
    <div class="node-slider-resize-handle resize-right"></div>
    <div class="node-slider-resize-handle resize-bottom"></div>
    <div class="node-slider-resize-handle resize-corner"></div>
  </div>`;
  nodeSlider.style.zIndex = '90'; // below header (100) but above content
  document.body.appendChild(nodeSlider);
  console.log('✅ nodeSlider created successfully');
  
  /* Add close button event listener - NOVA ESTRATÉGIA: Zona de Exclusão */
  const closeButton = nodeSlider.querySelector('.node-slider-close');
  if (closeButton) {
    // Simple and direct approach - NOVA ESTRATÉGIA
    closeButton.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      console.log('Botão fechar clicado (simplificado) - DESLOCAMENTO LIVRE');
      
      // Cancelar drag se estiver ativo
      if (nodeSliderDragging) {
        nodeSliderDragging = false;
        nodeSliderDragCancelled = true;
        nodeSlider.classList.remove('dragging');
        console.log('Drag cancelado pelo click no fechar');
      }
      
      // Esconder o node-slider completamente
      nodeSlider.style.display = 'none';
      console.log('Node-slider fechado com sucesso');
      return false;
    };
    
    // Also add event listener for extra safety - NOVA ESTRATÉGIA
    closeButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      console.log('Botão fechar clicado (event listener) - DESLOCAMENTO LIVRE');
      
      // Cancelar drag se estiver ativo
      if (nodeSliderDragging) {
        nodeSliderDragging = false;
        nodeSliderDragCancelled = true;
        nodeSlider.classList.remove('dragging');
        console.log('Drag cancelado pelo addEventListener no fechar');
      }
      
      // Esconder o node-slider completamente
      nodeSlider.style.display = 'none';
      console.log('Node-slider fechado com sucesso (event listener)');
      return false;
    }, true);
  }
  
  /* Node slider drag functionality - NOVA ESTRATÉGIA: Detecção de Intenção */
  let nodeSliderDragging = false;
  let nodeSliderDragOffset = { x: 0, y: 0 };
  let nodeSliderDragStart = { x: 0, y: 0 };
  let nodeSliderDragThreshold = 5; // pixels de movimento para considerar drag
  let nodeSliderCloseButtonRect = null; // Zona de exclusão do botão fechar
  let nodeSliderDragCancelled = false; // Flag para cancelar drag quando mouse entra na zona de exclusão
  
  const nodeSliderDragArea = nodeSlider.querySelector('.node-slider-drag-area');
  
  // Função para atualizar a zona de exclusão do botão fechar
  function updateCloseButtonExclusionZone() {
    const closeButton = nodeSlider.querySelector('.node-slider-close');
    if (closeButton) {
      const rect = closeButton.getBoundingClientRect();
      nodeSliderCloseButtonRect = {
        left: rect.left - 10, // Margem de 10px ao redor
        right: rect.right + 10,
        top: rect.top - 10,
        bottom: rect.bottom + 10
      };
      console.log('Zona de exclusão do botão fechar atualizada:', nodeSliderCloseButtonRect);
    }
  }
  
  // Função para verificar se o mouse está na zona de exclusão
  function isMouseInCloseButtonZone(x, y) {
    if (!nodeSliderCloseButtonRect) return false;
    return x >= nodeSliderCloseButtonRect.left && 
           x <= nodeSliderCloseButtonRect.right && 
           y >= nodeSliderCloseButtonRect.top && 
           y <= nodeSliderCloseButtonRect.bottom;
  }
  
  // Função para atualizar zona de exclusão quando o painel é movido
  function updateExclusionZoneOnMove() {
    if (nodeSliderDragging) {
      updateCloseButtonExclusionZone();
    }
  }
  
  // Adicionar listener para atualizar zona de exclusão durante movimento
  nodeSlider.addEventListener('transitionend', updateExclusionZoneOnMove);
  window.addEventListener('resize', updateCloseButtonExclusionZone);
  
  // Observer para detectar quando o painel é aberto e atualizar zona de exclusão
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.classList.contains('open')) {
          // Painel foi aberto, atualizar zona de exclusão
          setTimeout(() => {
            updateCloseButtonExclusionZone();
            console.log('Zona de exclusão atualizada após abertura do painel');
          }, 100);
        }
      }
    });
  });
  
  observer.observe(nodeSlider, { attributes: true, attributeFilter: ['class'] });
  
  // Event listener para drag em toda a expansão (não apenas no header)
  nodeSlider.addEventListener('mousedown', (e) => {
    // Não iniciar drag se clicou no botão fechar
    if (e.target.closest('.node-slider-close')) {
      e.stopPropagation();
      return;
    }
    
    // Não iniciar drag se clicou em elementos interativos
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea') || e.target.closest('a')) {
      return;
    }
    
    // Não iniciar drag se clicou no conteúdo do body (para permitir seleção de texto)
    if (e.target.closest('.node-slider-body')) {
      // Permitir drag apenas se clicou em área vazia do body
      if (e.target.classList.contains('node-slider-body') || e.target.classList.contains('node-slider-content')) {
        // Verificar se há texto selecionado
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
          return; // Não iniciar drag se há texto selecionado
        }
      } else {
        return; // Não iniciar drag se clicou em elementos dentro do body
      }
    }
    
    // Atualizar zona de exclusão
    updateCloseButtonExclusionZone();
    
    nodeSliderDragging = false; // Reset drag state
    nodeSliderDragCancelled = false; // Reset cancel flag
    nodeSliderDragStart.x = e.clientX;
    nodeSliderDragStart.y = e.clientY;
    const rect = nodeSlider.getBoundingClientRect();
    nodeSliderDragOffset.x = e.clientX - rect.left;
    nodeSliderDragOffset.y = e.clientY - rect.top;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    // Se ainda não está dragging, verificar se passou do threshold
    if (!nodeSliderDragging && nodeSliderDragStart.x !== 0 && !nodeSliderDragCancelled) {
      const deltaX = Math.abs(e.clientX - nodeSliderDragStart.x);
      const deltaY = Math.abs(e.clientY - nodeSliderDragStart.y);
      
      if (deltaX > nodeSliderDragThreshold || deltaY > nodeSliderDragThreshold) {
        nodeSliderDragging = true;
        nodeSlider.classList.add('dragging');
        
        // Ensure proper positioning during drag
        nodeSlider.style.position = 'fixed';
        nodeSlider.style.zIndex = '90';
        console.log('Drag iniciado - z-index aumentado para 90');
      }
    }
    
    // Verificar se o mouse entrou na zona de exclusão do botão fechar
    if (nodeSliderDragging && isMouseInCloseButtonZone(e.clientX, e.clientY)) {
      console.log('Mouse entrou na zona de exclusão do botão fechar - cancelando drag');
      nodeSliderDragCancelled = true;
      nodeSliderDragging = false;
      nodeSlider.classList.remove('dragging');
      // Não resetar posição, manter onde está
    }
    
    if (!nodeSliderDragging || nodeSliderDragCancelled) return;
    
    let left = e.clientX - nodeSliderDragOffset.x;
    let top = e.clientY - nodeSliderDragOffset.y;
    
    // DESLOCAMENTO LIVRE - Permitir coordenadas negativas e fora da tela
    // Remover limitações de viewport para movimento ilimitado
    
    // Clear any conflicting positioning
    nodeSlider.style.left = left + 'px';
    nodeSlider.style.top = top + 'px';
    nodeSlider.style.right = 'auto';
    nodeSlider.style.bottom = 'auto';
    nodeSlider.style.transform = 'none'; // Remover transform que interfere
    nodeSlider.style.position = 'fixed';
    nodeSlider.style.zIndex = '90';
    
    console.log(`Drag posição: left=${left}px, top=${top}px`);
  });
  
  document.addEventListener('mouseup', (e) => {
    if (nodeSliderDragging && !nodeSliderDragCancelled) {
      nodeSliderDragging = false;
      nodeSlider.classList.remove('dragging');
      
      // Restore z-index below header after drag
      nodeSlider.style.zIndex = '90';
      console.log('Drag finalizado - z-index mantido em 90 (abaixo do header)');
    }
    
    // Reset drag start position
    nodeSliderDragStart.x = 0;
    nodeSliderDragStart.y = 0;
    nodeSliderDragCancelled = false;
  });
  
  // Touch events para toda a expansão
  nodeSlider.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    
    // Não iniciar drag se clicou no botão fechar
    if (e.target.closest('.node-slider-close')) {
      e.stopPropagation();
      return;
    }
    
    // Não iniciar drag se clicou em elementos interativos
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea') || e.target.closest('a')) {
      return;
    }
    
    // Não iniciar drag se clicou no conteúdo do body (para permitir seleção de texto)
    if (e.target.closest('.node-slider-body')) {
      // Permitir drag apenas se clicou em área vazia do body
      if (e.target.classList.contains('node-slider-body') || e.target.classList.contains('node-slider-content')) {
        // Verificar se há texto selecionado
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
          return; // Não iniciar drag se há texto selecionado
        }
      } else {
        return; // Não iniciar drag se clicou em elementos dentro do body
      }
    }
    
    // Atualizar zona de exclusão
    updateCloseButtonExclusionZone();
    
    nodeSliderDragging = false; // Reset drag state
    nodeSliderDragCancelled = false; // Reset cancel flag
    nodeSliderDragStart.x = touch.clientX;
    nodeSliderDragStart.y = touch.clientY;
    const rect = nodeSlider.getBoundingClientRect();
    nodeSliderDragOffset.x = touch.clientX - rect.left;
    nodeSliderDragOffset.y = touch.clientY - rect.top;
    e.preventDefault();
  }, { passive: false });
  
  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    
    // Se ainda não está dragging, verificar se passou do threshold
    if (!nodeSliderDragging && nodeSliderDragStart.x !== 0 && !nodeSliderDragCancelled) {
      const deltaX = Math.abs(touch.clientX - nodeSliderDragStart.x);
      const deltaY = Math.abs(touch.clientY - nodeSliderDragStart.y);
      
      if (deltaX > nodeSliderDragThreshold || deltaY > nodeSliderDragThreshold) {
        nodeSliderDragging = true;
        nodeSlider.classList.add('dragging');
        
        // Ensure proper positioning during drag
        nodeSlider.style.position = 'fixed';
        nodeSlider.style.zIndex = '90';
        console.log('Touch drag iniciado - z-index aumentado para 90');
      }
    }
    
    // Verificar se o touch entrou na zona de exclusão do botão fechar
    if (nodeSliderDragging && isMouseInCloseButtonZone(touch.clientX, touch.clientY)) {
      console.log('Touch entrou na zona de exclusão do botão fechar - cancelando drag');
      nodeSliderDragCancelled = true;
      nodeSliderDragging = false;
      nodeSlider.classList.remove('dragging');
      // Não resetar posição, manter onde está
    }
    
    if (!nodeSliderDragging || nodeSliderDragCancelled) return;
    
    let left = touch.clientX - nodeSliderDragOffset.x;
    let top = touch.clientY - nodeSliderDragOffset.y;
    
    // DESLOCAMENTO LIVRE - Permitir coordenadas negativas e fora da tela
    // Remover limitações de viewport para movimento ilimitado
    
    // Clear any conflicting positioning
    nodeSlider.style.left = left + 'px';
    nodeSlider.style.top = top + 'px';
    nodeSlider.style.right = 'auto';
    nodeSlider.style.bottom = 'auto';
    nodeSlider.style.transform = 'none'; // Remover transform que interfere
    nodeSlider.style.position = 'fixed';
    nodeSlider.style.zIndex = '90';
    
    console.log(`Touch drag posição: left=${left}px, top=${top}px`);
    e.preventDefault();
  }, { passive: false });
  
  document.addEventListener('touchend', () => {
    if (nodeSliderDragging && !nodeSliderDragCancelled) {
      nodeSliderDragging = false;
      nodeSlider.classList.remove('dragging');
      
      // Restore z-index below header after drag
      nodeSlider.style.zIndex = '90';
      console.log('Touch drag finalizado - z-index mantido em 90 (abaixo do header)');
    }
    
    // Reset drag start position
    nodeSliderDragStart.x = 0;
    nodeSliderDragStart.y = 0;
    nodeSliderDragCancelled = false;
  });
  
} catch (error) {
  console.error('❌ Failed to create node slider:', error);
}

/* Global event listener para garantir que o botão fechar sempre funcione - NOVA ESTRATÉGIA */
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('node-slider-close')) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('Botão fechar clicado (global) - NOVA ESTRATÉGIA'); // Debug
    
    // Cancelar drag se estiver ativo
    if (typeof nodeSliderDragging !== 'undefined' && nodeSliderDragging) {
      nodeSliderDragging = false;
      if (typeof nodeSliderDragCancelled !== 'undefined') {
        nodeSliderDragCancelled = true;
      }
      const slider = document.querySelector('.node-slider');
      if (slider) {
        slider.classList.remove('dragging');
      }
      console.log('Drag cancelado pelo click global no fechar');
    }
    
    if (nodeSlider) {
      // Esconder o node-slider completamente
      nodeSlider.style.display = 'none';
      console.log('Painel fechado com sucesso (global)');
    }
    return false;
  }
}, true); // Use capture phase

/* Global event listener para mousedown no botão fechar - NOVA ESTRATÉGIA */
document.addEventListener('mousedown', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('node-slider-close')) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('Botão fechar mousedown (global) - NOVA ESTRATÉGIA'); // Debug
    
    // Cancelar drag se estiver ativo
    if (typeof nodeSliderDragging !== 'undefined' && nodeSliderDragging) {
      nodeSliderDragging = false;
      if (typeof nodeSliderDragCancelled !== 'undefined') {
        nodeSliderDragCancelled = true;
      }
      const slider = document.querySelector('.node-slider');
      if (slider) {
        slider.classList.remove('dragging');
      }
      console.log('Drag cancelado pelo mousedown global no fechar');
    }
    return false;
  }
}, true); // Use capture phase

/* Global event listener para mouseup no botão fechar - NOVA ESTRATÉGIA */
document.addEventListener('mouseup', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('node-slider-close')) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('Botão fechar mouseup (global) - NOVA ESTRATÉGIA'); // Debug
    
    // Cancelar drag se estiver ativo
    if (typeof nodeSliderDragging !== 'undefined' && nodeSliderDragging) {
      nodeSliderDragging = false;
      if (typeof nodeSliderDragCancelled !== 'undefined') {
        nodeSliderDragCancelled = true;
      }
      const slider = document.querySelector('.node-slider');
      if (slider) {
        slider.classList.remove('dragging');
      }
      console.log('Drag cancelado pelo mouseup global no fechar');
    }
    
    if (nodeSlider) {
      nodeSlider.classList.remove('open');
      console.log('Painel fechado com sucesso (mouseup global)');
    }
    return false;
  }
}, true); // Use capture phase

/* Events */
providerSelect.addEventListener('change', async () => {
  state.provider = providerSelect.value;
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, apiKey: state.apiKey, model: '' });
  modelSelect.innerHTML = '<option value="">Carregando...</option>';
  await updateModelsUI();
});

saveApiBtn.addEventListener('click', async () => {
  const raw = apiKeyInput.value.trim();
  state.apiKey = raw || state.apiKey; // allow keeping masked
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, apiKey: state.apiKey, model: state.model });
  apiStatus.textContent = 'API Key salva.';
  await updateModelsUI();
});

refreshModelsBtn.addEventListener('click', updateModelsUI);

/* ========================================
   CHAT FLUTUANTE - FUNCIONALIDADES DE DRAG & DROP
   ======================================== */

// Referências do chat flutuante principal
const floatingChat = document.getElementById('floatingChat');
const floatingChatLog = document.getElementById('floatingChatLog');
const floatingChatInput = document.getElementById('floatingChatInput');
const floatingChatSend = document.getElementById('floatingChatSend');
const floatingChatClear = document.getElementById('floatingChatClear');
const addNodeBtn = document.getElementById('addNodeBtn');
const expandNodeBtn = document.getElementById('expandNodeBtn');

// Referências do chat especialista
const specialistChat = document.getElementById('specialistChat');
const specialistChatLog = document.getElementById('specialistChatLog');
const specialistChatInput = document.getElementById('specialistChatInput');
const specialistChatSend = document.getElementById('specialistChatSend');
const specialistChatClear = document.getElementById('specialistChatClear');

// Referências dos controles - SEPARADOS para cada chat
const floatingChatMinimizeBtn = floatingChat?.querySelector('.minimize-btn');
const floatingChatCloseBtn = floatingChat?.querySelector('.close-btn');
const specialistChatMinimizeBtn = specialistChat?.querySelector('.minimize-btn');
const specialistChatCloseBtn = specialistChat?.querySelector('.close-btn');

// Estado do drag do chat flutuante
let floatingChatDragging = false;
let floatingChatDragOffset = { x: 0, y: 0 };
let floatingChatResizing = false;
let floatingChatResizeStart = { x: 0, y: 0, width: 0, height: 0 };

// Função para habilitar drag do chat flutuante
function enableFloatingChatDrag() {
  const dragArea = floatingChat.querySelector('.floating-chat-drag-area');
  
  // Mouse events
  dragArea.addEventListener('mousedown', startFloatingChatDrag);
  document.addEventListener('mousemove', handleFloatingChatDrag);
  document.addEventListener('mouseup', endFloatingChatDrag);
  
  // Touch events para mobile
  dragArea.addEventListener('touchstart', startFloatingChatDragTouch, { passive: false });
  document.addEventListener('touchmove', handleFloatingChatDragTouch, { passive: false });
  document.addEventListener('touchend', endFloatingChatDrag);
}

// Função para habilitar resize do chat flutuante
function enableFloatingChatResize() {
  const resizeHandle = floatingChat.querySelector('.resize-handle');
  
  resizeHandle.addEventListener('mousedown', startFloatingChatResize);
  document.addEventListener('mousemove', handleFloatingChatResize);
  document.addEventListener('mouseup', endFloatingChatResize);
  
  // Touch events para resize
  resizeHandle.addEventListener('touchstart', startFloatingChatResizeTouch, { passive: false });
  document.addEventListener('touchmove', handleFloatingChatResizeTouch, { passive: false });
  document.addEventListener('touchend', endFloatingChatResize);
}

// Funções de drag
function startFloatingChatDrag(e) {
  floatingChatDragging = true;
  floatingChat.classList.add('dragging');
  const rect = floatingChat.getBoundingClientRect();
  floatingChatDragOffset.x = e.clientX - rect.left;
  floatingChatDragOffset.y = e.clientY - rect.top;
  
  // Converter para posição absoluta
  floatingChat.style.right = 'auto';
  floatingChat.style.bottom = 'auto';
}

function handleFloatingChatDrag(e) {
  if (!floatingChatDragging) return;
  
  let x = e.clientX - floatingChatDragOffset.x;
  let y = e.clientY - floatingChatDragOffset.y;
  
  // Limitar movimento dentro da viewport
  x = Math.max(0, Math.min(window.innerWidth - floatingChat.offsetWidth, x));
  y = Math.max(0, Math.min(window.innerHeight - floatingChat.offsetHeight, y));
  
  floatingChat.style.left = x + 'px';
  floatingChat.style.top = y + 'px';
}

function endFloatingChatDrag() {
  if (!floatingChatDragging) return;
  floatingChatDragging = false;
  floatingChat.classList.remove('dragging');
}

// Funções de drag para touch
function startFloatingChatDragTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  floatingChatDragging = true;
  floatingChat.classList.add('dragging');
  const rect = floatingChat.getBoundingClientRect();
  floatingChatDragOffset.x = touch.clientX - rect.left;
  floatingChatDragOffset.y = touch.clientY - rect.top;
  
  floatingChat.style.right = 'auto';
  floatingChat.style.bottom = 'auto';
}

function handleFloatingChatDragTouch(e) {
  if (!floatingChatDragging) return;
  e.preventDefault();
  const touch = e.touches[0];
  
  let x = touch.clientX - floatingChatDragOffset.x;
  let y = touch.clientY - floatingChatDragOffset.y;
  
  x = Math.max(0, Math.min(window.innerWidth - floatingChat.offsetWidth, x));
  y = Math.max(0, Math.min(window.innerHeight - floatingChat.offsetHeight, y));
  
  floatingChat.style.left = x + 'px';
  floatingChat.style.top = y + 'px';
}

// Funções de resize
function startFloatingChatResize(e) {
  floatingChatResizing = true;
  floatingChat.classList.add('resizing');
  const rect = floatingChat.getBoundingClientRect();
  floatingChatResizeStart.x = e.clientX;
  floatingChatResizeStart.y = e.clientY;
  floatingChatResizeStart.width = rect.width;
  floatingChatResizeStart.height = rect.height;
}

function handleFloatingChatResize(e) {
  if (!floatingChatResizing) return;
  
  const deltaX = e.clientX - floatingChatResizeStart.x;
  const deltaY = e.clientY - floatingChatResizeStart.y;
  
  let newWidth = floatingChatResizeStart.width + deltaX;
  let newHeight = floatingChatResizeStart.height + deltaY;
  
  // Limitar tamanho mínimo e máximo
  newWidth = Math.max(300, Math.min(window.innerWidth - 20, newWidth));
  newHeight = Math.max(350, Math.min(window.innerHeight - 20, newHeight));
  
  floatingChat.style.width = newWidth + 'px';
  floatingChat.style.height = newHeight + 'px';
}

function endFloatingChatResize() {
  if (!floatingChatResizing) return;
  floatingChatResizing = false;
  floatingChat.classList.remove('resizing');
}

// Funções de resize para touch
function startFloatingChatResizeTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  floatingChatResizing = true;
  floatingChat.classList.add('resizing');
  const rect = floatingChat.getBoundingClientRect();
  floatingChatResizeStart.x = touch.clientX;
  floatingChatResizeStart.y = touch.clientY;
  floatingChatResizeStart.width = rect.width;
  floatingChatResizeStart.height = rect.height;
}

function handleFloatingChatResizeTouch(e) {
  if (!floatingChatResizing) return;
  e.preventDefault();
  const touch = e.touches[0];
  
  const deltaX = touch.clientX - floatingChatResizeStart.x;
  const deltaY = touch.clientY - floatingChatResizeStart.y;
  
  let newWidth = floatingChatResizeStart.width + deltaX;
  let newHeight = floatingChatResizeStart.height + deltaY;
  
  newWidth = Math.max(300, Math.min(window.innerWidth - 20, newWidth));
  newHeight = Math.max(350, Math.min(window.innerHeight - 20, newHeight));
  
  floatingChat.style.width = newWidth + 'px';
  floatingChat.style.height = newHeight + 'px';
}

// Funções de controle do chat
function toggleFloatingChat() {
  if (floatingChat.style.display === 'none') {
    floatingChat.style.display = 'flex';
    floatingChat.classList.add('open');
    
    // Adicionar mensagem inicial se o chat estiver vazio
    if (floatingChatLog.children.length === 0) {
      if (!state.currentMap) {
        addFloatingChatMessage('system', '👋 Olá! Digite um assunto para gerar um mapa mental. Ex: "Explique redes neurais"');
      } else {
        addFloatingChatMessage('system', `🗺️ Chat ativo para o mapa: "${state.currentMap.title || 'Mapa Mental'}"`);
        addFloatingChatMessage('system', '💡 Faça perguntas sobre o mapa ou use ➕/🔍 para modificá-lo.');
      }
    }
  } else {
    floatingChat.style.display = 'none';
    floatingChat.classList.remove('open');
  }
}

function minimizeFloatingChat() {
  floatingChat.classList.toggle('minimized');
}

function closeFloatingChat() {
  floatingChat.style.display = 'none';
  floatingChat.classList.remove('open', 'minimized');
}

function minimizeSpecialistChat() {
  specialistChat.classList.toggle('minimized');
}

function closeSpecialistChat() {
  specialistChat.style.display = 'none';
  specialistChat.classList.remove('open', 'minimized');
}

// Event listeners - CHAT PRINCIPAL
if (floatingChatMinimizeBtn) {
  floatingChatMinimizeBtn.addEventListener('click', minimizeFloatingChat);
}

if (floatingChatCloseBtn) {
  floatingChatCloseBtn.addEventListener('click', closeFloatingChat);
}

// Event listeners globais para garantir que os botões fechar sempre funcionem
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('close-btn')) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('Botão fechar do chat clicado (global)');
    
    // Determinar qual chat fechar baseado no contexto
    const chatElement = e.target.closest('.floating-chat');
    if (chatElement) {
      if (chatElement.id === 'floatingChat') {
        closeFloatingChat();
      } else if (chatElement.id === 'specialistChat') {
        closeSpecialistChat();
      }
    }
    return false;
  }
}, true); // Use capture phase

document.addEventListener('mousedown', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('close-btn')) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('Botão fechar do chat mousedown (global)');
    return false;
  }
}, true); // Use capture phase

// Event listeners - CHAT ESPECIALISTA
if (specialistChatMinimizeBtn) {
  specialistChatMinimizeBtn.addEventListener('click', minimizeSpecialistChat);
}

if (specialistChatCloseBtn) {
  specialistChatCloseBtn.addEventListener('click', closeSpecialistChat);
}

if (floatingChatClear) {
  floatingChatClear.addEventListener('click', () => {
    floatingChatLog.innerHTML = '';
  });
}

// Inicializar funcionalidades de drag e resize
if (floatingChat) {
  enableFloatingChatDrag();
  enableFloatingChatResize();
}

/* ========================================
   FUNCIONALIDADES DE CONSTRUÇÃO EM TEMPO REAL
   ======================================== */

// Função para adicionar nó ao mapa existente
async function addNodeToMap() {
  if (!state.currentMap) {
    addFloatingChatMessage('system', '❌ Nenhum mapa carregado. Gere um mapa primeiro.');
    return;
  }

  const prompt = floatingChatInput.value.trim();
  if (!prompt) {
    addFloatingChatMessage('system', '❌ Digite um prompt para adicionar o nó.');
    return;
  }

  try {
    addFloatingChatMessage('user', `➕ Adicionar nó: ${prompt}`);
    addFloatingChatMessage('system', '🔄 Gerando novo nó...');
    
    // Criar prompt para adicionar nó ao mapa existente
    const addNodePrompt = `Você deve adicionar UM NOVO NÓ ao mapa mental existente. 
    
MAPA ATUAL:
${JSON.stringify(state.currentMap, null, 2)}

PROMPT DO USUÁRIO: ${prompt}

INSTRUÇÕES:
1. Analise o mapa atual
2. Identifique onde o novo nó deve ser conectado
3. Crie APENAS UM nó novo com conexão apropriada
4. Mantenha toda a estrutura existente
5. Retorne o mapa COMPLETO (original + novo nó) em formato JSON válido

Responda APENAS com o JSON do mapa completo, sem explicações.`;

    guardProvider();
    const response = await window.AI.chatPlain({
      provider: state.provider,
      apiKey: state.apiKey,
      model: state.model,
      message: addNodePrompt,
      temperature: 0.3
    });

    // Tentar extrair JSON da resposta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const newMap = JSON.parse(jsonMatch[0]);
      state.currentMap = newMap;
      await renderAndAttach(newMap, true); // Preservar viewport
      addFloatingChatMessage('assistant', `✅ Nó adicionado com sucesso!`);
      floatingChatInput.value = '';
    } else {
      throw new Error('Resposta da IA não contém JSON válido');
    }

  } catch (error) {
    console.error('Erro ao adicionar nó:', error);
    addFloatingChatMessage('assistant', `❌ Erro: ${error.message}`);
  }
}

// Função para expandir nó selecionado
async function expandSelectedNode() {
  if (!state.currentMap) {
    addFloatingChatMessage('system', '❌ Nenhum mapa carregado.');
    return;
  }

  const prompt = floatingChatInput.value.trim();
  if (!prompt) {
    addFloatingChatMessage('system', '❌ Digite o nome do nó que deseja expandir.');
    return;
  }

  try {
    addFloatingChatMessage('user', `🔍 Expandir nó: ${prompt}`);
    addFloatingChatMessage('system', '🔄 Expandindo nó...');
    
    // Criar prompt para expandir nó específico
    const expandPrompt = `Você deve EXPANDIR um nó específico do mapa mental existente, adicionando subnós detalhados.

MAPA ATUAL:
${JSON.stringify(state.currentMap, null, 2)}

NÓ PARA EXPANDIR: ${prompt}

INSTRUÇÕES:
1. Encontre o nó "${prompt}" no mapa
2. Adicione 3-5 subnós detalhados conectados a este nó
3. Mantenha toda a estrutura existente
4. Retorne o mapa COMPLETO com o nó expandido em formato JSON válido

Responda APENAS com o JSON do mapa completo, sem explicações.`;

    guardProvider();
    const response = await window.AI.chatPlain({
      provider: state.provider,
      apiKey: state.apiKey,
      model: state.model,
      message: expandPrompt,
      temperature: 0.3
    });

    // Tentar extrair JSON da resposta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const expandedMap = JSON.parse(jsonMatch[0]);
      state.currentMap = expandedMap;
      await renderAndAttach(expandedMap, true); // Preservar viewport
      addFloatingChatMessage('assistant', `✅ Nó "${prompt}" expandido com sucesso!`);
      floatingChatInput.value = '';
    } else {
      throw new Error('Resposta da IA não contém JSON válido');
    }

  } catch (error) {
    console.error('Erro ao expandir nó:', error);
    addFloatingChatMessage('assistant', `❌ Erro: ${error.message}`);
  }
}

// Função para processar links Markdown e adicionar segurança
function processMarkdownLinks(htmlContent) {
  // Criar um elemento temporário para processar o HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Encontrar todos os links e adicionar target="_blank" e rel="noopener noreferrer"
  const links = tempDiv.querySelectorAll('a');
  links.forEach(link => {
    // Só adicionar se não tiver target já definido
    if (!link.hasAttribute('target')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
  
  return tempDiv.innerHTML;
}

// Função para adicionar mensagem ao chat flutuante com suporte a Markdown
function addFloatingChatMessage(role, content) {
  if (!floatingChatLog) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `fmsg ${role}`;
  
  // Se for mensagem do sistema, usar texto simples
  if (role === 'system') {
    messageDiv.textContent = content;
  } else {
    // Para mensagens do usuário e assistente, processar Markdown
    try {
      const htmlContent = window.marked.parse(content);
      const processedContent = processMarkdownLinks(htmlContent);
      messageDiv.innerHTML = processedContent;
    } catch (error) {
      // Se houver erro no Markdown, usar texto simples
      console.warn('Erro ao processar Markdown:', error);
      messageDiv.textContent = content;
    }
  }
  
  floatingChatLog.appendChild(messageDiv);
  floatingChatLog.scrollTop = floatingChatLog.scrollHeight;
}

// Função principal de envio de mensagem
async function handleFloatingChatSend() {
  const message = floatingChatInput.value.trim();
  if (!message) return;

  try {
    addFloatingChatMessage('user', message);
    
    if (!state.currentMap) {
      // Se não há mapa, gerar um novo mapa mental
      // ✅ LIMPAR CHAT ANTES DE GERAR NOVO MAPA
      floatingChatLog.innerHTML = '';
      addFloatingChatMessage('system', '🔄 Gerando novo mapa mental...');
      
      guardProvider();
      const mapData = await window.AI.chatMindMap({
        provider: state.provider,
        apiKey: state.apiKey,
        model: state.model,
        message: message
      });
      
      // Renderizar o novo mapa
      state.currentMap = mapData;
      await renderAndAttach(mapData);
      
      // Atualizar UI
    deleteMapBtn.disabled = false;
    state.currentMapId = null;
    modelSelector.classList.add('open');
      
      // Mostrar chat especialista automaticamente
      showSpecialistChat();
      
      // Mostrar botão especialista
      toggleSpecialistButton();
      
      // Mostrar botão de modelos de mapas
      toggleMapModelsButton();
      
      // Remover mensagem de loading e adicionar sucesso
      const messages = floatingChatLog.querySelectorAll('.fmsg');
      if (messages.length > 0 && messages[messages.length - 1].textContent === '🔄 Gerando novo mapa mental...') {
        messages[messages.length - 1].remove();
      }
      
      addFloatingChatMessage('assistant', `✅ Mapa "${mapData.title}" gerado com sucesso!`);
      addFloatingChatMessage('system', '💡 Agora você pode usar os botões ➕ e 🔍 para modificar o mapa, ou fazer perguntas sobre ele.');
      addFloatingChatMessage('system', '🧠 O Chat Especialista foi aberto automaticamente - ele conhece TUDO sobre este mapa!');
      
    } else {
      // Se já há mapa, fazer chat contextual
      addFloatingChatMessage('system', '🔄 Processando...');
      
      // Criar prompt contextual sobre o mapa
      const contextualPrompt = `Você é um assistente especializado em mapas mentais. Responda APENAS sobre o mapa fornecido.

MAPA ATUAL:
${JSON.stringify(state.currentMap, null, 2)}

PERGUNTA DO USUÁRIO: ${message}

Responda de forma concisa e prática sobre a estrutura, organização ou conteúdo do mapa.`;

      guardProvider();
      const response = await window.AI.chatPlain({
        provider: state.provider,
        apiKey: state.apiKey,
        model: state.model,
        message: contextualPrompt,
        temperature: 0.2
      });

      // Remover mensagem de loading e adicionar resposta
      const messages = floatingChatLog.querySelectorAll('.fmsg');
      if (messages.length > 0 && messages[messages.length - 1].textContent === '🔄 Processando...') {
        messages[messages.length - 1].remove();
      }
      
      addFloatingChatMessage('assistant', response);
    }
    
    floatingChatInput.value = '';

  } catch (error) {
    console.error('Erro no chat:', error);
    
    // Remover mensagem de loading se existir
    const messages = floatingChatLog.querySelectorAll('.fmsg');
    if (messages.length > 0 && (messages[messages.length - 1].textContent === '🔄 Gerando novo mapa mental...' || 
                               messages[messages.length - 1].textContent === '🔄 Processando...')) {
      messages[messages.length - 1].remove();
    }
    
    addFloatingChatMessage('assistant', `❌ Erro: ${error.message}`);
  }
}

// Event listeners para funcionalidades de construção em tempo real
if (floatingChatSend) {
  floatingChatSend.addEventListener('click', handleFloatingChatSend);
}

if (addNodeBtn) {
  addNodeBtn.addEventListener('click', addNodeToMap);
}

if (expandNodeBtn) {
  expandNodeBtn.addEventListener('click', expandSelectedNode);
}

// Enter para enviar mensagem
if (floatingChatInput) {
  floatingChatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFloatingChatSend();
    }
  });
}

// ✅ REMOVIDO - Duplicação corrigida na linha 1970

/* ========================================
   CHAT ESPECIALISTA - FUNCIONALIDADES
   ======================================== */

// Função para mostrar/ocultar chat especialista
function toggleSpecialistChat() {
  if (specialistChat.style.display === 'none') {
    specialistChat.style.display = 'flex';
    specialistChat.classList.add('open');
    
    // Adicionar mensagem inicial se o chat estiver vazio
    if (specialistChatLog.children.length === 0 && state.currentMap) {
      addSpecialistMessage('system', `🧠 Especialista ativo para: "${state.currentMap.title || 'Mapa Mental'}"`);
      addSpecialistMessage('system', '🔍 Eu conheço TODOS os nós, conexões e organização deste mapa. Pergunte sobre estrutura, conceitos, relações ou detalhes específicos.');
    }
  } else {
    specialistChat.style.display = 'none';
    specialistChat.classList.remove('open');
  }
}

// Função para adicionar mensagem ao chat especialista com suporte a Markdown
function addSpecialistMessage(role, content) {
  if (!specialistChatLog) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `fmsg ${role}`;
  
  // Se for mensagem do sistema, usar texto simples
  if (role === 'system') {
    messageDiv.textContent = content;
  } else {
    // Para mensagens do usuário e assistente, processar Markdown
    try {
      const htmlContent = window.marked.parse(content);
      const processedContent = processMarkdownLinks(htmlContent);
      messageDiv.innerHTML = processedContent;
    } catch (error) {
      // Se houver erro no Markdown, usar texto simples
      console.warn('Erro ao processar Markdown:', error);
      messageDiv.textContent = content;
    }
  }
  
  specialistChatLog.appendChild(messageDiv);
  specialistChatLog.scrollTop = specialistChatLog.scrollHeight;
}

// Função principal do chat especialista
async function handleSpecialistChatSend() {
  const message = specialistChatInput.value.trim();
  if (!message) return;

  if (!state.currentMap) {
    addSpecialistMessage('system', '❌ Nenhum mapa carregado. O especialista só funciona com mapas ativos.');
    specialistChatInput.value = '';
    return;
  }

  try {
    addSpecialistMessage('user', message);
    addSpecialistMessage('system', '🔄 Analisando mapa detalhadamente...');
    
    // Criar prompt do especialista - conhece TUDO sobre o mapa
    const specialistPrompt = `Você é um ESPECIALISTA em mapas mentais e conhece COMPLETAMENTE este mapa específico. Você tem conhecimento profundo sobre:

1. TODOS os nós e suas conexões
2. A organização hierárquica completa
3. O contexto e significado de cada conceito
4. As relações entre os diferentes elementos
5. A estrutura e lógica do modelo

MAPA COMPLETO:
${JSON.stringify(state.currentMap, null, 2)}

PERGUNTA DO USUÁRIO: ${message}

INSTRUÇÕES:
- Responda APENAS sobre este mapa específico
- Use seu conhecimento profundo dos nós e conexões
- Explique a organização e estrutura detalhadamente
- Seja preciso sobre os conceitos e suas relações
- Não invente informações que não estão no mapa
- Responda de forma técnica e detalhada
- **IMPORTANTE**: Use formatação Markdown para organizar sua resposta:
  * Use **negrito** para destacar conceitos importantes
  * Use *itálico* para ênfase
  * Use listas com - ou 1. para organizar informações
  * Use ## para títulos de seções
  * Use \`código\` para termos técnicos
  * Use > para citações ou observações importantes

Responda como um especialista que conhece cada detalhe deste mapa, usando Markdown para uma apresentação clara e organizada.`;

    guardProvider();
    const response = await window.AI.chatPlain({
      provider: state.provider,
      apiKey: state.apiKey,
      model: state.model,
      message: specialistPrompt,
      temperature: 0.1 // Baixa temperatura para respostas mais precisas
    });

    // Remover mensagem de loading e adicionar resposta
    const messages = specialistChatLog.querySelectorAll('.fmsg');
    if (messages.length > 0 && messages[messages.length - 1].textContent === '🔄 Analisando mapa detalhadamente...') {
      messages[messages.length - 1].remove();
    }
    
    addSpecialistMessage('assistant', response);
    specialistChatInput.value = '';

  } catch (error) {
    console.error('Erro no chat especialista:', error);
    
    // Remover mensagem de loading se existir
    const messages = specialistChatLog.querySelectorAll('.fmsg');
    if (messages.length > 0 && messages[messages.length - 1].textContent === '🔄 Analisando mapa detalhadamente...') {
      messages[messages.length - 1].remove();
    }
    
    addSpecialistMessage('assistant', `❌ Erro: ${error.message}`);
  }
}

// Função para mostrar chat especialista quando mapa é gerado
function showSpecialistChat() {
  if (state.currentMap) {
    specialistChat.style.display = 'flex';
    specialistChat.classList.add('open');
    
    // Limpar chat anterior e adicionar mensagem inicial
    specialistChatLog.innerHTML = '';
    addSpecialistMessage('system', `🧠 Especialista ativo para: "${state.currentMap.title || 'Mapa Mental'}"`);
    addSpecialistMessage('system', '🔍 Eu conheço TODOS os nós, conexões e organização deste mapa. Pergunte sobre estrutura, conceitos, relações ou detalhes específicos.');
  }
}

// Função para ocultar chat especialista quando mapa é removido
function hideSpecialistChat() {
  specialistChat.style.display = 'none';
  specialistChat.classList.remove('open');
  specialistChatLog.innerHTML = '';
}

// Função para controlar visibilidade do botão especialista
function toggleSpecialistButton() {
  const specialistBtn = document.getElementById('specialistBtn');
  if (!specialistBtn) return;
  
  if (state.currentMap) {
    // Mostrar botão quando há mapa
    specialistBtn.style.display = 'flex';
  } else {
    // Esconder botão quando não há mapa
    specialistBtn.style.display = 'none';
  }
}

// Event listeners do chat especialista
if (specialistChatSend) {
  specialistChatSend.addEventListener('click', handleSpecialistChatSend);
}

if (specialistChatClear) {
  specialistChatClear.addEventListener('click', () => {
    specialistChatLog.innerHTML = '';
    if (state.currentMap) {
      addSpecialistMessage('system', `🧠 Especialista ativo para: "${state.currentMap.title || 'Mapa Mental'}"`);
      addSpecialistMessage('system', '🔍 Eu conheço TODOS os nós, conexões e organização deste mapa. Pergunte sobre estrutura, conceitos, relações ou detalhes específicos.');
    }
  });
}

// Enter para enviar mensagem no chat especialista
if (specialistChatInput) {
  specialistChatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSpecialistChatSend();
    }
  });
}

// Event listener do botão especialista
const specialistBtn = document.getElementById('specialistBtn');
if (specialistBtn) {
  specialistBtn.addEventListener('click', () => {
    if (state.currentMap) {
      showSpecialistChat();
    }
  });
}

// Função para habilitar drag do chat especialista
function enableSpecialistChatDrag() {
  const dragArea = specialistChat.querySelector('.floating-chat-drag-area');
  
  // Mouse events
  dragArea.addEventListener('mousedown', startSpecialistChatDrag);
  document.addEventListener('mousemove', handleSpecialistChatDrag);
  document.addEventListener('mouseup', endSpecialistChatDrag);
  
  // Touch events para mobile
  dragArea.addEventListener('touchstart', startSpecialistChatDragTouch, { passive: false });
  document.addEventListener('touchmove', handleSpecialistChatDragTouch, { passive: false });
  document.addEventListener('touchend', endSpecialistChatDrag);
}

// Função para habilitar resize do chat especialista
function enableSpecialistChatResize() {
  const resizeHandle = specialistChat.querySelector('.resize-handle');
  
  resizeHandle.addEventListener('mousedown', startSpecialistChatResize);
  document.addEventListener('mousemove', handleSpecialistChatResize);
  document.addEventListener('mouseup', endSpecialistChatResize);
  
  // Touch events para resize
  resizeHandle.addEventListener('touchstart', startSpecialistChatResizeTouch, { passive: false });
  document.addEventListener('touchmove', handleSpecialistChatResizeTouch, { passive: false });
  document.addEventListener('touchend', endSpecialistChatResize);
}

// Estado do drag do chat especialista
let specialistChatDragging = false;
let specialistChatDragOffset = { x: 0, y: 0 };
let specialistChatResizing = false;
let specialistChatResizeStart = { x: 0, y: 0, width: 0, height: 0 };

// Funções de drag do chat especialista
function startSpecialistChatDrag(e) {
  specialistChatDragging = true;
  specialistChat.classList.add('dragging');
  const rect = specialistChat.getBoundingClientRect();
  specialistChatDragOffset.x = e.clientX - rect.left;
  specialistChatDragOffset.y = e.clientY - rect.top;
  
  specialistChat.style.right = 'auto';
  specialistChat.style.bottom = 'auto';
}

function handleSpecialistChatDrag(e) {
  if (!specialistChatDragging) return;
  
  let x = e.clientX - specialistChatDragOffset.x;
  let y = e.clientY - specialistChatDragOffset.y;
  
  x = Math.max(0, Math.min(window.innerWidth - specialistChat.offsetWidth, x));
  y = Math.max(0, Math.min(window.innerHeight - specialistChat.offsetHeight, y));
  
  specialistChat.style.left = x + 'px';
  specialistChat.style.top = y + 'px';
}

function endSpecialistChatDrag() {
  if (!specialistChatDragging) return;
  specialistChatDragging = false;
  specialistChat.classList.remove('dragging');
}

// Funções de drag para touch do chat especialista
function startSpecialistChatDragTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  specialistChatDragging = true;
  specialistChat.classList.add('dragging');
  const rect = specialistChat.getBoundingClientRect();
  specialistChatDragOffset.x = touch.clientX - rect.left;
  specialistChatDragOffset.y = touch.clientY - rect.top;
  
  specialistChat.style.right = 'auto';
  specialistChat.style.bottom = 'auto';
}

function handleSpecialistChatDragTouch(e) {
  if (!specialistChatDragging) return;
  e.preventDefault();
  const touch = e.touches[0];
  
  let x = touch.clientX - specialistChatDragOffset.x;
  let y = touch.clientY - specialistChatDragOffset.y;
  
  x = Math.max(0, Math.min(window.innerWidth - specialistChat.offsetWidth, x));
  y = Math.max(0, Math.min(window.innerHeight - specialistChat.offsetHeight, y));
  
  specialistChat.style.left = x + 'px';
  specialistChat.style.top = y + 'px';
}

// Funções de resize do chat especialista
function startSpecialistChatResize(e) {
  specialistChatResizing = true;
  specialistChat.classList.add('resizing');
  const rect = specialistChat.getBoundingClientRect();
  specialistChatResizeStart.x = e.clientX;
  specialistChatResizeStart.y = e.clientY;
  specialistChatResizeStart.width = rect.width;
  specialistChatResizeStart.height = rect.height;
}

function handleSpecialistChatResize(e) {
  if (!specialistChatResizing) return;
  
  const deltaX = e.clientX - specialistChatResizeStart.x;
  const deltaY = e.clientY - specialistChatResizeStart.y;
  
  let newWidth = specialistChatResizeStart.width + deltaX;
  let newHeight = specialistChatResizeStart.height + deltaY;
  
  newWidth = Math.max(300, Math.min(window.innerWidth - 20, newWidth));
  newHeight = Math.max(350, Math.min(window.innerHeight - 20, newHeight));
  
  specialistChat.style.width = newWidth + 'px';
  specialistChat.style.height = newHeight + 'px';
}

function endSpecialistChatResize() {
  if (!specialistChatResizing) return;
  specialistChatResizing = false;
  specialistChat.classList.remove('resizing');
}

// Funções de resize para touch do chat especialista
function startSpecialistChatResizeTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  specialistChatResizing = true;
  specialistChat.classList.add('resizing');
  const rect = specialistChat.getBoundingClientRect();
  specialistChatResizeStart.x = touch.clientX;
  specialistChatResizeStart.y = touch.clientY;
  specialistChatResizeStart.width = rect.width;
  specialistChatResizeStart.height = rect.height;
}

function handleSpecialistChatResizeTouch(e) {
  if (!specialistChatResizing) return;
  e.preventDefault();
  const touch = e.touches[0];
  
  const deltaX = touch.clientX - specialistChatResizeStart.x;
  const deltaY = touch.clientY - specialistChatResizeStart.y;
  
  let newWidth = specialistChatResizeStart.width + deltaX;
  let newHeight = specialistChatResizeStart.height + deltaY;
  
  newWidth = Math.max(300, Math.min(window.innerWidth - 20, newWidth));
  newHeight = Math.max(350, Math.min(window.innerHeight - 20, newHeight));
  
  specialistChat.style.width = newWidth + 'px';
  specialistChat.style.height = newHeight + 'px';
}

// Inicializar funcionalidades de drag e resize do chat especialista
if (specialistChat) {
  enableSpecialistChatDrag();
  enableSpecialistChatResize();
}

saveMapBtn.addEventListener('click', () => {
  if (!state.currentMap) return;
  const title = (saveTitleInput.value || state.currentMap.title || 'Mapa sem título').trim();
  const id = window.Storage.GeraMapas.saveMap({ title, data: state.currentMap });
  saveTitleInput.value = '';
  loadSavedList();
  state.currentMapId = id;
  // update visual state
  deleteMapBtn.disabled = false;
});

deleteMapBtn.addEventListener('click', () => {
  if (!state.currentMap) {
    return;
  }
  
  // Parar auto-organização antes de remover o mapa
  window.MapEngine.stopAutoOrganization();
  
  // Do NOT remove saved maps from storage here — only clear the map shown on screen
  state.currentMapId = null;
  state.cy.elements().remove();
  state.currentMap = null;
  clearOverlays();
  deleteMapBtn.disabled = true;
  
  // ✅ LIMPAR CHAT QUANDO MAPA É FECHADO
  floatingChatLog.innerHTML = '';
  
  // hide model selector and floating chat because they are map-specific
  modelSelector.classList.remove('open');
  floatingChat.style.display = 'none';
  
  // ========================================
  // FECHAMENTO AUTOMÁTICO DO POPUP DE EXPANSÃO
  // ========================================
  // Implementado por Lucius VII - Especialista GeraMapa
  // 
  // FUNCIONALIDADE: Fechar popup ao deletar mapa inteiro
  // COMPORTAMENTO: 
  // 1. Usuário clica em "Deletar Mapa"
  // 2. Sistema remove o mapa inteiro
  // 3. Sistema automaticamente fecha o popup de expansão
  // 4. Popup não fica "perdido" sem contexto
  //
  // BENEFÍCIOS:
  // - Popup não fica ativo após mapa sumir
  // - Interface limpa e consistente
  // - Experiência mais intuitiva
  // ========================================
  
  // Fechar node-slider se estiver aberto
  if (nodeSlider && nodeSlider.classList.contains('open')) {
    nodeSlider.classList.remove('open');
    console.log('✅ Popup de expansão fechado automaticamente ao deletar mapa');
  }
  
  // Alternativa: usar display none (se estiver usando essa estratégia)
  if (nodeSlider && nodeSlider.style.display === 'flex') {
    nodeSlider.style.display = 'none';
    console.log('✅ Popup de expansão fechado automaticamente ao deletar mapa (display)');
  }
  
  // Fechar popup de informações do nó (se existir)
  closePopup('nodeInfo');
  
  console.log('🗑️ Mapa deletado e popup de expansão fechado automaticamente');
  // ========================================
  
  // Ocultar chat especialista quando mapa é removido
  hideSpecialistChat();
  
  // Esconder botão especialista
  toggleSpecialistButton();
  
  // Esconder botão de modelos de mapas
  toggleMapModelsButton();
});

savedMapsList.addEventListener('click', (ev) => {
  const btn = ev.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  if (action === 'load') {
    const item = window.Storage.GeraMapas.getMap(id);
    if (item) {
      state.currentMap = item.data;
      state.currentMapId = id;
      renderAndAttach(item.data);
      deleteMapBtn.disabled = false;
      // ensure map-specific UI (model selector and floating chat) are visible when loading a saved map
      modelSelector.classList.add('open');
      floatingChat.style.display = 'block';
      floatingChat.classList.add('open');
      floatingChatLog.innerHTML = `<div class="fmsg system">Chat reaberto para o mapa salvo: <strong>${item.title || item.data.title || 'Mapa Mental'}</strong><br><small>Pergunte primeiro sobre a estrutura (ex: "Explique a organização do mapa"), depois sobre o contexto.</small></div>`;
      
      // Mostrar chat especialista para mapa carregado
      showSpecialistChat();
      
      // Mostrar botão especialista
      toggleSpecialistButton();
      
      // Mostrar botão de modelos de mapas
      toggleMapModelsButton();
    }
  } else if (action === 'add') {
    const item = window.Storage.GeraMapas.getMap(id);
    if (item && state.currentMap) {
      state.currentMap = window.MapEngine.mergeMaps(state.currentMap, item.data);
      renderAndAttach(state.currentMap);
      // ensure UI remains active
      modelSelector.classList.add('open');
      floatingChat.style.display = 'block';
      floatingChat.classList.add('open');
      
      // Mostrar chat especialista e botão após adicionar mapa
      showSpecialistChat();
      toggleSpecialistButton();
      toggleMapModelsButton();
    } else if (item) {
      state.currentMap = item.data;
      renderAndAttach(state.currentMap);
      state.currentMapId = id;
      deleteMapBtn.disabled = false;
      // ensure UI visible for loaded map
      modelSelector.classList.add('open');
      floatingChat.style.display = 'block';
      floatingChat.classList.add('open');
      floatingChatLog.innerHTML = `<div class="fmsg system">Chat reaberto para o mapa salvo: <strong>${item.title || item.data.title || 'Mapa Mental'}</strong><br><small>Pergunte primeiro sobre a estrutura (ex: "Explique a organização do mapa"), depois sobre o contexto.</small></div>`;
      
      // Mostrar chat especialista e botão após carregar mapa
      showSpecialistChat();
      toggleSpecialistButton();
      toggleMapModelsButton();
    }
  } else if (action === 'delete') {
    window.Storage.GeraMapas.deleteMap(id);
    loadSavedList();
    if (state.currentMapId === id) {
      // if we deleted the map currently loaded, clear it
      state.currentMapId = null;
      state.currentMap = null;
      state.cy.elements().remove();
      clearOverlays();
      deleteMapBtn.disabled = true;
      
      // ✅ LIMPAR CHAT QUANDO MAPA É DELETADO
      floatingChatLog.innerHTML = '';
      // hide model selector and floating chat because they are tied to the removed map
      modelSelector.classList.remove('open');
      
      // Esconder botão de modelos de mapas
      toggleMapModelsButton();
      floatingChat.style.display = 'none';
    }
  }
});




/* Helpers */
// Funções auxiliares de chat removidas - serão reconstruídas

async function renderAndAttach(map, preserveViewport = false) {
  // Salvar viewport E posições dos nós se solicitado
  let savedState = null;
  if (preserveViewport && state.cy) {
    savedState = {
      viewport: {
        zoom: state.cy.zoom(),
        pan: state.cy.pan()
      },
      nodePositions: {}
    };
    
    // Salvar posições dos nós existentes
    state.cy.nodes().forEach(node => {
      savedState.nodePositions[node.id()] = {
        x: node.position().x,
        y: node.position().y
      };
    });
    
    console.log('💾 Estado completo salvo:', Object.keys(savedState.nodePositions).length, 'nós');
  }
  
  // Renderizar mapa SEM aplicar layout quando preservando viewport
  window.MapEngine.renderMindMap(state.cy, map, state.currentModel, preserveViewport);
  
  // Restaurar estado se foi salvo
  if (savedState && state.cy) {
    // Restaurar posições dos nós que ainda existem
    state.cy.nodes().forEach(node => {
      const nodeId = node.id();
      if (savedState.nodePositions[nodeId]) {
        node.position(savedState.nodePositions[nodeId]);
      }
    });
    
    // Restaurar viewport
    state.cy.viewport({
      zoom: savedState.viewport.zoom,
      pan: savedState.viewport.pan
    });
    
    console.log('🔄 Estado restaurado - viewport + posições dos nós');
  }
  
  buildNodeInfoIcons(map);
  wireCollapseExpandEvents();
  
  // Atualizar visibilidade do botão de modelos de mapas
  toggleMapModelsButton(); // attach interactive collapse/expand
}

async function updateModelsUI() {
  modelsStatus.textContent = '';
  modelSelect.innerHTML = '<option value="">Carregando modelos...</option>';
  try {
    // Only require provider (and API key for Groq) to fetch models
    if (!state.provider) throw new Error('Selecione um provedor.');
    if (state.provider === 'groq' && !state.apiKey) throw new Error('Defina e salve sua API Key da Groq para listar modelos.');
    const list = await window.AI.fetchModels(state.provider, state.apiKey);
      modelSelect.innerHTML = '';
      for (const m of list) {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.label;
        modelSelect.appendChild(opt);
      }
      if (state.model && list.find(x => x.id === state.model)) {
        modelSelect.value = state.model;
      } else {
        state.model = modelSelect.value;
      }
    modelsStatus.textContent = `Modelos carregados (${list.length}).`;
    window.Storage.GeraMapas.saveSettings({ provider: state.provider, apiKey: state.apiKey, model: state.model });
  } catch (e) {
    modelSelect.innerHTML = '<option value="">Erro ao carregar modelos</option>';
    modelsStatus.textContent = e.message;
  }
}
  modelSelect.addEventListener('change', () => {
    state.model = modelSelect.value;
    window.Storage.GeraMapas.saveSettings({ provider: state.provider, apiKey: state.apiKey, model: state.model });
  });

function loadSavedList() {
  const all = window.Storage.GeraMapas.listMaps();
  savedMapsList.innerHTML = '';
    for (const { id, title } of all) {
      const li = document.createElement('li');
      li.className = 'list-item';
      li.innerHTML = `
        <span>${title}</span>
        <span style="display:flex;gap:6px">
          <button class="btn" data-action="load" data-id="${id}" aria-label="Abrir mapa">📂</button>
          <button class="btn" data-action="add" data-id="${id}" aria-label="Adicionar ao atual">➕</button>
          <button class="btn ghost" data-action="delete" data-id="${id}" aria-label="Excluir mapa">🗑️</button>
        </span>
      `;
      savedMapsList.appendChild(li);
  }
  // disable delete button if no current map
  deleteMapBtn.disabled = !state.currentMap;
}
loadSavedList();

function guardProvider() {
  if (!state.apiKey) throw new Error('Defina e salve sua API Key.');
  if (!state.provider) throw new Error('Selecione um provedor.');
  if (!state.model) throw new Error('Selecione um modelo.');
}

// Eventos do novo layout - Popups
if (chatBtn) {
  chatBtn.addEventListener('click', () => {
    toggleFloatingChat(); // ✅ Usar função correta
    setActiveNavBtn(chatBtn);
  });
}

if (savedMapsBtn) {
  savedMapsBtn.addEventListener('click', () => {
    togglePopup(savedMapsPopup);
    setActiveNavBtn(savedMapsBtn);
  });
}

if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    togglePopup(settingsPopup);
    setActiveNavBtn(settingsBtn);
  });
}

if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    togglePopup(exportPopup);
    setActiveNavBtn(exportBtn);
  });
}

// Fechar popups com Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllPopups();
  }
});

// Funções para gerenciar popups
function togglePopup(popup) {
  if (!popup) return;
  
  // Fechar todos os outros popups primeiro
  closeAllPopups();
  
  // Toggle do popup atual
  if (popup.classList.contains('show')) {
    popup.classList.remove('show');
  } else {
    popup.classList.add('show');
  }
}

function closeAllPopups() {
  const popups = document.querySelectorAll('.mobile-popup');
  popups.forEach(popup => {
    popup.classList.remove('show');
  });
  
  // Remover estado ativo de todos os botões
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.classList.remove('active');
  });
}

function setActiveNavBtn(activeBtn) {
  // Remover estado ativo de todos os botões
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Adicionar estado ativo ao botão clicado
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Eventos para fechar popups
document.addEventListener('click', (e) => {
  // Fechar popup ao clicar no botão de fechar
  if (e.target && e.target.classList && e.target.classList.contains('popup-close')) {
    const popup = e.target.closest('.mobile-popup');
    if (popup) {
      popup.classList.remove('show');
      setActiveNavBtn(null);
    }
  }
  
  // Fechar popup ao clicar fora do conteúdo
  if (e.target && e.target.classList && e.target.classList.contains('mobile-popup')) {
    e.target.classList.remove('show');
    setActiveNavBtn(null);
  }
});

// Função para mostrar/ocultar popup fixo de informações do mapa
function updateMapInfoPopup() {
  if (!mapInfoPopup) return;
  
  if (state.currentMap && state.cy) {
    const nodes = state.cy.nodes();
    const edges = state.cy.edges();
    
    if (nodeCount) nodeCount.textContent = nodes.length;
    if (edgeCount) edgeCount.textContent = edges.length;
    if (currentLayout) currentLayout.textContent = state.currentModel || 'default';
    
    mapInfoPopup.style.display = 'block';
  } else {
    mapInfoPopup.style.display = 'none';
  }
}

// Função para atualizar status
function updateStatus(message) {
  if (statusText) {
    statusText.textContent = message;
  }
}

// Sistema de drag para popups móveis
function enablePopupDrag() {
  const popups = document.querySelectorAll('.mobile-popup');
  
  popups.forEach(popup => {
  let dragging = false;
  let dx = 0, dy = 0;
    const handle = popup.querySelector('.popup-header');
    
    if (!handle) return;
    
    // Mouse events
  handle.addEventListener('mousedown', (ev) => {
      if (!popup.classList.contains('show')) return;
    dragging = true;
      popup.classList.add('dragging');
    const rect = popup.getBoundingClientRect();
    dx = ev.clientX - rect.left;
    dy = ev.clientY - rect.top;
    popup.style.transition = 'none';
      ev.preventDefault();
  });
    
  document.addEventListener('mousemove', (ev) => {
    if (!dragging) return;
    let x = ev.clientX - dx;
    let y = ev.clientY - dy;
      
      // Limitar movimento dentro da tela
      x = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, y));
      
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.style.right = 'auto';
  });
    
  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
      popup.classList.remove('dragging');
    popup.style.transition = '';
  });
    
    // Touch events
  handle.addEventListener('touchstart', (e) => {
      if (!popup.classList.contains('show')) return;
    const t = e.touches[0];
    dragging = true;
      popup.classList.add('dragging');
    const rect = popup.getBoundingClientRect();
    dx = t.clientX - rect.left;
    dy = t.clientY - rect.top;
      e.preventDefault();
    }, { passive: false });
    
  document.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    let x = t.clientX - dx;
    let y = t.clientY - dy;
      
      // Limitar movimento dentro da tela
      x = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, y));
      
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.style.right = 'auto';
      e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      popup.classList.remove('dragging');
      popup.style.transition = '';
    });
  });
}

// Inicializar drag quando DOM estiver pronto
// document.addEventListener('DOMContentLoaded', enablePopupDrag);

// Eventos para botões de modelos
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('model-apply')) {
    const modelOption = e.target.closest('.model-option');
    const model = modelOption.dataset.model;
    if (model) {
      applyModel(model);
      closeAllPopups();
    }
  }
});

// Eventos para tooltips informativos
document.addEventListener('mouseenter', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('info-icon')) {
    const tooltip = e.target.getAttribute('data-tooltip');
    if (tooltip) {
      showTooltip(e.target, tooltip);
    }
  }
}, true);

document.addEventListener('mouseleave', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('info-icon')) {
    hideTooltip();
  }
}, true);

// Função para mostrar tooltip
function showTooltip(element, text) {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;
  document.body.appendChild(tooltip);
  
  const rect = element.getBoundingClientRect();
  tooltip.style.left = rect.left + 'px';
  tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
  
  setTimeout(() => tooltip.classList.add('show'), 10);
}

// Função para esconder tooltip
function hideTooltip() {
  const tooltip = document.querySelector('.tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}

// Função para controlar visibilidade do botão de modelos de mapas
function toggleMapModelsButton() {
  if (state.currentMap) {
    mapModelsBtn.style.display = 'flex';
    console.log('✅ Botão modelos de mapas: VISÍVEL (mapa carregado)');
  } else {
    mapModelsBtn.style.display = 'none';
    console.log('❌ Botão modelos de mapas: OCULTO (nenhum mapa)');
  }
}

// Event listener para o botão de modelos de mapas
if (mapModelsBtn) {
  mapModelsBtn.addEventListener('click', () => {
    if (modelSelector) {
      modelSelector.classList.toggle('open');
      console.log('🔄 Model selector toggleado');
    }
  });
}

// Função para aplicar modelo
function applyModel(model) {
  if (!state.currentMap || !state.cy) {
    updateStatus('Nenhum mapa carregado para aplicar modelo');
    return;
  }
  
  state.currentModel = model;
  updateStatus(`Aplicando modelo: ${model}`);
  
  // Re-renderizar mapa com novo modelo
  window.MapEngine.renderMindMap(state.cy, state.currentMap, model);
  updateMapInfoPopup();
  
  updateStatus(`Modelo ${model} aplicado com sucesso`);
}

// Eventos para tabs de configurações
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('tab-btn')) {
    const tab = e.target.dataset.tab;
    switchTab(tab);
  }
});

function switchTab(tabName) {
  // Remover ativo de todas as tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Ativar tab selecionada
  const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
  const activeContent = document.querySelector(`[data-tab-content="${tabName}"]`);
  
  if (activeBtn) activeBtn.classList.add('active');
  if (activeContent) activeContent.classList.add('active');
}

// Conectar eventos de exportação
document.addEventListener('click', (e) => {
  if (e.target.id === 'exportBtnPopup') {
    handleExport();
  }
});

async function handleExport() {
  try {
    // ✅ Verificações básicas
  if (!state.currentMap || !state.cy) {
      updateStatus('❌ Nenhum mapa carregado para exportar');
      alert('❌ Nenhum mapa carregado para exportar');
    return;
  }
  
  const format = document.getElementById('exportFormat')?.value || 'png';
    console.log(`🔄 Iniciando exportação: ${format}`);
    updateStatus(`🔄 Exportando como ${format.toUpperCase()}...`);
    
    // ✅ Desabilitar botão durante exportação
    const exportBtn = document.getElementById('exportBtnPopup');
    if (exportBtn) {
      exportBtn.disabled = true;
      exportBtn.textContent = '⏳ Exportando...';
    }
    
    await exportMap(format);
    
    // ✅ Sucesso
    updateStatus('✅ Exportação concluída com sucesso');
    console.log('✅ Exportação concluída com sucesso');
    closeAllPopups();
    
  } catch (err) {
    // ✅ Erro
    const errorMsg = `❌ Erro na exportação: ${err.message}`;
    updateStatus(errorMsg);
    console.error('❌ Erro na exportação:', err);
    alert(errorMsg);
  } finally {
    // ✅ Reabilitar botão
    const exportBtn = document.getElementById('exportBtnPopup');
    if (exportBtn) {
      exportBtn.disabled = false;
      exportBtn.textContent = '📤 Exportar';
    }
  }
}

// Conectar eventos de salvar mapa
document.addEventListener('click', (e) => {
  if (e.target.id === 'saveMapBtnPopup') {
    handleSaveMap();
  }
});

function handleSaveMap() {
  if (!state.currentMap) {
    updateStatus('Nenhum mapa para salvar');
    return;
  }
  
  const title = document.getElementById('saveTitleInput')?.value || 'Mapa sem título';
  
  try {
    const id = window.Storage.GeraMapas.saveMap({
      title: title,
      data: state.currentMap
    });
    
    updateStatus(`Mapa "${title}" salvo com sucesso`);
    loadSavedList();
    document.getElementById('saveTitleInput').value = '';
  } catch (err) {
    updateStatus(`Erro ao salvar: ${err.message}`);
  }
}
/* ...existing code... */

/* Info icons logic - Variáveis movidas para o topo do arquivo */

function clearOverlays() {
  overlaysRoot.innerHTML = '';
  currentTooltip = null;
}

function buildNodeInfoIcons(mapJson) {
  clearOverlays();
  const nodes = state.cy.nodes();
  nodes.forEach((n) => {
    const id = n.id();
    const pos = n.renderedPosition();
    const el = document.createElement('div');
    el.className = 'node-info';
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Informações: ${n.data('label') || 'nó'}`);
    el.tabIndex = 0;
    // inner label for styling
    const span = document.createElement('span');
    span.className = 'ni-label';
    span.textContent = 'i';
    el.appendChild(span);
    // store node id for reliable association
    el.dataset.nodeId = id;
    overlaysRoot.appendChild(el);
    positionOverlay(el, pos);

    // Click handler: FORCE stop all event bubbling
    const onActivate = (ev) => {
      // Immediately stop ALL event propagation
      if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
      if (ev && typeof ev.stopPropagation === 'function') ev.stopPropagation();
      if (ev && typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation();
      
      // record to help cy node click ignore this interaction
      lastInfoClick.nodeId = id;
      lastInfoClick.time = Date.now();
      
      // Log for debugging
      console.log('ℹ️ Ícone "i" clicado - evento bloqueado:', id);
      
      // open the tooltip / info panel as before
      showTooltipForNode(n, el, mapJson);
      
      // Return false to ensure no further processing
      return false;
    };

    // mouse interactions with capture to intercept before Cytoscape
    el.addEventListener('click', onActivate, { passive: false, capture: true });
    el.addEventListener('mousedown', (e) => { 
      e.preventDefault(); 
      e.stopPropagation(); 
      e.stopImmediatePropagation();
      return false;
    }, { passive: false, capture: true });
    
    // touch interactions
    el.addEventListener('touchstart', (e) => { 
      e.preventDefault(); 
      e.stopPropagation(); 
      e.stopImmediatePropagation();
      return false;
    }, { passive: false, capture: true });
    el.addEventListener('touchend', (e) => { onActivate(e); }, { passive: false, capture: true });

    // keyboard accessibility (Enter / Space triggers)
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        onActivate(e);
      }
    });
  });

  // update positions on viewport changes
  /* batch updates via rAF to avoid visual lag and cover more cytoscape events */
  let _overlayUpdateRAF = null;
  function scheduleOverlayUpdate() {
    if (_overlayUpdateRAF) return;
    _overlayUpdateRAF = requestAnimationFrame(() => {
      _overlayUpdateRAF = null;
      state.cy.nodes().forEach(n => {
        const nodeEl = overlaysRoot.querySelector(`.node-info[data-node-id="${n.id()}"]`);
        if (nodeEl) positionOverlay(nodeEl, n.renderedPosition());
      });
    });
  }
  ['pan','zoom','resize','position','drag','render'].forEach(evt => state.cy.on(evt, scheduleOverlayUpdate));
}

function positionOverlay(el, pos) {
  // offset top-right of node
  el.style.left = (pos.x + 24) + 'px';
  el.style.top = (pos.y - 12) + 'px';
}

/* show tooltip and request node-specific summary from model */
async function showTooltipForNode(node, anchorEl, mapJson) {
  // remove existing tooltip
  if (currentTooltip) currentTooltip.remove();
  
  const nodeLabel = node.data('label') || 'Nó sem título';
  
  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  tooltip.innerHTML = `
    <div class="node-tooltip-header">
      <h3 class="node-tooltip-title">${nodeLabel}</h3>
      <button class="node-tooltip-close" aria-label="Fechar">✕</button>
    </div>
    <div class="node-tooltip-content">
      <div class="tt-text">Gerando resumo...</div>
    </div>
    <div class="node-tooltip-actions">
                         <button class="btn small copy-text" title="Copiar resumo">Copiar</button>
                         <button class="btn small expand-node" title="Expansão">Expansão</button>
                         <button class="btn small add-child">Adicionar subnó</button>
                         <button class="btn small gen-image" title="Gerar Imagem">Gerar Imagem</button>
                         <button class="btn small upload-image" title="Carregar Imagem">Carregar Imagem</button>
    </div>
  `;
  
  document.body.appendChild(tooltip);
  currentTooltip = tooltip;
  
  // Posicionar popup de forma responsiva
  positionTooltipResponsively(tooltip, anchorEl);
  
  // Adicionar funcionalidade de drag & drop
  enableTooltipDrag(tooltip);
  
  // Adicionar evento de fechar
  const closeBtn = tooltip.querySelector('.node-tooltip-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
      }
    });
  }
 
  // prepare prompt: include map title + node label + brief context
  const mapTitle = (mapJson && mapJson.title) ? mapJson.title : 'Mapa Mental';
  // include structural context: layout/model, parent(s), children, and nearby connected nodes
  const parents = node.incomers('node').map(n => n.data('label')).filter(Boolean);
  const children = node.outgoers('node').map(n => n.data('label')).filter(Boolean);
  const connected = Array.from(new Set([...(parents||[]), ...(children||[]), ...node.connectedEdges().connectedNodes().map(n=>n.data('label')||'')])).filter(Boolean);
  const layoutModel = state.currentModel || 'default';
  // include reading mode instruction
  const mode = state.readingMode || 'normal';
  const modeInstr = {
    normal: 'Formato padrão, objetivo e conciso.',
    aluno: 'Tom: acolhedor e didático; use analogias simples, explique como para um aluno curioso; inclua perguntas retóricas ("você pode estar se perguntando...").',
    detetive: 'Tom: investigativo; destaque pontos-chave, contradições e lacunas; questione suposições e destaque evidências.',
    jornalista: 'Tom: neutro e objetivo; pirâmide invertida; destaque o fato principal nos primeiros termos: quem, o quê, quando, onde, por quê.',
    criativo: 'Tom: imaginativo; use metáforas, histórias curtas e imagens mentais para reimaginar o conteúdo.',
    minimalista: 'Tom: extremamente sucinto; frases curtas, bullets, extraia a essência em poucas palavras.',
    analitico: 'Tom: analítico; estruture em premissas, evidências e conclusão, passo a passo.',
    contextualizador: 'Tom: relacione ao contexto histórico/social/cultural; faça conexões interdisciplinares.'
  }[mode] || 'Formato padrão, objetivo e conciso.';
  
  const prompt = `Considere o mapa "${mapTitle}" e o modelo de layout "${layoutModel}". ${modeInstr} Forneça um resumo EM MARKDOWN (suportando títulos, parágrafos, listas, ênfase **negrito**, _itálico_, links e trechos de código quando aplicável) em 2-6 frases do tópico "${nodeLabel}", levando em conta: (1) nós pais: ${parents.length?parents.join(', '):'nenhum'}, (2) subnós: ${children.length?children.join(', '):'nenhum'}, e (3) nós ligados/relacionados: ${connected.length?connected.join(', '):'nenhum'}. Use o contexto do próprio mapa (título e estrutura) para explicar a função e relevância deste nó. Responda apenas com o texto em Markdown, sem explicações adicionais. Seja conciso e prático.`;
 
  try {
    guardProvider();
    // use chatPlain so the selected model/provider produces the plain text markdown
    const markdown = await window.AI.chatPlain({
      provider: state.provider,
      apiKey: state.apiKey,
      model: state.model,
      message: prompt,
      temperature: 0.2
    });

    // render markdown usando marked local
    let rendered = '';
    try {
      if (window.marked) {
        const htmlContent = window.marked.parse ? window.marked.parse(markdown) : window.marked(markdown);
        rendered = processMarkdownLinks(htmlContent);
      } else {
        throw new Error('Marked não carregado');
      }
    } catch (e) {
      // fallback: basic escaping + preserve line breaks
      rendered = `<pre style="white-space:pre-wrap;word-wrap:break-word;">${markdown.replace(/</g,'&lt;')}</pre>`;
    }

    const textEl = tooltip.querySelector('.tt-text');
    if (textEl) {
      // store raw markdown for copy action and set rendered HTML
      tooltip.dataset.rawMarkdown = markdown;
      textEl.innerHTML = rendered;
    }
  } catch (err) {
    const textEl = tooltip.querySelector('.tt-text');
    if (textEl) textEl.textContent = `Erro: ${err.message}`;
  }
  
  // Add-copy behavior
  const copyBtn = tooltip.querySelector('.copy-text');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const raw = tooltip.dataset.rawMarkdown || '';
      try {
        // copy raw markdown to clipboard so user can paste formatted markdown elsewhere
        await navigator.clipboard.writeText(raw || '');
        copyBtn.textContent = 'Copiado';
        setTimeout(() => { copyBtn.textContent = 'Copiar'; }, 1500);
      } catch (e) {
        // fallback: copy visible text
        try {
          const textEl = tooltip.querySelector('.tt-text');
          const txt = textEl ? textEl.innerText : '';
          await navigator.clipboard.writeText(txt || '');
          copyBtn.textContent = 'Copiado';
          setTimeout(() => { copyBtn.textContent = 'Copiar'; }, 1500);
        } catch (err2) {
          alert('Falha ao copiar: ' + (err2 && err2.message ? err2.message : err2));
        }
      }
    });
  }
  
  // Expand (full page) behavior: generate full markdown page via LLM and open slider
  const expandBtn = tooltip.querySelector('.expand-node');
  if (expandBtn) {
    expandBtn.addEventListener('click', async () => {
      if (!state.currentMap) return;
      // prepare detailed prompt for full page (ask for extended markdown with sections)
      const mapTitle = (mapJson && mapJson.title) ? mapJson.title : 'Mapa Mental';
      const nodeLabel = node.data('label') || '';
      const parents = node.incomers('node').map(n => n.data('label')).filter(Boolean);
      const children = node.outgoers('node').map(n => n.data('label')).filter(Boolean);
      const layoutModel = state.currentModel || 'default';
      const mode = state.readingMode || 'normal';
      const fullPrompt = `Gere UMA PÁGINA COMPLETA EM MARKDOWN sobre o nó "${nodeLabel}" do mapa "${mapTitle}". Considere o modelo de layout "${layoutModel}", os nós pais: ${parents.length?parents.join(', '):'nenhum'}, subnós: ${children.length?children.join(', '):'nenhum'}, e os nós relacionados. Use o modo de leitura "${mode}" para o tom. A página deve conter: título, resumo curto (2-4 frases), seção "Contexto e Função" explicando a importância no mapa, seção "Detalhes e Subtópicos" com listas/expansões para cada subnó, exemplos práticos quando aplicável, e seção "Referências / Próximos passos". Responda SOMENTE com MARKDOWN completo.`;
      // Mostrar o node-slider
      nodeSlider.style.display = 'flex';
      nodeSlider.querySelector('.node-slider-title').textContent = nodeLabel;
      nodeSlider.querySelector('.node-slider-content').innerHTML = '<em>Gerando conteúdo completo...</em>';
      try {
        guardProvider();
        // fetch base/normal content once (will reuse for "Normal" tab)
        const baseMd = await window.AI.chatPlain({ provider: state.provider, apiKey: state.apiKey, model: state.model, message: fullPrompt, temperature: 0.2 });
        // render markdown helper
        const renderMd = async (md) => {
          try {
            if (window.marked) {
              const htmlContent = window.marked.parse ? window.marked.parse(md) : window.marked(md);
              return processMarkdownLinks(htmlContent);
            } else {
              throw new Error('Marked não carregado');
            }
          } catch (e) { return `<pre style="white-space:pre-wrap;">${md.replace(/</g,'&lt;')}</pre>`; }
        };
        const normalHtml = await renderMd(baseMd);
        // set up tabbed UI skeleton
        nodeSlider.querySelector('.node-slider-content').innerHTML = `
          <div class="node-tabs">
            <div class="node-tabs-header">
              <button data-tab="normal" class="tab active">Normal</button>
              <button data-tab="tecnico" class="tab">Técnico</button>
              <button data-tab="leigo" class="tab">Leigo</button>
              <button data-tab="palestra" class="tab">Palestra</button>
              <button data-tab="roteiro" class="tab">Roteiro Curto</button>
              <button data-tab="exercicio" class="tab">Exercício</button>
              <button id="downloadTabBtn" class="tab download-tab" title="Download conteúdo da aba ativa">📥</button>
            </div>
            <div class="node-tabs-body">
              <div data-tab-content="normal" class="tab-content active">${normalHtml}</div>
              <div data-tab-content="tecnico" class="tab-content" data-loading="0"><em>Carregue a aba Técnico para gerar conteúdo aprofundado...</em></div>
              <div data-tab-content="leigo" class="tab-content" data-loading="0"><em>Carregue a aba Leigo para gerar explicação acessível...</em></div>
              <div data-tab-content="palestra" class="tab-content" data-loading="0"><em>Carregue a aba Palestra para gerar roteiro em primeira pessoa...</em></div>
              <div data-tab-content="roteiro" class="tab-content" data-loading="0"></div>
              <div data-tab-content="exercicio" class="tab-content" data-loading="0">
                <div class="card" style="display:grid;gap:12px;align-items:end;grid-template-columns: repeat(auto-fit, minmax(180px,1fr));">
                  <div>
                    <label class="label">Base (aba)</label>
                    <select class="ex-base" title="Aba base para gerar os exercícios">
                      <option value="normal" selected>Normal</option>
                      <option value="tecnico">Técnico</option>
                      <option value="leigo">Leigo</option>
                      <option value="palestra">Palestra</option>
                      <option value="roteiro">Roteiro Curto</option>
                    </select>
                  </div>
                  <div>
                    <label class="label">Tipo</label>
                    <select class="ex-type">
                      <option value="discursiva" selected>Discursiva</option>
                      <option value="multipla">Múltipla escolha</option>
                    </select>
                  </div>
                  <div class="ex-field-disc">
                    <label class="label">Perguntas (discursiva)</label>
                    <input type="number" class="ex-qtd-disc" min="1" max="50" value="5" />
                  </div>
                  <div class="ex-field-mult" style="display:none">
                    <label class="label">Perguntas (múltipla)</label>
                    <input type="number" class="ex-qtd-mult" min="1" max="50" value="5" />
                  </div>
                  <div class="ex-field-mult" style="display:none">
                    <label class="label">Opções por pergunta</label>
                    <input type="number" class="ex-opts" min="2" max="8" value="4" />
                  </div>
                  <div style="display:flex;gap:8px;align-items:center">
                    <button class="btn primary ex-generate">Gerar Exercícios</button>
                    <button class="btn ghost ex-toggle-answers" title="Mostrar/ocultar respostas">👁️</button>
                    <button class="btn secondary ex-save-pdf" title="Salvar exercícios em PDF" style="display:none">📄 PDF</button>
                  </div>
                </div>
                <div class="ex-output" style="margin-top:12px"></div>
              </div>
            </div>
          </div>
        `;
        // tab switching logic
        const header = nodeSlider.querySelector('.node-tabs-header');
        header.addEventListener('click', async (ev) => {
          // ✅ BOTÃO DE DOWNLOAD
          if (ev.target.id === 'downloadTabBtn') {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            downloadActiveTabContent(nodeSlider, nodeLabel);
            return false;
          }
          
          const btn = ev.target.closest('button[data-tab]');
          if (!btn) return;
          const tab = btn.dataset.tab;
          // ui activation
          nodeSlider.querySelectorAll('.node-tabs-header .tab').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          nodeSlider.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
          const activeContent = nodeSlider.querySelector(`.tab-content[data-tab-content="${tab}"]`);
          if (activeContent) activeContent.classList.add('active');
          const target = nodeSlider.querySelector(`.tab-content[data-tab-content="${tab}"]`);
          if (!target) return;
          
          // ✅ VERIFICAR SE JÁ TEM CONTEÚDO SALVO (OFFLINE)
          const savedContent = loadTabContentFromStorage(nodeLabel, tab);
          if (savedContent) {
            target.innerHTML = savedContent;
            target.dataset.loading = '1';
            console.log(`📂 Conteúdo carregado do cache: ${tab}`);
            return;
          }
          
          if (tab === 'roteiro') {
            // Roteiro Curto: displays model selection UI immediately
            renderScriptModelSelector(target, nodeLabel, mapTitle, renderMd);
            target.dataset.loading = '1'; // Mark static UI as loaded
            return;
          }
          if (tab === 'exercicio') {
            // Render UI (já está no HTML); ligar eventos uma vez
            if (target.dataset.loading !== '1') {
              const out = target.querySelector('.ex-output');
              const btn = target.querySelector('.ex-generate');
              const toggle = target.querySelector('.ex-toggle-answers');
              const typeSel = target.querySelector('.ex-type');
              const baseSel = target.querySelector('.ex-base');
              const qtdDisc = target.querySelector('.ex-qtd-disc');
              const qtdMult = target.querySelector('.ex-qtd-mult');
              const qtdOpts = target.querySelector('.ex-opts');
              const fieldsDisc = target.querySelectorAll('.ex-field-disc');
              const fieldsMult = target.querySelectorAll('.ex-field-mult');
              const savePdfBtn = target.querySelector('.ex-save-pdf');

              // Mostrar/ocultar campos conforme o tipo escolhido
              function syncFields() {
                const isDisc = typeSel.value === 'discursiva';
                fieldsDisc.forEach(el => el.style.display = '');
                fieldsMult.forEach(el => el.style.display = isDisc ? 'none' : '');
                if (isDisc) {
                  fieldsDisc.forEach(el => el.style.display = '');
                } else {
                  fieldsDisc.forEach(el => el.style.display = 'none');
                }
              }
              syncFields();
              
              // ========================================
              // FUNCIONALIDADE AUTOMÁTICA DE EXERCÍCIOS
              // ========================================
              // Implementado por Lucius VII - Especialista GeraMapa
              // 
              // FUNCIONALIDADE: Geração automática ao mudar tipo de exercício
              // COMPORTAMENTO: 
              // 1. Usuário muda de "Discursiva" para "Múltipla escolha" (ou vice-versa)
              // 2. Sistema automaticamente limpa exercício anterior
              // 3. Sistema gera novo exercício do tipo selecionado
              // 4. Não precisa clicar em "Gerar Exercícios"
              //
              // BENEFÍCIOS:
              // - Experiência mais fluida para o usuário
              // - Elimina necessidade de cliques extras
              // - Geração instantânea ao mudar tipo
              // ========================================
              
              // Função para gerar exercícios automaticamente
              async function generateExercisesAutomatically() {
                // Limpar exercício anterior
                out.innerHTML = '';
                
                // Mostrar indicador de carregamento
                out.innerHTML = '<div class="hint">🔄 Gerando exercícios automaticamente...</div>';
                
                try {
                  // Coleta de conteúdo das abas já carregadas
                  const collected = [];
                  const base = (baseSel && baseSel.value) ? baseSel.value : 'normal';
                  const tabsToRead = [base];
                  tabsToRead.forEach(key => {
                    const el = nodeSlider.querySelector(`.tab-content[data-tab-content="${key}"]`);
                    if (el && el.dataset.loading === '1') {
                      collected.push(`--- ${key.toUpperCase()} ---\n` + el.textContent.trim().slice(0, 4000));
                    }
                  });
                  const contextText = collected.join('\n\n');
                  const kind = typeSel.value;
                  const nDisc = Math.max(1, parseInt(qtdDisc.value||'5',10));
                  const nMult = Math.max(1, parseInt(qtdMult.value||'5',10));
                  const nOpts = Math.min(8, Math.max(2, parseInt(qtdOpts.value||'4',10)));

                  // Prompt para a IA: pede div .answers para respostas
                  let exPrompt = `Com base no conteúdo abaixo (use apenas como referência), gere EXERCÍCIOS sobre o tópico "${nodeLabel}" do mapa "${mapTitle}".\n\nCONTEXTO:\n${contextText}\n\n`;
                  if (kind === 'discursiva') {
                    exPrompt += `Formato: Markdown com seção "Perguntas" contendo ${nDisc} perguntas discursivas claras e desafiadoras. Em seguida, crie uma seção <div class=\"answers\">"Respostas"</div> com respostas modelo curtas (2-4 frases). Não misture soluções no enunciado.`;
                  } else {
                    exPrompt += `Formato: Markdown com seção "Perguntas" contendo ${nMult} questões de múltipla escolha, cada uma com ${nOpts} opções (A..). Apenas UMA correta por questão. Após as perguntas, crie uma seção <div class=\"answers\">"Respostas"</div> listando: número da questão, alternativa correta e explicação em 1-2 frases. IMPORTANTE: Use exatamente a classe "answers" na div das respostas.`;
                  }

                  guardProvider();
                  const exMd = await window.AI.chatPlain({ provider: state.provider, apiKey: state.apiKey, model: state.model, message: exPrompt, temperature: 0.2 });
                  const html = await renderMd(exMd);
                  out.innerHTML = html;
                  
                  // Ocultar respostas por padrão
                  out.querySelectorAll('.answers').forEach(a => a.style.display = 'none');
                  toggle.textContent = '👁️';
                  
                  // Debug: verificar se as respostas foram criadas corretamente
                  const answersAfterGeneration = out.querySelectorAll('.answers');
                  console.log('🔍 Respostas encontradas após geração:', answersAfterGeneration.length);
                  if (answersAfterGeneration.length === 0) {
                    console.warn('⚠️ ATENÇÃO: Nenhuma resposta com classe .answers foi encontrada!');
                    console.log('📄 HTML gerado:', out.innerHTML);
                  }
                  
                  // Mostrar botão PDF após gerar exercícios
                  savePdfBtn.style.display = '';
                  
                  console.log('✅ Exercícios gerados automaticamente para tipo:', kind);
                  
                } catch (e) {
                  out.innerHTML = `<div class="hint">Erro ao gerar exercícios automaticamente: ${e.message}</div>`;
                  console.error('❌ Erro na geração automática:', e);
                }
              }
              
              // Event listener para mudança de tipo - GERAÇÃO AUTOMÁTICA
              typeSel.addEventListener('change', async () => {
                syncFields();
                // Gerar exercícios automaticamente quando mudar o tipo
                await generateExercisesAutomatically();
              });

              // Toggle respostas (olho) - por padrão oculto
              let answersVisible = false;
              toggle.addEventListener('click', () => {
                answersVisible = !answersVisible;
                
                // Debug: verificar se existem elementos .answers
                const answers = out.querySelectorAll('.answers');
                console.log('🔍 Elementos .answers encontrados:', answers.length);
                
                if (answers.length === 0) {
                  console.warn('⚠️ Nenhum elemento .answers encontrado! Verificando estrutura HTML...');
                  console.log('📄 HTML atual:', out.innerHTML);
                  
                  // Tentar encontrar respostas com outros seletores
                  const possibleAnswers = out.querySelectorAll('[class*="answer"], [class*="resposta"], [class*="gabarito"]');
                  console.log('🔍 Possíveis elementos de resposta encontrados:', possibleAnswers.length);
                  
                  if (possibleAnswers.length > 0) {
                    possibleAnswers.forEach(a => a.style.display = answersVisible ? '' : 'none');
                toggle.textContent = answersVisible ? '🙈' : '👁️';
                    console.log('✅ Respostas encontradas e alternadas com seletores alternativos');
                    return;
                  }
                  
                  // Se não encontrar respostas, mostrar aviso
                  alert('⚠️ Nenhuma seção de respostas encontrada nos exercícios. Verifique se a IA gerou o formato correto.');
                  return;
                }
                
                // Alternar visibilidade das respostas
                answers.forEach(a => {
                  a.style.display = answersVisible ? '' : 'none';
                  console.log('🔄 Alternando visibilidade da resposta:', a.style.display);
                });
                
                // Atualizar ícone do botão
                toggle.textContent = answersVisible ? '🙈' : '👁️';
                
                console.log('✅ Respostas alternadas. Visível:', answersVisible);
              });

              btn.addEventListener('click', async () => {
                btn.disabled = true; btn.textContent = 'Gerando...';
                try {
                  // Coleta de conteúdo das abas já carregadas
                  const collected = [];
                    const base = (baseSel && baseSel.value) ? baseSel.value : 'normal';
                    const tabsToRead = [base];
                  tabsToRead.forEach(key => {
                    const el = nodeSlider.querySelector(`.tab-content[data-tab-content="${key}"]`);
                    if (el && el.dataset.loading === '1') {
                      collected.push(`--- ${key.toUpperCase()} ---\n` + el.textContent.trim().slice(0, 4000));
                    }
                  });
                  const contextText = collected.join('\n\n');
                  const kind = typeSel.value;
                  const nDisc = Math.max(1, parseInt(qtdDisc.value||'5',10));
                  const nMult = Math.max(1, parseInt(qtdMult.value||'5',10));
                  const nOpts = Math.min(8, Math.max(2, parseInt(qtdOpts.value||'4',10)));

                  // Prompt para a IA: pede div .answers para respostas
                  let exPrompt = `Com base no conteúdo abaixo (use apenas como referência), gere EXERCÍCIOS sobre o tópico "${nodeLabel}" do mapa "${mapTitle}".\n\nCONTEXTO:\n${contextText}\n\n`;
                  if (kind === 'discursiva') {
                    exPrompt += `Formato: Markdown com seção "Perguntas" contendo ${nDisc} perguntas discursivas claras e desafiadoras. Em seguida, crie uma seção <div class=\"answers\">"Respostas"</div> com respostas modelo curtas (2-4 frases). Não misture soluções no enunciado.`;
                  } else {
                    exPrompt += `Formato: Markdown com seção "Perguntas" contendo ${nMult} questões de múltipla escolha, cada uma com ${nOpts} opções (A..). Apenas UMA correta por questão. Após as perguntas, crie uma seção <div class=\"answers\">"Respostas"</div> listando: número da questão, alternativa correta e explicação em 1-2 frases. IMPORTANTE: Use exatamente a classe "answers" na div das respostas.`;
                  }

                  guardProvider();
                  const exMd = await window.AI.chatPlain({ provider: state.provider, apiKey: state.apiKey, model: state.model, message: exPrompt, temperature: 0.2 });
                  const html = await renderMd(exMd);
                  out.innerHTML = html;
                    // Ocultar respostas por padrão
                    out.querySelectorAll('.answers').forEach(a => a.style.display = 'none');
                    toggle.textContent = '👁️';
                    
                    // Mostrar botão PDF após gerar exercícios
                    savePdfBtn.style.display = '';
                } catch (e) {
                  out.innerHTML = `<div class="hint">Erro: ${e.message}</div>`;
                } finally {
                  btn.disabled = false; btn.textContent = 'Gerar Exercícios';
                }
              });

              // Event listener para salvar PDF
              savePdfBtn.addEventListener('click', () => {
                try {
                  console.log('🔄 Iniciando criação de PDF...');
                  
                  const includeAnswers = true; // Sempre incluir gabarito
                  const exerciseType = typeSel.value;
                  const mapTitle = state.currentMap?.title || 'Mapa Mental';
                  const currentNodeLabel = nodeLabel || 'Nó';
                  
                  // Criar título do PDF usando melhor método para substituir "nó"
                  const pdfTitle = `${mapTitle} - Exercícios sobre ${currentNodeLabel}`;
                  console.log('📄 Título do PDF:', pdfTitle);
                  
                  // Método 1: Tentar jsPDF primeiro
                  if (typeof window.jsPDF !== 'undefined') {
                    createPDFWithJsPDF();
                    return;
                  }
                  
                  // Método 2: Carregar jsPDF dinamicamente com múltiplas tentativas
                  loadJsPDFAndCreate();
                  
                  function loadJsPDFAndCreate() {
                    console.log('🔄 Carregando jsPDF dinamicamente...');
                    
                    // Tentar múltiplas URLs
                    const jsPDFUrls = [
                      './libs/jspdf.min.js',
                      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
                      'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js'
                    ];
                    
                    let currentUrlIndex = 0;
                    
                    function tryNextUrl() {
                      if (currentUrlIndex >= jsPDFUrls.length) {
                        console.log('⚠️ jsPDF não carregou, usando método alternativo...');
                        createPDFWithPrintAPI();
                        return;
                      }
                      
                      const script = document.createElement('script');
                      script.src = jsPDFUrls[currentUrlIndex];
                      script.onload = () => {
                        console.log('✅ jsPDF carregado de:', jsPDFUrls[currentUrlIndex]);
                        if (typeof window.jsPDF !== 'undefined') {
                          createPDFWithJsPDF();
                        } else {
                          currentUrlIndex++;
                          tryNextUrl();
                        }
                      };
                      script.onerror = () => {
                        console.log('❌ Falha ao carregar:', jsPDFUrls[currentUrlIndex]);
                        currentUrlIndex++;
                        tryNextUrl();
                      };
                      document.head.appendChild(script);
                    }
                    
                    tryNextUrl();
                  }
                  
                  function createPDFWithJsPDF() {
                    try {
                      console.log('📄 Criando PDF com jsPDF...');
                      const doc = new window.jsPDF();
                      
                      // Configurar fonte e tamanho
                      doc.setFontSize(16);
                      doc.text(pdfTitle, 20, 20);
                      
                      // Adicionar linha separadora
                      doc.setLineWidth(0.5);
                      doc.line(20, 25, 190, 25);
                      
                      // Preparar conteúdo para PDF
                      const exerciseContent = out.innerHTML;
                      
                      // Converter HTML para texto simples para PDF
                      const tempDiv = document.createElement('div');
                      tempDiv.innerHTML = exerciseContent;
                      
                      // Remover respostas se não incluir gabarito
                      if (!includeAnswers) {
                        const answersElements = tempDiv.querySelectorAll('.answers');
                        answersElements.forEach(answer => answer.remove());
                      }
                      
                      // Extrair texto limpo
                      const cleanText = tempDiv.textContent || tempDiv.innerText || '';
                      
                      if (!cleanText.trim()) {
                        alert('Erro: Nenhum conteúdo encontrado para salvar em PDF.');
                        return;
                      }
                      
                      // Dividir texto em linhas para o PDF
                      const lines = doc.splitTextToSize(cleanText, 170);
                      
                      // Adicionar conteúdo ao PDF
                      doc.setFontSize(10);
                      let yPosition = 35;
                      const pageHeight = doc.internal.pageSize.height;
                      
                      lines.forEach((line, index) => {
                        if (yPosition > pageHeight - 20) {
                          doc.addPage();
                          yPosition = 20;
                        }
                        doc.text(line, 20, yPosition);
                        yPosition += 6;
                      });
                      
                      // Salvar PDF
                      const fileName = `${pdfTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`;
                      doc.save(fileName);
                      
                      console.log('✅ PDF salvo com sucesso:', fileName);
                      alert(`PDF salvo com sucesso: ${fileName}`);
                      
                    } catch (error) {
                      console.error('❌ Erro ao criar PDF com jsPDF:', error);
                      console.log('🔄 Tentando método alternativo...');
                      createPDFWithPrintAPI();
                    }
                  }
                  
                  function createPDFWithPrintAPI() {
                    console.log('🔄 Criando PDF com Print API...');
                    
                    // Criar uma nova janela para impressão
                    const printWindow = window.open('', '_blank');
                    
                    // Preparar conteúdo para impressão
                    const exerciseContent = out.innerHTML;
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = exerciseContent;
                    
                    // Remover respostas se não incluir gabarito
                    if (!includeAnswers) {
                      const answersElements = tempDiv.querySelectorAll('.answers');
                      answersElements.forEach(answer => answer.remove());
                    }
                    
                    // Criar HTML para impressão
                    const printHTML = `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>${pdfTitle}</title>
                        <style>
                          @media print {
                            @page { margin: 1in; }
                            body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.4; }
                            h1 { font-size: 18pt; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
                            h2 { font-size: 14pt; margin-top: 20px; margin-bottom: 10px; }
                            p { margin-bottom: 8px; }
                            .answers { margin-top: 15px; padding-top: 10px; border-top: 1px solid #ccc; }
                          }
                          body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.4; margin: 20px; }
                          h1 { font-size: 18pt; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
                          h2 { font-size: 14pt; margin-top: 20px; margin-bottom: 10px; }
                          p { margin-bottom: 8px; }
                          .answers { margin-top: 15px; padding-top: 10px; border-top: 1px solid #ccc; }
                        </style>
                      </head>
                      <body>
                        <h1>${pdfTitle}</h1>
                        ${tempDiv.innerHTML}
                      </body>
                      </html>
                    `;
                    
                    printWindow.document.write(printHTML);
                    printWindow.document.close();
                    
                    // Aguardar carregamento e imprimir
                    printWindow.onload = () => {
                      setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                        console.log('✅ PDF gerado via Print API');
                        alert('PDF gerado! Use "Salvar como PDF" na janela de impressão.');
                      }, 500);
                    };
                  }
                  
                } catch (error) {
                  console.error('❌ Erro ao salvar PDF:', error);
                  alert(`Erro ao salvar PDF: ${error.message}`);
                }
              });

              target.dataset.loading = '1';
            }
            return;
          }

          // if content already loaded, do nothing
          if (target.dataset.loading === '1') {
            console.log('🔄 Conteúdo já carregado para aba:', tab);
            return;
          }
          // set loading flag to avoid duplicate calls
          target.dataset.loading = '1';
          console.log('🔄 Carregando conteúdo para aba:', tab);
          // generate appropriate prompt per tab
          let rolePrompt = '';
          if (tab === 'tecnico') {
            rolePrompt = `Mode: Técnico. Gere UMA VERSÃO TÉCNICA E DETALHADA EM MARKDOWN sobre o nó "${nodeLabel}" do mapa "${mapTitle}". Use terminologia especializada, referências e rigor metodológico; inclua referências e notas técnicas quando aplicável. Responda SOMENTE com MARKDOWN.`;
          } else if (tab === 'leigo') {
            rolePrompt = `Mode: Leigo. Gere UMA VERSÃO ACLARADA EM MARKDOWN sobre o nó "${nodeLabel}" do mapa "${mapTitle}", sem jargões, usando metáforas e exemplos cotidianos para explicar conceitos complexos de forma acessível. Responda SOMENTE com MARKDOWN.`;
          } else if (tab === 'palestra') {
            rolePrompt = `Mode: Palestra. Gere UM ROTEIRO FALADO EM PRIMEIRA PESSOA (português) para uma palestra sobre o nó "${nodeLabel}" do mapa "${mapTitle}". Deve ser didático, fluido e envolvente, com analogias, exemplos práticos, perguntas retóricas, pausas implícitas, estrutura narrativa clara e encerramento com convite à reflexão. Formate em MARKDOWN e inclua ao final a frase "[GERAR_QUIZ_PLS]" sinalizando que o frontend pode gerar um quiz ao clicar no botão.`;
          } else {
            rolePrompt = fullPrompt;
          }
          try {
            console.log('🤖 Enviando prompt para IA:', rolePrompt.substring(0, 100) + '...');
            guardProvider();
            const resp = await window.AI.chatPlain({ provider: state.provider, apiKey: state.apiKey, model: state.model, message: rolePrompt, temperature: 0.2 });
            console.log('✅ Resposta da IA recebida:', resp.substring(0, 100) + '...');
            const html = await renderMd(resp);
            target.innerHTML = html + (tab === 'palestra' ? `<div style="margin-top:12px"><button class="btn primary generate-quiz">Gerar Quiz</button><div class="quiz-area" style="margin-top:12px"></div></div>` : '');
            
            // ✅ SALVAR CONTEÚDO NO LOCALSTORAGE (OFFLINE)
            saveTabContentToStorage(nodeLabel, tab, html);
            
            console.log('✅ Conteúdo renderizado na aba:', tab);
            // wire quiz button if present
            if (tab === 'palestra') {
              const qbtn = target.querySelector('.generate-quiz');
              const qarea = target.querySelector('.quiz-area');
              qbtn.addEventListener('click', async () => {
                qbtn.disabled = true;
                qbtn.textContent = 'Gerando quiz...';
                // ask LLM to produce 4 questions (MC or T/F) with answers + short explanations
                const quizPrompt = `Com base no roteiro de palestra sobre "${nodeLabel}" (use apenas o conteúdo do roteiro), gere um pequeno questionário com 4 perguntas: misture múltipla escolha (com 3-4 opções) e verdadeiro/falso, e após as perguntas forneça as respostas corretas numeradas com explicações curtas (1-2 frases cada). Formate a saída em MARKDOWN com seção "Quiz" e seção "Respostas".`;
                try {
                  guardProvider();
                  const quizMd = await window.AI.chatPlain({ provider: state.provider, apiKey: state.apiKey, model: state.model, message: quizPrompt, temperature: 0.2 });
                  const qhtml = await renderMd(quizMd);
                  qarea.innerHTML = qhtml;
                } catch (errQ) {
                  qarea.innerHTML = `<div class="hint">Erro ao gerar quiz: ${errQ.message}</div>`;
                } finally {
                  qbtn.disabled = false;
                  qbtn.textContent = 'Gerar Quiz';
                }
              });
            }
          } catch (errTab) {
            console.error('❌ Erro ao carregar conteúdo da aba:', tab, errTab);
            target.innerHTML = `<div class="hint">Erro: ${errTab.message}</div>`;
          }
        });
        // mark normal content as loaded
        nodeSlider.querySelector(`.tab-content[data-tab-content="normal"]`).dataset.loading = '1';
      } catch (err) {
        nodeSlider.querySelector('.node-slider-content').innerHTML = `<div class="hint">Erro: ${err.message}</div>`;
      }
    });
  }
  
  // Add-child button behavior: prompt for label, insert into state.currentMap and rerender
  const addBtn = tooltip.querySelector('.add-child');
  addBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    // create a context popup near the anchor (reusable component)
    const popup = document.createElement('div');
    popup.className = 'context-popup';
    const nodeLabel = node.data('label') || '';
    popup.innerHTML = `
      <label class="cp-label">Rótulo do novo subnó para "${escapeHtml(nodeLabel)}"</label>
      <input class="cp-input" type="text" aria-label="Rótulo do novo subnó" />
      <div class="cp-actions">
        <button class="btn cp-ok" data-action="ok">OK</button>
        <button class="btn ghost cp-cancel" data-action="cancel">Cancelar</button>
      </div>`;
    overlaysRoot.appendChild(popup);
    // position and adapt to viewport
    function place() {
      const pos = node.renderedPosition();
      const containerRect = mapContainer.getBoundingClientRect();
      // base coords relative to overlaysRoot
      let left = pos.x + 28;
      let top = pos.y - 12;
      // ensure popup stays inside viewport area of container
      const pw = Math.min(360, Math.max(240, window.innerWidth * 0.28));
      popup.style.width = pw + 'px';
      const rightOverflow = left + pw - containerRect.width;
      if (rightOverflow > 0) left -= (rightOverflow + 16);
      if (left < 8) left = 8;
      // vertical constraints
      const ph = popup.offsetHeight || 120;
      if (top + ph > containerRect.height - 8) top = Math.max(8, containerRect.height - ph - 8);
      popup.style.left = left + 'px';
      popup.style.top = top + 'px';
    }
    // small delay to allow CSS to compute size then place
    requestAnimationFrame(() => { place(); popup.querySelector('.cp-input').focus(); });

    // handlers
    function cleanup() {
      document.removeEventListener('keydown', onKey);
      overlaysRoot.removeEventListener('click', onOutside);
      window.removeEventListener('resize', place);
      try { popup.remove(); } catch {}
    }
    function onOutside(e) {
      if (!e.target.closest('.context-popup') && !e.target.closest('.node-info')) {
        popup.classList.add('closing');
        setTimeout(() => cleanup(), 180);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        popup.classList.add('closing');
        setTimeout(() => cleanup(), 180);
      } else if (e.key === 'Enter') {
        const val = popup.querySelector('.cp-input').value.trim();
        if (val) okAction(val);
      }
    }
    overlaysRoot.addEventListener('click', onOutside);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', place);

    // action logic: adds child in the map JSON, re-renders and persists if needed
    function okAction(label) {
      // ensure state.currentMap exists
      state.currentMap = state.currentMap || { title: 'Mapa Mental', nodes: [{ id: 'root', label: state.currentMap?.nodes?.[0]?.label || 'Mapa', children: [] }] };
      function findAndAppend(obj) {
        if (!obj) return false;
        if (obj.id === node.id() || obj.label === node.data('label')) {
          obj.children = obj.children || [];
          const nid = crypto.randomUUID();
          
          // Aplicar numeração automática baseada no nó pai
          let numberedLabel = label;
          if (obj.id !== 'root') {
            // Se não é o root, calcular numeração baseada no pai
            const parentPrefix = window.AI.extractNumberingPrefix ? window.AI.extractNumberingPrefix(obj.label) : '';
            const nextNumber = window.AI.getNextChildNumber ? window.AI.getNextChildNumber(obj) : 1;
            
            if (parentPrefix) {
              numberedLabel = `${parentPrefix}.${nextNumber} - ${label}`;
            } else {
              numberedLabel = `${nextNumber} - ${label}`;
            }
          } else {
            // Se é filho do root, usar numeração simples
            const nextNumber = window.AI.getNextChildNumber ? window.AI.getNextChildNumber(obj) : 1;
            numberedLabel = `${nextNumber} - ${label}`;
          }
          
          obj.children.push({ id: nid, label: numberedLabel, children: [] });
          return true;
        }
        const kids = obj.children || [];
        for (let k of kids) { if (findAndAppend(k)) return true; }
        return false;
      }
      const rootObj = state.currentMap.nodes[0];
      if (findAndAppend(rootObj)) {
        renderAndAttach(state.currentMap);
        if (state.currentMapId) {
          const stored = window.Storage.GeraMapas.getMap(state.currentMapId);
          if (stored) window.Storage.GeraMapas.updateMap(state.currentMapId, { title: stored.title, data: state.currentMap });
        }
      } else {
        // graceful fallback
        console.warn('Não foi possível localizar o nó no JSON do mapa para adicionar subnó.');
      }
      popup.classList.add('closing');
      setTimeout(() => cleanup(), 160);
    }

    // wire buttons
    popup.querySelector('.cp-ok').addEventListener('click', () => {
      const val = popup.querySelector('.cp-input').value.trim();
      if (val) okAction(val);
    });
    popup.querySelector('.cp-cancel').addEventListener('click', () => {
      popup.classList.add('closing');
      setTimeout(() => cleanup(), 160);
    });
  });

  // Generate Image prompt popup
  const genBtn = tooltip.querySelector('.gen-image');
  if (genBtn) {
    genBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // build prompt in English from node and map context
      const nodeLabel = node.data('label') || '';
      const mapTitle = (mapJson && mapJson.title) ? mapJson.title : 'Mind Map';
      const parents = node.incomers('node').map(n=>n.data('label')).filter(Boolean);
      const children = node.outgoers('node').map(n=>n.data('label')).filter(Boolean);
      const desc = tooltip.dataset.rawMarkdown || '';
      const promptText = generateImagePromptEnglish({ title: mapTitle, node: nodeLabel, parents, children, desc });
      // show lightweight popup with prompt (reuses context-popup style)
      const p = document.createElement('div'); p.className = 'context-popup';
      p.innerHTML = `<div style="max-height:50vh;overflow:auto"><label class="cp-label">Image prompt (English)</label><textarea class="cp-input" rows="6">${escapeHtml(promptText)}</textarea></div>
                     <div class="cp-actions"><button class="btn cp-ok" data-action="copy">Copiar</button><button class="btn ghost cp-cancel" data-action="close">Fechar</button></div>`;
      overlaysRoot.appendChild(p);
      // position near anchor
      requestAnimationFrame(()=> {
        const pos = node.renderedPosition();
        p.style.left = Math.min(mapContainer.clientWidth - 320, Math.max(8, pos.x + 28)) + 'px';
        p.style.top = Math.max(8, pos.y - 12) + 'px';
      });
      p.querySelector('.cp-ok').addEventListener('click', async () => {
        const txt = p.querySelector('.cp-input').value || '';
        try { await navigator.clipboard.writeText(txt); p.querySelector('.cp-ok').textContent = 'Copiado'; setTimeout(()=>p.remove(),1200); } catch { alert('Falha ao copiar.'); }
      });
      p.querySelector('.cp-cancel').addEventListener('click', ()=>p.remove());
    });
  }

  // Upload Image handling (file picker + resize + attach to node)
  const uploadBtn = tooltip.querySelector('.upload-image');
  if (uploadBtn) {
    uploadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // create or reuse hidden file input
      let fin = document.getElementById('node-image-input');
      if (!fin) {
        fin = document.createElement('input');
        fin.type = 'file'; fin.accept = 'image/png,image/jpeg'; fin.id = 'node-image-input';
        fin.style.display = 'none';
        document.body.appendChild(fin);
      }
      fin.onchange = async (evt) => {
        const f = evt.target.files && evt.target.files[0];
        fin.value = '';
        if (!f) return;
        try {
          const dataUrl = await resizeImageFileToSquareDataURL(f, 120); // 120x120 fixed
          // attach to node in state.currentMap
          if (!state.currentMap) state.currentMap = { title: 'Mapa Mental', nodes: [{ id: 'root', label: state.currentMap?.nodes?.[0]?.label || 'Mapa', children: [] }] };
          const success = attachImageToNodeInMap(state.currentMap, node.id(), dataUrl);
          if (success) {
            renderAndAttach(state.currentMap);
            // persist if currently saved
            if (state.currentMapId) {
              const stored = window.Storage.GeraMapas.getMap(state.currentMapId);
              if (stored) { stored.data = state.currentMap; window.Storage.GeraMapas.deleteMap(state.currentMapId); window.Storage.GeraMapas.saveMap({ title: stored.title, data: stored.data }); }
            }
          } else {
            alert('Não foi possível localizar o nó no mapa para associar a imagem.');
          }
        } catch (err) { alert('Erro ao processar imagem: ' + (err && err.message ? err.message : err)); }
      };
      fin.click();
    });
  }
}

// Função para posicionar tooltip de forma responsiva
function positionTooltipResponsively(tooltip, anchorEl) {
  const tooltipRect = tooltip.getBoundingClientRect();
  const anchorRect = anchorEl.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Posição inicial baseada no anchor
  let left = anchorRect.right + 12;
  let top = anchorRect.top;
  
  // Ajustar se sair da tela à direita
  if (left + tooltipRect.width > viewportWidth) {
    left = anchorRect.left - tooltipRect.width - 12;
  }
  
  // Ajustar se sair da tela à esquerda
  if (left < 0) {
    left = 12;
  }
  
  // Ajustar se sair da tela embaixo
  if (top + tooltipRect.height > viewportHeight) {
    top = viewportHeight - tooltipRect.height - 12;
  }
  
  // Ajustar se sair da tela em cima
  if (top < 0) {
    top = 12;
  }
  
  // Aplicar posição
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
  tooltip.style.right = 'auto';
  tooltip.style.bottom = 'auto';
}

// Função para habilitar drag & drop no tooltip
function enableTooltipDrag(tooltip) {
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  const header = tooltip.querySelector('.node-tooltip-header');
  
  if (!header) return;
  
  // Mouse events
  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    tooltip.classList.add('dragging');
    const rect = tooltip.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    let left = e.clientX - dragOffset.x;
    let top = e.clientY - dragOffset.y;
    
    // Limitar movimento dentro da tela
    const tooltipRect = tooltip.getBoundingClientRect();
    left = Math.max(0, Math.min(window.innerWidth - tooltipRect.width, left));
    top = Math.max(0, Math.min(window.innerHeight - tooltipRect.height, top));
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.style.right = 'auto';
    tooltip.style.bottom = 'auto';
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      tooltip.classList.remove('dragging');
    }
  });
  
  // Touch events
  header.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    isDragging = true;
    tooltip.classList.add('dragging');
    const rect = tooltip.getBoundingClientRect();
    dragOffset.x = touch.clientX - rect.left;
    dragOffset.y = touch.clientY - rect.top;
    e.preventDefault();
  }, { passive: false });
  
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    let left = touch.clientX - dragOffset.x;
    let top = touch.clientY - dragOffset.y;
    
    // Limitar movimento dentro da tela
    const tooltipRect = tooltip.getBoundingClientRect();
    left = Math.max(0, Math.min(window.innerWidth - tooltipRect.width, left));
    top = Math.max(0, Math.min(window.innerHeight - tooltipRect.height, top));
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.style.right = 'auto';
    tooltip.style.bottom = 'auto';
    e.preventDefault();
  }, { passive: false });
  
  document.addEventListener('touchend', () => {
    if (isDragging) {
      isDragging = false;
      tooltip.classList.remove('dragging');
    }
  });
}

/* Close tooltip when clicking outside */
document.addEventListener('click', (e) => {
    if (!currentTooltip) return;
    const isTooltip = e.target.closest('.node-tooltip');
    const isIcon = e.target.closest('.node-info');
    if (!isTooltip && !isIcon) {
      currentTooltip.remove();
      currentTooltip = null;
    }
  });

// Fechar tooltip com Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentTooltip) {
    currentTooltip.remove();
    currentTooltip = null;
  }
});

/* slider close button behavior - will be set after nodeSlider is created */

/* Node slider resize functionality */
let nodeSliderResizing = false;
let nodeSliderResizeType = '';
let nodeSliderResizeStart = { x: 0, y: 0, width: 0, height: 0 };

const resizeHandles = nodeSlider.querySelectorAll('.node-slider-resize-handle');

resizeHandles.forEach(handle => {
  handle.addEventListener('mousedown', (e) => {
    nodeSliderResizing = true;
    nodeSliderResizeType = handle.classList.contains('resize-right') ? 'right' : 
                          handle.classList.contains('resize-bottom') ? 'bottom' : 'corner';
    
    nodeSliderResizeStart.x = e.clientX;
    nodeSliderResizeStart.y = e.clientY;
    nodeSliderResizeStart.width = nodeSlider.offsetWidth;
    nodeSliderResizeStart.height = nodeSlider.offsetHeight;
    
    e.preventDefault();
  });
});

document.addEventListener('mousemove', (e) => {
  if (!nodeSliderResizing) return;
  
  const deltaX = e.clientX - nodeSliderResizeStart.x;
  const deltaY = e.clientY - nodeSliderResizeStart.y;
  
  let newWidth = nodeSliderResizeStart.width;
  let newHeight = nodeSliderResizeStart.height;
  
  if (nodeSliderResizeType === 'right' || nodeSliderResizeType === 'corner') {
    newWidth = Math.max(400, Math.min(window.innerWidth, nodeSliderResizeStart.width + deltaX));
  }
  
  if (nodeSliderResizeType === 'bottom' || nodeSliderResizeType === 'corner') {
    newHeight = Math.max(600, Math.min(window.innerHeight - 100, nodeSliderResizeStart.height + deltaY));
  }
  
  nodeSlider.style.width = newWidth + 'px';
  nodeSlider.style.height = newHeight + 'px';
});

document.addEventListener('mouseup', () => {
  if (nodeSliderResizing) {
    nodeSliderResizing = false;
    nodeSliderResizeType = '';
  }
});

/* Allow closing slider by Esc */
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const s = document.querySelector('.node-slider');
    if (s && s.classList.contains('open')) s.classList.remove('open');
  }
});

/* Model selector drag functionality */
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

  modelSelector.addEventListener('mousedown', (e) => {
  if (e.target.closest('.model-selector-body') || e.target.closest('.model-selector-close')) return;
  isDragging = true;
  const rect = modelSelector.getBoundingClientRect();
  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;
  modelSelector.classList.add('dragging');
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const x = e.clientX - dragOffset.x;
  const y = e.clientY - dragOffset.y;
  modelSelector.style.left = Math.max(0, Math.min(window.innerWidth - modelSelector.offsetWidth, x)) + 'px';
  modelSelector.style.top = Math.max(0, Math.min(window.innerHeight - modelSelector.offsetHeight, y)) + 'px';
  modelSelector.style.right = 'auto';
  });

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    modelSelector.classList.remove('dragging');
  }
});

/* accordion header behavior: toggle accordion content and arrow (keep draggable) */
const msHeader = modelSelector ? modelSelector.querySelector('.model-selector-header') : null;
const msArrow = modelSelector ? modelSelector.querySelector('.model-selector-arrow') : null;
const msContent = modelSelector ? modelSelector.querySelector('.accordion-content') : null;

if (msHeader && msArrow) {
  msHeader.addEventListener('click', (ev) => {
    if (ev.target.closest('.model-selector-close')) return;
    const collapsed = modelSelector.classList.toggle('collapsed');
    msArrow.textContent = collapsed ? '↓' : '↑';
  });

  /* allow keyboard toggling for accessibility */
  msHeader.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter' || ev.key === ' ') {
    ev.preventDefault();
    msHeader.click();
  }
  });
}

/* Model selection */
if (modelOptions && modelOptions.length > 0) {
  modelOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      modelOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      state.currentModel = opt.dataset.model;
      if (state.currentMap) {
        renderAndAttach(state.currentMap);
      }
    });
  });
}

if (closeModelSelector) {
  closeModelSelector.addEventListener('click', () => {
    if (modelSelector) {
      modelSelector.classList.remove('open');
    }
  });
}

/* attach icons after initial load if currentMap exists */
if (state.currentMap) {
  buildNodeInfoIcons(state.currentMap);
  deleteMapBtn.disabled = false;
} else {
  deleteMapBtn.disabled = true;
}
/* hide model selector initially */
if (modelSelector) {
  modelSelector.classList.remove('open');
}

// Código do sidebar antigo removido - não existe mais no novo layout CSS Grid

/* Export helpers */
async function exportMap(format) {
  try {
    // ✅ Verificações de segurança
    if (!state.currentMap) {
      throw new Error('Nenhum mapa carregado para exportar');
    }
    
    if (!state.cy) {
      throw new Error('Cytoscape não inicializado');
    }
    
    console.log(`🔄 Iniciando exportação: ${format}`);
    
    // ✅ Formatos de texto (não precisam de imagem)
  if (format === 'json') {
    const payload = mapToStructuredJSON(state.currentMap);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    downloadBlob(blob, (state.currentMap.title || 'mapa_exportado') + '.json');
    return;
  }
    
  if (format === 'xml') {
    const xml = mapToXML(state.currentMap);
    const blob = new Blob([xml], { type: 'application/xml' });
    downloadBlob(blob, (state.currentMap.title || 'mapa_exportado') + '.xml');
    return;
  }
    
  if (format === 'mmd') {
    const mmd = mapToMermaid(state.currentMap);
    const blob = new Blob([mmd], { type: 'text/plain' });
    downloadBlob(blob, (state.currentMap.title || 'mapa_exportado') + '.mmd');
    return;
  }
    
    // ✅ Formatos de imagem (precisam de PNG do Cytoscape)
    console.log('🖼️ Gerando imagem PNG...');
  const pngData = state.cy.png({ full: true, scale: 2, output: 'blob' });
    
    if (!pngData) {
      throw new Error('Falha na geração da imagem PNG');
    }
    
    // ✅ Garantir que temos um Blob
  const blob = pngData instanceof Blob ? pngData : dataURLtoBlob(state.cy.png({ full: true, scale: 2 }));
    
    if (!blob) {
      throw new Error('Falha na criação do Blob da imagem');
    }
    
    // ✅ PNG
  if (format === 'png') {
    downloadBlob(blob, (state.currentMap.title || 'mapa') + '.png');
    return;
  }
    
    // ✅ JPG
  if (format === 'jpg') {
      console.log('🔄 Convertendo PNG→JPG...');
    const jpegBlob = await convertBlobToJpeg(blob, 0.92);
    downloadBlob(jpegBlob, (state.currentMap.title || 'mapa') + '.jpg');
    return;
  }
    
    // ✅ HTML
  if (format === 'html') {
      console.log('🔄 Criando HTML...');
    const dataUrl = await blobToDataURL(blob);
    const html = `<!doctype html><meta charset="utf-8"><title>${escapeHtml(state.currentMap.title||'Mapa')}</title><style>body{margin:0;padding:16px;font-family:Inter,system-ui,Arial;background:#fff}img{max-width:100%;height:auto;border:1px solid #ddd;border-radius:8px}</style><h1>${escapeHtml(state.currentMap.title||'Mapa')}</h1><img src="${dataUrl}" alt="Mapa Mental"/></html>`;
    const hBlob = new Blob([html], { type: 'text/html' });
    downloadBlob(hBlob, (state.currentMap.title || 'mapa') + '.html');
    return;
  }
    
    // ✅ PDF
  if (format === 'pdf') {
      console.log('🔄 Criando PDF...');
      if (!window.jspdf || !window.jspdf.jsPDF) {
        throw new Error('jsPDF não carregado. Recarregue a página.');
      }
      
    const { jsPDF } = window.jspdf;
    const dataUrl = await blobToDataURL(blob);
    const img = await loadImage(dataUrl);
      
      const pdf = new jsPDF({ 
        orientation: img.width > img.height ? 'landscape' : 'portrait', 
        unit: 'pt', 
        format: [img.width, img.height] 
      });
      
    pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
    const pdfBlob = pdf.output('blob');
    downloadBlob(pdfBlob, (state.currentMap.title || 'mapa') + '.pdf');
    return;
  }
    
    throw new Error(`Formato desconhecido: ${format}`);
    
  } catch (error) {
    console.error('❌ Erro na exportação:', error);
    throw error; // Re-throw para que handleExport possa capturar
  }
}

/* small utilities */
function dataURLtoBlob(dataurl) {
  try {
    if (!dataurl || typeof dataurl !== 'string') {
      throw new Error('DataURL inválido');
    }
    
    const arr = dataurl.split(',');
    if (arr.length !== 2) {
      throw new Error('Formato de DataURL inválido');
    }
    
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Tipo MIME não encontrado no DataURL');
    }
    
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    
  return new Blob([u8arr], { type: mime });
  } catch (error) {
    console.error('❌ Erro na conversão DataURL→Blob:', error);
    throw new Error(`Falha na conversão: ${error.message}`);
  }
}
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    try {
      if (!blob || !(blob instanceof Blob)) {
        reject(new Error('Blob inválido'));
        return;
      }
      
    const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = (error) => reject(new Error(`Erro na leitura do Blob: ${error.message}`));
    fr.readAsDataURL(blob);
    } catch (error) {
      reject(new Error(`Falha na conversão Blob→DataURL: ${error.message}`));
    }
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    try {
      if (!dataUrl || typeof dataUrl !== 'string') {
        reject(new Error('DataURL inválido'));
        return;
      }
      
    const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(new Error(`Erro ao carregar imagem: ${error.message}`));
    img.src = dataUrl;
    } catch (error) {
      reject(new Error(`Falha no carregamento da imagem: ${error.message}`));
    }
  });
}
// ✅ FUNÇÃO ALTERNATIVA PARA DOWNLOAD DIRETO (MAIS ROBUSTA)
function forceDirectDownload(blob, filename) {
  try {
    if (!blob) {
      throw new Error('Blob inválido para download');
    }
    
    // ✅ Método 1: Usar URL.createObjectURL
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    a.target = '_self';
    
    // ✅ Adicionar ao DOM temporariamente
    document.body.appendChild(a);
    
    // ✅ Disparar evento de clique
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    a.dispatchEvent(clickEvent);
    
    // ✅ Limpar imediatamente
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    }, 50);
    
    console.log(`✅ Download direto forçado: ${filename}`);
    return true;
    
  } catch (error) {
    console.error('❌ Erro no download direto:', error);
    
    // ✅ Método 2: Fallback usando window.open (se necessário)
    try {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      console.log(`⚠️ Download via nova aba: ${filename}`);
      return true;
    } catch (fallbackError) {
      console.error('❌ Fallback também falhou:', fallbackError);
      throw new Error(`Falha completa no download: ${error.message}`);
    }
  }
}

function downloadBlob(blob, filename) {
  try {
    if (!blob) {
      throw new Error('Blob inválido para download');
    }
    
    // ✅ Usar função robusta para exportação de mapas (mantém funcionalidade original)
    return forceDirectDownload(blob, filename);
  } catch (error) {
    console.error('❌ Erro no download:', error);
    throw error;
  }
}
async function convertBlobToJpeg(blob, quality = 0.9) {
  try {
  const dataUrl = await blobToDataURL(blob);
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
    
    // ✅ Fundo branco para JPG
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // ✅ Desenhar imagem
  ctx.drawImage(img, 0, 0);
    
    // ✅ Converter para JPG usando Promise
    return new Promise((resolve, reject) => {
      canvas.toBlob((jpegBlob) => {
        if (jpegBlob) {
          resolve(jpegBlob);
        } else {
          reject(new Error('Falha na conversão para JPG'));
        }
      }, 'image/jpeg', quality);
    });
  } catch (error) {
    console.error('❌ Erro na conversão PNG→JPG:', error);
    throw new Error(`Erro na conversão: ${error.message}`);
  }
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

/* apply persisted theme/layout if exists */
function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement.style;
  if (theme['--bg']) root.setProperty('--bg', theme['--bg']);
  if (theme['--text']) root.setProperty('--text', theme['--text']);
  if (theme['--accent']) root.setProperty('--accent', theme['--accent']);
  if (theme['--muted']) root.setProperty('--muted', theme['--muted']);
  if (theme['--border']) root.setProperty('--border', theme['--border']);
  if (theme.fontSize) root.setProperty('--font-size-base', theme.fontSize + 'px');
  if (theme.fontFamily) root.setProperty('--font-family-main', theme.fontFamily);
  // reflect controls
  if (colorBg) colorBg.value = theme['--bg'] || colorBg.value;
  if (colorText) colorText.value = theme['--text'] || colorText.value;
  if (colorAccent) colorAccent.value = theme['--accent'] || colorAccent.value;
  if (colorMuted) colorMuted.value = theme['--muted'] || colorMuted.value;
  if (colorBorder) colorBorder.value = theme['--border'] || colorBorder.value;
  if (fontSizeSelect && theme.fontSize) fontSizeSelect.value = String(theme.fontSize);
  if (fontFamilySelect && theme.fontFamily) fontFamilySelect.value = theme.fontFamily;
}

/* apply layout preset */
function applyLayoutPreset(name) {
  document.documentElement.classList.remove('layout-compact','layout-spacious');
  if (name === 'compact') document.documentElement.classList.add('layout-compact');
  if (name === 'spacious') document.documentElement.classList.add('layout-spacious');
  // persist
  state.layout = name;
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, apiKey: state.apiKey, model: state.model, theme: state.theme, layout: state.layout });
}


/* Helper to generate English image prompt */
function generateImagePromptEnglish({ title, node, parents, children, desc }) {
  // concise, descriptive prompt with style, composition, colors
  const context = parents && parents.length ? `Context: ${parents.join(', ')}.` : '';
  const elements = children && children.length ? `Contains sub-elements: ${children.join(', ')}.` : '';
  const shortDesc = desc ? ('Description: ' + (desc.split('\n')[0] || '').replace(/[*_`]/g,'')) : '';
  // craft prompt
  return `${node} — a visually striking illustration inspired by "${title}". ${shortDesc} ${context} ${elements} Render a high-detail, cinematic composition focused on clear silhouette and color harmony; use warm mid-tone highlights with complementary accents, soft natural lighting, shallow depth of field, crisp textures, and painterly yet realistic rendering. Style suggestions: dramatic editorial photography blended with digital painting, 3:4 portrait orientation, balanced negative space, vivid but tasteful palette, no text, high visual clarity — suitable for concept art or cover illustration.`;
}

/* Attach image dataURL to node inside the map JSON by node id */
function attachImageToNodeInMap(mapJson, nodeId, dataUrl) {
  let found = false;
  function walk(obj) {
    if (!obj || found) return;
    if (obj.id === nodeId) { obj.img = dataUrl; found = true; return; }
    (obj.children || []).forEach(c => walk(c));
  }
  walk(mapJson.nodes[0]);
  return found;
}

/* Resize uploaded file to square dataURL */
function resizeImageFileToSquareDataURL(file, size = 120) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        // fill transparent/white background to avoid alpha issues
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,size,size);
        // compute cover-fit crop preserving aspect ratio (center-crop)
        const ratio = Math.max(size / img.width, size / img.height);
        const w = img.width * ratio, h = img.height * ratio;
        const dx = (size - w) / 2, dy = (size - h) / 2;
        ctx.drawImage(img, dx, dy, w, h);
        // add soft padding/shadow via CSS on node (cytoscape will display background, we keep border in styles)
        const dataUrl = canvas.toDataURL('image/png');
        res(dataUrl);
      };
      img.onerror = (e) => rej(new Error('Formato de imagem inválido'));
      img.src = reader.result;
    };
    reader.onerror = () => rej(new Error('Falha ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}

/**
 * Renders the selection UI for short script models.
 * @param {HTMLElement} targetElement - The content area for the 'roteiro' tab.
 * @param {string} nodeLabel - The label of the current node.
 * @param {string} mapTitle - The title of the current map.
 * @param {function} renderMd - Markdown rendering helper.
 */
function renderScriptModelSelector(targetElement, nodeLabel, mapTitle, renderMd) {
    // Clear any previous output or loading state
    targetElement.innerHTML = '';
    
    const modelsHtml = Object.entries(SHORT_SCRIPT_MODELS).map(([key, model]) => `
        <div class="script-model-option" data-model-key="${key}">
            <div class="option-header">
                <h4>[Roteiro ${model.label}]</h4>
                <p class="objective">Objetivo: ${model.objective}</p>
            </div>
            <p class="structure">Estrutura: ${model.structure.map(s => `<span>${s.split('.')[1].trim()}</span>`).join(' • ')}</p>
            <button class="btn small primary generate-script-btn" data-model-key="${key}">Gerar Roteiro</button>
        </div>
    `).join('');

    targetElement.innerHTML = `
        <div class="script-model-selector">
            <h3>Modelos de Roteiro Curto</h3>
            <label style="display:block;margin:8px 0;font-size:13px">Estilo Narrativo:
              <select id="scriptStyleSelect" style="margin-left:8px;padding:6px;border-radius:6px;border:1px solid var(--border)">
                <option value="normal">Normal</option>
                <option value="bem-humorado">bem-humorado</option>
                <option value="tecnico">técnico</option>
                <option value="contador de histórias">contador de histórias</option>
                <option value="provocador">provocador</option>
                <option value="calmo e sábio">calmo e sábio</option>
                <option value="energetico">energético</option>
                <option value="minimalista">minimalista</option>
                <option value="confidente">confidente</option>
                <option value="analitico">analítico</option>
                <option value="motivacional">motivacional</option>
                <option value="irreverente">irreverente</option>
                <option value="didatico">didático</option>
                <option value="misterioso">misterioso</option>
              </select>
            </label>
            <div class="model-list">${modelsHtml}</div>
        </div>
        <div class="script-output" style="display:none;"></div>
    `;
    
    // Attach listeners to generate buttons
    targetElement.querySelectorAll('.generate-script-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const key = e.target.dataset.modelKey;
            const style = (targetElement.querySelector('#scriptStyleSelect') || { value: 'normal' }).value || 'normal';
            await generateShortScript(key, targetElement, nodeLabel, mapTitle, renderMd, style);
        });
    });
}

/**
 * Generates and displays the short script content based on the chosen model.
 */
async function generateShortScript(key, targetElement, nodeLabel, mapTitle, renderMd, style = 'normal') {
    const modelDef = SHORT_SCRIPT_MODELS[key];
    if (!modelDef) return;

    const selectorArea = targetElement.querySelector('.script-model-selector');
    const outputArea = targetElement.querySelector('.script-output');

    // Hide selector, show output
    selectorArea.style.display = 'none';
    outputArea.style.display = 'block';
    
    // Show loading
    outputArea.innerHTML = `<div class="loading-state">Gerando roteiro ${modelDef.label} (Objetivo: ${modelDef.objective})...</div>`;

    const structureList = modelDef.structure.join('\n');
    
    // incorporate the selected style instruction (do not mention style name in final output)
    const styleInstr = SCRIPT_STYLES[style] ? `Use o seguinte estilo narrativo: ${SCRIPT_STYLES[style]}` : '';
    
    const scriptPrompt = `
        Você é um escritor especialista em roteiros narrativos curtos. 
        Sua tarefa é gerar um roteiro curto baseado no tópico do mapa mental: "${nodeLabel}" (contexto do mapa: "${mapTitle}").
        
        O roteiro deve seguir RIGOROSAMENTE a estrutura e ordem numérica definida abaixo, preenchendo cada um dos ${modelDef.structure.length} passos com conteúdo específico para o tópico, alinhado ao objetivo: "${modelDef.objective}".
        
        ${styleInstr}
        
        Instruções de Formato: Responda APENAS com o texto final do roteiro, formatado em MARKDOWN, utilizando uma lista numerada para cada passo da estrutura.
        
        ESTRUTURA A SER SEGUIDA:
        ${structureList}
    `;

    try {
        guardProvider();
        const scriptMd = await window.AI.chatPlain({ 
            provider: state.provider, 
            apiKey: state.apiKey, 
            model: state.model, 
            message: scriptPrompt, 
            temperature: 0.5
        });

        // The model output might already be a numbered list markdown. We render it.
        const scriptHtml = await renderMd(scriptMd);

        outputArea.innerHTML = `
            <button class="btn ghost back-to-models-btn">← Voltar aos Modelos</button>
            <div class="script-header">
                <h4>Roteiro Gerado: ${modelDef.label}</h4>
                <div class="objective">${modelDef.objective}</div>
            </div>
            <div class="generated-script-text">
                ${scriptHtml}
            </div>
            <div class="script-editor-actions">
                <textarea class="script-raw-editor" rows="15" aria-label="Editor de Roteiro Curto (Markdown)">${escapeHtml(scriptMd)}</textarea>
                <button class="btn small primary copy-script-btn">Copiar Texto</button>
            </div>
        `;
        
        // Wire back button
        outputArea.querySelector('.back-to-models-btn').addEventListener('click', () => {
            selectorArea.style.display = 'block';
            outputArea.style.display = 'none';
        });

        // Wire copy button
        outputArea.querySelector('.copy-script-btn').addEventListener('click', async (e) => {
            const editor = outputArea.querySelector('.script-raw-editor');
            try {
                await navigator.clipboard.writeText(editor.value);
                e.target.textContent = 'Copiado!';
                setTimeout(() => e.target.textContent = 'Copiar Texto', 1500);
            } catch (err) {
                alert('Falha ao copiar.');
            }
        });
        
    } catch (err) {
        outputArea.innerHTML = `
            <button class="btn ghost back-to-models-btn">← Voltar aos Modelos</button>
            <div class="hint">Erro ao gerar roteiro: ${err.message}</div>
        `;
        outputArea.querySelector('.back-to-models-btn').addEventListener('click', () => {
            selectorArea.style.display = 'block';
            outputArea.style.display = 'none';
        });
    }
}

/* New helpers to convert current map structure to JSON / XML / Mermaid */
function mapToStructuredJSON(mapJson) {
  // Ensure we export title, nodes and flattened connections (source->target)
  const out = { title: mapJson.title || 'Mapa Mental', nodes: [], connections: [] };
  const nodeMap = new Map();
  // traverse and assign stable ids
  function walk(n) {
    const id = n.id || crypto.randomUUID();
    nodeMap.set(id, { id, label: n.label || '', meta: { depth: n.depth || null } , raw: n });
    out.nodes.push({ id, label: n.label || '', img: n.img || null, children: (n.children || []).map(c => c.id || null) });
    (n.children || []).forEach(child => {
      const cid = child.id || crypto.randomUUID();
      // create connection from parent id to child id (will dedupe later)
      out.connections.push({ source: id, target: cid });
      walk(child);
    });
  }
  if (Array.isArray(mapJson.nodes) && mapJson.nodes[0]) walk(mapJson.nodes[0]);
  return out;
}

function mapToXML(mapJson) {
  // simple, readable XML structure
  const esc = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const structured = mapToStructuredJSON(mapJson);
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<map>\n  <title>${esc(structured.title)}</title>\n  <nodes>\n`;
  const byId = new Map(structured.nodes.map(n => [n.id, n]));
  for (const n of structured.nodes) {
    xml += `    <node id="${esc(n.id)}">\n      <label>${esc(n.label)}</label>\n      ${n.img ? `<image>${esc(n.img)}</image>\n      ` : ''}      <children>${(n.children||[]).map(cid => (cid?`<child id="${esc(cid)}"/>`:'')).join('')}</children>\n    </node>\n`;
  }
  xml += `  </nodes>\n  <connections>\n`;
  for (const c of structured.connections) {
    xml += `    <connection>\n      <source>${esc(c.source)}</source>\n      <target>${esc(c.target)}</target>\n    </connection>\n`;
  }
  xml += `  </connections>\n</map>\n`;
  return xml;
}

function mapToMermaid(mapJson) {
  // produce graph TD with unique ids and labels (escape special chars)
  const esc = s => String(s || '').replace(/["<>]/g, '');
  let lines = ['graph TD'];
  // walk tree and emit edges; ensure unique ids and use safe label tokens
  function walk(node, parentId) {
    const id = (node.id) ? node.id.replace(/[^a-zA-Z0-9_-]/g,'_') : ('node_' + Math.random().toString(36).slice(2,9));
    const label = esc(node.label || node.id || 'n');
    // define node line (Mermaid allows: id["Label"])
    lines.push(`  ${id}["${label}"]`);
    if (parentId) {
      lines.push(`  ${parentId} --> ${id}`);
    }
    (node.children || []).forEach(child => walk(child, id));
  }
  if (Array.isArray(mapJson.nodes) && mapJson.nodes[0]) walk(mapJson.nodes[0], null);
  return lines.join('\n');
}


function setNodeCollapsed(mapJson, nodeId, collapsed) {
  const root = mapJson.nodes[0];
  const n = window.findNodeById(root, nodeId);
  if (n) { n.isCollapsed = !!collapsed; }
}

function wireCollapseExpandEvents() {
  // collapse child on edge click
  state.cy.off('tap', 'edge');
  state.cy.on('tap', 'edge', (evt) => {
    const childId = evt.target.target().id();
    setNodeCollapsed(state.currentMap, childId, true);
    persistCurrentMap();
    renderAndAttach(state.currentMap, true); // preservar viewport ao retrair nó
  });
  // parent click opens popup of collapsed children
  state.cy.off('tap', 'node');
  state.cy.on('tap', 'node', (evt) => {
    try {
      const tappedNodeId = evt.target.id();
      // If an info button was clicked very recently for this node, ignore to avoid triggering node action.
      const now = Date.now();
      if (lastInfoClick.nodeId === tappedNodeId && (now - (lastInfoClick.time || 0) < 600)) {
        // clear marker and short-circuit
        lastInfoClick.nodeId = null;
        lastInfoClick.time = 0;
        return;
      }

      // NEW: if the event point lands over a .node-info overlay, ignore the node tap
      try {
        const orig = evt.originalEvent;
        let cx = orig && orig.clientX;
        let cyy = orig && orig.clientY;
        if ((!cx || !cyy) && orig && orig.touches && orig.touches[0]) { cx = orig.touches[0].clientX; cyy = orig.touches[0].clientY; }
        if (typeof cx === 'number' && typeof cyy === 'number') {
          const el = document.elementFromPoint(cx, cyy);
          if (el && el.closest && el.closest('.node-info')) return;
        }
      } catch (e) { /* ignore detection errors and proceed */ }

    } catch (e) { /* ignore and proceed */ }

    const pid = evt.target.id();
    const parent = window.findNodeById(state.currentMap.nodes[0], pid);
    if (!parent) return;
    const collapsedKids = (parent.children || []).filter(k => k.isCollapsed);
    // Always show the node editor popup on node click; the popup itself handles empty collapsed lists.
    showCollapsedListPopup(evt.target, collapsedKids);
  });
}

function persistCurrentMap() {
  if (!state.currentMapId) return;
    const stored = window.Storage.GeraMapas.getMap(state.currentMapId);
    if (stored) window.Storage.GeraMapas.updateMap(state.currentMapId, { title: stored.title, data: state.currentMap });
}

function showCollapsedListPopup(cyNode, collapsedKids) {
  // Remove popup existente
  const existingPopup = document.querySelector('.context-popup');
  if (existingPopup) existingPopup.remove();
  
  const popup = document.createElement('div');
  popup.className = 'context-popup';
  popup.style.cssText = `
    position: fixed !important;
    background: white !important;
    border: 1px solid #ddd !important;
    border-radius: 8px !important;
    padding: 0 !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
    z-index: 99999 !important;
    min-width: 320px !important;
    max-width: min(90vw, 450px) !important;
    overflow: visible !important;
    cursor: move !important;
    user-select: none !important;
    resize: both !important;
    min-height: 200px !important;
    max-height: none !important;
  `;
  
  // Criar seção de nós colapsados se existirem
  const collapsedSection = collapsedKids.length > 0 ? `
    <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;">
      <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #333;">📁 Nós Retraídos/Colapsados</h4>
      <button class="popup-expand-all" style="width: 100%; background: #28a745; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; margin-bottom: 8px;">
        🔓 Expandir Todos (${collapsedKids.length})
      </button>
      <div class="popup-collapsed-list" style="max-height: none; overflow-y: visible;">
        ${collapsedKids.map(kid => `
          <button class="popup-expand-one" data-node-id="${kid.id}" style="
            width: 100%; 
            text-align: left; 
            background: #f8f9fa; 
            border: 1px solid #ddd; 
            padding: 8px 12px; 
            margin-bottom: 4px; 
            border-radius: 4px; 
            cursor: pointer;
            transition: background 0.2s;
          " onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='#f8f9fa'">
            📄 ${escapeHtml(kid.label || kid.id)}
          </button>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Criar HTML completo com cabeçalho arrastável + editor + nós colapsados
  popup.innerHTML = `
    <div class="popup-header" style="
      background: linear-gradient(135deg, #007acc, #0056b3);
      color: white;
      padding: 12px 20px;
      border-radius: 8px 8px 0 0;
      cursor: move;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
      font-weight: bold;
    ">
      <span>🎨 Editor do Nó</span>
      <button class="popup-close-x" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
      " title="Fechar">×</button>
    </div>
    <div class="popup-content" style="
      padding: 20px;
      max-height: calc(80vh - 60px);
      overflow-y: auto;
    ">
      
      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">Cor da borda:</label>
        <input type="color" class="popup-color" value="#000000" style="width: 100%; height: 36px; border: 1px solid #ddd; border-radius: 4px;" />
      </div>
      
      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">Fonte:</label>
        <select class="popup-font" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">
        <option value="Noto Sans, sans-serif">Noto Sans</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Space Mono', monospace">Space Mono (monospace)</option>
          <option value="'Segoe UI', sans-serif">Segoe UI</option>
          <option value="'Roboto', sans-serif">Roboto</option>
          <option value="'Inter', sans-serif">Inter</option>
          <option value="'Poppins', sans-serif">Poppins</option>
      </select>
      </div>
      
      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">Tamanho (px):</label>
        <input type="number" class="popup-fontsize" min="8" max="48" value="13" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
      </div>
      
    <div style="margin-bottom: 15px;">
      <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">Forma do nó:</label>
      <select class="popup-shape" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">
        <option value="roundrectangle">📦 Retângulo Arredondado (padrão)</option>
        <option value="rectangle">⬜ Retângulo</option>
        <option value="ellipse">⭕ Oval/Círculo</option>
        <option value="triangle">🔺 Triângulo</option>
        <option value="diamond">💎 Losango</option>
        <option value="hexagon">⬡ Hexágono</option>
      </select>
    </div>
    
    <div style="margin-bottom: 15px;">
      <label style="display: block; font-size: 12px; color: #666; margin-bottom: 8px;">😊 Adicionar Emoji ao Texto:</label>
      <div class="emoji-grid" style="
        display: grid; 
        grid-template-columns: repeat(8, 1fr); 
        gap: 4px; 
        max-height: 120px; 
        overflow-y: auto; 
        border: 1px solid #ddd; 
        border-radius: 4px; 
        padding: 8px;
        background: #f9f9f9;
      ">
        <button class="emoji-btn" data-emoji="😊" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Feliz">😊</button>
        <button class="emoji-btn" data-emoji="🎯" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Objetivo">🎯</button>
        <button class="emoji-btn" data-emoji="💡" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Ideia">💡</button>
        <button class="emoji-btn" data-emoji="🚀" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Lançamento">🚀</button>
        <button class="emoji-btn" data-emoji="⭐" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Estrela">⭐</button>
        <button class="emoji-btn" data-emoji="🔥" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Popular">🔥</button>
        <button class="emoji-btn" data-emoji="💰" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Dinheiro">💰</button>
        <button class="emoji-btn" data-emoji="📈" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Crescimento">📈</button>
        <button class="emoji-btn" data-emoji="❤️" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Amor">❤️</button>
        <button class="emoji-btn" data-emoji="✅" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Concluído">✅</button>
        <button class="emoji-btn" data-emoji="❌" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Erro">❌</button>
        <button class="emoji-btn" data-emoji="⚠️" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Atenção">⚠️</button>
        <button class="emoji-btn" data-emoji="🔔" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Notificação">🔔</button>
        <button class="emoji-btn" data-emoji="📱" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Celular">📱</button>
        <button class="emoji-btn" data-emoji="💻" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Computador">💻</button>
        <button class="emoji-btn" data-emoji="🌟" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Destaque">🌟</button>
        <button class="emoji-btn" data-emoji="🎨" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Arte">🎨</button>
        <button class="emoji-btn" data-emoji="📊" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Gráfico">📊</button>
        <button class="emoji-btn" data-emoji="🔍" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Pesquisar">🔍</button>
        <button class="emoji-btn" data-emoji="⚙️" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Configuração">⚙️</button>
        <button class="emoji-btn" data-emoji="🏆" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Troféu">🏆</button>
        <button class="emoji-btn" data-emoji="📚" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Livros">📚</button>
        <button class="emoji-btn" data-emoji="🎓" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Educação">🎓</button>
        <button class="emoji-btn" data-emoji="🏠" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Casa">🏠</button>
        <button class="emoji-btn" data-emoji="🌍" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Mundo">🌍</button>
        <button class="emoji-btn" data-emoji="🚗" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Carro">🚗</button>
        <button class="emoji-btn" data-emoji="✈️" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Avião">✈️</button>
        <button class="emoji-btn" data-emoji="🍕" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Pizza">🍕</button>
        <button class="emoji-btn" data-emoji="☕" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Café">☕</button>
        <button class="emoji-btn" data-emoji="🎵" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Música">🎵</button>
        <button class="emoji-btn" data-emoji="📷" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Foto">📷</button>
        <button class="emoji-btn" data-emoji="🎮" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Jogo">🎮</button>
        <button class="emoji-btn" data-emoji="💪" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Força">💪</button>
        <button class="emoji-btn" data-emoji="🧠" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Cérebro">🧠</button>
        <button class="emoji-btn" data-emoji="👥" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Pessoas">👥</button>
        <button class="emoji-btn" data-emoji="👤" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Pessoa">👤</button>
        <button class="emoji-btn" data-emoji="💼" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Trabalho">💼</button>
        <button class="emoji-btn" data-emoji="🔧" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Ferramenta">🔧</button>
        <button class="emoji-btn" data-emoji="📝" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Escrever">📝</button>
        <button class="emoji-btn" data-emoji="📅" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Calendário">📅</button>
        <button class="emoji-btn" data-emoji="⏰" style="border: none; background: white; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 16px; transition: all 0.2s;" title="Tempo">⏰</button>
      </div>
      <div style="margin-top: 8px; font-size: 11px; color: #888;">
        💡 Clique em um emoji para adicionar ao texto do nó
      </div>
    </div>
      
      <div style="display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap;">
        <button class="popup-apply" style="background: #007acc; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; min-width: 100px;">✅ Aplicar</button>
        <button class="popup-cancel" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; min-width: 80px;">❌ Fechar</button>
    </div>
      
      ${collapsedSection}
    </div>
  `;

  // Posicionar popup de forma responsiva
  document.body.appendChild(popup);
  
  // Posicionamento inteligente baseado no tamanho da tela
  const bb = cyNode.renderedBoundingBox();
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Em telas pequenas, centralizar o popup
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.maxWidth = '95vw';
    popup.style.maxHeight = '90vh';
  } else {
    // Em telas grandes, posicionar próximo ao nó
    const popupWidth = 420;
    const popupHeight = 300;
    
    let left = bb.x2 + 10;
    let top = bb.y1;
    
    // Ajustar se sair da tela
    if (left + popupWidth > window.innerWidth) {
      left = bb.x1 - popupWidth - 10;
    }
    if (left < 10) left = 10;
    
    if (top + popupHeight > window.innerHeight) {
      top = window.innerHeight - popupHeight - 10;
    }
    if (top < 10) top = 10;
    
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
  }
  
  console.log('📱 Popup posicionado:', isMobile ? 'modo mobile' : 'modo desktop');
  
  // Obter valores atuais do nó
      const nid = cyNode.id();
  const node = state.cy.getElementById(nid);
  const currentColor = node.style('border-color') || '#000000';
  const currentFont = node.style('font-family') || 'Noto Sans, sans-serif';
  const currentSize = parseInt(node.style('font-size')) || 13;
  const currentShape = node.style('shape') || 'roundrectangle';

  // Aplicar valores atuais aos controles
  const colorInput = popup.querySelector('.popup-color');
  const fontSelect = popup.querySelector('.popup-font');
  const sizeInput = popup.querySelector('.popup-fontsize');
  const shapeSelect = popup.querySelector('.popup-shape');
  
  if (colorInput) colorInput.value = rgbToHex(currentColor);
  if (fontSelect) {
    // Tentar encontrar a fonte mais próxima
    const fontOptions = Array.from(fontSelect.options);
    const matchedOption = fontOptions.find(opt => 
      currentFont.toLowerCase().includes(opt.text.toLowerCase()) ||
      opt.value.toLowerCase().includes(currentFont.split(',')[0].toLowerCase().replace(/['"]/g, ''))
    );
    if (matchedOption) fontSelect.value = matchedOption.value;
  }
  if (sizeInput) sizeInput.value = currentSize;
  if (shapeSelect) shapeSelect.value = currentShape;
  
  console.log('🎨 Popup criado:', { currentColor, currentFont, currentSize, currentShape });
  
  // Funcionalidade de arrastar (drag)
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  
  const header = popup.querySelector('.popup-header');
  const closeBtn = popup.querySelector('.popup-close-x');
  
  // Event listeners para arrastar
  header.addEventListener('mousedown', (e) => {
    if (e.target === closeBtn) return; // Não arrastar se clicou no X
    isDragging = true;
    const rect = popup.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    header.style.cursor = 'grabbing';
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, e.clientY - dragOffset.y));
    
    popup.style.left = newX + 'px';
    popup.style.top = newY + 'px';
    e.preventDefault();
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      header.style.cursor = 'move';
    }
  });
  
  // Touch events para dispositivos móveis
  header.addEventListener('touchstart', (e) => {
    if (e.target === closeBtn) return;
    const touch = e.touches[0];
    const rect = popup.getBoundingClientRect();
    dragOffset.x = touch.clientX - rect.left;
    dragOffset.y = touch.clientY - rect.top;
    e.preventDefault();
  });
  
  header.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const newX = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, touch.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, touch.clientY - dragOffset.y));
    
    popup.style.left = newX + 'px';
    popup.style.top = newY + 'px';
    e.preventDefault();
  });
  
  // Event listeners dos botões
  const applyBtn = popup.querySelector('.popup-apply');
  const cancelBtn = popup.querySelector('.popup-cancel');
  
  // Botão X do cabeçalho
  closeBtn.addEventListener('click', () => {
    popup.remove();
    console.log('❌ Popup fechado pelo X');
  });
  
  // Botão Aplicar
    applyBtn.addEventListener('click', () => {
    const newColor = colorInput.value;
    const newFont = fontSelect.value;
    const newSize = parseInt(sizeInput.value) || 13;
    const newShape = shapeSelect ? shapeSelect.value : null;

    console.log('✅ Aplicando mudanças:', { newColor, newFont, newSize, newShape });
    console.log('🔍 Debug elementos:', {
      colorInput: !!colorInput,
      fontSelect: !!fontSelect, 
      sizeInput: !!sizeInput,
      shapeSelect: !!shapeSelect
    });

    try {
      // Aplicar estilos ao nó
      if (newColor) {
        node.style('border-color', newColor);
        setNodeStyleData(nid, 'border-color', newColor);
      }

      if (newFont) {
        node.style('font-family', newFont);
        setNodeStyleData(nid, 'font-family', newFont);
        console.log('🔤 Fonte aplicada:', newFont);
      }

      if (newSize) {
        node.style('font-size', newSize);
        setNodeStyleData(nid, 'font-size', newSize);
        console.log('📏 Tamanho aplicado:', newSize);
      }

      // Sempre aplicar forma se foi selecionada (pode ser force update)
      if (newShape) {
        console.log('🔷 Aplicando forma:', currentShape, '→', newShape);
        
        try {
          // Forçar aplicação da forma
          node.style('shape', newShape);
          
          // Verificar se foi aplicada
          const appliedShape = node.style('shape');
          console.log('🔍 Forma verificada após aplicação:', appliedShape);
          
          // Salvar no mapa
          setNodeStyleData(nid, 'shape', newShape);
          console.log('💾 Forma salva no mapa JSON');
          
          // Log de sucesso
          if (appliedShape === newShape) {
            console.log('✅ Forma aplicada com SUCESSO:', newShape);
          } else {
            console.log('⚠️ Forma aplicada mas valor diferente:', newShape, '≠', appliedShape);
          }
          
        } catch (error) {
          console.error('❌ ERRO ao aplicar forma:', error);
          alert('Erro ao aplicar forma: ' + error.message);
        }
      } else {
        console.log('⚠️ Nenhuma forma selecionada para aplicar');
      }

    persistCurrentMap();
      
      // Fechar popup
      popup.remove();
      console.log('🎯 Mudanças aplicadas com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao aplicar mudanças:', error);
      alert('Erro ao aplicar mudanças: ' + error.message);
    }
  });
  
  // Botão Cancelar
  cancelBtn.addEventListener('click', () => {
    popup.remove();
    console.log('❌ Popup cancelado');
  });
  
  // Debug do dropdown de fonte
  fontSelect.addEventListener('change', (e) => {
    console.log('🔄 Font dropdown mudou para:', e.target.value);
  });
  
  fontSelect.addEventListener('click', () => {
    console.log('🖱️ Font dropdown clicado');
  });
  
  // Debug do dropdown de forma
  if (shapeSelect) {
    shapeSelect.addEventListener('change', (e) => {
      console.log('🔷 Shape dropdown mudou para:', e.target.value);
    });
    
    shapeSelect.addEventListener('click', () => {
      console.log('🖱️ Shape dropdown clicado');
    });
    
    console.log('🔷 Shape select inicializado com valor:', shapeSelect.value);
    console.log('🔷 Shape options disponíveis:', Array.from(shapeSelect.options).map(o => o.value));
  } else {
    console.error('❌ ERRO: shapeSelect não encontrado!');
  }
  
  // Event listeners para botões de emoji
  const emojiButtons = popup.querySelectorAll('.emoji-btn');
  emojiButtons.forEach(btn => {
    btn.addEventListener('mouseenter', (e) => {
      e.target.style.background = '#e3f2fd';
      e.target.style.transform = 'scale(1.1)';
    });
    
    btn.addEventListener('mouseleave', (e) => {
      e.target.style.background = 'white';
      e.target.style.transform = 'scale(1)';
    });
    
    btn.addEventListener('click', (e) => {
      const emoji = e.target.dataset.emoji;
      const currentLabel = node.data('label') || '';
      
      // Adicionar emoji ao início do texto (se não estiver lá já)
      let newLabel;
      if (currentLabel.includes(emoji)) {
        // Se já tem o emoji, remove
        newLabel = currentLabel.replace(emoji + ' ', '').replace(emoji, '');
        console.log('🗑️ Emoji removido:', emoji);
      } else {
        // Se não tem, adiciona no início
        newLabel = emoji + ' ' + currentLabel;
        console.log('😊 Emoji adicionado:', emoji);
      }
      
      // Atualizar o nó imediatamente para feedback visual
      node.data('label', newLabel);
      
      // Atualizar também no mapa JSON
      if (state.currentMap) {
        const mapNode = window.findNodeById(state.currentMap.nodes[0], nid);
        if (mapNode) {
          mapNode.label = newLabel;
          console.log('💾 Label atualizado no mapa JSON');
        }
      }
      
      // Persistir mudanças
      persistCurrentMap();
      
      // Feedback visual no botão
      e.target.style.background = '#c8e6c9';
      setTimeout(() => {
        e.target.style.background = 'white';
      }, 200);
      
      console.log('📝 Texto atualizado:', newLabel);
    });
  });
  
  console.log('😊 Event listeners de emoji configurados:', emojiButtons.length, 'botões');
  
  // Event listeners para nós colapsados
  if (collapsedKids.length > 0) {
    console.log('📁 Configurando botões para', collapsedKids.length, 'nós colapsados');
    
    // Botão "Expandir Todos"
    const expandAllBtn = popup.querySelector('.popup-expand-all');
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
        console.log('🔓 Expandindo todos os nós colapsados...');
        try {
           collapsedKids.forEach(kid => {
             setNodeCollapsed(state.currentMap, kid.id, false);
             console.log('✅ Expandido:', kid.label || kid.id);
           });
      persistCurrentMap();
           popup.remove();
           renderAndAttach(state.currentMap, true); // preservar viewport ao expandir todos
          console.log('🎯 Todos os nós expandidos com sucesso!');
        } catch (error) {
          console.error('❌ Erro ao expandir todos:', error);
        }
      });
    }
    
    // Botões individuais "Expandir Um"
    const expandButtons = popup.querySelectorAll('.popup-expand-one');
    expandButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const nodeId = btn.getAttribute('data-node-id');
        const nodeLabel = btn.textContent.replace('📄 ', '');
        console.log('🔓 Expandindo nó individual:', nodeLabel, '(ID:', nodeId, ')');
        
        try {
          setNodeCollapsed(state.currentMap, nodeId, false);
        persistCurrentMap();
          popup.remove();
          renderAndAttach(state.currentMap, true); // preservar viewport ao expandir nó individual
          console.log('✅ Nó expandido:', nodeLabel);
        } catch (error) {
          console.error('❌ Erro ao expandir nó:', error);
        }
      });
    });
  }
}

/* helper to convert rgb/rgba to hex (small utility) */
function rgbToHex(rgb) {
  if (!rgb) return '#000000';
  if (rgb[0] === '#') return rgb;
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return rgb;
  return '#' + [1,2,3].map(i=>parseInt(m[i]).toString(16).padStart(2,'0')).join('');
}

/* persist small inline style overrides inside the map JSON for node id */
function setNodeStyleData(nodeId, key, value) {
  const n = window.findNodeById(state.currentMap.nodes[0], nodeId);
  if (!n) return;
  n._style = n._style || {};
  n._style[key] = value;
}

/* remove stored style keys */
function removeNodeStyleData(nodeId, keys = []) {
  const n = window.findNodeById(state.currentMap.nodes[0], nodeId);
  if (!n || !n._style) return;
  keys.forEach(k => delete n._style[k]);
  // cleanup empty object
  if (Object.keys(n._style).length === 0) delete n._style;
}

// after overlaysRoot is created (keep existing placement) — add drag/placement logic for context popups
let popupDragState = { active: false, target: null, offsetX: 0, offsetY: 0 };
overlaysRoot.addEventListener('mousedown', (e) => {
  const p = e.target.closest && e.target.closest('.context-popup');
  if (!p) return;
  // ignore interactions with inputs/buttons inside popup
  if (e.target.closest('input,textarea,button')) return;
  popupDragState.active = true;
  popupDragState.target = p;
  const rect = p.getBoundingClientRect();
  popupDragState.offsetX = e.clientX - rect.left;
  popupDragState.offsetY = e.clientY - rect.top;
  p.classList.add('dragging');
  e.preventDefault();
});
document.addEventListener('mousemove', (e) => {
  if (!popupDragState.active || !popupDragState.target) return;
  const containerRect = mapContainer.getBoundingClientRect();
  let left = e.clientX - containerRect.left - popupDragState.offsetX;
  let top = e.clientY - containerRect.top - popupDragState.offsetY;
  // clamp inside map container with 8px margin
  left = Math.max(8, Math.min(containerRect.width - popupDragState.target.offsetWidth - 8, left));
  top = Math.max(8, Math.min(containerRect.height - popupDragState.target.offsetHeight - 8, top));
  popupDragState.target.style.left = left + 'px';
  popupDragState.target.style.top = top + 'px';
});
document.addEventListener('mouseup', () => {
  if (!popupDragState.active) return;
  popupDragState.active = false;
  if (popupDragState.target) popupDragState.target.classList.remove('dragging');
  popupDragState.target = null;
});
// touch support
overlaysRoot.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  const p = (e.target.closest && e.target.closest('.context-popup')) || null;
  if (!p) return;
  if (e.target.closest('input,textarea,button')) return;
  popupDragState.active = true;
  popupDragState.target = p;
  const rect = p.getBoundingClientRect();
  popupDragState.offsetX = t.clientX - rect.left;
  popupDragState.offsetY = t.clientY - rect.top;
  p.classList.add('dragging');
}, { passive: false });
document.addEventListener('touchmove', (e) => {
  if (!popupDragState.active || !popupDragState.target) return;
  const t = e.touches[0];
  const containerRect = mapContainer.getBoundingClientRect();
  let left = t.clientX - containerRect.left - popupDragState.offsetX;
  let top = t.clientY - containerRect.top - popupDragState.offsetY;
  left = Math.max(8, Math.min(containerRect.width - popupDragState.target.offsetWidth - 8, left));
  top = Math.max(8, Math.min(containerRect.height - popupDragState.target.offsetHeight - 8, top));
  popupDragState.target.style.left = left + 'px';
  popupDragState.target.style.top = top + 'px';
  e.preventDefault();
}, { passive: false });
document.addEventListener('touchend', () => {
  if (!popupDragState.active) return;
  popupDragState.active = false;
  if (popupDragState.target) popupDragState.target.classList.remove('dragging');
  popupDragState.target = null;
});

/* Theme and Layout Controls - moved inside initApp */
const colorBg = document.getElementById('colorBg');
const colorText = document.getElementById('colorText');
const colorAccent = document.getElementById('colorAccent');
const colorMuted = document.getElementById('colorMuted');
const colorBorder = document.getElementById('colorBorder');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const applyThemeBtn = document.getElementById('applyThemeBtn');
const resetThemeBtn = document.getElementById('resetThemeBtn');
const layoutTemplateSelect = document.getElementById('layoutTemplateSelect');
const readingModeSelect = document.getElementById('readingModeSelect');

/* apply persisted theme/layout if exists */
if (persisted && persisted.theme) { state.theme = persisted.theme; applyTheme(state.theme); }
if (persisted && persisted.layout) { state.layout = persisted.layout; layoutTemplateSelect.value = persisted.layout; applyLayoutPreset(persisted.layout); }
if (persisted && persisted.readingMode) { state.readingMode = persisted.readingMode; if (readingModeSelect) readingModeSelect.value = persisted.readingMode; } else { state.readingMode = 'normal'; }

/* UI actions */
applyThemeBtn.addEventListener('click', () => {
  const theme = {
    '--bg': colorBg.value,
    '--text': colorText.value,
    '--accent': colorAccent.value,
    '--muted': colorMuted.value,
    '--border': colorBorder.value,
    fontSize: Number(fontSizeSelect.value),
    fontFamily: fontFamilySelect.value
  };
  state.theme = theme;
  applyTheme(theme);
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, apiKey: state.apiKey, model: state.model, theme: state.theme, layout: state.layout });
});

resetThemeBtn.addEventListener('click', () => {
  const def = { '--bg':'#ffffff','--text':'#111111','--accent':'#000000','--muted':'#666666','--border':'#e6e6e6', fontSize:16, fontFamily: "Noto Sans, system-ui, sans-serif" };
  state.theme = def;
  applyTheme(def);
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, apiKey: state.apiKey, model: state.model, theme: state.theme, layout: state.layout });
});

layoutTemplateSelect.addEventListener('change', (e) => {
  applyLayoutPreset(e.target.value);
});

/* reading mode selection */
if (readingModeSelect) {
  readingModeSelect.addEventListener('change', (e) => {
    state.readingMode = e.target.value;
    window.Storage.GeraMapas.saveSettings({ provider: state.provider, apiKey: state.apiKey, model: state.model, theme: state.theme, layout: state.layout, readingMode: state.readingMode });
  });
}

/* Live preview: apply immediately when changing font or size (without clicking Apply) */
fontSizeSelect.addEventListener('input', (e) => {
  const size = Number(e.target.value);
  document.documentElement.style.setProperty('--font-size-base', size + 'px');
  // persist selection in state.theme but do not overwrite other theme keys
  state.theme = state.theme || {};
  state.theme.fontSize = size;
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, apiKey: state.apiKey, model: state.model, theme: state.theme, layout: state.layout });
});

fontFamilySelect.addEventListener('change', (e) => {
  const fam = e.target.value;
  document.documentElement.style.setProperty('--font-family-main', fam);
  state.theme = state.theme || {};
  state.theme.fontFamily = fam;
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, apiKey: state.apiKey, model: state.model, theme: state.theme, layout: state.layout });
});

/* Export functionality - Removido duplicata, já definido acima */

// Expose showCollapsedListPopup globally for testing
window.showCollapsedListPopup = showCollapsedListPopup;

// Controles de Zoom
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomFitBtn = document.getElementById('zoomFit');
const resetZoomPositionBtn = document.getElementById('resetZoomPosition');
const zoomPercent = document.getElementById('zoomPercent');

let currentZoom = 1.0;

function updateZoomDisplay() {
  const percent = Math.round(currentZoom * 100);
  zoomPercent.textContent = percent + '%';
  
  // Feedback visual nos botões
  zoomInBtn.disabled = currentZoom >= 3.0;
  zoomOutBtn.disabled = currentZoom <= 0.1;
  
  if (zoomInBtn.disabled) {
    zoomInBtn.style.opacity = '0.5';
    zoomInBtn.style.cursor = 'not-allowed';
  } else {
    zoomInBtn.style.opacity = '1';
    zoomInBtn.style.cursor = 'pointer';
  }
  
  if (zoomOutBtn.disabled) {
    zoomOutBtn.style.opacity = '0.5';
    zoomOutBtn.style.cursor = 'not-allowed';
  } else {
    zoomOutBtn.style.opacity = '1';
    zoomOutBtn.style.cursor = 'pointer';
  }
}

function performZoom(factor, animate = true) {
  if (!state.cy) return;
  
  const newZoom = Math.max(0.1, Math.min(3.0, currentZoom * factor));
  if (newZoom === currentZoom) return;
  
  // Salvar posições atuais dos nós antes do zoom
  const nodePositions = {};
  state.cy.nodes().forEach(node => {
    nodePositions[node.id()] = {
      x: node.position().x,
      y: node.position().y
    };
  });
  
  // Salvar viewport atual (pan)
  const currentPan = state.cy.pan();
  
  currentZoom = newZoom;
  
  if (animate) {
    state.cy.animate({
      zoom: currentZoom,
      duration: 300,
      easing: 'ease-out'
    }, {
      complete: () => {
        // Restaurar posições dos nós após zoom
        state.cy.nodes().forEach(node => {
          const savedPos = nodePositions[node.id()];
          if (savedPos) {
            node.position(savedPos);
          }
        });
        // Manter pan atual
        state.cy.pan(currentPan);
      }
    });
  } else {
    state.cy.zoom(currentZoom);
    // Restaurar posições imediatamente
    state.cy.nodes().forEach(node => {
      const savedPos = nodePositions[node.id()];
      if (savedPos) {
        node.position(savedPos);
      }
    });
    state.cy.pan(currentPan);
  }
  
  updateZoomDisplay();
  console.log('🔍 Zoom preservando posições:', Math.round(currentZoom * 100) + '%');
}

function zoomToFit() {
  if (!state.cy) return;
  
  try {
    const nodes = state.cy.nodes();
    if (nodes.length === 0) return;
    
    // Salvar posições atuais dos nós
    const nodePositions = {};
    nodes.forEach(node => {
      nodePositions[node.id()] = {
        x: node.position().x,
        y: node.position().y
      };
    });
    
    // Calcular zoom para fit sem mover nós desnecessariamente
    const bb = nodes.boundingBox();
    const containerWidth = state.cy.width();
    const containerHeight = state.cy.height();
    const padding = 50;
    
    const zoomX = (containerWidth - 2 * padding) / bb.w;
    const zoomY = (containerHeight - 2 * padding) / bb.h;
    const fitZoom = Math.min(zoomX, zoomY, 3.0); // Limitar zoom máximo
    
    currentZoom = Math.max(0.1, fitZoom); // Limitar zoom mínimo
    
    // Aplicar apenas zoom, sem reposicionar nós automaticamente
    state.cy.animate({
      zoom: currentZoom,
      pan: {
        x: (containerWidth - bb.w * currentZoom) / 2 - bb.x1 * currentZoom,
        y: (containerHeight - bb.h * currentZoom) / 2 - bb.y1 * currentZoom
      },
      duration: 500,
      easing: 'ease-out'
    }, {
      complete: () => {
        // Restaurar posições originais dos nós
        nodes.forEach(node => {
          const savedPos = nodePositions[node.id()];
          if (savedPos) {
            node.position(savedPos);
          }
        });
        updateZoomDisplay();
        console.log('🎯 Zoom fit preservando posições:', Math.round(currentZoom * 100) + '%');
      }
    });
  } catch (error) {
    console.error('❌ Erro no zoom fit:', error);
  }
}

// Event listeners dos botões de zoom
zoomInBtn.addEventListener('click', () => {
  performZoom(1.2);
  
  // Feedback visual
  zoomInBtn.style.transform = 'scale(0.9)';
  setTimeout(() => {
    zoomInBtn.style.transform = '';
  }, 150);
});

zoomOutBtn.addEventListener('click', () => {
  performZoom(0.8);
  
  // Feedback visual
  zoomOutBtn.style.transform = 'scale(0.9)';
  setTimeout(() => {
    zoomOutBtn.style.transform = '';
  }, 150);
});

zoomFitBtn.addEventListener('click', () => {
  zoomToFit();
  
  // Feedback visual
  zoomFitBtn.style.transform = 'scale(0.9)';
  setTimeout(() => {
    zoomFitBtn.style.transform = '';
  }, 150);
});

resetZoomPositionBtn.addEventListener('click', () => {
  resetZoomControlsPosition();
  
  // Feedback visual
  resetZoomPositionBtn.style.transform = 'scale(0.9)';
  setTimeout(() => {
    resetZoomPositionBtn.style.transform = '';
  }, 150);
});

// Atalhos de teclado para zoom
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case '+':
      case '=':
        e.preventDefault();
        performZoom(1.2);
        break;
      case '-':
        e.preventDefault();
        performZoom(0.8);
        break;
      case '0':
        e.preventDefault();
        zoomToFit();
        break;
    }
  }
});

// Sincronizar zoom com o Cytoscape quando o usuário usar mouse wheel
if (state.cy) {
  state.cy.on('zoom', () => {
    const cyZoom = state.cy.zoom();
    if (Math.abs(cyZoom - currentZoom) > 0.01) {
      currentZoom = cyZoom;
      updateZoomDisplay();
    }
  });
}

// Tornar controles de zoom arrastáveis
const zoomControls = document.querySelector('.zoom-controls');
let isDraggingZoom = false;
let zoomDragOffset = { x: 0, y: 0 };

function makeZoomControlsDraggable() {
  if (!zoomControls) return;
  
  // Salvar posição inicial
  let savedPosition = localStorage.getItem('zoomControlsPosition');
  if (savedPosition) {
    const pos = JSON.parse(savedPosition);
    zoomControls.style.left = pos.x + 'px';
    zoomControls.style.top = pos.y + 'px';
    zoomControls.style.right = 'auto';
    zoomControls.style.bottom = 'auto';
  }
  
  // Event listeners para arrastar
  zoomControls.addEventListener('mousedown', (e) => {
    // Só arrastar se não clicou em um botão
    if (e.target && e.target.classList && (e.target.classList.contains('zoom-btn') || e.target.classList.contains('zoom-icon'))) {
      return;
    }
    
    isDraggingZoom = true;
    const rect = zoomControls.getBoundingClientRect();
    zoomDragOffset.x = e.clientX - rect.left;
    zoomDragOffset.y = e.clientY - rect.top;
    
    zoomControls.classList.add('dragging');
    e.preventDefault();
    console.log('🔍 Iniciando arraste dos controles de zoom');
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDraggingZoom) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - zoomControls.offsetWidth, e.clientX - zoomDragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - zoomControls.offsetHeight, e.clientY - zoomDragOffset.y));
    
    zoomControls.style.left = newX + 'px';
    zoomControls.style.top = newY + 'px';
    zoomControls.style.right = 'auto';
    zoomControls.style.bottom = 'auto';
    
    e.preventDefault();
  });
  
  document.addEventListener('mouseup', () => {
    if (isDraggingZoom) {
      isDraggingZoom = false;
      zoomControls.classList.remove('dragging');
      
      // Salvar posição
      const rect = zoomControls.getBoundingClientRect();
      localStorage.setItem('zoomControlsPosition', JSON.stringify({
        x: rect.left,
        y: rect.top
      }));
      
      console.log('🔍 Controles de zoom reposicionados');
    }
  });
  
  // Touch events para dispositivos móveis
  zoomControls.addEventListener('touchstart', (e) => {
    if (e.target && e.target.classList && (e.target.classList.contains('zoom-btn') || e.target.classList.contains('zoom-icon'))) {
      return;
    }
    
    const touch = e.touches[0];
    const rect = zoomControls.getBoundingClientRect();
    zoomDragOffset.x = touch.clientX - rect.left;
    zoomDragOffset.y = touch.clientY - rect.top;
    
    zoomControls.classList.add('dragging');
    e.preventDefault();
  });
  
  zoomControls.addEventListener('touchmove', (e) => {
    if (!zoomControls.classList.contains('dragging')) return;
    
    const touch = e.touches[0];
    const newX = Math.max(0, Math.min(window.innerWidth - zoomControls.offsetWidth, touch.clientX - zoomDragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - zoomControls.offsetHeight, touch.clientY - zoomDragOffset.y));
    
    zoomControls.style.left = newX + 'px';
    zoomControls.style.top = newY + 'px';
    zoomControls.style.right = 'auto';
    zoomControls.style.bottom = 'auto';
    
    e.preventDefault();
  });
  
  zoomControls.addEventListener('touchend', () => {
    if (zoomControls.classList.contains('dragging')) {
      zoomControls.classList.remove('dragging');
      
      // Salvar posição
      const rect = zoomControls.getBoundingClientRect();
      localStorage.setItem('zoomControlsPosition', JSON.stringify({
        x: rect.left,
        y: rect.top
      }));
    }
  });
}

// Inicializar controles arrastáveis
makeZoomControlsDraggable();

// ========================================
// EVENT LISTENER GLOBAL PARA LINKS SEGUROS
// ========================================

// Event listener global para garantir que todos os links abram em nova aba
document.addEventListener('click', function(event) {
  // Verificar se o elemento clicado é um link
  if (event.target.tagName === 'A' && event.target.href) {
    // Verificar se o link não tem target="_blank" já definido
    if (!event.target.hasAttribute('target')) {
      event.preventDefault(); // Prevenir comportamento padrão
      
      // Abrir em nova aba com segurança
      const newWindow = window.open(event.target.href, '_blank', 'noopener,noreferrer');
      
      // Verificar se a janela foi bloqueada pelo popup blocker
      if (!newWindow) {
        console.warn('Popup bloqueado. Tentando abrir link diretamente.');
        // Fallback: definir target e tentar novamente
        event.target.setAttribute('target', '_blank');
        event.target.setAttribute('rel', 'noopener noreferrer');
        event.target.click();
      }
    }
  }
});

// Event listener para links criados dinamicamente após o carregamento
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    mutation.addedNodes.forEach(function(node) {
      if (node.nodeType === 1) { // Element node
        // Verificar se o nó adicionado é um link
        if (node.tagName === 'A' && node.href) {
          if (!node.hasAttribute('target')) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
          }
        }
        
        // Verificar links dentro do nó adicionado
        const links = node.querySelectorAll ? node.querySelectorAll('a') : [];
        links.forEach(function(link) {
          if (link.href && !link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          }
        });
      }
    });
  });
});

// Iniciar observação de mudanças no DOM
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Botão para resetar posição dos controles
function resetZoomControlsPosition() {
  localStorage.removeItem('zoomControlsPosition');
  zoomControls.style.left = '';
  zoomControls.style.top = '';
  zoomControls.style.right = '20px';
  zoomControls.style.bottom = '20px';
  console.log('🔍 Posição dos controles resetada para padrão');
}

// Inicializar display do zoom
updateZoomDisplay();

console.log('🔍 Controles de zoom inicializados (arrastáveis)');
console.log('⌨️ Atalhos: Ctrl + (+/-/0)');
console.log('🖱️ Arraste os controles para reposicionar');

// Inicializar drag para popups móveis
enablePopupDrag();

} // End of initApp function

// ========================================
// FUNÇÃO DE DELETAR NÓ COM FECHAMENTO DE POPUP
// ========================================
// Implementado por Lucius VII - Especialista GeraMapa
// 
// FUNCIONALIDADE: Deletar nó e fechar popup de expansão automaticamente
// COMPORTAMENTO: 
// 1. Usuário clica na lixeira para deletar um nó
// 2. Sistema deleta o nó do mapa
// 3. Sistema automaticamente fecha o popup de expansão
// 4. Popup desaparece junto com seu nó de origem
//
// BENEFÍCIOS:
// - Popup não fica "perdido" após deletar nó
// - Interface limpa e consistente
// - Experiência mais intuitiva
// ========================================

function deleteNode() {
  if (!state.selectedNode) return;
  
  const nodeTitle = state.selectedNode.data('label') || 'este nó';
  if (confirm(`Tem certeza que deseja excluir "${nodeTitle}" e todos os seus filhos?`)) {
    const nodeId = state.selectedNode.data('id');
    
    // Remove from Cytoscape
    state.selectedNode.remove();
    
    // Update current map data
    if (state.currentMap) {
      removeNodeFromMap(nodeId);
    }
    
    // ========================================
    // FECHAMENTO AUTOMÁTICO DO POPUP DE EXPANSÃO
    // ========================================
    // Implementado por Lucius VII - Especialista GeraMapa
    
    // Fechar node-slider se estiver aberto
    if (nodeSlider && nodeSlider.classList.contains('open')) {
      nodeSlider.classList.remove('open');
      console.log('✅ Popup de expansão fechado automaticamente ao deletar nó');
    }
    
    // Alternativa: usar display none (se estiver usando essa estratégia)
    if (nodeSlider && nodeSlider.style.display === 'flex') {
      nodeSlider.style.display = 'none';
      console.log('✅ Popup de expansão fechado automaticamente ao deletar nó (display)');
    }
    
    // Fechar popup de informações do nó (se existir)
    closePopup('nodeInfo');
    
    console.log('🗑️ Nó deletado e popup de expansão fechado automaticamente');
    // ========================================
    
    updateStatus(`Nó "${nodeTitle}" excluído`);
  }
}

// Função auxiliar para remover nó do mapa
function removeNodeFromMap(nodeId) {
  if (!state.currentMap) return;
  
  function removeNodeFromTree(nodes, id) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        nodes.splice(i, 1);
        return true;
      }
      if (nodes[i].children && removeNodeFromTree(nodes[i].children, id)) {
        return true;
      }
    }
    return false;
  }
  
  removeNodeFromTree(state.currentMap.nodes, nodeId);
}

// Função auxiliar para fechar popup
function closePopup(popupType) {
  // Implementação básica - pode ser expandida conforme necessário
  console.log(`Fechando popup: ${popupType}`);
}

// ✅ FUNÇÕES DE ARMAZENAMENTO OFFLINE
function saveTabContentToStorage(nodeLabel, tabName, content) {
  try {
    const storageKey = `tab_content_${nodeLabel.replace(/[^a-zA-Z0-9]/g, '_')}_${tabName}`;
    const data = {
      content: content,
      timestamp: new Date().toISOString(),
      nodeLabel: nodeLabel,
      tabName: tabName
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
    console.log(`💾 Conteúdo salvo offline: ${nodeLabel} - ${tabName}`);
  } catch (error) {
    console.error('❌ Erro ao salvar no localStorage:', error);
  }
}

function loadTabContentFromStorage(nodeLabel, tabName) {
  try {
    const storageKey = `tab_content_${nodeLabel.replace(/[^a-zA-Z0-9]/g, '_')}_${tabName}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      console.log(`📂 Conteúdo carregado offline: ${nodeLabel} - ${tabName}`);
      return data.content;
    }
    return null;
  } catch (error) {
    console.error('❌ Erro ao carregar do localStorage:', error);
    return null;
  }
}

function hasStoredContent(nodeLabel, tabName) {
  try {
    const storageKey = `tab_content_${nodeLabel.replace(/[^a-zA-Z0-9]/g, '_')}_${tabName}`;
    return localStorage.getItem(storageKey) !== null;
  } catch (error) {
    return false;
  }
}

// ✅ FUNÇÃO DE TESTE PARA VERIFICAR DOWNLOADS
function testAllDownloads() {
  console.log('🧪 TESTANDO TODOS OS PONTOS DE DOWNLOAD...');
  
  // 1. Testar downloadBlob direto
  try {
    const testBlob = new Blob(['Teste de download direto'], { type: 'text/plain' });
    downloadBlob(testBlob, 'teste_download_direto.txt');
    console.log('✅ 1. downloadBlob direto: OK');
  } catch (error) {
    console.error('❌ 1. downloadBlob direto: FALHOU', error);
  }
  
  // 2. Testar se há mapa para exportação
  if (state.currentMap && state.cy) {
    console.log('✅ 2. Mapa carregado: OK');
    
    // Testar exportação JSON (mais simples)
    try {
      const payload = mapToStructuredJSON(state.currentMap);
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      downloadBlob(blob, 'teste_mapa.json');
      console.log('✅ 3. Exportação JSON: OK');
    } catch (error) {
      console.error('❌ 3. Exportação JSON: FALHOU', error);
    }
  } else {
    console.warn('⚠️ 2. Mapa não carregado - pulando testes de exportação');
  }
  
  // 3. Testar se há botão de download das abas
  const downloadBtn = document.getElementById('downloadTabBtn');
  if (downloadBtn) {
    console.log('✅ 4. Botão download das abas: ENCONTRADO');
    
    // Verificar se há node slider ativo
    const nodeSlider = document.querySelector('.node-slider');
    if (nodeSlider) {
      console.log('✅ 5. Node slider ativo: ENCONTRADO');
      
      // Verificar se há aba ativa
      const activeTab = nodeSlider.querySelector('.tab-content.active');
      if (activeTab) {
        console.log('✅ 6. Aba ativa: ENCONTRADA');
        console.log('✅ TODOS OS PONTOS DE DOWNLOAD ESTÃO FUNCIONAIS!');
      } else {
        console.warn('⚠️ 6. Nenhuma aba ativa encontrada');
      }
    } else {
      console.warn('⚠️ 5. Nenhum node slider ativo encontrado');
    }
  } else {
    console.warn('⚠️ 4. Botão download das abas não encontrado');
  }
  
  console.log('🧪 TESTE CONCLUÍDO!');
}

// ✅ EXPORTA FUNÇÃO PARA TESTE NO CONSOLE
window.testDownloads = testAllDownloads;

// ✅ FUNÇÃO DE TESTE ESPECÍFICA PARA DOWNLOAD DAS ABAS
function testTabDownload() {
  console.log('🧪 TESTANDO DOWNLOAD DAS ABAS...');
  
  // 1. Verificar se há node slider
  const nodeSlider = document.querySelector('.node-slider');
  if (!nodeSlider) {
    console.error('❌ Nenhum node slider encontrado');
    alert('Abra um nó primeiro para testar o download das abas');
    return;
  }
  
  console.log('✅ Node slider encontrado');
  
  // 2. Verificar se há aba ativa
  const activeTab = nodeSlider.querySelector('.tab-content.active');
  if (!activeTab) {
    console.error('❌ Nenhuma aba ativa encontrada');
    alert('Clique em uma aba primeiro para testar o download');
    return;
  }
  
  console.log('✅ Aba ativa encontrada');
  
  // 3. Verificar se há conteúdo na aba
  const content = activeTab.innerHTML;
  if (!content || content.length < 10) {
    console.error('❌ Aba não tem conteúdo suficiente');
    alert('A aba não tem conteúdo suficiente para download');
    return;
  }
  
  console.log('✅ Conteúdo encontrado, tamanho:', content.length, 'caracteres');
  
  // 4. Obter nome da aba
  const activeTabButton = nodeSlider.querySelector('.tab.active[data-tab]');
  const tabName = activeTabButton ? activeTabButton.dataset.tab : 'conteudo';
  console.log('✅ Nome da aba:', tabName);
  
  // 5. Obter nome do nó
  const nodeLabel = nodeSlider.querySelector('.node-slider-title')?.textContent || 'Nó_Teste';
  console.log('✅ Nome do nó:', nodeLabel);
  
  // 6. Testar download
  try {
    console.log('🔄 Testando download...');
    downloadActiveTabContent(nodeSlider, nodeLabel);
    console.log('✅ Teste de download iniciado');
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    alert('Erro no teste: ' + error.message);
  }
}

// ✅ EXPORTA FUNÇÃO DE TESTE
window.testTabDownload = testTabDownload;

// ✅ FUNÇÃO DE TESTE PARA VERIFICAR EXPORTAÇÃO DE MAPAS
function testMapExport() {
  console.log('🧪 TESTANDO EXPORTAÇÃO DE MAPAS...');
  
  if (!state.currentMap || !state.cy) {
    console.error('❌ Nenhum mapa carregado');
    alert('Crie um mapa primeiro para testar a exportação');
    return;
  }
  
  console.log('✅ Mapa carregado, testando exportação JSON...');
  
  try {
    const payload = mapToStructuredJSON(state.currentMap);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'teste_exportacao_mapa.json');
    console.log('✅ Exportação de mapa: SUCESSO');
  } catch (error) {
    console.error('❌ Erro na exportação de mapa:', error);
    alert('❌ Erro na exportação: ' + error.message);
  }
}

// ✅ EXPORTA FUNÇÃO DE TESTE DE EXPORTAÇÃO
window.testMapExport = testMapExport;

// ✅ FUNÇÃO DE TESTE SIMPLES
function testSimpleDownload() {
  console.log('🧪 TESTANDO DOWNLOAD SIMPLES...');
  
  try {
    const testText = 'Este é um teste de download simples.\n\nData: ' + new Date().toLocaleString('pt-BR');
    const success = simpleDownload(testText, 'teste_download_simples.txt');
    
    if (success) {
      console.log('✅ Teste de download simples: SUCESSO');
      alert('✅ Teste de download realizado com sucesso!');
    } else {
      console.log('❌ Teste de download simples: FALHOU');
      alert('❌ Teste de download falhou');
    }
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    alert('❌ Erro no teste: ' + error.message);
  }
}

// ✅ EXPORTA FUNÇÃO DE TESTE SIMPLES
window.testSimpleDownload = testSimpleDownload;

// ✅ FUNÇÃO SIMPLES E FUNCIONAL PARA DOWNLOAD
function simpleDownload(text, filename) {
  try {
    // Criar blob com o texto
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    
    // Criar URL do blob
    const url = window.URL.createObjectURL(blob);
    
    // Criar link temporário
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Adicionar ao DOM, clicar e remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpar URL
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Download realizado:', filename);
    return true;
  } catch (error) {
    console.error('❌ Erro no download simples:', error);
    return false;
  }
}

// ✅ FUNÇÃO DE DOWNLOAD DO CONTEÚDO DA ABA ATIVA (RECONSTRUÍDA)
function downloadActiveTabContent(nodeSlider, nodeLabel) {
  try {
    console.log('🔄 Iniciando download...');
    
    // 1. Verificar se há aba ativa
    const activeTab = nodeSlider.querySelector('.tab-content.active');
    if (!activeTab) {
      alert('❌ Nenhuma aba ativa encontrada. Clique em uma aba primeiro.');
      return;
    }
    
    // 2. Obter nome da aba
    const activeTabButton = nodeSlider.querySelector('.tab.active[data-tab]');
    const tabName = activeTabButton ? activeTabButton.dataset.tab : 'conteudo';
    
    // 3. Extrair conteúdo da aba
    let content = activeTab.textContent || activeTab.innerText || '';
    
    // Se não há texto, tentar extrair do HTML
    if (!content || content.trim().length < 5) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = activeTab.innerHTML;
      tempDiv.querySelectorAll('button, input, select, .btn').forEach(el => el.remove());
      content = tempDiv.textContent || tempDiv.innerText || '';
    }
    
    // Se ainda não há conteúdo, usar HTML limpo
    if (!content || content.trim().length < 5) {
      content = activeTab.innerHTML.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
    
    // 4. Criar conteúdo do arquivo
    const header = `=== CONTEÚDO DA ABA: ${tabName.toUpperCase()} ===\n`;
    const nodeInfo = `Nó: ${nodeLabel}\n`;
    const dateInfo = `Data: ${new Date().toLocaleString('pt-BR')}\n`;
    const separator = '='.repeat(50) + '\n\n';
    
    const fullContent = header + nodeInfo + dateInfo + separator + content;
    
    // 5. Criar nome do arquivo
    const filename = `${nodeLabel.replace(/[^a-zA-Z0-9]/g, '_')}_${tabName}.txt`;
    
    // 6. Fazer download usando função simples (APENAS PARA ABAS)
    const success = simpleDownload(fullContent, filename);
    
    if (success) {
      console.log('✅ Download das abas concluído com sucesso!');
    } else {
      alert('❌ Erro ao fazer download das abas. Tente novamente.');
    }
    
  } catch (error) {
    console.error('❌ Erro na função de download:', error);
    alert('❌ Erro ao fazer download: ' + error.message);
  }
}

// Initialize app when DOM is loaded with extension safety
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function() {
    try {
      initApp();
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  });
}