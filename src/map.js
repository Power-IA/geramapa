/* GeraMapas Map Engine - Convertido para JavaScript tradicional */
window.MapEngine = window.MapEngine || {};

window.MapEngine.initCy = function(container) {
  return window.cytoscape({
    container,
    elements: [],
    
    // Enable unlimited pan and zoom
    panningEnabled: true,
    userPanningEnabled: true,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    boxSelectionEnabled: true,
    autoungrabify: false,
    autolock: false,
    
    // Remove viewport boundaries
    minZoom: 0.01,
    maxZoom: 10,
    
    style: [
      { selector: 'node',
        style: {
          'background-color': '#fff',
          'background-fit': 'cover',
          'background-clip': 'none',
          'background-opacity': 1,
          'label': 'data(label)',
          'color': '#111',
          'text-background-color': '#fff',
          'text-background-opacity': 1,
          'text-background-padding': 6,
          'text-wrap': 'wrap',
          'text-max-width': 160,
          'font-family': 'Noto Sans, sans-serif',
          'font-size': 13,
          'shape': 'round-rectangle',
          'padding': '10px',
          'border-color': '#333',
          'border-width': 1.5,
          'width': '48px',
          'height': '48px',
          'min-width': '36px',
          'min-height': '36px',
          'text-max-width': '72px',
          'text-max-height': '72px',
        }
      },
      { selector: 'node[depth = 0]',
        style: {
          'font-size': 16,
          'border-width': 2,
          'padding': '12px',
          'width': '60px',
          'height': '60px',
          'min-width': '48px',
          'min-height': '48px',
          'text-max-width': '84px',
          'text-max-height': '84px',
        }
      },
      { selector: 'node[img]',
        style: {
          'background-image': 'data(img)',
        }
      },
      { selector: 'node[branch = "0"]', style: { 'border-color': '#2ecc71' } },
      { selector: 'node[branch = "1"]', style: { 'border-color': '#3498db' } },
      { selector: 'node[branch = "2"]', style: { 'border-color': '#e67e22' } },
      { selector: 'node[branch = "3"]', style: { 'border-color': '#9b59b6' } },
      { selector: 'node[branch = "4"]', style: { 'border-color': '#34495e' } },
      { selector: 'edge',
        style: {
          'line-color': '#333',
          'width': 2,
          'curve-style': 'bezier',
          'target-arrow-shape': 'none'
        }
      },
      { selector: 'edge[branch = "0"]', style: { 'line-color': '#2ecc71' } },
      { selector: 'edge[branch = "1"]', style: { 'line-color': '#3498db' } },
      { selector: 'edge[branch = "2"]', style: { 'line-color': '#e67e22' } },
      { selector: 'edge[branch = "3"]', style: { 'line-color': '#9b59b6' } },
      { selector: 'edge[branch = "4"]', style: { 'line-color': '#34495e' } },
    ],
    wheelSensitivity: 0.1
  });
};

// ✅ CORREÇÃO: Sistema unificado de zoom que preserva posições (DESKTOP + MOBILE)
function enableCenteredZoom(cy) {
  try {
    const container = cy.container();
    if (!container) return;
    
    // ✅ CORREÇÃO: Variáveis para pinch zoom em móveis
    let initialDistance = 0;
    let initialZoom = 1;
    let isPinching = false;
    
    // ✅ CORREÇÃO: Função para calcular distância entre dois pontos
    function getDistance(touch1, touch2) {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
    
    // ✅ CORREÇÃO: Função para aplicar zoom unificado
    function applyUnifiedZoom(factor) {
      if (window.performZoom) {
        window.performZoom(factor, false);
      } else {
        // Fallback se performZoom não estiver disponível
        const current = cy.zoom();
        const target = Math.max(cy.minZoom() || 0.01, Math.min(cy.maxZoom() || 10, current * factor));
        const center = { x: (container.clientWidth || 0) / 2, y: (container.clientHeight || 0) / 2 };
        cy.zoom({ level: target, renderedPosition: center });
      }
    }
    
    // ✅ CORREÇÃO: Wheel events (desktop)
    container.addEventListener('wheel', function(e) {
      if (!e) return;
      
      // Intercepta gesto de zoom (trackpad/pinch/wheel com ctrl)
      const isZoomGesture = e.ctrlKey || Math.abs(e.deltaY) > Math.abs(e.deltaX);
      if (!isZoomGesture) return;
      
      e.preventDefault();
      
      // ✅ CORREÇÃO: Usar performZoom em vez de zoom direto
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      applyUnifiedZoom(factor);
    }, { passive: false });
    
    // ✅ CORREÇÃO: Touch events para dispositivos móveis
    container.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        // Pinch zoom iniciado
        isPinching = true;
        initialDistance = getDistance(e.touches[0], e.touches[1]);
        initialZoom = cy.zoom();
        e.preventDefault();
        console.log('📱 Pinch zoom iniciado');
      }
    }, { passive: false });
    
    container.addEventListener('touchmove', function(e) {
      if (isPinching && e.touches.length === 2) {
        // Calcular nova distância
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        
        if (initialDistance > 0) {
          // Calcular fator de zoom baseado na mudança de distância
          const scale = currentDistance / initialDistance;
          const factor = scale > 1 ? Math.min(scale, 1.2) : Math.max(scale, 0.8);
          
          // Aplicar zoom unificado
          const newZoom = Math.max(cy.minZoom() || 0.01, Math.min(cy.maxZoom() || 10, initialZoom * factor));
          cy.zoom(newZoom);
        }
        
        e.preventDefault();
      }
    }, { passive: false });
    
    container.addEventListener('touchend', function(e) {
      if (isPinching) {
        isPinching = false;
        initialDistance = 0;
        initialZoom = 1;
        console.log('📱 Pinch zoom finalizado');
      }
    }, { passive: false });
    
    // ✅ CORREÇÃO: Prevenir zoom nativo do navegador em móveis
    container.addEventListener('gesturestart', function(e) {
      e.preventDefault();
    }, { passive: false });
    
    container.addEventListener('gesturechange', function(e) {
      e.preventDefault();
    }, { passive: false });
    
    container.addEventListener('gestureend', function(e) {
      e.preventDefault();
    }, { passive: false });
    
    console.log('📱 Sistema de zoom unificado ativado (Desktop + Mobile)');
  } catch (error) {
    console.error('❌ Erro ao ativar zoom unificado:', error);
  }
}

// Função centralizada para aplicar regras de diretório principal
function applyMainDirectoryRules(cy, mapJson, preserveViewport = false) {
  // 1. Identificar o nó raiz (diretório principal)
  const rootNode = cy.nodes().filter(n => (n.data('depth') || 0) === 0).first();
  
  // 2. Aplicar regras de posicionamento do diretório principal
  if (rootNode && !preserveViewport) {
    // O nó raiz sempre fica no centro (0, 0)
    rootNode.position({ x: 0, y: 0 });
    console.log('🎯 Diretório principal posicionado no centro:', rootNode.data('label'));
  }
  
  // 3. Aplicar regras de tamanho consistente
  cy.nodes().forEach(n => {
    const depth = n.data('depth') || 0;
    // Todos os nós seguem a mesma regra de tamanho
    if (depth === 0) {
      // Nó raiz: 60px (reduzido 40%)
      n.style('width', '60px');
      n.style('height', '60px');
    } else {
      // Nós filhos: 48px (reduzido 40%)
      n.style('width', '48px');
      n.style('height', '48px');
    }
  });
  
  // 4. Aplicar regras de hierarquia visual
  cy.nodes().forEach(n => {
    const depth = n.data('depth') || 0;
    // Bordas mais grossas para níveis superiores
    if (depth === 0) {
      n.style('border-width', 2);
      n.style('font-size', 16);
    } else if (depth === 1) {
      n.style('border-width', 1.5);
      n.style('font-size', 14);
    } else {
      n.style('border-width', 1);
      n.style('font-size', 13);
    }
  });
  
  return rootNode;
}

// Ajuste de zoom quando existe apenas um nó visível
function applySingleNodeZoom(cy) {
  try {
    const allNodes = cy.nodes();
    const visibleNodes = allNodes.filter(':visible');
    const nodes = visibleNodes.length ? visibleNodes : allNodes;
    if (nodes.length === 1) {
      const n = nodes[0];
      const currentZoom = cy.zoom();
      const targetZoom = Math.max(cy.minZoom() || 0.01, currentZoom * 0.3); // reduz 70%
      
      // ✅ CORREÇÃO: Aplicar zoom centrado SEM mover o nó
      // Salvar posição atual do nó
      const nodePos = n.position();
      
      // Aplicar zoom centrado na tela (não na posição do nó)
      cy.zoom({ level: targetZoom, position: { x: 0, y: 0 } });
      
      // Garantir que o nó permaneça na posição original
      n.position(nodePos);
      
      console.log('🔎 Ajuste de zoom para nó único aplicado (sem movimento)');
    }
  } catch (e) { /* noop */ }
}

window.MapEngine.renderMindMap = function(cy, mapJson, layoutModel = 'default', preserveViewport = false) {
  const elements = treeToElements(mapJson.nodes[0]);
  cy.elements().remove();
  cy.add(elements);
  
  // Apply persisted per-node inline styles (stored on map JSON as _style)
  try {
    cy.nodes().forEach(n => {
      const id = n.id();
      const mapNode = (function walk(m) {
        if (!m) return null;
        if (m.id === id) return m;
        for (const c of (m.children||[])) {
          const r = walk(c); if (r) return r;
        }
        return null;
      })(mapJson.nodes[0]);
      const s = mapNode && mapNode._style ? mapNode._style : null;
      if (s) {
        // apply supported style keys to the cytoscape node element
        Object.entries(s).forEach(([k,v]) => {
          if (v === null || v === undefined) return;
          try { n.style(k, v); } catch (e) { /* ignore unsupported */ }
        });
      }
    });
  } catch (e) { console.warn('Applying node inline styles failed', e); }
  
  // Aplicar regras do diretório principal ANTES de qualquer layout
  const rootNode = applyMainDirectoryRules(cy, mapJson, preserveViewport);
  
  // --- density & visual tuning: compute map density and adapt node padding / edge width / text width
  (function adaptVisuals() {
    const nodeCount = cy.nodes().length || 1;
    const edgeCount = cy.edges().length || 0;
    // density roughly nodes per area of viewport
    const container = cy.container();
    const area = (container ? Math.max(400, container.clientWidth) * Math.max(300, container.clientHeight) : 300000);
    const density = Math.min(2.5, Math.max(0.5, (nodeCount / Math.max(1, area / 20000)))); // 0.5..2.5
    // derive padding & text width (larger density -> more compact, but never less than base)
    const basePadding = 8;
    const padding = Math.max(8, Math.round(basePadding * (1 / density)));
    const baseTextMax = 180;
    const textMax = Math.max(110, Math.round(baseTextMax * (1 / Math.max(0.8, density))));
    const edgeWidth = Math.max(1.2, Math.min(3.2, 2.2 * (1 / density)));
    // apply style adjustments per-node (so different branches remain visually distinct)
    cy.nodes().forEach(n => {
      n.style('padding', `${padding}px`);
      n.style('text-max-width', textMax);
      // ensure nodes render above edges
      n.style('z-index', 10);
    });
    cy.edges().forEach(e => {
      e.style('width', edgeWidth);
      e.style('curve-style', 'bezier');
      e.style('z-index', 0);
      // gentle alpha for crowded maps
      e.style('line-color', e.data('branch') ? e.style('line-color') : '#333');
    });
  })();
  // --- end adaptVisuals

  // special "estrela" (star) layout: root center, first-level children in a circle, deeper nodes near parent
  if (layoutModel === 'estrela') {
    console.log('⭐ Aplicando layout Estrela com regras do diretório principal');
    const root = rootNode; // Usar o nó raiz já posicionado pelas regras
    const level1 = cy.nodes().filter(n => (n.data('depth') || 0) === 1);
    const cx = 0, cyc = 0; // Centro já definido pelas regras do diretório principal
    const count = level1.length || 1;
    const radius = Math.max(180, 90 + count * 30);
    
    // O root já está posicionado no centro pelas regras do diretório principal
    level1.forEach((n, i) => {
      const ang = (i / count) * Math.PI * 2;
      n.position({ x: cx + Math.cos(ang) * radius, y: cyc + Math.sin(ang) * radius });
    });
    
    // place deeper nodes around their parent
    cy.nodes().filter(n => (n.data('depth') || 0) > 1).forEach(n => {
      const incoming = n.incomers('node');
      const parent = incoming[0] || null;
      const px = parent ? parent.position().x : cx;
      const py = parent ? parent.position().y : cyc;
      n.position({ x: px + (Math.random() * 120 - 60), y: py + (Math.random() * 120 - 60) });
    });
    
    if (!preserveViewport) {
      cy.fit(undefined, 40);
      applySingleNodeZoom(cy);
    }
    return;
  }
  
  if (layoutModel === 'polvo') {
    console.log('🐙 Aplicando layout Polvo com regras do diretório principal');
    // "Corpo do Polvo" — root fixed at left, main branches extend to the right with vertical stacking to avoid collisions
    const container = cy.container();
    const cw = container ? container.clientWidth : 1200;
    const ch = container ? container.clientHeight : 800;
    const margin = 80;
    const root = rootNode; // Usar o nó raiz já posicionado pelas regras
    const level1 = cy.nodes().filter(n => (n.data('depth') || 0) === 1);
    
    // Reposicionar o root para a esquerda (mantendo as regras de tamanho)
    if (root) root.position({ x: -cw/2 + margin + 40, y: 0 });
    
    // compute vertical bands for each tentacle ensuring spacing
    const bandHeight = Math.max(80, ch / Math.max(1, level1.length + 1));
    const startY = -((level1.length - 1) * bandHeight) / 2;
    level1.forEach((n, i) => {
      const x = -cw/2 + margin + 220 + (i % 2 === 0 ? 0 : 0); // main branches start to the right of root
      const y = startY + i * bandHeight;
      n.position({ x: x + Math.random() * 60 - 30, y: y + (Math.random() * 40 - 20) });
      // recursively position descendants to the right, drifting vertically within the branch band
      const placeChildren = (node, depth) => {
        const kids = node.outgoers('node');
        const baseX = node.position().x;
        const stepX = 140 + (depth * 30);
        kids.forEach((k, idx) => {
          const nx = baseX + stepX;
          const ny = node.position().y + (idx - (kids.length-1)/2) * Math.min(60, bandHeight/3) + (Math.random()*20-10);
          k.position({ x: nx, y: ny });
          placeChildren(k, depth + 1);
        });
      };
      placeChildren(n, 1);
    });
    // ensure fit focusing view to include right expansion but keep root visible on left
    if (!preserveViewport) {
      cy.fit(undefined, 40);
      applySingleNodeZoom(cy);
    }
    return;
  }
  
  const layouts = {
    default: { name: 'concentric', concentric: n => 10 - (n.data('depth') || 0), levelWidth: () => 1, spacingFactor: 1.25 },
    hierarchical: { name: 'breadthfirst', spacingFactor: 1.25, directed: true },
    radial: { name: 'concentric', concentric: n => n.data('depth') || 0, levelWidth: () => 1, spacingFactor: 1.5 },
    organic: { name: 'cose', idealEdgeLength: 50, nodeOverlap: 20, refresh: 20, randomize: false, componentSpacing: 100, nodeRepulsion: 400000, edgeElasticity: 100, nestingFactor: 5, gravity: 80, numIter: 1000, initialTemp: 200, coolingFactor: 0.95, minTemp: 1.0 },
    tree: { name: 'breadthfirst', spacingFactor: 1.5, directed: true, avoidOverlap: true, nodeDimensionsIncludeLabels: true },
    teia: { name: 'cose', idealEdgeLength: 60, nodeOverlap: 10, refresh: 30, randomize: true, componentSpacing: 80, nodeRepulsion: 450000, edgeElasticity: 150, nestingFactor: 4, gravity: 60, numIter: 1200, initialTemp: 250, coolingFactor: 0.92, minTemp: 0.8 },
    estrela: { name: 'concentric', fit: true, spacingFactor: 1.8, nodeOverlap: 16 }
  };
  
  // Skip layout and post-processing when preserving viewport
  if (!preserveViewport) {
    console.log('🎨 Aplicando layout', layoutModel, 'com regras do diretório principal');
    const layout = layouts[layoutModel] || layouts.default;
    
    // Aplicar layout padrão
    cy.layout({ ...layout, animate: true }).run();
    
    // Garantir que o nó raiz mantenha sua posição central após o layout
    if (rootNode) {
      rootNode.position({ x: 0, y: 0 });
      console.log('🎯 Diretório principal reposicionado no centro após layout');
    }
    
    cy.fit(undefined, 40);
    enableCenteredZoom(cy);
    applySingleNodeZoom(cy);
    // post-layout: apply collision resolution and smart edge routing
    window.LayoutAlgorithm.applyCollisionFreeLayout(cy, { iterations: 120, minGap: 40 });
    window.LayoutAlgorithm.routeEdgesSmart(cy);
    
    // ===== ATIVAR AUTO-ORGANIZAÇÃO AUTOMÁTICA =====
    // Sistema que funciona continuamente para manter nós organizados
    // ✅ CORREÇÃO: Desabilitar auto-organização para nó único
    const nodeCount = cy.nodes().length;
    if (nodeCount > 1) {
      window.LayoutAlgorithm.startAutoOrganization(cy, {
        minGap: 50,           // Distância mínima MUITO aumentada para evitar aglomeração
        damping: 0.6,         // Menos damping para movimento mais eficaz
        stepMax: 20,          // Movimento máximo aumentado
        forceStrength: 2.5,   // Força de repulsão MUITO aumentada
        interval: 16,         // Intervalo menor para 60fps (mais responsivo)
        enableHierarchy: true, // Respeitar hierarquia
        enableRootAnchor: true // Manter nó raiz ancorado
      });
      
      // Resolver clusters críticos imediatamente após layout
      setTimeout(() => {
        const clustersResolved = window.LayoutAlgorithm.resolveCriticalClusters(cy);
        if (clustersResolved > 0) {
          console.log(`🎯 ${clustersResolved} clusters críticos resolvidos após layout`);
        }
      }, 100);
      
      console.log('🧠 Sistema de auto-organização automática ATIVADO para múltiplos nós');
    } else {
      console.log('🔒 Auto-organização DESABILITADA para nó único (evita movimento indesejado)');
    }
  } else {
    console.log('🔒 Layout pulado - preservando viewport');
  }

};

window.MapEngine.mergeMaps = function(a, b) {
  const rootA = a.nodes[0];
  const rootB = b.nodes[0];
  const merged = JSON.parse(JSON.stringify(a));
  merged.title = `${a.title} + ${b.title}`;
  const attach = { id: `ref-${rootB.id || 'root'}`, label: rootB.label || b.title || 'Mapa', children: rootB.children || [] };
  merged.nodes[0].children = (merged.nodes[0].children || []).concat(attach);
  return merged;
};

// Função para parar auto-organização quando necessário
window.MapEngine.stopAutoOrganization = function() {
  window.LayoutAlgorithm.stopAutoOrganization();
  console.log('🛑 Auto-organização parada');
};

function treeToElements(root) {
  const elements = [];
  function walk(node, parentId = null, depth = 0, branch = null) {
    if (node.isCollapsed) return; // skip collapsed subtree entirely
    const id = node.id || crypto.randomUUID();
    const data = { id, label: node.label || '', depth };
    if (node.img) data.img = node.img; // include image dataURL for cytoscape background
    if (branch !== null) data.branch = String(branch);
    elements.push({ data });
    if (parentId) {
      const edgeData = { id: `${parentId}->${id}`, source: parentId, target: id };
      if (branch !== null) edgeData.branch = String(branch);
      elements.push({ data: edgeData });
    }
    const kids = node.children || [];
    kids.forEach((child, idx) => {
      const childBranch = depth === 0 ? idx : branch;
      walk(child, id, depth + 1, childBranch);
    });
  }
  walk(root, null, 0, null);
  return elements;
}

function positionOverlay(el, pos) {
  // place the info icon outside node bounds with at least 8px margin
  try {
    // if node provided, compute bounding box to avoid overlap
    if (pos && pos.x !== undefined && pos.y !== undefined && el && el.dataset && el.dataset.nodeId) {
      // try to use the node's rendered bounding box if available (passed as pos may be center)
      const nid = el.dataset.nodeId;
      const node = state.cy.getElementById(nid);
      if (node && node.length) {
        const bb = node.renderedBoundingBox();
        const left = bb.x2 + 12; // place further right to avoid edge overlap
        const top = Math.max(8, bb.y1 - 4); // position slightly above node to avoid edge paths
        el.style.left = left + 'px';
        el.style.top = top + 'px';
        return;
      }
    }
  } catch (e) { /* fallback to simple offset */ }
  // fallback: offset top-right of node with safe margins
  el.style.left = (pos.x + 28) + 'px';
  el.style.top = (pos.y - 12) + 'px';
}

/* after state and DOM references are defined, add containers for overlays */
// overlaysRoot is now created in app.js with extension safety

function buildNodeInfoIcons(mapJson) {
  console.log('🔍 buildNodeInfoIcons called, overlaysRoot:', overlaysRoot);
  if (!overlaysRoot) {
    console.warn('❌ overlaysRoot not available, skipping node info icons');
    return;
  }
  console.log('✅ Building node info icons...');
  clearOverlays();
  const nodes = state.cy.nodes();
  console.log('📊 Found', nodes.length, 'nodes');
  nodes.forEach((n, idx) => {
    const id = n.id();
    const pos = n.renderedPosition();
    const el = document.createElement('div');
    el.className = 'node-info';
    el.textContent = 'i';
    el.style.pointerEvents = 'auto';
    // store node id for precise overlay placement
    el.dataset.nodeId = id;
    overlaysRoot.appendChild(el);
    positionOverlay(el, pos);
    el.addEventListener('click', async (e) => {
      e.stopPropagation();
      showTooltipForNode(n, el, mapJson);
    });
  });
  console.log('✅ Node info icons created successfully');
  // update positions on viewport changes
  ['pan', 'zoom', 'resize', 'position'].forEach(evt => state.cy.on(evt, () => {
    state.cy.nodes().forEach(n => {
      const nodeEl = overlaysRoot.querySelector(`.node-info[data-node-id="${n.id()}"]`);
      if (nodeEl) positionOverlay(nodeEl, n.renderedPosition());
    });
  }));
}