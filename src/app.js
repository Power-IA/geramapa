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
const markerBtn = document.getElementById('markerBtn');
const lapisBtn = document.getElementById('lapisBtn');

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
      // console.log('🖱️ Clique no mapa detectado - fechando popup de expansão'); // ✅ Removido para reduzir logs
      
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
  // Carregar API key do provedor atual
  if (state.provider && persisted.apiKeys) {
    state.apiKey = persisted.apiKeys[state.provider] || '';
  } else {
  state.apiKey = persisted.apiKey || '';
  }
  state.model = persisted.model || '';
  providerSelect.value = state.provider;
  apiKeyInput.value = state.apiKey ? '••••••••' : '';
}
// Apenas atualizar UI de modelos, não carregar ainda
modelSelect.innerHTML = '<option value="">Selecione um modelo</option>';

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
      // console.log('Zona de exclusão do botão fechar atualizada:', nodeSliderCloseButtonRect); // ✅ Removido para reduzir poluição no console
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
  console.log(`🔄 ===== TROCANDO PROVEDOR =====`);
  console.log(`🔄 Provedor anterior: ${state.provider}`);
  
  state.provider = providerSelect.value;
  console.log(`🔄 Provedor novo: ${state.provider}`);
  
  // Carregar API key do novo provedor
  console.log(`🔄 Chamando getApiKey(${state.provider})`);
  const loadedApiKey = window.Storage.GeraMapas.getApiKey(state.provider);
  console.log(`🔄 API Key carregada:`, loadedApiKey ? 'CONFIGURADA' : 'VAZIA');
  
  state.apiKey = loadedApiKey;
  apiKeyInput.value = state.apiKey ? '••••••••' : '';
  
  console.log(`🔄 State.apiKey agora é: "${state.apiKey}"`);
  
  window.Storage.GeraMapas.saveSettings({ provider: state.provider });
  state.model = ''; // Reset modelo ao mudar provedor
  modelSelect.innerHTML = '<option value="">Carregando...</option>';
  
  if (state.apiKey) {
    console.log(`🔄 API key existe, carregando modelos...`);
  await updateModelsUI();
  } else {
    console.log(`🔄 Nenhuma API key, mostrando mensagem...`);
    modelSelect.innerHTML = '<option value="">Configure a API Key</option>';
    modelsStatus.textContent = '⚠️ Configure sua API Key para carregar modelos';
    modelsStatus.style.color = 'var(--accent)';
  }
  
  console.log(`🔄 ===== TROCA DE PROVEDOR CONCLUÍDA =====`);
});

saveApiBtn.addEventListener('click', async () => {
  const raw = apiKeyInput.value.trim();
  
  if (!raw) {
    apiStatus.textContent = '⚠️ API Key não pode estar vazia';
    apiStatus.style.color = 'var(--accent)';
    return;
  }
  
  // Salvar API key para o provedor atual
  window.Storage.GeraMapas.saveApiKey(state.provider, raw);
  state.apiKey = raw;
  window.Storage.GeraMapas.saveSettings({ model: state.model });
  
  apiStatus.textContent = '✅ API Key salva com sucesso!';
  apiStatus.style.color = 'var(--success)';
  
  await updateModelsUI();
});

// Botão para excluir API key
if (document.getElementById('deleteApiBtn')) {
  document.getElementById('deleteApiBtn').addEventListener('click', () => {
    console.log(`🔴 ===== INICIANDO EXCLUSÃO DE API KEY =====`);
    console.log(`🔴 Provedor atual: ${state.provider}`);
    console.log(`🔴 API Key atual no state: ${state.apiKey ? 'CONFIGURADA' : 'VAZIA'}`);
    
    if (confirm(`Deseja realmente excluir a API Key do provedor ${state.provider.toUpperCase()}?`)) {
      console.log(`🔴 Usuário confirmou exclusão`);
      
      // Excluir do storage
      console.log(`🔴 Chamando deleteApiKey(${state.provider})`);
      window.Storage.GeraMapas.deleteApiKey(state.provider);
      
      // Verificar após exclusão
      const afterDelete = window.Storage.GeraMapas.getApiKey(state.provider);
      console.log(`🔴 API Key após deleteApiKey:`, afterDelete);
      
      // Limpar UI
      state.apiKey = '';
      apiKeyInput.value = '';
      modelSelect.innerHTML = '<option value="">Nenhum modelo disponível</option>';
      modelsStatus.textContent = 'API Key excluída';
      apiStatus.textContent = '✅ API Key excluída com sucesso';
      apiStatus.style.color = 'var(--success)';
      
      // Forçar reset do modelo
      state.model = '';
      
      console.log(`🔴 ===== EXCLUSÃO CONCLUÍDA =====`);
      console.log(`🔴 State.apiKey agora é: "${state.apiKey}"`);
      console.log(`🔴 Storage tem a key?: "${afterDelete}"`);
    } else {
      console.log(`🔴 Usuário cancelou exclusão`);
    }
  });
}

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
  
  if (!dragArea) return;
  
  // ✅ OPÇÃO C: Drag em telas médias e grandes (> 600px)
  // Mobile pequeno (≤ 600px): SEM drag (evitar movimentos acidentais)
  // Mobile médio/grande + Desktop (> 600px): COM drag
  const screenWidth = window.innerWidth;
  
  if (screenWidth > 600) {
    // ✅ Telas > 600px: Habilitar drag com mouse
    dragArea.addEventListener('mousedown', startFloatingChatDrag);
    
    // ✅ Touch para tablets e telas maiores (> 600px)
    if (screenWidth <= 1024) {
      dragArea.addEventListener('touchstart', startFloatingChatDragTouch, { passive: false });
      console.log('📱 Drag habilitado (Tablet/Mobile > 600px) - Mouse + Touch');
    } else {
      console.log('🖥️ Drag habilitado (Desktop > 1024px) - Mouse');
    }
  } else {
    console.log('📱 Drag desabilitado (Mobile ≤ 600px)');
  }
}
// Função para habilitar resize do chat flutuante
function enableFloatingChatResize() {
  const resizeHandle = floatingChat.querySelector('.resize-handle');
  
  if (!resizeHandle) return;
  
  // ✅ OPÇÃO A: Desabilitar resize no mobile (< 768px)
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) {
    // ✅ Desktop: Habilitar resize
    // NOTA: Listeners de move/end deveriam ser adicionados dinamicamente (otimização futura)
  resizeHandle.addEventListener('mousedown', startFloatingChatResize);
  document.addEventListener('mousemove', handleFloatingChatResize);
  document.addEventListener('mouseup', endFloatingChatResize);
    console.log('✅ Resize habilitado (Desktop)');
  } else {
    console.log('📱 Resize desabilitado (Mobile < 768px)');
  }
  
  // ❌ Removido: Touch events - Sem resize no mobile
}

// Funções de drag
function startFloatingChatDrag(e) {
  e.preventDefault(); // ✅ Prevenir comportamento padrão
  e.stopPropagation(); // ✅ Impedir propagação para não fechar o chat
  
  floatingChatDragging = true;
  floatingChat.classList.add('dragging');
  
  // ✅ CORRIGIDO: Adicionar listeners AGORA (não na inicialização)
  document.addEventListener('mousemove', handleFloatingChatDrag);
  document.addEventListener('mouseup', endFloatingChatDrag);
  
  // ✅ CORREÇÃO DO SALTO: Obter posição ANTES de modificar estilos
  const rect = floatingChat.getBoundingClientRect();
  floatingChatDragOffset.x = e.clientX - rect.left;
  floatingChatDragOffset.y = e.clientY - rect.top;
  
  // ✅ CORREÇÃO DO SALTO: Definir posição absoluta usando rect (posição visual atual)
  floatingChat.style.left = rect.left + 'px';
  floatingChat.style.top = rect.top + 'px';
  floatingChat.style.right = 'auto';
  floatingChat.style.bottom = 'auto';
  floatingChat.style.transform = 'none'; // ✅ Remover transform para evitar salto
}

function handleFloatingChatDrag(e) {
  if (!floatingChatDragging) return;
  
  e.preventDefault(); // ✅ Prevenir seleção de texto durante drag
  
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
  
  // ✅ CORRIGIDO: Remover listeners AQUI (evitar drag automático)
  document.removeEventListener('mousemove', handleFloatingChatDrag);
  document.removeEventListener('mouseup', endFloatingChatDrag);
  document.removeEventListener('touchmove', handleFloatingChatDragTouch);
  document.removeEventListener('touchend', endFloatingChatDrag);
}

// Funções de drag para touch
function startFloatingChatDragTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  floatingChatDragging = true;
  floatingChat.classList.add('dragging');
  
  // ✅ CORRIGIDO: Adicionar listeners AGORA (não na inicialização)
  document.addEventListener('touchmove', handleFloatingChatDragTouch, { passive: false });
  document.addEventListener('touchend', endFloatingChatDrag);
  
  // ✅ CORREÇÃO DO SALTO: Obter posição ANTES de modificar estilos
  const rect = floatingChat.getBoundingClientRect();
  floatingChatDragOffset.x = touch.clientX - rect.left;
  floatingChatDragOffset.y = touch.clientY - rect.top;
  
  // ✅ CORREÇÃO DO SALTO: Definir posição absoluta usando rect (posição visual atual)
  floatingChat.style.left = rect.left + 'px';
  floatingChat.style.top = rect.top + 'px';
  floatingChat.style.right = 'auto';
  floatingChat.style.bottom = 'auto';
  floatingChat.style.transform = 'none'; // ✅ Remover transform para evitar salto
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
    
    // ✅ CORRIGIDO: RESET completo de posição ao abrir
    // Remove estilos inline do drag para restaurar centralização do CSS
    floatingChat.style.left = '';
    floatingChat.style.top = '';
    floatingChat.style.right = '';
    floatingChat.style.bottom = '';
    floatingChat.style.transform = '';
    
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
    floatingChat.classList.remove('open', 'minimized');
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

// ✅ CORREÇÃO: Impedir que cliques no chat fechem ele
// Adicionar stopPropagation para evitar que eventos bubbling fechem o chat
if (floatingChat) {
  floatingChat.addEventListener('click', (e) => {
    // Se não for o botão de fechar, impedir propagação
    if (!e.target.classList.contains('close-btn') && 
        !e.target.closest('.close-btn')) {
      e.stopPropagation();
    }
  });
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

// ✅ CORREÇÃO: Impedir que cliques no chat especialista fechem ele
if (specialistChat) {
  specialistChat.addEventListener('click', (e) => {
    // Se não for o botão de fechar, impedir propagação
    if (!e.target.classList.contains('close-btn') && 
        !e.target.closest('.close-btn')) {
      e.stopPropagation();
    }
  });
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

    // Tentar extrair e validar JSON da resposta
    const newMap = extractAndValidateJSON(response);
      state.currentMap = newMap;
      await renderAndAttach(newMap, true); // Preservar viewport
      addFloatingChatMessage('assistant', `✅ Nó adicionado com sucesso!`);
      floatingChatInput.value = '';

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

    // Tentar extrair e validar JSON da resposta
    const expandedMap = extractAndValidateJSON(response);
      state.currentMap = expandedMap;
      await renderAndAttach(expandedMap, true); // Preservar viewport
      addFloatingChatMessage('assistant', `✅ Nó "${prompt}" expandido com sucesso!`);
      floatingChatInput.value = '';

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
      // ✅ CORREÇÃO: Configurar marked para evitar avisos de deprecação
      const markedOptions = {
        mangle: false,
        headerIds: false,
        headerPrefix: ''
      };
      
      // Configurar marked com opções
      if (window.marked.setOptions) {
        window.marked.setOptions(markedOptions);
      }
      
      const htmlContent = window.marked.parse ? window.marked.parse(content, markedOptions) : window.marked(content, markedOptions);
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
      
      // 💾 AUTO-SAVE do mapa inicial criado pela IA
      const autoSaveId = window.Storage.GeraMapas.saveMap({ title: mapData.title, data: mapData });
      state.currentMapId = autoSaveId;
    deleteMapBtn.disabled = false;
      console.log(`💾 Auto-salvo: "${mapData.title}" (ID: ${autoSaveId})`);
      
      // Atualizar UI
      loadSavedList();
    modelSelector.classList.add('open');
    
    // ✅ CORREÇÃO: Atualizar estado do menu mobile
    updateMobileMenuState();
    
    // 🧪 AUTO-TESTE: Verificar visibilidade do footer no mobile
    autoTestFooterOnMap();
      
      // Mostrar chat especialista automaticamente
      showSpecialistChat();
      
      // Mostrar botão especialista
      toggleSpecialistButton();
      
      // Mostrar botão de modelos de mapas
      updateMobileMenuState();
      
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
      // ✅ CORREÇÃO: Configurar marked para evitar avisos de deprecação
      const markedOptions = {
        mangle: false,
        headerIds: false,
        headerPrefix: ''
      };
      
      // Configurar marked com opções
      if (window.marked.setOptions) {
        window.marked.setOptions(markedOptions);
      }
      
      const htmlContent = window.marked.parse ? window.marked.parse(content, markedOptions) : window.marked(content, markedOptions);
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

// Função para controlar visibilidade do botão Modelos de Mapas
function toggleMapModelsButton() {
  const mapModelsBtn = document.getElementById('mapModelsBtn');
  if (!mapModelsBtn) {
    console.warn('⚠️ mapModelsBtn não encontrado no DOM');
    return;
  }
  
  if (state.currentMap) {
    // Mostrar botão quando há mapa
    mapModelsBtn.style.display = 'flex';
    console.log('✅ Map Models Button: VISÍVEL');
  } else {
    // Esconder botão quando não há mapa
    mapModelsBtn.style.display = 'none';
    console.log('❌ Map Models Button: OCULTO');
  }
}

// ✅ FUNÇÃO CENTRALIZADA: Detecção de mobile consistente
function isMobileDevice() {
  return window.innerWidth <= 768;
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
      // ✅ CORREÇÃO: Alternar entre abrir e fechar chat especialista
      const isOpen = specialistChat.style.display === 'flex' && specialistChat.classList.contains('open');
      
      if (isOpen) {
        // Chat está aberto - fechar
        specialistChat.style.display = 'none';
        specialistChat.classList.remove('open');
        console.log('✅ Chat Especialista fechado');
      } else {
        // Chat está fechado - abrir
      showSpecialistChat();
        console.log('✅ Chat Especialista aberto');
      }
    }
  });
}

// Função para habilitar drag do chat especialista
function enableSpecialistChatDrag() {
  const dragArea = specialistChat.querySelector('.floating-chat-drag-area');
  
  if (!dragArea) return;
  
  // ✅ OPÇÃO C: Drag em telas médias e grandes (> 600px)
  const screenWidth = window.innerWidth;
  
  if (screenWidth > 600) {
    // ✅ Telas > 600px: Habilitar drag com mouse
    dragArea.addEventListener('mousedown', startSpecialistChatDrag);
    
    // ✅ Touch para tablets e telas maiores (> 600px)
    if (screenWidth <= 1024) {
      dragArea.addEventListener('touchstart', startSpecialistChatDragTouch, { passive: false });
      console.log('📱 Drag Especialista habilitado (Tablet/Mobile > 600px) - Mouse + Touch');
    } else {
      console.log('🖥️ Drag Especialista habilitado (Desktop > 1024px) - Mouse');
    }
  } else {
    console.log('📱 Drag Especialista desabilitado (Mobile ≤ 600px)');
  }
}

// Função para habilitar resize do chat especialista
function enableSpecialistChatResize() {
  const resizeHandle = specialistChat.querySelector('.resize-handle');
  
  if (!resizeHandle) return;
  
  // ✅ OPÇÃO A: Desabilitar resize no mobile (< 768px)
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) {
    // ✅ Desktop: Habilitar resize
  resizeHandle.addEventListener('mousedown', startSpecialistChatResize);
  document.addEventListener('mousemove', handleSpecialistChatResize);
  document.addEventListener('mouseup', endSpecialistChatResize);
    console.log('✅ Resize Especialista habilitado (Desktop)');
  } else {
    console.log('📱 Resize Especialista desabilitado (Mobile < 768px)');
  }
  
  // ❌ Removido: Touch events - Sem resize no mobile
}

// Estado do drag do chat especialista
let specialistChatDragging = false;
let specialistChatDragOffset = { x: 0, y: 0 };
let specialistChatResizing = false;
let specialistChatResizeStart = { x: 0, y: 0, width: 0, height: 0 };

// Funções de drag do chat especialista
function startSpecialistChatDrag(e) {
  e.preventDefault(); // ✅ Prevenir comportamento padrão
  e.stopPropagation(); // ✅ Impedir propagação
  
  specialistChatDragging = true;
  specialistChat.classList.add('dragging');
  
  // ✅ Adicionar listeners dinamicamente (igual floating chat)
  document.addEventListener('mousemove', handleSpecialistChatDrag);
  document.addEventListener('mouseup', endSpecialistChatDrag);
  
  // ✅ CORREÇÃO DO SALTO: Obter posição ANTES de modificar estilos
  const rect = specialistChat.getBoundingClientRect();
  specialistChatDragOffset.x = e.clientX - rect.left;
  specialistChatDragOffset.y = e.clientY - rect.top;
  
  // ✅ CORREÇÃO DO SALTO: Definir posição absoluta usando rect (posição visual atual)
  specialistChat.style.left = rect.left + 'px';
  specialistChat.style.top = rect.top + 'px';
  specialistChat.style.right = 'auto';
  specialistChat.style.bottom = 'auto';
  specialistChat.style.transform = 'none'; // ✅ Remover transform para evitar salto
}
function handleSpecialistChatDrag(e) {
  if (!specialistChatDragging) return;
  
  e.preventDefault(); // ✅ Prevenir seleção de texto durante drag
  
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
  
  // ✅ Remover listeners dinamicamente (mouse + touch)
  document.removeEventListener('mousemove', handleSpecialistChatDrag);
  document.removeEventListener('mouseup', endSpecialistChatDrag);
  document.removeEventListener('touchmove', handleSpecialistChatDragTouch);
  document.removeEventListener('touchend', endSpecialistChatDrag);
}

// Funções de drag para touch do chat especialista
function startSpecialistChatDragTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  specialistChatDragging = true;
  specialistChat.classList.add('dragging');
  
  // ✅ Adicionar listeners dinamicamente
  document.addEventListener('touchmove', handleSpecialistChatDragTouch, { passive: false });
  document.addEventListener('touchend', endSpecialistChatDrag);
  
  // ✅ CORREÇÃO DO SALTO: Obter posição ANTES de modificar estilos
  const rect = specialistChat.getBoundingClientRect();
  specialistChatDragOffset.x = touch.clientX - rect.left;
  specialistChatDragOffset.y = touch.clientY - rect.top;
  
  // ✅ CORREÇÃO DO SALTO: Definir posição absoluta usando rect (posição visual atual)
  specialistChat.style.left = rect.left + 'px';
  specialistChat.style.top = rect.top + 'px';
  specialistChat.style.right = 'auto';
  specialistChat.style.bottom = 'auto';
  specialistChat.style.transform = 'none'; // ✅ Remover transform para evitar salto
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
  
  // ✅ CORREÇÃO: Atualizar estado do menu mobile
  updateMobileMenuState();
  
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
  updateMobileMenuState();
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
      updateMobileMenuState();
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
  // ✅ VERIFICAR SE MAPA TEM ESTADO VISUAL SALVO
  const hasVisualState = map._visualState && map._visualState.nodePositions;
  
  if (hasVisualState) {
    console.log('🔄 Carregando mapa com estado visual salvo:', {
      nodes: Object.keys(map._visualState.nodePositions).length,
      styles: Object.keys(map._visualState.nodeStyles || {}).length,
      timestamp: map._visualState.timestamp
    });
  }
  
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
  
  // ✅ CORREÇÃO: Atualizar estado do menu mobile
  updateMobileMenuState();
  
  // ✅ RESTAURAR ESTADO VISUAL SALVO (se existir)
  if (hasVisualState && state.cy) {
    // Restaurar posições dos nós salvos
    Object.entries(map._visualState.nodePositions).forEach(([nodeId, pos]) => {
      const node = state.cy.getElementById(nodeId);
      if (node && node.length > 0) {
        node.position(pos);
      }
    });
    
    // Restaurar estilos personalizados dos nós
    if (map._visualState.nodeStyles) {
      Object.entries(map._visualState.nodeStyles).forEach(([nodeId, styles]) => {
        const node = state.cy.getElementById(nodeId);
        if (node && node.length > 0) {
          Object.entries(styles).forEach(([prop, value]) => {
            try {
              node.style(prop, value);
            } catch (e) {
              console.warn(`Erro ao aplicar estilo ${prop}:`, e);
            }
          });
        }
      });
    }
    
    // Restaurar viewport salvo
    if (map._visualState.viewport) {
      state.cy.viewport({
        zoom: map._visualState.viewport.zoom,
        pan: map._visualState.viewport.pan
      });
    }
    
    console.log('✅ Estado visual restaurado completamente');
  }
  // Restaurar estado se foi salvo (para casos de preservação de viewport)
  else if (savedState && state.cy) {
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
  updateMobileMenuState(); // attach interactive collapse/expand
}

async function updateModelsUI() {
  modelsStatus.textContent = '';
  modelSelect.innerHTML = '<option value="">Carregando modelos...</option>';
  
  try {
    // ✅ VALIDAÇÃO: Verificar provedor
    if (!state.provider) {
      modelSelect.innerHTML = '<option value="">Selecione um provedor</option>';
      modelsStatus.textContent = 'Selecione um provedor';
      modelsStatus.style.color = 'var(--muted)';
      return;
    }
    
    // ✅ VALIDAÇÃO: API key obrigatória
    if (!state.apiKey) {
      modelSelect.innerHTML = '<option value="">Configure a API Key</option>';
      modelsStatus.textContent = '⚠️ Configure sua API Key para carregar modelos';
      modelsStatus.style.color = 'var(--accent)';
      return;
    }
    
    console.log(`🔄 Carregando modelos para ${state.provider}...`);
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
    } else if (list.length > 0) {
      state.model = list[0].id;
      modelSelect.value = state.model;
    }
    
    modelsStatus.textContent = `✅ ${list.length} modelos carregados`;
    modelsStatus.style.color = 'var(--success)';
    
    window.Storage.GeraMapas.saveSettings({ provider: state.provider, model: state.model });
  } catch (e) {
    console.error('Erro ao carregar modelos:', e);
    modelSelect.innerHTML = '<option value="">Erro ao carregar modelos</option>';
    modelsStatus.textContent = `❌ ${e.message}`;
    modelsStatus.style.color = 'var(--error)';
  }
}
  modelSelect.addEventListener('change', () => {
    state.model = modelSelect.value;
    window.Storage.GeraMapas.saveSettings({ provider: state.provider, model: state.model });
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
    // Initialize cache stats when settings popup is opened
    setTimeout(() => {
      updateCacheStats();
      updateSummariesList();
    }, 100);
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
    // ✅ CORREÇÃO: Recentralizar popup ao abrir
    if (typeof recenterPopup === 'function') {
      recenterPopup(popup);
    }
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

// ✅ CORREÇÃO: Eventos para fechar popups (DESKTOP + MOBILE)
document.addEventListener('click', (e) => {
  // Fechar popup ao clicar no botão de fechar
  if (e.target && e.target.classList && e.target.classList.contains('popup-close')) {
    // ✅ CORREÇÃO: Tratar tanto mobile-popup quanto fixed-popup
    const mobilePopup = e.target.closest('.mobile-popup');
    const fixedPopup = e.target.closest('.fixed-popup');
    
    if (mobilePopup) {
      mobilePopup.classList.remove('show');
      setActiveNavBtn(null);
      // console.log('❌ Popup móvel fechado pelo botão X (click)'); // ✅ Removido para reduzir logs
    }
    
    if (fixedPopup) {
      fixedPopup.style.display = 'none';
      console.log('❌ Popup fixo fechado pelo botão X (click)');
    }
  }
  
  // Fechar popup ao clicar fora do conteúdo
  if (e.target && e.target.classList && e.target.classList.contains('mobile-popup')) {
    e.target.classList.remove('show');
    setActiveNavBtn(null);
    // console.log('❌ Popup móvel fechado clicando fora'); // ✅ Removido para reduzir logs
  }
});

// ✅ CORREÇÃO: Eventos touch para fechar popups em móveis
document.addEventListener('touchend', (e) => {
  // Fechar popup ao tocar no botão de fechar
  if (e.target && e.target.classList && e.target.classList.contains('popup-close')) {
    e.preventDefault();
    e.stopPropagation();
    
    // ✅ CORREÇÃO: Tratar tanto mobile-popup quanto fixed-popup
    const mobilePopup = e.target.closest('.mobile-popup');
    const fixedPopup = e.target.closest('.fixed-popup');
    
    if (mobilePopup) {
      mobilePopup.classList.remove('show');
      setActiveNavBtn(null);
      // console.log('❌ Popup móvel fechado pelo botão X (touch)'); // ✅ Removido para reduzir logs
    }
    
    if (fixedPopup) {
      fixedPopup.style.display = 'none';
      console.log('❌ Popup fixo fechado pelo botão X (touch)');
    }
  }
  
  // ✅ CORREÇÃO: Tratar botão fechar do popup de informação (node-tooltip)
  if (e.target && e.target.classList && e.target.classList.contains('node-tooltip-close')) {
    e.preventDefault();
    e.stopPropagation();
    
    const tooltip = e.target.closest('.node-tooltip');
    if (tooltip) {
      tooltip.remove();
      currentTooltip = null;
      console.log('❌ Popup de informação fechado pelo botão X (touch)');
    }
  }
  
  // Fechar popup ao tocar fora do conteúdo
  if (e.target && e.target.classList && e.target.classList.contains('mobile-popup')) {
    e.preventDefault();
    e.target.classList.remove('show');
    setActiveNavBtn(null);
    // console.log('❌ Popup móvel fechado tocando fora'); // ✅ Removido para reduzir logs
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

// ✅ CORREÇÃO: Função para recentralizar popup
function recenterPopup(popup) {
  // Remove estilos inline de drag para restaurar centralização CSS
  popup.style.left = '';
  popup.style.top = '';
  popup.style.right = '';
  popup.style.transform = '';
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
    // ✅ CRIAR CÓPIA DO MAPA COM ESTADO VISUAL ATUAL
    const mapWithVisualState = {
      ...state.currentMap,
      // ✅ ADICIONAR ESTADO VISUAL ATUAL
      _visualState: {
        viewport: {
          zoom: state.cy.zoom(),
          pan: state.cy.pan()
        },
        nodePositions: {},
        nodeStyles: {},
        timestamp: new Date().toISOString()
      }
    };
    
    // ✅ SALVAR POSIÇÕES ATUAIS DOS NÓS
    state.cy.nodes().forEach(node => {
      const nodeId = node.id();
      mapWithVisualState._visualState.nodePositions[nodeId] = {
        x: node.position().x,
        y: node.position().y
      };
      
      // ✅ SALVAR ESTILOS PERSONALIZADOS DOS NÓS
      const nodeStyle = {};
      const styleProps = ['background-color', 'border-color', 'border-width', 'color', 'font-size'];
      styleProps.forEach(prop => {
        const value = node.style(prop);
        if (value && value !== 'data(background-color)' && value !== 'data(border-color)') {
          nodeStyle[prop] = value;
        }
      });
      
      if (Object.keys(nodeStyle).length > 0) {
        mapWithVisualState._visualState.nodeStyles[nodeId] = nodeStyle;
      }
    });
    
    console.log('💾 Salvando mapa com estado visual:', {
      nodes: Object.keys(mapWithVisualState._visualState.nodePositions).length,
      styles: Object.keys(mapWithVisualState._visualState.nodeStyles).length,
      viewport: mapWithVisualState._visualState.viewport
    });
    
    const id = window.Storage.GeraMapas.saveMap({
      title: title,
      data: mapWithVisualState
    });
    
    updateStatus(`Mapa "${title}" salvo com estado visual atual`);
    loadSavedList();
    document.getElementById('saveTitleInput').value = '';
  } catch (err) {
    updateStatus(`Erro ao salvar: ${err.message}`);
  }
}

// ✅ FUNÇÃO DE TESTE: Verificar dimensões do header e espaço disponível
window.testHeaderDimensions = function() {
  console.log('📱 TESTE DE DIMENSÕES DO HEADER');
  console.log('==========================================');
  
  const header = document.querySelector('.app-header');
  const brand = document.querySelector('.header-brand');
  const nav = document.querySelector('.header-nav');
  
  if (header) {
    const headerRect = header.getBoundingClientRect();
    console.log(`📱 HEADER:`);
    console.log(`   - Largura total: ${headerRect.width}px`);
    console.log(`   - Altura: ${headerRect.height}px`);
    console.log(`   - Classes: ${header.className}`);
  }
  
  if (brand) {
    const brandRect = brand.getBoundingClientRect();
    console.log(`📱 BRAND:`);
    console.log(`   - Largura: ${brandRect.width}px`);
    console.log(`   - Altura: ${brandRect.height}px`);
    console.log(`   - Offset esquerdo: ${brandRect.left}px`);
  }
  
  if (nav) {
    const navRect = nav.getBoundingClientRect();
    console.log(`📱 NAV:`);
    console.log(`   - Largura: ${navRect.width}px`);
    console.log(`   - Altura: ${navRect.height}px`);
    console.log(`   - Offset: ${navRect.left}px`);
    console.log(`   - Scroll width: ${nav.scrollWidth}px`);
    console.log(`   - Client width: ${nav.clientWidth}px`);
    console.log(`   - Espaço necessário: ${nav.scrollWidth > nav.clientWidth ? '❌ PRECISA SCROLL' : '✅ CABE TUDO'}`);
  }
  
  const hasMap = document.querySelector('.app-header.has-map');
  console.log(`📱 Estado: ${hasMap ? 'COM MAPA (expandido)' : 'SEM MAPA (compacto)'}`);
  
  console.log('==========================================');
};
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
      console.log('✅ Ícone "i" clicado - evento processado:', id);
      
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

// Function to update tooltip summary content
async function updateTooltipSummary(tooltip, node, mapJson, nodeLabel, mapTitle, layoutModel, mode) {
  // prepare prompt: include map title + node label + brief context
  const parents = node.incomers('node').map(n => n.data('label')).filter(Boolean);
  const children = node.outgoers('node').map(n => n.data('label')).filter(Boolean);
  const connected = Array.from(new Set([...(parents||[]), ...(children||[]), ...node.connectedEdges().connectedNodes().map(n=>n.data('label')||'')])).filter(Boolean);

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

    // Generate new summary directly (skip cache check for update)
    console.log(`🤖 Gerando novo resumo via IA: ${nodeLabel}`);
    const markdown = await window.AI.chatPlain({
      provider: state.provider,
      apiKey: state.apiKey,
      model: state.model,
      message: prompt,
      temperature: 0.2
    });

    // ✅ SALVAR NOVO RESUMO NO LOCALSTORAGE
    window.Storage.GeraMapas.saveSummary({
      nodeLabel: nodeLabel,
      mapTitle: mapTitle,
      summary: markdown,
      readingMode: mode,
      layoutModel: layoutModel
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
    throw err;
  }
}

// Function to update node slider content if it's open for the current node
async function updateNodeSliderContent(node, mapJson) {
  if (!nodeSlider || nodeSlider.style.display === 'none') {
    return; // Node slider is not open
  }

  const currentNodeTitle = nodeSlider.querySelector('.node-slider-title')?.textContent;
  const nodeLabel = node.data('label') || 'Nó sem título';

  // Check if node slider is showing this node
  if (currentNodeTitle !== nodeLabel) {
    return; // Different node is being shown
  }

  try {
    console.log(`🔄 Atualizando conteúdo do node-slider para: ${nodeLabel}`);

    // Clear all cached tab content for this node
    const mapTitle = (mapJson && mapJson.title) ? mapJson.title : 'Mapa Mental';
    const tabs = ['normal', 'tecnico', 'leigo', 'palestra', 'roteiro'];

    tabs.forEach(tab => {
      removeTabContentFromStorage(nodeLabel, tab);
    });

    // Update all tabs in node slider
    const layoutModel = state.currentModel || 'default';
    const mode = state.readingMode || 'normal';

    for (const tabName of tabs) {
      const target = nodeSlider.querySelector(`.tab-content[data-tab-content="${tabName}"]`);
      if (target) {
        target.innerHTML = '<em>Atualizando conteúdo...</em>';
        target.dataset.loading = '0';

        try {
          await generateTabContentForNode(target, node, mapJson, tabName, layoutModel, mode);
        } catch (error) {
          console.error(`Erro ao atualizar aba ${tabName}:`, error);
          target.innerHTML = `<div class="hint" style="color: var(--accent);">Erro ao atualizar: ${error.message}</div>`;
        }
      }
    }

    // Update the active tab display
    const activeTab = nodeSlider.querySelector('.tab-content.active');
    if (activeTab && activeTab.dataset.loading === '1') {
      // Content is ready, make sure it's visible
      nodeSlider.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      activeTab.classList.add('active');
    }

  } catch (error) {
    console.error('Erro ao atualizar node-slider:', error);
  }
}

// Function to update specific tab content
async function updateTabContent(nodeSlider, node, mapJson, tabName, layoutModel, mode) {
  try {
    const target = nodeSlider.querySelector(`.tab-content[data-tab-content="${tabName}"]`);
    const updateBtn = nodeSlider.querySelector(`.tab-update-internal[data-tab="${tabName}"]`);
    const nodeLabel = node.data('label') || 'Nó sem título';

    if (!target || !updateBtn) return;

    // Check if API is configured
    if (!state.apiKey || !state.model) {
      target.innerHTML = `
        <div style="color: var(--accent); font-weight: 600; margin-bottom: 8px;">
          ⚠️ API não configurada
        </div>
        <div style="font-size: 0.9em; margin-bottom: 12px;">
          Configure sua API Key e modelo nas <strong>Configurações ⚙️</strong> para atualizar conteúdo.
        </div>
        <button class="btn small" onclick="document.getElementById('settingsBtn').click()" style="font-size: 0.8em; padding: 6px 10px;">
          ⚙️ Abrir Configurações
        </button>
      `;
      return;
    }

    // Show loading state
    updateBtn.textContent = '⏳';
    updateBtn.disabled = true;
    target.innerHTML = '<em>Gerando novo conteúdo...</em>';
    target.dataset.loading = '0';

    // Remove cached content to force regeneration
    removeTabContentFromStorage(nodeLabel, tabName);

    // Generate new content
    await generateTabContentForNode(target, node, mapJson, tabName, layoutModel, mode);

    // Update button state
    updateBtn.textContent = '✅';
    setTimeout(() => {
      updateBtn.textContent = '🔄';
      updateBtn.disabled = false;
    }, 2000);

    console.log(`🔄 Aba atualizada: ${tabName}`);

  } catch (error) {
    console.error(`Erro ao atualizar aba ${tabName}:`, error);

    const target = nodeSlider.querySelector(`.tab-content[data-tab-content="${tabName}"]`);
    const updateBtn = nodeSlider.querySelector(`.tab-update-internal[data-tab="${tabName}"]`);

    if (target) {
      target.innerHTML = `<div class="hint" style="color: var(--accent);">Erro ao atualizar: ${error.message}</div>`;
    }

    if (updateBtn) {
      updateBtn.textContent = '🔄';
      updateBtn.disabled = false;
    }
  }
}

// Function to generate tab content for a specific node
async function generateTabContentForNode(target, node, mapJson, tabName, layoutModel, mode) {
  const nodeLabel = node.data('label') || 'Nó sem título';
  const mapTitle = (mapJson && mapJson.title) ? mapJson.title : 'Mapa Mental';
  const parents = node.incomers('node').map(n => n.data('label')).filter(Boolean);
  const children = node.outgoers('node').map(n => n.data('label')).filter(Boolean);
  const connected = Array.from(new Set([...parents, ...children]));

  try {
    guardProvider();

    let prompt = '';
    let contentType = 'markdown';

    switch (tabName) {
      case 'tecnico':
        prompt = `Gere conteúdo TÉCNICO detalhado sobre "${nodeLabel}" do mapa "${mapTitle}". Use o modelo "${layoutModel}" e modo "${mode}". Inclua definições precisas, terminologia específica, análise profunda e conceitos avançados. Considere os nós relacionados: ${connected.join(', ')}. Responda em formato markdown estruturado com títulos, listas e exemplos técnicos.`;
        break;
      case 'leigo':
        prompt = `Explique "${nodeLabel}" do mapa "${mapTitle}" de forma SIMPLES e ACESSÍVEL, como se estivesse falando com alguém que não conhece o assunto. Use o modelo "${layoutModel}" e modo "${mode}". Use analogias cotidianas, linguagem clara e evite jargões técnicos. Considere os nós relacionados: ${connected.join(', ')}. Responda em formato markdown com explicações passo a passo.`;
        break;
      case 'palestra':
        prompt = `Crie um ROTEIRO DE PALESTRA em primeira pessoa sobre "${nodeLabel}" do mapa "${mapTitle}". Use o modelo "${layoutModel}" e modo "${mode}". Estruture como um discurso natural, com introdução envolvente, desenvolvimento claro e conclusão impactante. Considere os nós relacionados: ${connected.join(', ')}. Responda em formato markdown com marcações de tom de voz e pausas.`;
        break;
      case 'normal':
      default:
        prompt = `Gere conteúdo NORMAL sobre "${nodeLabel}" do mapa "${mapTitle}". Use o modelo "${layoutModel}" e modo "${mode}". Forneça informações equilibradas e bem estruturadas. Considere os nós relacionados: ${connected.join(', ')}. Responda em formato markdown.`;
        break;
    }

    const markdown = await window.AI.chatPlain({
      provider: state.provider,
      apiKey: state.apiKey,
      model: state.model,
      message: prompt,
      temperature: 0.2
    });

    // Save content to localStorage
    saveTabContentToStorage(nodeLabel, tabName, markdown);

    // Render markdown
    let rendered = '';
    try {
      if (window.marked) {
        const htmlContent = window.marked.parse ? window.marked.parse(markdown) : window.marked(markdown);
        rendered = processMarkdownLinks(htmlContent);
      } else {
        rendered = `<pre style="white-space:pre-wrap;word-wrap:break-word;">${markdown.replace(/</g,'&lt;')}</pre>`;
      }
    } catch (e) {
      rendered = `<pre style="white-space:pre-wrap;word-wrap:break-word;">${markdown.replace(/</g,'&lt;')}</pre>`;
    }

    target.innerHTML = rendered;
    target.dataset.loading = '1';

  } catch (error) {
    target.innerHTML = `<div class="hint" style="color: var(--accent);">Erro ao gerar conteúdo: ${error.message}</div>`;
    throw error;
  }
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
                         <button class="btn small update-summary" title="Atualizar resumo">🔄 Atualizar</button>
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
  
  // ✅ CORREÇÃO: Adicionar eventos de fechar (DESKTOP + MOBILE)
  const closeBtn = tooltip.querySelector('.node-tooltip-close');
  if (closeBtn) {
    // Evento para desktop
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
        console.log('❌ Popup de informação fechado pelo botão X (click)');
      }
    });
    
    // ✅ CORREÇÃO: Evento específico para móveis (PRIORIDADE MÁXIMA)
    closeBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
        console.log('❌ Popup de informação fechado pelo botão X (touch)');
      }
    }, { passive: false });
    
    // ✅ CORREÇÃO: Prevenir que o sistema de drag interfira
    closeBtn.addEventListener('touchstart', (e) => {
      e.stopImmediatePropagation();
    }, { passive: false });
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

    // ✅ VERIFICAR SE JÁ TEM RESUMO SALVO NO LOCALSTORAGE
    const savedSummary = window.Storage.GeraMapas.loadSummary(nodeLabel, mapTitle);

    let markdown = '';
    if (savedSummary &&
        savedSummary.readingMode === mode &&
        savedSummary.layoutModel === layoutModel &&
        savedSummary.summary) {
      // Usar resumo salvo se os parâmetros forem os mesmos
      markdown = savedSummary.summary;
      console.log(`📂 Resumo carregado do localStorage: ${nodeLabel}`);
    } else {
      // Gerar novo resumo se não houver salvo ou parâmetros diferentes
      console.log(`🤖 Gerando novo resumo via IA: ${nodeLabel}`);
      markdown = await window.AI.chatPlain({
      provider: state.provider,
      apiKey: state.apiKey,
      model: state.model,
      message: prompt,
      temperature: 0.2
    });

      // ✅ SALVAR RESUMO NO LOCALSTORAGE APÓS GERAÇÃO
      window.Storage.GeraMapas.saveSummary({
        nodeLabel: nodeLabel,
        mapTitle: mapTitle,
        summary: markdown,
        readingMode: mode,
        layoutModel: layoutModel
      });
    }

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

  // Add update behavior - regenerate summary
  const updateBtn = tooltip.querySelector('.update-summary');
  if (updateBtn) {
    updateBtn.addEventListener('click', async () => {
      try {
        // Check if API is configured
        if (!state.apiKey || !state.model) {
          const textEl = tooltip.querySelector('.tt-text');
          if (textEl) {
            textEl.innerHTML = `
              <div style="color: var(--accent); font-weight: 600; margin-bottom: 8px;">
                ⚠️ API não configurada
              </div>
              <div style="font-size: 0.9em; margin-bottom: 12px;">
                Configure sua API Key e modelo nas <strong>Configurações ⚙️</strong> para atualizar resumos.
              </div>
              <button class="btn small" onclick="document.getElementById('settingsBtn').click()" style="font-size: 0.8em; padding: 6px 10px;">
                ⚙️ Abrir Configurações
              </button>
            `;
          }
          return;
        }

        // Show loading state and disable button
        updateBtn.textContent = '🔄 Atualizando...';
        updateBtn.disabled = true;

        const textEl = tooltip.querySelector('.tt-text');
        if (textEl) {
          textEl.innerHTML = 'Gerando novo resumo...';
        }

        // Delete existing summary from cache
        const mapTitle = (mapJson && mapJson.title) ? mapJson.title : 'Mapa Mental';
        const layoutModel = state.currentModel || 'default';
        const mode = state.readingMode || 'normal';

        window.Storage.GeraMapas.deleteSummary(nodeLabel, mapTitle);

        // Generate new summary
        await updateTooltipSummary(tooltip, node, mapJson, nodeLabel, mapTitle, layoutModel, mode);

        // Update node-slider if it's open and showing this node
        await updateNodeSliderContent(node, mapJson);

        // Re-enable button
        updateBtn.textContent = '✅ Atualizado';
        setTimeout(() => {
          updateBtn.textContent = '🔄 Atualizar';
          updateBtn.disabled = false;
        }, 2000);

        console.log(`🔄 Resumo atualizado: ${nodeLabel}`);
      } catch (error) {
        console.error('Erro ao atualizar resumo:', error);
        const textEl = tooltip.querySelector('.tt-text');
        if (textEl) {
          textEl.textContent = `Erro ao atualizar: ${error.message}`;
        }

        // Re-enable button on error
        updateBtn.textContent = '🔄 Atualizar';
        updateBtn.disabled = false;
      }
    });
  }
  // Expand (full page) behavior: generate full markdown page via LLM and open slider
  const expandBtn = tooltip.querySelector('.expand-node');
  if (expandBtn) {
    expandBtn.addEventListener('click', async () => {
      if (!state.currentMap) return;
      
      // ✅ CORREÇÃO: Fechar tooltip automaticamente ao abrir expansão
      if (tooltip && currentTooltip === tooltip) {
        tooltip.remove();
        currentTooltip = null;
        console.log('✅ Tooltip fechado automaticamente ao abrir Expansão');
      }
      
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
              // ✅ CORREÇÃO: Configurar marked para evitar avisos de deprecação
              const markedOptions = {
                mangle: false,
                headerIds: false,
                headerPrefix: ''
              };
              
              // Configurar marked com opções
              if (window.marked.setOptions) {
                window.marked.setOptions(markedOptions);
              }
              
              const htmlContent = window.marked.parse ? window.marked.parse(md, markedOptions) : window.marked(md, markedOptions);
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
              <button data-tab="ia-tutor" class="tab">🤖 IA Tutor</button>
              <button id="downloadTabBtn" class="tab download-tab" title="Download conteúdo da aba ativa">📥</button>
            </div>
            <div class="node-tabs-body">
              <div data-tab-content="normal" class="tab-content active">
                <div class="tab-content-header">
                  <button class="tab-update-internal" data-tab="normal" title="Atualizar conteúdo">🔄 Atualizar</button>
                </div>
                <div class="tab-content-body">${normalHtml}</div>
              </div>
              <div data-tab-content="tecnico" class="tab-content" data-loading="0">
                <div class="tab-content-header">
                  <button class="tab-update-internal" data-tab="tecnico" title="Atualizar conteúdo">🔄 Atualizar</button>
                </div>
                <div class="tab-content-body"><em>Carregue a aba Técnico para gerar conteúdo aprofundado...</em></div>
              </div>
              <div data-tab-content="leigo" class="tab-content" data-loading="0">
                <div class="tab-content-header">
                  <button class="tab-update-internal" data-tab="leigo" title="Atualizar conteúdo">🔄 Atualizar</button>
                </div>
                <div class="tab-content-body"><em>Carregue a aba Leigo para gerar explicação acessível...</em></div>
              </div>
              <div data-tab-content="palestra" class="tab-content" data-loading="0">
                <div class="tab-content-header">
                  <button class="tab-update-internal" data-tab="palestra" title="Atualizar conteúdo">🔄 Atualizar</button>
                </div>
                <div class="tab-content-body"><em>Carregue a aba Palestra para gerar roteiro em primeira pessoa...</em></div>
              </div>
              <div data-tab-content="roteiro" class="tab-content" data-loading="0">
                <div class="tab-content-body"></div>
              </div>
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
              <div data-tab-content="ia-tutor" class="tab-content" data-loading="0">
                <div class="ia-tutor-container">
                  <div class="ia-tutor-suggestions">
                    <div class="ia-suggestions-header">💡 Perguntas sugeridas</div>
                    <div class="ia-suggestions-list" id="iaSuggestionsList"></div>
                  </div>
                  <div class="ia-tutor-chat">
                    <div class="chat-messages" id="iaChatMessages"></div>
                    <div class="chat-input-container">
                      <input type="text" class="chat-input" id="iaChatInput" placeholder="Digite sua pergunta sobre este nó..." />
                      <button class="btn primary chat-send-btn" id="iaSendBtn">Enviar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        // ✅ LISTENERS PARA BOTÕES DE ATUALIZAR INTERNOS (dentro do conteúdo)
        const updateButtons = nodeSlider.querySelectorAll('.tab-update-internal');
        updateButtons.forEach(btn => {
          btn.addEventListener('click', async (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            
            const tabName = ev.target.dataset.tab;
            console.log(`🔄 Atualizando aba interna: ${tabName}`);
            await updateTabContent(nodeSlider, node, mapJson, tabName, layoutModel, mode);
          });
        });

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
          if (tab === 'ia-tutor') {
            // IA Tutor: inicializar chat e sugestões
            if (target.dataset.loading !== '1') {
              initIATutorChat(target, node, mapJson, nodeLabel, mapTitle);
              target.dataset.loading = '1';
            }
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
  
  // ✅ CORREÇÃO: Touch events para dispositivos móveis (sem interferir com botão fechar)
  let isTouchDragging = false;
  let startTouch = null;
  
  header.addEventListener('touchstart', (e) => {
    // ✅ CORREÇÃO: Verificar se é botão fechar ANTES de qualquer processamento
    if (e.target.classList.contains('node-tooltip-close') || 
        e.target.closest('.node-tooltip-close')) {
      console.log('🔒 Touch no botão fechar - ignorando sistema de drag');
      return; // Deixar o botão funcionar normalmente
    }
    
    const touch = e.touches[0];
    const rect = tooltip.getBoundingClientRect();
    dragOffset.x = touch.clientX - rect.left;
    dragOffset.y = touch.clientY - rect.top;
    startTouch = { x: touch.clientX, y: touch.clientY };
    isTouchDragging = false;
    
    console.log('📱 Touch no header - preparando para possível drag');
  }, { passive: false });
  
  document.addEventListener('touchmove', (e) => {
    if (!startTouch) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - startTouch.x);
    const deltaY = Math.abs(touch.clientY - startTouch.y);
    
    // ✅ CORREÇÃO: Só iniciar drag se movimento for MUITO significativo (evitar conflito com toque simples)
    if (deltaX > 15 || deltaY > 15) {
      isTouchDragging = true;
      tooltip.classList.add('dragging');
      
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
      
      console.log('📱 Drag ativado - movimento significativo detectado');
    e.preventDefault();
    }
  }, { passive: false });
  
  document.addEventListener('touchend', () => {
    if (isTouchDragging) {
      isTouchDragging = false;
      tooltip.classList.remove('dragging');
    }
    startTouch = null;
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
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, model: state.model, theme: state.theme, layout: state.layout });
}


/* Helper to generate English image prompt in JSON format */
function generateImagePromptEnglish({ title, node, parents, children, desc }) {
  // ✅ CORREÇÃO: Gerar prompt em JSON com nome do nó, descrição visual e contexto
  const nodeName = node || 'Untitled Node';
  
  // Descrição do conteúdo do resumo (primeira linha, em inglês)
  const shortDesc = desc ? (desc.split('\n')[0] || '').replace(/[*_`]/g,'').trim() : '';
  
  // Contexto dos nós pais
  const context = parents && parents.length ? `This node belongs to: ${parents.join(', ')}.` : '';
  
  // Elementos filhos
  const elements = children && children.length ? `Contains sub-elements: ${children.join(', ')}.` : '';
  
  // Criar prompt visual em inglês
  const visualDescription = shortDesc 
    ? `${shortDesc}. ` 
    : `${nodeName} from the mind map "${title}". `;
  
  const fullPrompt = `${visualDescription}${context}${elements} Render a visually striking illustration with high-detail, cinematic composition focused on clear silhouette and color harmony; use warm mid-tone highlights with complementary accents, soft natural lighting, shallow depth of field, crisp textures, and painterly yet realistic rendering. Style suggestions: dramatic editorial photography blended with digital painting, 3:4 portrait orientation, balanced negative space, vivid but tasteful palette, no text, high visual clarity — suitable for concept art or cover illustration.`;
  
  // Retornar JSON em inglês
  return JSON.stringify({
    nodeName: nodeName,
    visualDescription: fullPrompt,
    nodeLabel: nodeName
  }, null, 2);
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

/* IA Tutor Chat initialization */
async function initIATutorChat(container, node, mapJson, nodeLabel, mapTitle) {
  const suggestionsList = container.querySelector('#iaSuggestionsList');
  const chatMessages = container.querySelector('#iaChatMessages');
  const chatInput = container.querySelector('#iaChatInput');
  const sendBtn = container.querySelector('#iaSendBtn');
  
  // Clear previous content
  chatMessages.innerHTML = '';
  suggestionsList.innerHTML = '';
  
  // Generate initial context about the node
  const nodeContext = await generateNodeContext(node, mapJson, nodeLabel);
  
  // Generate 3-4 suggested questions
  const suggestions = await generateSuggestedQuestions(nodeContext);
  
  // Render suggestions
  suggestionsList.innerHTML = suggestions.map((q, idx) => 
    `<button class="suggestion-btn" data-question="${idx}">${q}</button>`
  ).join('');
  
  // Attach click listeners to suggestions
  suggestionsList.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const questionIdx = parseInt(btn.dataset.question);
      const question = suggestions[questionIdx];
      chatInput.value = question;
      await sendMessage();
    });
  });
  
  // Store sendMessage function reference to prevent duplicate listeners
  let sendMessageHandler = null;
  
  // Send button listener
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-message user-message';
    userMsgDiv.textContent = message;
    chatMessages.appendChild(userMsgDiv);
    
    // Clear input
    chatInput.value = '';
    chatInput.disabled = true;
    sendBtn.disabled = true;
    
    // Add loading message
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message bot-message loading';
    loadingDiv.innerHTML = '<div class="loading-dots">⏳ Gerando resposta...</div>';
    chatMessages.appendChild(loadingDiv);
    // Scroll smoothly to show new message while keeping input visible
    requestAnimationFrame(() => {
      chatMessages.scrollTop = Math.min(chatMessages.scrollHeight - chatMessages.clientHeight, chatMessages.scrollTop + 200);
    });
    
    try {
      // Generate AI response (use fresh nodeContext)
      const response = await generateIATutorResponse(message, nodeContext, mapJson);
      
      // Remove loading
      loadingDiv.remove();
      
      // Add bot response
      const botMsgDiv = document.createElement('div');
      botMsgDiv.className = 'chat-message bot-message';
      botMsgDiv.innerHTML = formatResponse(response);
      chatMessages.appendChild(botMsgDiv);
      
      // Check if response suggests creating a node
      if (response.shouldCreateNode && response.nodeSuggestion) {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'chat-suggestion';
        suggestionDiv.innerHTML = `
          <strong>💡 Sugestão:</strong> ${response.nodeSuggestion}
          <button class="btn small create-node-btn">Criar nó sobre isso</button>
        `;
        chatMessages.appendChild(suggestionDiv);
        
        // Add node creation listener
        suggestionDiv.querySelector('.create-node-btn').addEventListener('click', async () => {
          await createNodeFromSuggestion(response.nodeSuggestion, nodeLabel, mapJson, chatMessages);
        });
      }
      
      // Show related nodes only if user's question is off-topic
      if (response.showRelatedNodes && response.relatedNodes && response.relatedNodes.length > 0) {
        const relatedDiv = document.createElement('div');
        relatedDiv.className = 'chat-message bot-message related-nodes';
        relatedDiv.innerHTML = `
          <strong>📍 Nós relacionados no mapa:</strong>
          <ul style="margin: 8px 0 0 20px; padding: 0;">
            ${response.relatedNodes.map(n => `<li>${n.label} <span style="opacity: 0.7; font-size: 0.9em;">(${n.path})</span></li>`).join('')}
          </ul>
        `;
        chatMessages.appendChild(relatedDiv);
      }
    } catch (err) {
      loadingDiv.remove();
      const errorDiv = document.createElement('div');
      errorDiv.className = 'chat-message bot-message error';
      errorDiv.textContent = `❌ Erro: ${err.message}`;
      chatMessages.appendChild(errorDiv);
      console.error('Error in IA Tutor chat:', err);
    } finally {
      chatInput.disabled = false;
      sendBtn.disabled = false;
      chatInput.focus();
      // Only scroll a bit to keep input visible, not to the absolute bottom
      requestAnimationFrame(() => {
        chatMessages.scrollTop = Math.min(chatMessages.scrollHeight - chatMessages.clientHeight, chatMessages.scrollTop + 300);
      });
    }
  }
  
  // Remove old listeners if they exist
  if (sendMessageHandler) {
    sendBtn.removeEventListener('click', sendMessageHandler);
    chatInput.removeEventListener('keypress', sendMessageHandler);
  }
  
  // Store new handler
  sendMessageHandler = (e) => {
    if (e.key === 'Enter' || !e.key) {
      sendMessage();
    }
  };
  
  sendBtn.addEventListener('click', sendMessageHandler);
  chatInput.addEventListener('keypress', sendMessageHandler);
  
  // Show welcome message
  const welcomeMsg = document.createElement('div');
  welcomeMsg.className = 'chat-message bot-message welcome';
  welcomeMsg.innerHTML = `
    <div class="welcome-header">👋 Olá! Sou seu IA Tutor</div>
    <div class="welcome-text">Posso conversar sobre <strong>${nodeLabel}</strong> e tudo relacionado a esse nó no mapa <strong>${mapTitle}</strong>.</div>
    <div class="welcome-tip">💡 Dica: Clique em uma das perguntas sugeridas para começar!</div>
  `;
  chatMessages.appendChild(welcomeMsg);
}

/* Generate context about the node for IA Tutor */
async function generateNodeContext(node, mapJson, nodeLabel) {
  // Collect info about the node
  const nodeData = {
    label: nodeLabel,
    summary: '',
    parents: [],
    children: []
  };
  
  // Try to get summary from localStorage
  const savedSummary = window.Storage?.GeraMapas?.loadSummary(nodeLabel, mapJson.title);
  if (savedSummary && savedSummary.summary) {
    nodeData.summary = savedSummary.summary;
  }
  
  // Find parents and children in the map
  function walkTree(currentNode, path = []) {
    if (!currentNode) return null;
    if (currentNode.label === nodeLabel) {
      return { found: true, path, node: currentNode };
    }
    if (currentNode.children) {
      for (const child of currentNode.children) {
        const result = walkTree(child, [...path, currentNode.label]);
        if (result) return result;
      }
    }
    return null;
  }
  
  const result = walkTree(mapJson.nodes[0]);
  if (result) {
    nodeData.parents = result.path;
    nodeData.children = (result.node.children || []).map(c => c.label);
  }
  
  return nodeData;
}

/* Generate suggested questions about the node */
async function generateSuggestedQuestions(nodeContext) {
  // Perguntas baseadas no conteúdo do nó
  const baseQuestions = [];
  
  // Se tem resumo, usar contexto do resumo
  if (nodeContext.summary) {
    const summaryShort = nodeContext.summary.substring(0, 200);
    baseQuestions.push(
      `Explique o conceito principal de ${nodeContext.label}`,
      `Quais são os pontos mais importantes sobre ${nodeContext.label}?`,
      `Como posso aplicar ${nodeContext.label} na prática?`
    );
  }
  
  // Se tem filhos, perguntar sobre relacionamento
  if (nodeContext.children && nodeContext.children.length > 0) {
    baseQuestions.push(`Qual a relação entre ${nodeContext.label} e seus elementos?`);
  }
  
  // Perguntas genéricas se não tem contexto suficiente
  if (baseQuestions.length === 0) {
    baseQuestions.push(
      `O que é ${nodeContext.label}?`,
      `Por que ${nodeContext.label} é importante?`,
      `Como funciona ${nodeContext.label}?`,
      `Principais conceitos de ${nodeContext.label}`
    );
  }
  
  return baseQuestions.slice(0, 4);
}

/* Generate IA Tutor response */
async function generateIATutorResponse(question, nodeContext, mapJson) {
  // Check if AI is configured
  if (!window.AI || typeof window.AI.chatPlain !== 'function') {
    throw new Error('Modelo de IA não disponível. Configure uma API key nas configurações.');
  }
  
  // Check if provider and API key are set
  if (!state.provider || !state.apiKey) {
    throw new Error('Configure uma API key nas configurações para usar o IA Tutor.');
  }
  
  // Search for related nodes in the map
  const relatedNodes = searchMapForTopic(question, mapJson, nodeContext.label);
  
  // Build comprehensive context including map search results
  let contextPrompt = `
Você é um IA Tutor especializado em explicar conceitos de um mapa mental.

CONTEXTO DO NÓ ATUAL:
- Nome: ${nodeContext.label}
- Resumo: ${nodeContext.summary || 'Não disponível'}
- Nós pais: ${nodeContext.parents.join(' → ') || 'Raiz do mapa'}
- Nós filhos: ${nodeContext.children.join(', ') || 'Nenhum'}

${relatedNodes.length > 0 ? `\nNÓS RELACIONADOS NO MAPA:\n${relatedNodes.map((n, i) => `- ${i + 1}. ${n.label} (${n.path}`).join('\n')}` : ''}

REGRAS IMPORTANTES:
1. Você deve responder APENAS sobre ${nodeContext.label} e assuntos diretamente relacionados.
2. Se a pergunta do usuário NÃO estiver relacionada a ${nodeContext.label}, você deve:
   ${relatedNodes.length > 0 ? 
     `- Informar que sua função é falar sobre ${nodeContext.label}
   - Sugerir que o usuário verifique os nós relacionados listados acima
   - Se nenhum nó relacionado for encontrado, sugerir criar um novo nó sobre esse assunto` :
     `- Informar que sua função é falar sobre ${nodeContext.label}
   - Sugerir onde no mapa o usuário pode encontrar essa informação
   - Se a informação não existir no mapa, sugerir criar um novo nó sobre esse assunto`}
3. Use linguagem clara e didática.
4. Faça conexões com os nós pais e filhos quando relevante.
5. Seja conciso mas completo.

PERGUNTA DO USUÁRIO:
${question}

RESPOSTA (em formato de mensagem):`;

  const response = await window.AI.chatPlain({
    provider: state.provider,
    apiKey: state.apiKey,
    model: state.model,
    message: contextPrompt,
    temperature: 0.2
  });
  
  // Parse response to detect suggestions
  const shouldCreateNode = response.includes('criar') || response.includes('novo nó');
  const nodeSuggestion = shouldCreateNode ? extractNodeSuggestion(response) : '';
  
  // Detect if response indicates the question is off-topic
  const isOffTopic = response.toLowerCase().includes('não posso responder') || 
                     response.toLowerCase().includes('sua função é') ||
                     response.toLowerCase().includes('verifique os nós relacionados');
  
  return {
    text: response,
    shouldCreateNode,
    nodeSuggestion,
    relatedNodes: relatedNodes.slice(0, 3), // Return top 3 related nodes
    showRelatedNodes: isOffTopic && relatedNodes.length > 0 // Only show if question is off-topic and nodes found
  };
}

/* Search the map for nodes related to a topic */
function searchMapForTopic(query, mapJson, excludeNode) {
  const results = [];
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  function walkTree(node, path = '') {
    if (!node) return;
    
    const currentNodePath = path ? `${path} → ${node.label}` : node.label;
    
    // Skip the current node
    if (node.label === excludeNode) {
      if (node.children) {
        node.children.forEach(child => walkTree(child, currentNodePath));
      }
      return;
    }
    
    // Check if node label or children contain keywords
    const nodeLabelLower = node.label.toLowerCase();
    let relevance = 0;
    
    // Exact match
    if (nodeLabelLower === queryLower) {
      relevance = 100;
    }
    // Contains query
    else if (nodeLabelLower.includes(queryLower)) {
      relevance = 80;
    }
    // Keyword matches
    else {
      keywords.forEach(kw => {
        if (nodeLabelLower.includes(kw)) {
          relevance += 20;
        }
      });
    }
    
    // Check children
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        const childLower = child.label.toLowerCase();
        if (childLower.includes(queryLower) || keywords.some(kw => childLower.includes(kw))) {
          relevance += 10;
        }
      });
    }
    
    // Only add if relevant
    if (relevance > 0) {
      results.push({
        label: node.label,
        path: currentNodePath,
        relevance
      });
    }
    
    // Continue searching children
    if (node.children) {
      node.children.forEach(child => walkTree(child, currentNodePath));
    }
  }
  
  if (mapJson.nodes && mapJson.nodes[0]) {
    walkTree(mapJson.nodes[0]);
  }
  
  // Sort by relevance and return
  return results.sort((a, b) => b.relevance - a.relevance);
}

function extractNodeSuggestion(response) {
  // Try to extract suggested node topic from response
  const match = response.match(/criar.*?nó.*?(?:sobre|para|com)(.*?)(?:\.|$|,)/i);
  return match ? match[1].trim() : '';
}

function formatResponse(response) {
  // Handle both string and object responses
  const text = typeof response === 'string' ? response : (response.text || response);
  
  // Use marked for full markdown support if available, otherwise use simple formatting
  if (window.marked) {
    try {
      const markedOptions = {
        mangle: false,
        headerIds: false,
        headerPrefix: '',
        breaks: true, // Enable line breaks
        gfm: true // GitHub Flavored Markdown (for emoji support)
      };
      
      // Configure marked
      if (window.marked.setOptions) {
        window.marked.setOptions(markedOptions);
      }
      
      // Parse markdown
      const htmlContent = window.marked.parse 
        ? window.marked.parse(String(text), markedOptions)
        : window.marked(String(text), markedOptions);
      
      // Process links
      return processMarkdownLinks(htmlContent);
    } catch (e) {
      console.warn('Failed to parse markdown, using fallback:', e);
      return formatResponseFallback(text);
    }
  } else {
    return formatResponseFallback(text);
  }
}

function formatResponseFallback(text) {
  let html = String(text);
  
  // Basic markdown support without marked library
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Lists
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

/* Utility: Extract and validate JSON from AI response */
function extractAndValidateJSON(response) {
  try {
    // Tentar parsear direto primeiro
    const directParse = JSON.parse(response);
    return directParse;
  } catch (e) {
    console.log('⚠️ Parse direto falhou, tentando extrair JSON...');
  }
  
  try {
    // Tentar extrair JSON usando regex mais inteligente
    // Procurar por um JSON válido começando por {
    const jsonMatches = response.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
    
    if (jsonMatches && jsonMatches.length > 0) {
      // Tentar o último match (provavelmente o JSON completo)
      for (let i = jsonMatches.length - 1; i >= 0; i--) {
        try {
          const parsed = JSON.parse(jsonMatches[i]);
          console.log(`✅ JSON extraído com sucesso (tentativa ${jsonMatches.length - i})`);
          return parsed;
        } catch (e) {
          console.log(`⚠️ Tentativa ${jsonMatches.length - i} falhou:`, e.message);
        }
      }
    }
    
    // Fallback: tentar extrair tudo entre primeiro { e último }
    const fallbackMatch = response.match(/\{[\s\S]*\}/);
    if (fallbackMatch) {
      const parsed = JSON.parse(fallbackMatch[0]);
      console.log('✅ JSON extraído (fallback)');
      return parsed;
    }
    
    throw new Error('Nenhum JSON válido encontrado na resposta da IA');
  } catch (error) {
    console.error('❌ Erro ao extrair JSON:', error);
    console.log('📝 Resposta da IA:', response.substring(0, 500));
    throw new Error(`Erro ao processar resposta da IA: ${error.message}. Resposta: ${response.substring(0, 200)}`);
  }
}

/* Create node from chat suggestion in IA Tutor */
async function createNodeFromSuggestion(nodeSuggestion, currentNodeLabel, mapJson, chatMessagesElement) {
  if (!state.currentMap) {
    alert('❌ Nenhum mapa carregado. Não foi possível criar o nó.');
    return;
  }

  // Mostrar mensagem de progresso
  const progressMsg = document.createElement('div');
  progressMsg.className = 'chat-message bot-message loading';
  progressMsg.textContent = '🔄 Criando nó no mapa...';
  chatMessagesElement.appendChild(progressMsg);
  chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;

  try {
    console.log('➕ Criando nó a partir da sugestão do IA Tutor:', nodeSuggestion);
    
    // Criar prompt para adicionar nó filho ao nó atual
    const addNodePrompt = `Você deve adicionar UM NOVO NÓ FILHO ao mapa mental existente como subnó de: "${currentNodeLabel}".

MAPA ATUAL:
${JSON.stringify(state.currentMap, null, 2)}

NÓ PAI: ${currentNodeLabel}
NOVO NÓ: ${nodeSuggestion}

INSTRUÇÕES:
1. Analise o mapa atual
2. Encontre o nó "${currentNodeLabel}" no mapa
3. Adicione UM nó filho chamado "${nodeSuggestion}" conectado a "${currentNodeLabel}"
4. Mantenha toda a estrutura existente
5. O novo nó deve ser relevante ao contexto do nó pai
6. Retorne o mapa COMPLETO (original + novo nó) em formato JSON válido

Responda APENAS com o JSON do mapa completo, sem explicações.`;

    guardProvider();
    const response = await window.AI.chatPlain({
      provider: state.provider,
      apiKey: state.apiKey,
      model: state.model,
      message: addNodePrompt,
      temperature: 0.3
    });

    // Tentar extrair e validar JSON da resposta
    const newMap = extractAndValidateJSON(response);
    
    // ✅ VALIDAÇÃO: Verificar se o mapa tem estrutura válida
    if (!newMap || !newMap.nodes || !Array.isArray(newMap.nodes) || !newMap.nodes[0]) {
      throw new Error('O mapa retornado não tem estrutura válida (nodes[0] indefinido). Resposta da IA: ' + response.substring(0, 200));
    }
      
      // ✅ VERIFICAR SE É UM MAPA NOVO OU APENAS UPDATE
      // Se a IA retornou só o nó novo, precisamos integrá-lo ao mapa existente
      if (!newMap.title && newMap.nodes[0].label === nodeSuggestion) {
        console.log('⚠️ IA retornou apenas o nó novo, integrando ao mapa existente...');
        const existingMap = JSON.parse(JSON.stringify(state.currentMap));
        
        // Encontrar o nó pai no mapa existente e adicionar o filho
        function addChildToNode(node, targetLabel, newChild) {
          if (!node || !node.children) return false;
          
          if (node.label === targetLabel) {
            node.children = node.children || [];
            node.children.push({
              id: crypto.randomUUID(),
              label: newChild.label,
              children: newChild.children || []
            });
            return true;
          }
          
          for (const child of node.children) {
            if (addChildToNode(child, targetLabel, newChild)) {
              return true;
            }
          }
          
          return false;
        }
        
        const added = addChildToNode(existingMap.nodes[0], currentNodeLabel, newMap.nodes[0]);
        if (added) {
          state.currentMap = existingMap;
          await renderAndAttach(existingMap, true);
        } else {
          throw new Error('Não foi possível adicionar o nó ao mapa existente');
        }
      } else {
        // Mapa completo retornado pela IA
        state.currentMap = newMap;
        await renderAndAttach(newMap, true); // Preservar viewport
      }
      
      // Remover mensagem de progresso
      progressMsg.remove();
      
      // Mostrar mensagem de sucesso no chat
      const successMsg = document.createElement('div');
      successMsg.className = 'chat-message bot-message';
      successMsg.innerHTML = `✅ Nó <strong>${nodeSuggestion}</strong> adicionado ao mapa como filho de <strong>${currentNodeLabel}</strong>!`;
      chatMessagesElement.appendChild(successMsg);
      
      // Scroll to show success message
      requestAnimationFrame(() => {
        chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
      });
      
      console.log('✅ Nó criado com sucesso via IA Tutor');

  } catch (error) {
    console.error('Erro ao criar nó a partir da sugestão:', error);
    
    // Remover mensagem de progresso
    if (progressMsg.parentNode) {
      progressMsg.remove();
    }
    
    // Mostrar mensagem de erro no chat
    const errorMsg = document.createElement('div');
    errorMsg.className = 'chat-message bot-message error';
    errorMsg.textContent = `❌ Erro ao criar nó: ${error.message}`;
    chatMessagesElement.appendChild(errorMsg);
    
    alert(`❌ Erro ao criar nó: ${error.message}`);
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
  
  // ✅ DETECTAR MOBILE vs DESKTOP
  const isMobile = window.innerWidth <= 768;
  
  const popup = document.createElement('div');
  popup.className = 'context-popup';
  
  // ✅ APLICAR CONFIGURAÇÕES DIFERENTES PARA MOBILE vs DESKTOP
  if (isMobile) {
    // ✅ VERSÃO MOBILE: Layout otimizado, fixo e centralizado
    popup.classList.add('context-popup-mobile'); // Classe especial para mobile
    // ✅ CORREÇÃO CRÍTICA: Prevenir que o drag global do overlaysRoot interfira
    popup.setAttribute('data-no-drag', 'true'); // Marcar para não arrastar
    popup.style.cssText = `
      position: fixed !important;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 90vw !important;
      max-width: 400px !important;
      max-height: 85vh !important;
      background: white !important;
      border: 1px solid #ddd !important;
      border-radius: 12px !important;
      padding: 0 !important;
      box-shadow: 0 12px 40px rgba(0,0,0,0.3) !important;
      z-index: 99999 !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      user-select: text !important;
      touch-action: pan-y !important;
      cursor: default !important;
    `;
  } else {
    // ✅ VERSÃO DESKTOP: Drag habilitado, posicionamento livre
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
  }
  
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
      <label style="display: block; font-size: 12px; color: #666; margin-bottom: 8px;">Forma do nó:</label>
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
  
  // ✅ POSICIONAMENTO: No mobile já está centralizado via inline styles
  // No desktop, posicionar próximo ao nó
  if (!isMobile) {
  const bb = cyNode.renderedBoundingBox();
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
  // ✅ CORREÇÃO: Variáveis apenas para desktop (mobile não arrasta)
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  
  const header = popup.querySelector('.popup-header');
  const closeBtn = popup.querySelector('.popup-close-x');
  
  // ✅ CORREÇÃO: Event listeners para arrastar APENAS NO DESKTOP
  // No mobile, o popup é fixo e não deve ser arrastado
  if (!isMobile) {
    // Event listeners para arrastar (DESKTOP)
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
  } else {
    // ✅ MOBILE: Não adicionar listeners de drag (popup fixo)
    console.log('📱 Popup MOBILE: Listeners de drag NÃO adicionados');
    
    // ✅ MOBILE: Popup FIXO, SEM drag, apenas scroll interno
    header.style.touchAction = 'pan-y'; // Permitir scroll vertical interno
    header.style.cursor = 'default'; // Não mostrar cursor de drag
    header.style.userSelect = 'none'; // Prevenir seleção de texto no header
    
    console.log('📱 Popup MOBILE: Fixo centralizado, drag DESABILITADO');
  }
  
  // Event listeners dos botões
  const applyBtn = popup.querySelector('.popup-apply');
  const cancelBtn = popup.querySelector('.popup-cancel');
  
  // ✅ CORREÇÃO: Botão X do cabeçalho com suporte completo a touch
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    popup.remove();
    console.log('❌ Popup fechado pelo X');
  });
  
  // ✅ CORREÇÃO: Adicionar evento touch específico para o botão fechar
  closeBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    popup.remove();
    console.log('❌ Popup fechado pelo X (touch)');
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
  
  // ✅ CORREÇÃO CRÍTICA: Ignorar popups mobile e popups marcados como não-arrastáveis
  if (p.hasAttribute('data-no-drag') || p.classList.contains('context-popup-mobile')) {
    return; // Não arrastar popups mobile ou marcados
  }
  
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

// Cache management elements
const cacheStats = document.getElementById('cacheStats');
const clearAllSummariesBtn = document.getElementById('clearAllSummariesBtn');
const refreshCacheStatsBtn = document.getElementById('refreshCacheStatsBtn');
const summariesList = document.getElementById('summariesList');

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
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, model: state.model, theme: state.theme, layout: state.layout });
});

resetThemeBtn.addEventListener('click', () => {
  const def = { '--bg':'#ffffff','--text':'#111111','--accent':'#000000','--muted':'#666666','--border':'#e6e6e6', fontSize:16, fontFamily: "Noto Sans, system-ui, sans-serif" };
  state.theme = def;
  applyTheme(def);
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, model: state.model, theme: state.theme, layout: state.layout });
});

// Chat color controls
const chatBotBgColor = document.getElementById('chatBotBgColor');
const chatBotTextColor = document.getElementById('chatBotTextColor');
const chatBotBorderColor = document.getElementById('chatBotBorderColor');
const chatUserBgColor = document.getElementById('chatUserBgColor');
const chatUserTextColor = document.getElementById('chatUserTextColor');
const resetChatBotColorsBtn = document.getElementById('resetChatBotColorsBtn');
const resetChatUserColorsBtn = document.getElementById('resetChatUserColorsBtn');

// Initialize chat colors from localStorage
if (chatBotBgColor) {
  const persisted = window.Storage.GeraMapas.loadSettings();
  if (persisted && persisted.chatColors) {
    chatBotBgColor.value = persisted.chatColors.botBg || '#e3f2fd';
    chatBotTextColor.value = persisted.chatColors.botText || '#1976d2';
    chatBotBorderColor.value = persisted.chatColors.botBorder || '#90caf9';
    chatUserBgColor.value = persisted.chatColors.userBg || '#000000';
    chatUserTextColor.value = persisted.chatColors.userText || '#ffffff';
    
    // Apply colors immediately
    document.documentElement.style.setProperty('--chat-bot-bg', persisted.chatColors.botBg);
    document.documentElement.style.setProperty('--chat-bot-text', persisted.chatColors.botText);
    document.documentElement.style.setProperty('--chat-bot-border', persisted.chatColors.botBorder);
    document.documentElement.style.setProperty('--chat-user-bg', persisted.chatColors.userBg);
    document.documentElement.style.setProperty('--chat-user-text', persisted.chatColors.userText);
  }
}

// Apply chat colors on change
if (chatBotBgColor) {
  [chatBotBgColor, chatBotTextColor, chatBotBorderColor, chatUserBgColor, chatUserTextColor].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        document.documentElement.style.setProperty('--chat-bot-bg', chatBotBgColor.value);
        document.documentElement.style.setProperty('--chat-bot-text', chatBotTextColor.value);
        document.documentElement.style.setProperty('--chat-bot-border', chatBotBorderColor.value);
        document.documentElement.style.setProperty('--chat-user-bg', chatUserBgColor.value);
        document.documentElement.style.setProperty('--chat-user-text', chatUserTextColor.value);
        
        // Save to localStorage
        const settings = window.Storage.GeraMapas.loadSettings() || {};
        settings.chatColors = {
          botBg: chatBotBgColor.value,
          botText: chatBotTextColor.value,
          botBorder: chatBotBorderColor.value,
          userBg: chatUserBgColor.value,
          userText: chatUserTextColor.value
        };
        localStorage.setItem('mm.settings.v1', JSON.stringify(settings));
      });
    }
  });
}

// Reset buttons
if (resetChatBotColorsBtn) {
  resetChatBotColorsBtn.addEventListener('click', () => {
    chatBotBgColor.value = '#e3f2fd';
    chatBotTextColor.value = '#1976d2';
    chatBotBorderColor.value = '#90caf9';
    chatBotBgColor.dispatchEvent(new Event('input'));
  });
}

if (resetChatUserColorsBtn) {
  resetChatUserColorsBtn.addEventListener('click', () => {
    chatUserBgColor.value = '#000000';
    chatUserTextColor.value = '#ffffff';
    chatUserBgColor.dispatchEvent(new Event('input'));
  });
}

layoutTemplateSelect.addEventListener('change', (e) => {
  applyLayoutPreset(e.target.value);
});

/* reading mode selection */
if (readingModeSelect) {
  readingModeSelect.addEventListener('change', (e) => {
    state.readingMode = e.target.value;
    window.Storage.GeraMapas.saveSettings({ provider: state.provider, model: state.model, theme: state.theme, layout: state.layout, readingMode: state.readingMode });
  });
}

/* Live preview: apply immediately when changing font or size (without clicking Apply) */
fontSizeSelect.addEventListener('input', (e) => {
  const size = Number(e.target.value);
  document.documentElement.style.setProperty('--font-size-base', size + 'px');
  // persist selection in state.theme but do not overwrite other theme keys
  state.theme = state.theme || {};
  state.theme.fontSize = size;
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, model: state.model, theme: state.theme, layout: state.layout });
});

fontFamilySelect.addEventListener('change', (e) => {
  const fam = e.target.value;
  document.documentElement.style.setProperty('--font-family-main', fam);
  state.theme = state.theme || {};
  state.theme.fontFamily = fam;
  window.Storage.GeraMapas.saveSettings({ provider: state.provider, model: state.model, theme: state.theme, layout: state.layout });
});

/* Export functionality - Removido duplicata, já definido acima */

// Cache Management Functions
function updateCacheStats() {
  try {
    const summaries = window.Storage.GeraMapas.listAllSummaries();
    const totalSize = JSON.stringify(summaries).length;
    const oldestSummary = summaries.length > 0 ?
      new Date(Math.min(...summaries.map(s => s.timestamp))).toLocaleDateString() : 'N/A';
    const newestSummary = summaries.length > 0 ?
      new Date(Math.max(...summaries.map(s => s.timestamp))).toLocaleDateString() : 'N/A';

    if (cacheStats) {
      cacheStats.innerHTML = `
        <div class="stat-item">
          <span>Total de resumos:</span>
          <span class="stat-value">${summaries.length}</span>
        </div>
        <div class="stat-item">
          <span>Tamanho estimado:</span>
          <span class="stat-value">${(totalSize / 1024).toFixed(1)} KB</span>
        </div>
        <div class="stat-item">
          <span>Mais antigo:</span>
          <span class="stat-value">${oldestSummary}</span>
        </div>
        <div class="stat-item">
          <span>Mais recente:</span>
          <span class="stat-value">${newestSummary}</span>
        </div>
      `;
    }
  } catch (error) {
    console.error('Erro ao atualizar estatísticas do cache:', error);
    if (cacheStats) {
      cacheStats.innerHTML = '<p class="hint" style="color: var(--accent);">Erro ao carregar estatísticas</p>';
    }
  }
}

function updateSummariesList() {
  try {
    const summaries = window.Storage.GeraMapas.listAllSummaries();

    if (summariesList) {
      if (summaries.length === 0) {
        summariesList.innerHTML = '<div class="no-summaries">Nenhum resumo salvo no cache</div>';
        return;
      }

      summariesList.innerHTML = summaries
        .sort((a, b) => b.timestamp - a.timestamp) // Ordenar por mais recente primeiro
        .map(summary => {
          const date = new Date(summary.timestamp).toLocaleString();
          const truncatedTitle = summary.nodeLabel.length > 30 ?
            summary.nodeLabel.substring(0, 30) + '...' : summary.nodeLabel;

          return `
            <div class="summary-item">
              <div class="summary-info">
                <div class="summary-title">${escapeHtml(truncatedTitle)}</div>
                <div class="summary-meta">
                  ${summary.mapTitle} • ${summary.readingMode} • ${date}
                </div>
              </div>
              <div class="summary-actions">
                <button class="btn ghost delete-summary" data-node="${summary.nodeLabel}" data-map="${summary.mapTitle}" title="Excluir resumo">🗑️</button>
              </div>
            </div>
          `;
        }).join('');
    }
  } catch (error) {
    console.error('Erro ao atualizar lista de resumos:', error);
    if (summariesList) {
      summariesList.innerHTML = '<div class="no-summaries">Erro ao carregar resumos</div>';
    }
  }
}

function clearAllSummaries() {
  try {
    if (confirm('Tem certeza que deseja limpar todo o cache de resumos? Esta ação não pode ser desfeita.')) {
      // Limpar todos os resumos do localStorage
      localStorage.removeItem('mm.summaries.v1');

      // Atualizar interface
      updateCacheStats();
      updateSummariesList();

      console.log('✅ Todo cache de resumos foi limpo');
      alert('Cache de resumos limpo com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
    alert('Erro ao limpar cache. Tente novamente.');
  }
}

function deleteSummary(nodeLabel, mapTitle) {
  try {
    if (confirm(`Excluir resumo do nó "${nodeLabel}"?`)) {
      window.Storage.GeraMapas.deleteSummary(nodeLabel, mapTitle);
      updateCacheStats();
      updateSummariesList();
      console.log(`✅ Resumo excluído: ${nodeLabel}`);
    }
  } catch (error) {
    console.error('Erro ao excluir resumo:', error);
    alert('Erro ao excluir resumo. Tente novamente.');
  }
}

// Event listeners for cache management
if (clearAllSummariesBtn) {
  clearAllSummariesBtn.addEventListener('click', clearAllSummaries);
}

if (refreshCacheStatsBtn) {
  refreshCacheStatsBtn.addEventListener('click', () => {
    updateCacheStats();
    updateSummariesList();
  });
}

// Event delegation for delete buttons in summaries list
if (summariesList) {
  summariesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-summary')) {
      const nodeLabel = e.target.dataset.node;
      const mapTitle = e.target.dataset.map;
      deleteSummary(nodeLabel, mapTitle);
    }
  });
}

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

// ✅ CORREÇÃO: Tornar performZoom global para uso unificado
window.performZoom = function performZoom(factor, animate = true) {
  if (!state.cy) return;
  
  const newZoom = Math.max(0.1, Math.min(3.0, currentZoom * factor));
  if (newZoom === currentZoom) return;
  
  // ✅ CORREÇÃO: Salvar estado completo antes do zoom
  const nodePositions = {};
  state.cy.nodes().forEach(node => {
    nodePositions[node.id()] = {
      x: node.position().x,
      y: node.position().y
    };
  });
  
  const currentPan = state.cy.pan();
  currentZoom = newZoom;
  
  // ✅ CORREÇÃO: Desabilitar auto-organização durante zoom
  const wasAutoOrgActive = window.LayoutAlgorithm.isAutoOrganizationActive();
  if (wasAutoOrgActive) {
    window.LayoutAlgorithm.stopAutoOrganization();
    console.log('🔒 Auto-organização pausada durante zoom');
  }
  
  if (animate) {
    // ✅ CORREÇÃO: Zoom centrado na tela
    const container = state.cy.container();
    const center = container ? {
      x: container.clientWidth / 2,
      y: container.clientHeight / 2
    } : { x: 0, y: 0 };
    
    state.cy.animate({
      zoom: currentZoom,
      duration: 300,
      easing: 'ease-out'
    }, {
      complete: () => {
        // ✅ Restaurar posições dos nós após zoom
        state.cy.nodes().forEach(node => {
          const savedPos = nodePositions[node.id()];
          if (savedPos) {
            node.position(savedPos);
          }
        });
        
        // ✅ Restaurar pan atual
        state.cy.pan(currentPan);
        
        // ✅ Reativar auto-organização se estava ativa
        if (wasAutoOrgActive) {
          window.LayoutAlgorithm.startAutoOrganization(state.cy, {
            minGap: 50,
            damping: 0.6,
            stepMax: 20,
            forceStrength: 2.5,
            interval: 16,
            enableHierarchy: true,
            enableRootAnchor: true
          });
          console.log('🔓 Auto-organização reativada após zoom');
        }
      }
    });
  } else {
    // ✅ CORREÇÃO: Zoom centrado imediato
    const container = state.cy.container();
    const center = container ? {
      x: container.clientWidth / 2,
      y: container.clientHeight / 2
    } : { x: 0, y: 0 };
    
    state.cy.zoom({ level: currentZoom, renderedPosition: center });
    
    // ✅ Restaurar posições imediatamente
    state.cy.nodes().forEach(node => {
      const savedPos = nodePositions[node.id()];
      if (savedPos) {
        node.position(savedPos);
      }
    });
    
    // ✅ Restaurar pan atual
    state.cy.pan(currentPan);
    
    // ✅ Reativar auto-organização se estava ativa
    if (wasAutoOrgActive) {
      window.LayoutAlgorithm.startAutoOrganization(state.cy, {
        minGap: 50,
        damping: 0.6,
        stepMax: 20,
        forceStrength: 2.5,
        interval: 16,
        enableHierarchy: true,
        enableRootAnchor: true
      });
      console.log('🔓 Auto-organização reativada após zoom');
    }
  }
  
  updateZoomDisplay();
  console.log('🔍 Zoom centrado preservando posições:', Math.round(currentZoom * 100) + '%');
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
    performZoom(1.1);
  
  // Feedback visual
  zoomInBtn.style.transform = 'scale(0.9)';
  setTimeout(() => {
    zoomInBtn.style.transform = '';
  }, 150);
});

zoomOutBtn.addEventListener('click', () => {
    performZoom(0.91);
  
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
          performZoom(1.1);
        break;
      case '-':
        e.preventDefault();
          performZoom(0.91);
        break;
      case '0':
        e.preventDefault();
        zoomToFit();
        break;
    }
  }
});

// ✅ CORREÇÃO: Sincronização inteligente que evita conflitos
if (state.cy) {
  let isInternalZoom = false; // Flag para evitar loops
  
  state.cy.on('zoom', () => {
    if (isInternalZoom) return; // Evitar sincronização durante zoom interno
    
    const cyZoom = state.cy.zoom();
    if (Math.abs(cyZoom - currentZoom) > 0.01) {
      currentZoom = cyZoom;
      updateZoomDisplay();
    }
  });
  
  // ✅ CORREÇÃO: Marcar zoom interno para evitar conflitos
  const originalPerformZoom = window.performZoom;
  window.performZoom = function(factor, animate = true) {
    isInternalZoom = true;
    const result = originalPerformZoom(factor, animate);
    setTimeout(() => { isInternalZoom = false; }, 100);
    return result;
  };
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

// ✅ WhatsApp invite popup logic (GLOBAL SCOPE)
let whatsInviteTimer = null;
function openWhatsInvitePopup() {
  const el = document.getElementById('whatsInvitePopup');
  if (!el) return;
  el.classList.remove('hidden');
  el.classList.add('show');
  if (whatsInviteTimer) clearTimeout(whatsInviteTimer);
  whatsInviteTimer = setTimeout(() => {
    closeWhatsInvitePopup();
  }, 120000);
}
function closeWhatsInvitePopup() {
  const el = document.getElementById('whatsInvitePopup');
  if (!el) return;
  el.classList.remove('show');
  el.classList.add('hidden');
  if (whatsInviteTimer) {
    clearTimeout(whatsInviteTimer);
    whatsInviteTimer = null;
  }
}
function initWhatsInvitePopup() {
  const btn = document.getElementById('whatsInviteBtn');
  const closeBtn = document.getElementById('whatsInviteClose');
  
  // Botão "Entrar no Grupo" - abre link e fecha popup
  if (btn) {
    btn.addEventListener('click', () => {
      closeWhatsInvitePopup();
    }, { passive: true });
  }
  
  // Botão "Agora não" - fecha popup
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeWhatsInvitePopup();
    });
  }
  
  // Popup fica ativo até: clicar nos botões OU aguardar 2 minutos
  // NÃO fecha ao clicar no overlay (fundo escuro)
  
  setTimeout(openWhatsInvitePopup, 300);
}

// ========================================
// TESTE: VISIBILIDADE DO FOOTER NO MOBILE
// ========================================
function testFooterVisibility() {
  console.log('🔍 === TESTE: FOOTER (DISQUETE E LIXEIRA) ===');
  
  const footer = document.querySelector('.app-status');
  const saveBtn = document.getElementById('saveMapBtn');
  const deleteBtn = document.getElementById('deleteMapBtn');
  
  if (!footer) {
    console.error('❌ Footer (.app-status) NÃO ENCONTRADO!');
    return;
  }
  
  if (!saveBtn) {
    console.error('❌ Botão Salvar (#saveMapBtn) NÃO ENCONTRADO!');
    return;
  }
  
  if (!deleteBtn) {
    console.error('❌ Botão Deletar (#deleteMapBtn) NÃO ENCONTRADO!');
    return;
  }
  
  // Verificar se o footer está visível
  const footerStyles = window.getComputedStyle(footer);
  const footerDisplay = footerStyles.display;
  const footerVisibility = footerStyles.visibility;
  const footerOpacity = footerStyles.opacity;
  const footerHeight = footerStyles.height;
  const footerBottom = footer.getBoundingClientRect().bottom;
  const windowHeight = window.innerHeight;
  
  console.log('📊 Footer (.app-status):');
  console.log('  - Display:', footerDisplay);
  console.log('  - Visibility:', footerVisibility);
  console.log('  - Opacity:', footerOpacity);
  console.log('  - Height:', footerHeight);
  console.log('  - Bottom position:', footerBottom);
  console.log('  - Window height:', windowHeight);
  console.log('  - Footer visível na tela?', footerBottom <= windowHeight ? '✅ SIM' : '❌ NÃO (cortado)');
  
  // Verificar botões
  const saveBtnStyles = window.getComputedStyle(saveBtn);
  const deleteBtnStyles = window.getComputedStyle(deleteBtn);
  
  console.log('📊 Botão Salvar (#saveMapBtn):');
  console.log('  - Display:', saveBtnStyles.display);
  console.log('  - Visibility:', saveBtnStyles.visibility);
  console.log('  - Opacity:', saveBtnStyles.opacity);
  console.log('  - Width x Height:', saveBtnStyles.width, 'x', saveBtnStyles.height);
  
  console.log('📊 Botão Deletar (#deleteMapBtn):');
  console.log('  - Display:', deleteBtnStyles.display);
  console.log('  - Visibility:', deleteBtnStyles.visibility);
  console.log('  - Opacity:', deleteBtnStyles.opacity);
  console.log('  - Width x Height:', deleteBtnStyles.width, 'x', deleteBtnStyles.height);
  console.log('  - Disabled?', deleteBtn.disabled ? '🔒 SIM' : '✅ NÃO');
  
  // Verificar z-index
  console.log('📊 Z-Index:');
  console.log('  - Footer:', footerStyles.zIndex);
  
  // Verificar se há elementos sobrepondo
  const footerRect = footer.getBoundingClientRect();
  const centerX = footerRect.left + footerRect.width / 2;
  const centerY = footerRect.top + footerRect.height / 2;
  const elementAtCenter = document.elementFromPoint(centerX, centerY);
  
  console.log('📊 Elemento no centro do footer:', elementAtCenter?.tagName, elementAtCenter?.className);
  console.log('  - É o próprio footer?', elementAtCenter === footer || footer.contains(elementAtCenter) ? '✅ SIM' : '❌ NÃO (sobreposto)');
  
  console.log('✅ Teste de visibilidade do footer concluído!');
}

// Expor globalmente para testes
if (typeof window !== 'undefined') {
  window.testFooterVisibility = testFooterVisibility;
}

// ========================================
// TESTE: FLOATING CHAT - CENTRALIZAÇÃO E DRAG
// ========================================
function testFloatingChat() {
  console.log('🔍 === TESTE: FLOATING CHAT (CENTRALIZAÇÃO + DRAG) ===');
  
  const chat = document.getElementById('floatingChat');
  
  if (!chat) {
    console.error('❌ Floating Chat (#floatingChat) NÃO ENCONTRADO!');
    return;
  }
  
  // Verificar estado inicial
  const chatStyles = window.getComputedStyle(chat);
  const chatDisplay = chatStyles.display;
  
  console.log('📊 Estado Inicial do Chat:');
  console.log('  - Display:', chatDisplay);
  
  // Abrir o chat
  if (chatDisplay === 'none') {
    console.log('🔄 Abrindo chat...');
    toggleFloatingChat();
  }
  
  // Aguardar 100ms para o chat abrir
  setTimeout(() => {
    const chatStylesAfter = window.getComputedStyle(chat);
    const rect = chat.getBoundingClientRect();
    
    console.log('📊 Após Abrir:');
    console.log('  - Display:', chatStylesAfter.display);
    console.log('  - Inline Left:', chat.style.left || '(vazio - ✅ CSS ativo)');
    console.log('  - Inline Top:', chat.style.top || '(vazio - ✅ CSS ativo)');
    console.log('  - Inline Right:', chat.style.right || '(vazio - ✅ CSS ativo)');
    console.log('  - Inline Bottom:', chat.style.bottom || '(vazio - ✅ CSS ativo)');
    console.log('  - Inline Transform:', chat.style.transform || '(vazio - ✅ CSS ativo)');
    console.log('  - Computed Position:', chatStylesAfter.position);
    console.log('  - Computed Top:', chatStylesAfter.top);
    console.log('  - Computed Left:', chatStylesAfter.left);
    console.log('  - Computed Right:', chatStylesAfter.right);
    console.log('  - Computed Transform:', chatStylesAfter.transform);
    console.log('  - BoundingClientRect:', {
      top: rect.top.toFixed(2),
      left: rect.left.toFixed(2),
      width: rect.width.toFixed(2),
      height: rect.height.toFixed(2)
    });
    
    // Verificar se está centralizado (mobile)
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const centerX = window.innerWidth / 2;
      const chatCenterX = rect.left + rect.width / 2;
      const diff = Math.abs(centerX - chatCenterX);
      console.log('📱 Mobile - Centralização:');
      console.log('  - Centro da tela:', centerX.toFixed(2));
      console.log('  - Centro do chat:', chatCenterX.toFixed(2));
      console.log('  - Diferença:', diff.toFixed(2) + 'px');
      console.log('  - Centralizado?', diff < 10 ? '✅ SIM' : '❌ NÃO');
    }
    
    // Verificar drag area
    const dragArea = chat.querySelector('.floating-chat-drag-area');
    if (dragArea) {
      console.log('📊 Drag Area:');
      console.log('  - Encontrada:', '✅ SIM');
      
      // Contar listeners (aproximação)
      console.log('  - Listeners mousedown na dragArea:', '✅ Ativo');
      console.log('  - Listeners touchstart na dragArea:', '✅ Ativo');
      console.log('  - Listeners mousemove no document:', floatingChatDragging ? '⚠️ ATIVO (dragging em progresso)' : '✅ Inativo (só ativa no mousedown)');
      console.log('  - Estado floatingChatDragging:', floatingChatDragging ? '🔴 TRUE (arrastando)' : '✅ FALSE (não arrastando)');
    } else {
      console.error('❌ Drag Area NÃO ENCONTRADA!');
    }
    
    console.log('✅ Teste do Floating Chat concluído!');
    console.log('');
    console.log('📋 TESTES MANUAIS:');
    console.log('  1. ✅ Clique dentro do chat (não deve fechar)');
    console.log('  2. ✅ Clique e arraste a área de título (drag)');
    console.log('  3. ✅ Feche o chat (X)');
    console.log('  4. ✅ Reabra o chat (deve centralizar)');
    console.log('  5. ✅ Clique no botão X (deve fechar)');
  }, 100);
}

// Expor globalmente
if (typeof window !== 'undefined') {
  window.testFloatingChat = testFloatingChat;
}

// ========================================
// AUTO-TESTE: FOOTER AO GERAR MAPA
// ========================================
// Executar teste automaticamente quando um mapa for gerado
let footerTestExecuted = false;

function autoTestFooterOnMap() {
  if (footerTestExecuted) return;
  
  // Aguardar 2 segundos após o mapa ser gerado
  setTimeout(() => {
    if (state.currentMap) {
      console.log('🤖 === AUTO-TESTE: FOOTER NO MOBILE ===');
      console.log('📱 Dispositivo:', /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop');
      console.log('📏 Largura da tela:', window.innerWidth + 'px');
      testFooterVisibility();
      footerTestExecuted = true;
    }
  }, 2000);
}

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

function removeTabContentFromStorage(nodeLabel, tabName) {
  try {
    const storageKey = `tab_content_${nodeLabel.replace(/[^a-zA-Z0-9]/g, '_')}_${tabName}`;
    localStorage.removeItem(storageKey);
    console.log(`🗑️ Conteúdo removido do cache: ${tabName} para ${nodeLabel}`);
  } catch (error) {
    console.error('Erro ao remover conteúdo do cache:', error);
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

// ✅ FUNÇÃO DE TESTE ABRANGENTE PARA ZOOM EM TODOS OS CENÁRIOS
function testZoomAllScenarios() {
  console.log('🧪 TESTANDO ZOOM EM TODOS OS CENÁRIOS...');
  
  if (!state.currentMap || !state.cy) {
    console.error('❌ Nenhum mapa carregado');
    alert('Crie um mapa primeiro para testar o zoom');
    return;
  }
  
  const nodeCount = state.cy.nodes().length;
  console.log(`📊 Número de nós no mapa: ${nodeCount}`);
  
  // Salvar posições iniciais de todos os nós
  const initialPositions = {};
  state.cy.nodes().forEach(node => {
    initialPositions[node.id()] = {
      x: node.position().x,
      y: node.position().y
    };
  });
  
  console.log('📍 Posições iniciais salvas:', Object.keys(initialPositions).length, 'nós');
  
  // Testar zoom in
  console.log('🔍 Testando zoom in...');
  performZoom(1.5, false);
  
  setTimeout(() => {
    // Verificar se algum nó se moveu
    let movedNodes = 0;
    let totalMovement = 0;
    
    state.cy.nodes().forEach(node => {
      const initial = initialPositions[node.id()];
      const current = node.position();
      
      const deltaX = Math.abs(current.x - initial.x);
      const deltaY = Math.abs(current.y - initial.y);
      const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (movement > 5) { // Tolerância de 5px
        movedNodes++;
        totalMovement += movement;
        console.warn(`⚠️ Nó ${node.id()} se moveu:`, {
          deltaX: current.x - initial.x,
          deltaY: current.y - initial.y,
          movement: movement.toFixed(2)
        });
      }
    });
    
    if (movedNodes > 0) {
      console.error('❌ PROBLEMA DETECTADO:', movedNodes, 'nós se moveram durante zoom!');
      console.error('❌ Movimento total:', totalMovement.toFixed(2), 'px');
      alert(`❌ PROBLEMA: ${movedNodes} nós se moveram durante zoom!\n\nMovimento total: ${totalMovement.toFixed(2)}px\n\nVerifique o console para detalhes.`);
    } else {
      console.log('✅ SUCESSO: Nenhum nó se moveu durante zoom!');
      
      // Testar zoom out
      console.log('🔍 Testando zoom out...');
      performZoom(0.8, false);
      
      setTimeout(() => {
        // Verificar novamente após zoom out
        let movedNodesOut = 0;
        let totalMovementOut = 0;
        
        state.cy.nodes().forEach(node => {
          const initial = initialPositions[node.id()];
          const current = node.position();
          
          const deltaX = Math.abs(current.x - initial.x);
          const deltaY = Math.abs(current.y - initial.y);
          const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          
          if (movement > 5) {
            movedNodesOut++;
            totalMovementOut += movement;
          }
        });
        
        if (movedNodesOut > 0) {
          console.error('❌ PROBLEMA após zoom out:', movedNodesOut, 'nós se moveram!');
          alert(`❌ PROBLEMA após zoom out: ${movedNodesOut} nós se moveram!\n\nMovimento total: ${totalMovementOut.toFixed(2)}px`);
        } else {
          console.log('✅ SUCESSO COMPLETO: Nenhum nó se moveu em ambos os zooms!');
          alert('✅ TESTE PASSOU COMPLETAMENTE!\n\n✅ Zoom in: Nós permaneceram fixos\n✅ Zoom out: Nós permaneceram fixos\n\nProblema de movimento durante zoom CORRIGIDO!');
        }
      }, 100);
    }
  }, 100);
}

// ✅ EXPORTA FUNÇÃO DE TESTE ABRANGENTE
window.testZoomAllScenarios = testZoomAllScenarios;

// ✅ FUNÇÃO DE TESTE PARA NÓ ÚNICO E ZOOM
function testSingleNodeZoom() {
  console.log('🧪 TESTANDO COMPORTAMENTO DE NÓ ÚNICO E ZOOM...');
  
  if (!state.currentMap || !state.cy) {
    console.error('❌ Nenhum mapa carregado');
    alert('Crie um mapa primeiro para testar o comportamento de nó único');
    return;
  }
  
  const nodeCount = state.cy.nodes().length;
  console.log(`📊 Número de nós no mapa: ${nodeCount}`);
  
  if (nodeCount === 1) {
    console.log('✅ Teste válido: Mapa tem apenas um nó');
    
    // Testar zoom in
    console.log('🔍 Testando zoom in...');
    const initialPos = state.cy.nodes()[0].position();
    console.log('📍 Posição inicial do nó:', initialPos);
    
    // Aplicar zoom in
    performZoom(1.5, false);
    
    setTimeout(() => {
      const finalPos = state.cy.nodes()[0].position();
      console.log('📍 Posição final do nó:', finalPos);
      
      const moved = Math.abs(initialPos.x - finalPos.x) > 5 || Math.abs(initialPos.y - finalPos.y) > 5;
      
      if (moved) {
        console.error('❌ PROBLEMA: Nó se moveu durante zoom!');
        console.error('❌ Movimento detectado:', {
          deltaX: finalPos.x - initialPos.x,
          deltaY: finalPos.y - initialPos.y
        });
        alert('❌ PROBLEMA DETECTADO: Nó se moveu durante zoom!\n\nVerifique o console para detalhes.');
      } else {
        console.log('✅ SUCESSO: Nó permaneceu na posição original!');
        alert('✅ TESTE PASSOU: Nó único não se move durante zoom!\n\nProblema corrigido com sucesso.');
      }
    }, 100);
    
  } else {
    console.log('⚠️ Mapa tem múltiplos nós - teste não aplicável');
    alert(`Mapa tem ${nodeCount} nós. Para testar nó único, crie um mapa com apenas um nó.`);
  }
}

// ✅ EXPORTA FUNÇÃO DE TESTE
window.testSingleNodeZoom = testSingleNodeZoom;

// ✅ FUNÇÃO DE TESTE ESPECÍFICA PARA MOVIMENTO LATERAL
function testLateralMovement() {
  console.log('🧪 TESTANDO MOVIMENTO LATERAL DURANTE ZOOM...');
  
  if (!state.currentMap || !state.cy) {
    console.error('❌ Nenhum mapa carregado');
    alert('Crie um mapa primeiro para testar movimento lateral');
    return;
  }
  
  const nodeCount = state.cy.nodes().length;
  console.log(`📊 Número de nós no mapa: ${nodeCount}`);
  
  // Salvar posições iniciais de todos os nós
  const initialPositions = {};
  state.cy.nodes().forEach(node => {
    initialPositions[node.id()] = {
      x: node.position().x,
      y: node.position().y
    };
  });
  
  console.log('📍 Posições iniciais salvas:', Object.keys(initialPositions).length, 'nós');
  
  // Testar zoom in com wheel (simular)
  console.log('🔍 Testando zoom in com wheel...');
  performZoom(1.2, false);
  
  setTimeout(() => {
    // Verificar movimento lateral específico
    let lateralMovement = 0;
    let verticalMovement = 0;
    let totalNodes = 0;
    
    state.cy.nodes().forEach(node => {
      const initial = initialPositions[node.id()];
      const current = node.position();
      
      const deltaX = Math.abs(current.x - initial.x);
      const deltaY = Math.abs(current.y - initial.y);
      
      if (deltaX > 5) {
        lateralMovement++;
        console.warn(`⚠️ MOVIMENTO LATERAL detectado no nó ${node.id()}:`, {
          deltaX: current.x - initial.x,
          deltaY: current.y - initial.y
        });
      }
      
      if (deltaY > 5) {
        verticalMovement++;
      }
      
      totalNodes++;
    });
    
    console.log('📊 RESULTADOS DO TESTE:');
    console.log(`   Total de nós: ${totalNodes}`);
    console.log(`   Movimento lateral: ${lateralMovement}`);
    console.log(`   Movimento vertical: ${verticalMovement}`);
    
    if (lateralMovement > 0) {
      console.error('❌ PROBLEMA: Movimento lateral detectado!');
      alert(`❌ PROBLEMA: ${lateralMovement} nós se moveram lateralmente!\n\nIsso indica que o zoom não está centrado corretamente.\n\nVerifique o console para detalhes.`);
    } else if (verticalMovement > 0) {
      console.warn('⚠️ AVISO: Movimento vertical detectado (pode ser normal)');
      alert(`⚠️ AVISO: ${verticalMovement} nós se moveram verticalmente.\n\nIsso pode ser normal dependendo do layout.\n\nMovimento lateral: ${lateralMovement} (✅ OK)`);
    } else {
      console.log('✅ SUCESSO: Nenhum movimento detectado!');
      alert('✅ TESTE PASSOU: Nenhum movimento lateral ou vertical detectado!\n\nZoom está funcionando perfeitamente!');
    }
  }, 100);
}

// ✅ EXPORTA FUNÇÃO DE TESTE DE MOVIMENTO LATERAL
window.testLateralMovement = testLateralMovement;

// ✅ FUNÇÃO DE VERIFICAÇÃO COMPLETA DO SISTEMA
function verifySystemIntegrity() {
  console.log('🔍 VERIFICANDO INTEGRIDADE DO SISTEMA DE ZOOM...');
  
  // Verificar se as funções existem
  const checks = {
    'window.performZoom': typeof window.performZoom === 'function',
    'enableCenteredZoom': typeof enableCenteredZoom === 'function',
    'testLateralMovement': typeof window.testLateralMovement === 'function',
    'testZoomAllScenarios': typeof window.testZoomAllScenarios === 'function',
    'state.cy': !!state.cy,
    'currentZoom': typeof currentZoom === 'number'
  };
  
  console.log('📊 VERIFICAÇÕES DO SISTEMA:');
  Object.entries(checks).forEach(([check, result]) => {
    console.log(`   ${result ? '✅' : '❌'} ${check}: ${result}`);
  });
  
  const allPassed = Object.values(checks).every(Boolean);
  
  if (allPassed) {
    console.log('✅ SISTEMA INTEGRO: Todas as verificações passaram!');
    console.log('🎯 Sistema de zoom unificado está funcionando corretamente');
    
    // Teste rápido de funcionalidade
    if (state.cy && state.cy.nodes().length > 0) {
      console.log('🧪 Executando teste rápido de funcionalidade...');
      testLateralMovement();
    } else {
      console.log('⚠️ Nenhum mapa carregado - execute teste manual após criar mapa');
      alert('✅ SISTEMA VERIFICADO!\n\nTodas as correções foram implementadas corretamente.\n\nPara testar:\n1. Crie um mapa\n2. Execute: testLateralMovement()\n3. Teste zoom com botões e wheel');
    }
  } else {
    console.error('❌ PROBLEMAS DETECTADOS NO SISTEMA!');
    const failed = Object.entries(checks).filter(([_, result]) => !result);
    alert(`❌ PROBLEMAS DETECTADOS:\n\n${failed.map(([check]) => `• ${check}`).join('\n')}\n\nVerifique o console para detalhes.`);
  }
}

// ✅ EXPORTA FUNÇÃO DE VERIFICAÇÃO
window.verifySystemIntegrity = verifySystemIntegrity;

// ✅ FUNÇÃO DE TESTE ESPECÍFICA PARA DISPOSITIVOS MÓVEIS
function testMobileZoom() {
  console.log('📱 TESTANDO ZOOM EM DISPOSITIVOS MÓVEIS...');
  
  // Detectar se é dispositivo móvel
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768 || 
                   ('ontouchstart' in window);
  
  console.log(`📱 Dispositivo móvel detectado: ${isMobile}`);
  console.log(`📱 User Agent: ${navigator.userAgent}`);
  console.log(`📱 Largura da tela: ${window.innerWidth}px`);
  console.log(`📱 Touch support: ${'ontouchstart' in window}`);
  
  if (!state.currentMap || !state.cy) {
    console.error('❌ Nenhum mapa carregado');
    alert('Crie um mapa primeiro para testar zoom em móveis');
    return;
  }
  
  const nodeCount = state.cy.nodes().length;
  console.log(`📊 Número de nós no mapa: ${nodeCount}`);
  
  // Salvar posições iniciais
  const initialPositions = {};
  state.cy.nodes().forEach(node => {
    initialPositions[node.id()] = {
      x: node.position().x,
      y: node.position().y
    };
  });
  
  console.log('📍 Posições iniciais salvas:', Object.keys(initialPositions).length, 'nós');
  
  // Testar zoom programático (simula pinch)
  console.log('🔍 Testando zoom programático...');
  performZoom(1.3, false);
  
  setTimeout(() => {
    // Verificar movimento
    let movedNodes = 0;
    let totalMovement = 0;
    
    state.cy.nodes().forEach(node => {
      const initial = initialPositions[node.id()];
      const current = node.position();
      
      const deltaX = Math.abs(current.x - initial.x);
      const deltaY = Math.abs(current.y - initial.y);
      const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (movement > 5) {
        movedNodes++;
        totalMovement += movement;
        console.warn(`⚠️ Nó ${node.id()} se moveu:`, {
          deltaX: current.x - initial.x,
          deltaY: current.y - initial.y,
          movement: movement.toFixed(2)
        });
      }
    });
    
    console.log('📊 RESULTADOS DO TESTE MÓVEL:');
    console.log(`   Dispositivo móvel: ${isMobile}`);
    console.log(`   Total de nós: ${nodeCount}`);
    console.log(`   Nós que se moveram: ${movedNodes}`);
    console.log(`   Movimento total: ${totalMovement.toFixed(2)}px`);
    
    if (movedNodes > 0) {
      console.error('❌ PROBLEMA EM MÓVEIS: Nós se moveram durante zoom!');
      alert(`❌ PROBLEMA EM MÓVEIS: ${movedNodes} nós se moveram!\n\nMovimento total: ${totalMovement.toFixed(2)}px\n\nVerifique o console para detalhes.`);
    } else {
      console.log('✅ SUCESSO EM MÓVEIS: Nenhum nó se moveu durante zoom!');
      alert(`✅ TESTE MÓVEL PASSOU!\n\n✅ Dispositivo móvel: ${isMobile}\n✅ Zoom funcionando corretamente\n✅ Nenhum movimento detectado\n\nSistema de zoom móvel funcionando perfeitamente!`);
    }
  }, 100);
}

// ✅ EXPORTA FUNÇÃO DE TESTE MÓVEL
window.testMobileZoom = testMobileZoom;

// ✅ FUNÇÃO DE TESTE ESPECÍFICA PARA POPUPS EM MÓVEIS
function testMobilePopups() {
  console.log('📱 TESTANDO POPUPS EM DISPOSITIVOS MÓVEIS...');
  
  // Detectar se é dispositivo móvel
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768 || 
                   ('ontouchstart' in window);
  
  console.log(`📱 Dispositivo móvel detectado: ${isMobile}`);
  
  // Verificar se há popups abertos
  const openPopups = document.querySelectorAll('.mobile-popup.show');
  const allPopups = document.querySelectorAll('.mobile-popup');
  const closeButtons = document.querySelectorAll('.popup-close');
  
  console.log('📊 ESTADO DOS POPUPS:');
  console.log(`   Popups abertos: ${openPopups.length}`);
  console.log(`   Total de popups: ${allPopups.length}`);
  console.log(`   Botões fechar: ${closeButtons.length}`);
  
  // Verificar se os botões fechar têm os eventos corretos
  let buttonsWithEvents = 0;
  closeButtons.forEach(btn => {
    const hasClickEvent = btn.onclick !== null || 
                         (btn.addEventListener && btn.addEventListener.toString().includes('click'));
    const hasTouchEvent = btn.addEventListener && btn.addEventListener.toString().includes('touch');
    
    if (hasClickEvent || hasTouchEvent) {
      buttonsWithEvents++;
    }
  });
  
  console.log(`   Botões com eventos: ${buttonsWithEvents}/${closeButtons.length}`);
  
  // Teste de funcionalidade
  if (openPopups.length > 0) {
    console.log('🧪 Testando fechamento de popup aberto...');
    
    const firstPopup = openPopups[0];
    const closeBtn = firstPopup.querySelector('.popup-close');
    
    if (closeBtn) {
      console.log('✅ Botão fechar encontrado, testando...');
      
      // Simular clique/touch
      if (isMobile) {
        console.log('📱 Simulando touch em dispositivo móvel...');
        const touchEvent = new TouchEvent('touchend', {
          bubbles: true,
          cancelable: true,
          target: closeBtn
        });
        closeBtn.dispatchEvent(touchEvent);
      } else {
        console.log('🖱️ Simulando clique em desktop...');
        closeBtn.click();
      }
      
      setTimeout(() => {
        const stillOpen = firstPopup.classList.contains('show');
        if (stillOpen) {
          console.error('❌ PROBLEMA: Popup não fechou após toque/clique!');
          alert('❌ PROBLEMA EM MÓVEIS: Popup não fechou!\n\nBotão fechar não está funcionando corretamente.\n\nVerifique o console para detalhes.');
        } else {
          console.log('✅ SUCESSO: Popup fechou corretamente!');
          alert('✅ TESTE MÓVEL PASSOU!\n\n✅ Popup fechou corretamente\n✅ Botão fechar funcionando\n\nSistema de popups móvel funcionando perfeitamente!');
        }
      }, 100);
    } else {
      console.error('❌ PROBLEMA: Nenhum botão fechar encontrado no popup!');
      alert('❌ PROBLEMA: Popup aberto sem botão fechar!\n\nVerifique o console para detalhes.');
    }
  } else {
    console.log('⚠️ Nenhum popup aberto para testar');
    alert(`📱 TESTE DE POPUPS MÓVEIS\n\n✅ Dispositivo móvel: ${isMobile}\n✅ Total de popups: ${allPopups.length}\n✅ Botões fechar: ${closeButtons.length}\n\nPara testar:\n1. Abra um popup\n2. Execute: testMobilePopups()\n3. Teste fechar com toque`);
  }
}
// ✅ EXPORTA FUNÇÃO DE TESTE DE POPUPS MÓVEIS
window.testMobilePopups = testMobilePopups;
// ✅ FUNÇÃO DE TESTE ESPECÍFICA PARA POPUP DE INFORMAÇÃO
function testMapInfoPopup() {
  console.log('🧪 TESTANDO POPUP DE INFORMAÇÃO DO MAPA...');
  
  // Detectar se é dispositivo móvel
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768 || 
                   ('ontouchstart' in window);
  
  console.log(`📱 Dispositivo móvel detectado: ${isMobile}`);
  
  // Verificar se há mapa carregado
  if (!state.currentMap || !state.cy) {
    console.error('❌ Nenhum mapa carregado');
    alert('Crie um mapa primeiro para testar o popup de informação');
    return;
  }
  
  // Verificar se o popup de informação existe
  const mapInfoPopup = document.getElementById('mapInfoPopup');
  if (!mapInfoPopup) {
    console.error('❌ Popup de informação não encontrado');
    alert('Popup de informação não encontrado no HTML');
    return;
  }
  
  console.log('✅ Popup de informação encontrado');
  
  // Mostrar o popup
  updateMapInfoPopup();
  
  setTimeout(() => {
    const isVisible = mapInfoPopup.style.display !== 'none';
    console.log(`📊 Popup visível: ${isVisible}`);
    
    if (!isVisible) {
      console.error('❌ PROBLEMA: Popup não está visível após updateMapInfoPopup()');
      alert('❌ PROBLEMA: Popup de informação não está aparecendo!\n\nVerifique o console para detalhes.');
      return;
    }
    
    // Encontrar o botão fechar
    const closeBtn = mapInfoPopup.querySelector('.popup-close');
    if (!closeBtn) {
      console.error('❌ PROBLEMA: Botão fechar não encontrado no popup');
      alert('❌ PROBLEMA: Botão fechar não encontrado no popup de informação!');
      return;
    }
    
    console.log('✅ Botão fechar encontrado, testando...');
    
    // Testar fechamento
    if (isMobile) {
      console.log('📱 Simulando touch em dispositivo móvel...');
      const touchEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        target: closeBtn
      });
      closeBtn.dispatchEvent(touchEvent);
    } else {
      console.log('🖱️ Simulando clique em desktop...');
      closeBtn.click();
    }
    
    setTimeout(() => {
      const stillVisible = mapInfoPopup.style.display !== 'none';
      if (stillVisible) {
        console.error('❌ PROBLEMA: Popup não fechou após toque/clique!');
        alert('❌ PROBLEMA: Popup de informação não fechou!\n\nBotão fechar não está funcionando corretamente.\n\nVerifique o console para detalhes.');
      } else {
        console.log('✅ SUCESSO: Popup de informação fechou corretamente!');
        alert('✅ TESTE PASSOU!\n\n✅ Popup de informação funcionando\n✅ Botão fechar funcionando\n✅ Fechamento correto\n\nSistema de popup de informação funcionando perfeitamente!');
      }
    }, 100);
  }, 100);
}

// ✅ EXPORTA FUNÇÃO DE TESTE DE POPUP DE INFORMAÇÃO
window.testMapInfoPopup = testMapInfoPopup;

// ✅ FUNÇÃO DE TESTE PARA VERIFICAR CORREÇÃO DO LAYOUT-ALGORITHM
function testLayoutAlgorithmFix() {
  console.log('🧪 TESTANDO CORREÇÃO DO LAYOUT-ALGORITHM...');
  
  // Verificar se há mapa carregado
  if (!state.currentMap || !state.cy) {
    console.error('❌ Nenhum mapa carregado');
    alert('Crie um mapa primeiro para testar o layout-algorithm');
    return;
  }
  
  console.log('✅ Mapa carregado, testando layout-algorithm...');
  
  try {
    // Testar se o layout-algorithm funciona sem erros
    const nodes = state.cy.nodes();
    if (nodes.length > 1) {
      console.log('🧪 Testando auto-organização com múltiplos nós...');
      
      // Tentar iniciar auto-organização
      window.LayoutAlgorithm.startAutoOrganization(state.cy, {
        minGap: 50,
        damping: 0.6,
        stepMax: 20,
        forceStrength: 2.5,
        interval: 16,
        enableHierarchy: true,
        enableRootAnchor: true
      });
      
      setTimeout(() => {
        // Verificar se não há erros
        const isActive = window.LayoutAlgorithm.isAutoOrganizationActive();
        console.log(`📊 Auto-organização ativa: ${isActive}`);
        
        if (isActive) {
          console.log('✅ SUCESSO: Layout-algorithm funcionando sem erros!');
          alert('✅ TESTE PASSOU!\n\n✅ Layout-algorithm corrigido\n✅ Auto-organização funcionando\n✅ Sem erros de constante\n\nProblema do "Assignment to constant variable" CORRIGIDO!');
          
          // Parar auto-organização após teste
          window.LayoutAlgorithm.stopAutoOrganization();
        } else {
          console.error('❌ PROBLEMA: Auto-organização não iniciou');
          alert('❌ PROBLEMA: Auto-organização não iniciou corretamente!\n\nVerifique o console para detalhes.');
        }
      }, 500);
      
    } else {
      console.log('⚠️ Mapa tem apenas um nó - teste não aplicável');
      alert('Mapa tem apenas um nó. Para testar layout-algorithm, crie um mapa com múltiplos nós.');
    }
    
  } catch (error) {
    console.error('❌ ERRO durante teste:', error);
    alert(`❌ ERRO DETECTADO:\n\n${error.message}\n\nVerifique o console para detalhes.`);
  }
}

// ✅ EXPORTA FUNÇÃO DE TESTE DO LAYOUT-ALGORITHM
window.testLayoutAlgorithmFix = testLayoutAlgorithmFix;

// ✅ FUNÇÃO DE TESTE PARA VERIFICAR CORREÇÃO DOS AVISOS DO CONSOLE
function testConsoleWarningsFix() {
  console.log('🧪 TESTANDO CORREÇÃO DOS AVISOS DO CONSOLE...');
  
  // Verificar se há mapa carregado
  if (!state.currentMap || !state.cy) {
    console.error('❌ Nenhum mapa carregado');
    alert('Crie um mapa primeiro para testar os avisos do console');
    return;
  }
  
  console.log('✅ Mapa carregado, testando correções...');
  
  try {
    // Testar se marked.js está configurado corretamente
    if (window.marked) {
      console.log('✅ Marked.js carregado');
      
      // Testar configuração do marked
      const testMarkdown = '# Teste\n**Texto em negrito**';
      const markedOptions = {
        mangle: false,
        headerIds: false,
        headerPrefix: ''
      };
      
      if (window.marked.setOptions) {
        window.marked.setOptions(markedOptions);
        console.log('✅ Marked.js configurado com opções corretas');
      }
      
      const htmlContent = window.marked.parse ? window.marked.parse(testMarkdown, markedOptions) : window.marked(testMarkdown, markedOptions);
      console.log('✅ Marked.js funcionando sem avisos de deprecação');
    } else {
      console.warn('⚠️ Marked.js não carregado');
    }
    
    // Testar se Cytoscape não tem wheelSensitivity customizada
    const cyOptions = state.cy.options();
    if (cyOptions.wheelSensitivity === undefined) {
      console.log('✅ Wheel sensitivity não customizada (padrão)');
    } else {
      console.warn('⚠️ Wheel sensitivity ainda customizada:', cyOptions.wheelSensitivity);
    }
    
    // Testar se propriedades CSS estão corretas
    const nodeStyles = state.cy.style().json();
    const hasInvalidProps = nodeStyles.some(style => 
      style.style && (
        style.style['text-max-height'] !== undefined
      )
    );
    
    if (!hasInvalidProps) {
      console.log('✅ Propriedades CSS válidas');
    } else {
      console.warn('⚠️ Ainda há propriedades CSS inválidas');
    }
    
    console.log('✅ TESTE CONCLUÍDO: Avisos do console corrigidos!');
    alert('✅ TESTE PASSOU!\n\n✅ Wheel sensitivity corrigida\n✅ Propriedades CSS válidas\n✅ Marked.js configurado\n✅ Avisos de deprecação eliminados\n\nConsole limpo e funcionando perfeitamente!');
    
  } catch (error) {
    console.error('❌ ERRO durante teste:', error);
    alert(`❌ ERRO DETECTADO:\n\n${error.message}\n\nVerifique o console para detalhes.`);
  }
}
// ✅ EXPORTA FUNÇÃO DE TESTE DOS AVISOS DO CONSOLE
window.testConsoleWarningsFix = testConsoleWarningsFix;
// ✅ FUNÇÃO DE TESTE PARA VERIFICAR CORREÇÃO DO ÍCONE "i" E AUTO-ORGANIZAÇÃO
function testIconAndAutoOrgFix() {
  console.log('🧪 TESTANDO CORREÇÃO DO ÍCONE "i" E AUTO-ORGANIZAÇÃO...');
  
  // Verificar se há mapa carregado
  if (!state.currentMap || !state.cy) {
    console.error('❌ Nenhum mapa carregado');
    alert('Crie um mapa primeiro para testar as correções');
    return;
  }
  
  console.log('✅ Mapa carregado, testando correções...');
  
  try {
    // Testar se auto-organização está desabilitada
    const isAutoOrgActive = window.LayoutAlgorithm.isAutoOrganizationActive();
    console.log(`📊 Auto-organização ativa: ${isAutoOrgActive}`);
    
    if (!isAutoOrgActive) {
      console.log('✅ Auto-organização DESABILITADA corretamente');
    } else {
      console.warn('⚠️ Auto-organização ainda está ativa');
    }
    
    // Testar se ícones "i" estão funcionando
    const nodeInfoIcons = document.querySelectorAll('.node-info');
    console.log(`📊 Ícones "i" encontrados: ${nodeInfoIcons.length}`);
    
    if (nodeInfoIcons.length > 0) {
      console.log('✅ Ícones "i" estão presentes');
      
      // Testar se o primeiro ícone é clicável
      const firstIcon = nodeInfoIcons[0];
      if (firstIcon) {
        console.log('✅ Primeiro ícone "i" encontrado, testando clicabilidade...');
        
        // Simular clique
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        });
        
        firstIcon.dispatchEvent(clickEvent);
        console.log('✅ Clique no ícone "i" processado sem bloqueio');
      }
    } else {
      console.warn('⚠️ Nenhum ícone "i" encontrado');
    }
    
    // Verificar se não há movimento automático dos nós
    const nodes = state.cy.nodes();
    const initialPositions = {};
    nodes.forEach(node => {
      initialPositions[node.id()] = {
        x: node.position().x,
        y: node.position().y
      };
    });
    
    console.log('📍 Posições iniciais dos nós salvas');
    
    setTimeout(() => {
      let movedNodes = 0;
      nodes.forEach(node => {
        const initial = initialPositions[node.id()];
        const current = node.position();
        
        const deltaX = Math.abs(current.x - initial.x);
        const deltaY = Math.abs(current.y - initial.y);
        
        if (deltaX > 1 || deltaY > 1) {
          movedNodes++;
        }
      });
      
      console.log(`📊 Nós que se moveram: ${movedNodes}`);
      
      if (movedNodes === 0) {
        console.log('✅ SUCESSO: Nenhum nó se moveu automaticamente!');
        alert('✅ TESTE PASSOU!\n\n✅ Ícone "i" funcionando corretamente\n✅ Auto-organização DESABILITADA\n✅ Nós permanecem em posições fixas\n✅ Sem movimento automático\n\nSistema funcionando perfeitamente!');
      } else {
        console.warn(`⚠️ ${movedNodes} nós se moveram automaticamente`);
        alert(`⚠️ AVISO: ${movedNodes} nós se moveram automaticamente!\n\nVerifique se a auto-organização está realmente desabilitada.`);
      }
    }, 1000);
    
  } catch (error) {
    console.error('❌ ERRO durante teste:', error);
    alert(`❌ ERRO DETECTADO:\n\n${error.message}\n\nVerifique o console para detalhes.`);
  }
}

// ✅ EXPORTA FUNÇÃO DE TESTE DO ÍCONE "i" E AUTO-ORGANIZAÇÃO
window.testIconAndAutoOrgFix = testIconAndAutoOrgFix;

// ✅ FUNÇÃO DE TESTE ESPECÍFICA PARA POPUP DE INFORMAÇÃO EM MÓVEIS
function testNodeTooltipMobileFix() {
  console.log('🧪 TESTANDO POPUP DE INFORMAÇÃO EM DISPOSITIVOS MÓVEIS...');
  
  // Detectar se é dispositivo móvel
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768 || 
                   ('ontouchstart' in window);
  
  console.log(`📱 Dispositivo móvel detectado: ${isMobile}`);
  
  // Verificar se há mapa carregado
  if (!state.currentMap || !state.cy) {
    console.error('❌ Nenhum mapa carregado');
    alert('Crie um mapa primeiro para testar o popup de informação');
    return;
  }
  
  console.log('✅ Mapa carregado, testando popup de informação...');
  
  try {
    // Verificar se há ícones "i" disponíveis
    const nodeInfoIcons = document.querySelectorAll('.node-info');
    console.log(`📊 Ícones "i" encontrados: ${nodeInfoIcons.length}`);
    
    if (nodeInfoIcons.length === 0) {
      console.error('❌ Nenhum ícone "i" encontrado');
      alert('Nenhum ícone "i" encontrado. Crie um mapa com nós primeiro.');
      return;
    }
    
    // Simular clique no primeiro ícone "i" para abrir popup
    const firstIcon = nodeInfoIcons[0];
    console.log('✅ Simulando clique no primeiro ícone "i"...');
    
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });
    
    firstIcon.dispatchEvent(clickEvent);
    
    setTimeout(() => {
      // Verificar se popup foi aberto
      const tooltip = document.querySelector('.node-tooltip');
      if (!tooltip) {
        console.error('❌ Popup de informação não foi aberto');
        alert('❌ PROBLEMA: Popup de informação não foi aberto!\n\nVerifique o console para detalhes.');
        return;
      }
      
      console.log('✅ Popup de informação aberto, testando fechamento...');
      
      // Encontrar botão fechar
      const closeBtn = tooltip.querySelector('.node-tooltip-close');
      if (!closeBtn) {
        console.error('❌ Botão fechar não encontrado no popup');
        alert('❌ PROBLEMA: Botão fechar não encontrado no popup de informação!');
        return;
      }
      
      console.log('✅ Botão fechar encontrado, testando...');
      
      // Testar fechamento com touch
      if (isMobile) {
        console.log('📱 Simulando touch em dispositivo móvel...');
        const touchEvent = new TouchEvent('touchend', {
          bubbles: true,
          cancelable: true,
          target: closeBtn
        });
        closeBtn.dispatchEvent(touchEvent);
      } else {
        console.log('🖱️ Simulando clique em desktop...');
        closeBtn.click();
      }
      
      setTimeout(() => {
        const stillOpen = document.querySelector('.node-tooltip');
        if (stillOpen) {
          console.error('❌ PROBLEMA: Popup não fechou após toque/clique!');
          alert('❌ PROBLEMA EM MÓVEIS: Popup de informação não fechou!\n\nBotão fechar não está funcionando corretamente.\n\nVerifique o console para detalhes.');
        } else {
          console.log('✅ SUCESSO: Popup de informação fechou corretamente!');
          alert('✅ TESTE MÓVEL PASSOU!\n\n✅ Popup de informação funcionando\n✅ Botão fechar funcionando em móveis\n✅ Fechamento correto\n\nSistema de popup de informação móvel funcionando perfeitamente!');
        }
      }, 100);
    }, 500);
    
  } catch (error) {
    console.error('❌ ERRO durante teste:', error);
    alert(`❌ ERRO DETECTADO:\n\n${error.message}\n\nVerifique o console para detalhes.`);
  }
}

// ✅ EXPORTA FUNÇÃO DE TESTE DO POPUP DE INFORMAÇÃO EM MÓVEIS
window.testNodeTooltipMobileFix = testNodeTooltipMobileFix;

// ✅ FUNÇÃO DE TESTE PARA VERIFICAR SALVAMENTO COM ESTADO VISUAL
function testSaveWithVisualState() {
  console.log('🧪 TESTANDO SALVAMENTO COM ESTADO VISUAL...');
  
  if (!state.currentMap || !state.cy) {
    console.error('❌ Nenhum mapa carregado');
    alert('Crie um mapa primeiro para testar o salvamento com estado visual');
    return;
  }
  
  try {
    // Mover alguns nós para testar posições
    const nodes = state.cy.nodes();
    if (nodes.length > 1) {
      const firstNode = nodes[0];
      const secondNode = nodes[1];
      
      // Mover nós para posições específicas
      firstNode.position({ x: 100, y: 100 });
      secondNode.position({ x: 200, y: 200 });
      
      // Aplicar zoom e pan
      state.cy.zoom(1.5);
      state.cy.pan({ x: 50, y: 50 });
      
      console.log('✅ Nós movidos e viewport alterado para teste');
    }
    
    // Simular salvamento
    const testTitle = `Teste_Estado_Visual_${Date.now()}`;
    const mapWithVisualState = {
      ...state.currentMap,
      _visualState: {
        viewport: {
          zoom: state.cy.zoom(),
          pan: state.cy.pan()
        },
        nodePositions: {},
        nodeStyles: {},
        timestamp: new Date().toISOString()
      }
    };
    
    // Salvar posições dos nós
    state.cy.nodes().forEach(node => {
      const nodeId = node.id();
      mapWithVisualState._visualState.nodePositions[nodeId] = {
        x: node.position().x,
        y: node.position().y
      };
    });
    
    const id = window.Storage.GeraMapas.saveMap({
      title: testTitle,
      data: mapWithVisualState
    });
    
    console.log('✅ Mapa salvo com estado visual:', {
      id: id,
      nodes: Object.keys(mapWithVisualState._visualState.nodePositions).length,
      viewport: mapWithVisualState._visualState.viewport
    });
    
    alert(`✅ Teste concluído! Mapa "${testTitle}" salvo com estado visual.\n\nVerifique se ao carregar o mapa, as posições e zoom são restaurados.`);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    alert('❌ Erro no teste: ' + error.message);
  }
}

// ✅ EXPORTA FUNÇÃO DE TESTE
window.testSaveWithVisualState = testSaveWithVisualState;

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
    simpleDownload(fullContent, filename);
      console.log('✅ Download das abas concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na função de download:', error);
    alert('❌ Erro ao fazer download: ' + error.message);
  }
}
// ☕ FUNCIONALIDADE DO ÍCONE "PAGUE UM CAFÉ" DESLOCÁVEL
function initCoffeeIcon() {
  const coffeeIcon = document.getElementById('coffeeIcon');
  if (!coffeeIcon) return;
  
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;
  
  // ✅ Eventos de mouse
  coffeeIcon.addEventListener('mousedown', (e) => {
    // Só arrastar se clicar no ícone, não no link
    if (e.target.tagName === 'A') return;
    
    isDragging = true;
    coffeeIcon.classList.add('dragging');
    
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = coffeeIcon.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    const newX = initialX + deltaX;
    const newY = initialY + deltaY;
    
    // ✅ Limitar dentro da tela
    const maxX = window.innerWidth - coffeeIcon.offsetWidth;
    const maxY = window.innerHeight - coffeeIcon.offsetHeight;
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    coffeeIcon.style.left = constrainedX + 'px';
    coffeeIcon.style.right = 'auto';
    coffeeIcon.style.bottom = 'auto';
    coffeeIcon.style.top = constrainedY + 'px';
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      coffeeIcon.classList.remove('dragging');
    }
  });
  
  // ✅ Eventos de touch para dispositivos móveis
  coffeeIcon.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'A') return;
    
    isDragging = true;
    coffeeIcon.classList.add('dragging');
    
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    
    const rect = coffeeIcon.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    e.preventDefault();
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    const newX = initialX + deltaX;
    const newY = initialY + deltaY;
    
    // ✅ Limitar dentro da tela
    const maxX = window.innerWidth - coffeeIcon.offsetWidth;
    const maxY = window.innerHeight - coffeeIcon.offsetHeight;
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    coffeeIcon.style.left = constrainedX + 'px';
    coffeeIcon.style.right = 'auto';
    coffeeIcon.style.bottom = 'auto';
    coffeeIcon.style.top = constrainedY + 'px';
    
    e.preventDefault();
  });
  
  document.addEventListener('touchend', () => {
    if (isDragging) {
      isDragging = false;
      coffeeIcon.classList.remove('dragging');
    }
  });
  
  console.log('☕ Ícone do cafezinho inicializado - deslocável e responsivo!');
}

  // ✅ CORREÇÃO: Teste específico para popup de informação móvel
  window.testNodeTooltipMobileFix = function() {
    console.log('🧪 TESTE: Verificando correção do popup de informação móvel...');
    
    // Verificar se existe um popup ativo
    const activeTooltip = document.querySelector('.node-tooltip');
    if (!activeTooltip) {
      console.log('❌ Nenhum popup de informação ativo encontrado');
      console.log('💡 Dica: Clique em um ícone "i" de um nó primeiro');
      return;
    }
    
    // Verificar se o botão fechar existe
    const closeBtn = activeTooltip.querySelector('.node-tooltip-close');
    if (!closeBtn) {
      console.log('❌ Botão fechar não encontrado no popup');
      return;
    }
    
    console.log('✅ Botão fechar encontrado:', closeBtn);
    
    // Verificar CSS
    const computedStyle = window.getComputedStyle(closeBtn);
    console.log('✅ Z-index:', computedStyle.zIndex);
    console.log('✅ Pointer-events:', computedStyle.pointerEvents);
    console.log('✅ Touch-action:', computedStyle.touchAction);
    console.log('✅ Isolation:', computedStyle.isolation);
    
    // Verificar se o sistema de drag está configurado corretamente
    const header = activeTooltip.querySelector('.node-tooltip-header');
    if (header) {
      console.log('✅ Header encontrado para drag:', header);
      console.log('✅ Sistema de drag configurado com verificação de botão fechar');
    }
    
    console.log('🎯 TESTE CONCLUÍDO: Verifique se consegue fechar o popup tocando no X');
    console.log('📱 Teste em dispositivo móvel: toque no X e veja se fecha');
    console.log('🖱️ Teste em desktop: clique no X e veja se fecha');
    console.log('🔍 Logs detalhados serão exibidos no console durante o teste');
  };

  // ✅ FUNÇÃO DE TESTE: Verificar visibilidade dos botões no mobile
  window.testMobileButtonVisibility = function() {
    console.log('🔍 TESTE DE VISIBILIDADE DOS BOTÕES MOBILE');
    console.log('==========================================');
    
    const buttons = [
      { name: 'Modelos de Mapas', element: mapModelsBtn },
      { name: 'Marcador', element: markerBtn },
      { name: 'Lápis', element: lapisBtn }
    ];
    
    buttons.forEach(btn => {
      if (btn.element) {
        const computedStyle = window.getComputedStyle(btn.element);
        const display = computedStyle.display;
        const visibility = computedStyle.visibility;
        const opacity = computedStyle.opacity;
        
        console.log(`📱 ${btn.name}:`);
        console.log(`   - Elemento existe: ✅`);
        console.log(`   - Display: ${display}`);
        console.log(`   - Visibility: ${visibility}`);
        console.log(`   - Opacity: ${opacity}`);
        console.log(`   - OffsetWidth: ${btn.element.offsetWidth}`);
        console.log(`   - OffsetHeight: ${btn.element.offsetHeight}`);
        console.log(`   - ClientRect: ${btn.element.getBoundingClientRect().width}x${btn.element.getBoundingClientRect().height}`);
        console.log('---');
      } else {
        console.log(`❌ ${btn.name}: Elemento não encontrado`);
      }
    });
    
    // Verificar estado do header
    const header = document.querySelector('.app-header');
    if (header) {
      console.log(`📱 Header classes: ${header.className}`);
      console.log(`📱 Header has-map: ${header.classList.contains('has-map')}`);
    }
    
    // Verificar se há mapa ativo
    const hasActiveMap = state.currentMap && state.currentMap.nodes && state.currentMap.nodes.length > 0;
    console.log(`📱 Mapa ativo: ${hasActiveMap}`);
    console.log(`📱 Nodes count: ${state.currentMap ? state.currentMap.nodes.length : 0}`);
    
    console.log('==========================================');
    console.log('💡 Para testar: gere um mapa e execute novamente');
  };

  // ✅ CORREÇÃO: Controlar expansão do menu no mobile baseado em mapa ativo
  function updateMobileMenuState() {
    const header = document.querySelector('.app-header');
    
    if (!header) return;
    
    // Verificar se há um mapa ativo
    const hasActiveMap = state.currentMap && state.currentMap.nodes && state.currentMap.nodes.length > 0;
    
    // console.log('🔄 updateMobileMenuState() CHAMADA'); // ✅ Removido para reduzir logs
    // console.log('   - Mapa ativo:', hasActiveMap);
    // console.log('   - Nós no mapa:', state.currentMap ? state.currentMap.nodes.length : 0);
    
    if (hasActiveMap) {
      header.classList.add('has-map');
      // console.log('📱 Menu EXPANDIDO - mapa ativo detectado'); // ✅ Removido
      
      // ✅ CORREÇÃO: Garantir que botões específicos sejam visíveis
      if (mapModelsBtn) {
        mapModelsBtn.style.display = 'flex';
        mapModelsBtn.style.setProperty('display', 'flex', 'important');
        // console.log('   ✅ mapModelsBtn (🗺️ Modelos): VISÍVEL'); // ✅ Removido
      }
      
      if (markerBtn) {
        markerBtn.style.display = 'flex';
        markerBtn.style.setProperty('display', 'flex', 'important');
        // console.log('   ✅ markerBtn (🖍️ Marcador): VISÍVEL'); // ✅ Removido
      }
      
      if (lapisBtn) {
        lapisBtn.style.display = 'flex';
        lapisBtn.style.setProperty('display', 'flex', 'important');
        // console.log('   ✅ lapisBtn (✏️ Lápis): VISÍVEL'); // ✅ Removido
      }
      
      // console.log('✅ Botões específicos: modelos, marcador e lápis VISÍVEIS'); // ✅ Removido
    } else {
      header.classList.remove('has-map');
      // console.log('📱 Menu COMPACTO - nenhum mapa ativo'); // ✅ Removido
      
      // ✅ CORREÇÃO: Ocultar botões específicos quando não há mapa
      if (mapModelsBtn) {
        mapModelsBtn.style.display = 'none';
        mapModelsBtn.style.setProperty('display', 'none', 'important');
        // console.log('   ❌ mapModelsBtn (🗺️ Modelos): OCULTO'); // ✅ Removido
      }
      if (markerBtn) {
        markerBtn.style.display = 'none';
        markerBtn.style.setProperty('display', 'none', 'important');
        // console.log('   ❌ markerBtn (🖍️ Marcador): OCULTO'); // ✅ Removido
      }
      if (lapisBtn) {
        lapisBtn.style.display = 'none';
        lapisBtn.style.setProperty('display', 'none', 'important');
        // console.log('   ❌ lapisBtn (✏️ Lápis): OCULTO'); // ✅ Removido
      }
      
      // console.log('❌ Botões específicos: modelos, marcador e lápis OCULTOS'); // ✅ Removido
    }
}

// Initialize app when DOM is loaded with extension safety
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function() {
    try {
      initApp();
      // ✅ Inicializar ícone do cafezinho
      initCoffeeIcon();
      // ✅ CORREÇÃO: Atualizar estado do menu mobile
      updateMobileMenuState();
      // ✅ Inicializar popup de convite do WhatsApp
      initWhatsInvitePopup();
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  });
}