/* GeraMapas Layout Algorithm - Convertido para JavaScript tradicional */
window.LayoutAlgorithm = window.LayoutAlgorithm || {};

/**
 * Algorithm Design
 * - Base layout (Cose/Tree/Radial/etc.) runs first. Then a fast physics-like pass expands nodes using dynamic collision boxes and resolves overlaps with damped repulsion. Finally, edges are re-routed using unbundled Bezier control points biased away from nearby nodes.
 *
 * Collision Boundary Calculation
 * - For node n: measure textWidth ≈ measureText(label, font) capped by textMax; lines = ceil(textWidth / textMax); contentH = lineHeight * max(1, lines).
 * - Base box: w = paddingX*2 + min(textWidth, textMax), h = paddingY*2 + contentH.
 * - Adjustments: shapeFactor (ellipse +10%), depthFactor (root +20%, depth>2 -5%), childrenFactor (+(childrenCount*6) px).
 * - Collision radius r = 0.5*sqrt(w^2+h^2). Use minGap margin.
 *
 * Dynamic Repositioning Logic
 * - Spatial grid bins nodes by position; iterate up to N times:
 *   - For each pair in overlapping bins, if distance between centers < sumR+minGap, push apart along the line connecting centers (clamped step, damping).
 *   - Keep root(s) lightly anchored to reduce drift; clamp pan window.
 *
 * Edge Routing Strategy
 * - For each edge s->t, set curve-style: unbundled-bezier.
 * - Compute mid = (s+t)/2. Find nearest foreign node c near the segment.
 * - Offset control point perpendicular to (t-s) by distance K inversely proportional to proximity to c, flipping sign to move away from c.
 * - Set control-point-distances and control-point-weights to [d] and [0.5].
 *
 * Pseudocode
 * - calcBBox(n): measure, apply factors => {w,h,r}
 * - resolve():
 *   bins = grid(nodes)
 *   repeat I:
 *     for each node a in bins:
 *       for each neighbor b in nearCells:
 *         if overlap(a,b): displace(a,b)
 *     apply damping
 * - route():
 *   for edge e(s,t):
 *     c = nearestNodeToSegment(excluding s,t)
 *     perp = normalize(perp(t-s)) * f(distTo(c))
 *     set control-point-distances to [sign*|perp|], weights [0.5]
 *
 * Example Scenario
 * - 7 nodes (2 long titles, depth 0..3). After base tree layout, long-title nodes get larger r, repelled from neighbors ~30–60px. Edges near dense triad bend away 24–56px using control points, avoiding label occlusion.
 */

const MEASURE_CACHE = new Map();

function measureLabel(label, font = '13px Noto Sans, sans-serif') {
  const key = font + '|' + label;
  if (MEASURE_CACHE.has(key)) return MEASURE_CACHE.get(key);

  const c = measureLabel.canvas || (measureLabel.canvas = document.createElement('canvas'));
  const ctx = c.getContext('2d');
  ctx.font = font;
  const w = Math.max(1, ctx.measureText(String(label || '')).width);
  MEASURE_CACHE.set(key, w);
  return w;
}

function nodeBBox(n) {
  const label = n.data('label') || '';
  const fontSize = Number(n.style('font-size')) || 13;
  const font = `${fontSize}px Noto Sans, sans-serif`;
  const textMax = Number(n.style('text-max-width')) || 160;
  const paddingX = 10;
  const paddingY = 8;
  const lineH = Math.round(fontSize * 1.25);

  const rawW = measureLabel(label, font);
  const lines = Math.max(1, Math.ceil(rawW / textMax));
  const contentW = Math.min(rawW, textMax);
  const contentH = lines * lineH;

  let w = paddingX * 2 + contentW;
  let h = paddingY * 2 + contentH;

  // shape factor
  const shape = (n.style('shape') || 'round-rectangle').toLowerCase();
  if (shape.includes('ellipse')) {
    w *= 1.1;
    h *= 1.1;
  }

  // hierarchy factor
  const depth = Number(n.data('depth') || 0);
  if (depth === 0) {
    w *= 1.2;
    h *= 1.2;
  } else if (depth > 2) {
    w *= 0.95;
    h *= 0.95;
  }

  // children factor
  const kids = n.outgoers('node').length;
  w += Math.min(60, kids * 6);
  h += Math.min(40, kids * 4);

  const r = 0.5 * Math.hypot(w, h);
  return { w, h, r };
}

function gridKey(x, y, cell) {
  return ((x / cell) | 0) + ',' + ((y / cell) | 0);
}

function buildGrid(nodes, cell = 140) {
  const grid = new Map();
  nodes.forEach((n) => {
    const p = n.position();
    const key = gridKey(p.x, p.y, cell);
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(n);
  });
  return { grid, cell };
}

function neighborsFromGrid(node, GG) {
  const p = node.position();
  const c = GG.cell;
  const gx = (p.x / c) | 0;
  const gy = (p.y / c) | 0;
  const res = [];
  for (let ix = -1; ix <= 1; ix++)
    for (let iy = -1; iy <= 1; iy++) {
      const key = (gx + ix) + ',' + (gy + iy);
      const bucket = GG.grid.get(key);
      if (bucket) res.push(...bucket);
    }
  return res;
}

window.LayoutAlgorithm.applyCollisionFreeLayout = function(cy, { iterations = 120, minGap = 40 } = {}) {
  if (!cy || cy.destroyed()) return;
  const nodes = cy.nodes();
  if (nodes.length < 2) return;

  const anchor = nodes.filter((n) => (n.data('depth') || 0) === 0).first();
  const damping = 0.7;  // Menos damping para movimento mais eficaz
  const stepMax = 25;    // Movimento máximo aumentado
  
  console.log('🔧 Aplicando algoritmo de colisão AGRESSIVO com distância mínima:', minGap);

  for (let iter = 0; iter < iterations; iter++) {
    const GG = buildGrid(nodes, 200); // Grid maior para melhor detecção
    let moved = 0;

    nodes.forEach((a) => {
      const pa = a.position();
      const ba = nodeBBox(a);
      const near = neighborsFromGrid(a, GG);
      let shiftX = 0;
      let shiftY = 0;
      let overlapCount = 0;

      near.forEach((b) => {
        if (a === b) return;

        const pb = b.position();
        const bb = nodeBBox(b);

        const dx = pa.x - pb.x;
        const dy = pa.y - pb.y;

        let dist = Math.hypot(dx, dy) || 0.0001;
        const minDist = ba.r + bb.r + minGap;

        if (dist < minDist) {
          overlapCount++;
          
          // Força mais agressiva para separação inicial
          const nodeSize = Math.min(ba.w, ba.h);
          const otherSize = Math.min(bb.w, bb.h);
          const sizeFactor = Math.max(1.5, 2.0 - (nodeSize + otherSize) / 100);
          
          const push = (minDist - dist) * 0.8 * sizeFactor; // Mais agressivo
          shiftX += (dx / dist) * Math.min(stepMax, push);
          shiftY += (dy / dist) * Math.min(stepMax, push);
        }
      });

      // Boost adicional para nós com muitas sobreposições
      if (overlapCount > 1) {
        const overlapBoost = 1 + (overlapCount * 0.4);
        shiftX *= overlapBoost;
        shiftY *= overlapBoost;
      }

      // mild world bounds clamp (viewport-ish)
      shiftX *= damping;
      shiftY *= damping;

      if (a.same(anchor)) {
        // O nó raiz (diretório principal) tem movimento muito limitado
        shiftX *= 0.1;
        shiftY *= 0.1;
        // Garantir que o nó raiz sempre retorne ao centro
        const currentPos = a.position();
        const centerPull = 0.05;
        shiftX += (0 - currentPos.x) * centerPull;
        shiftY += (0 - currentPos.y) * centerPull;
      }

      if (Math.abs(shiftX) + Math.abs(shiftY) > 0.3) { // Threshold menor
        a.position({ x: pa.x + shiftX, y: pa.y + shiftY });
        moved++;
      }
    });

    if (moved === 0) break;
  }
  
  console.log(`✅ Algoritmo de colisão concluído com ${minGap}px de distância mínima`);
}

function nearestNodeToSegment(cy, s, t, excludeIds) {
  let best = null;
  let bestD = Infinity;

  cy.nodes().forEach((n) => {
    if (excludeIds.has(n.id())) return;

    const p = n.position();
    const d = pointToSegmentDistance(p.x, p.y, s.x, s.y, t.x, t.y);

    if (d < bestD) {
      bestD = d;
      best = { n, d };
    }
  });

  return best;
}

function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len = C * C + D * D;

  let t = len ? dot / len : 0;
  t = Math.max(0, Math.min(1, t));

  const xx = x1 + t * C;
  const yy = y1 + t * D;

  return Math.hypot(px - xx, py - yy);
}

window.LayoutAlgorithm.routeEdgesSmart = function(cy) {
  if (!cy || cy.destroyed()) return;

  cy.edges().forEach((e) => {
    const s = e.source().position();
    const t = e.target().position();

    const exclude = new Set([e.source().id(), e.target().id()]);

    const nearest = nearestNodeToSegment(cy, s, t, exclude);

    const vx = t.x - s.x;
    const vy = t.y - s.y;

    const len = Math.hypot(vx, vy) || 1;

    // perpendicular unit
    let px = -vy / len;
    let py = vx / len;

    // steer away from nearest node by flipping if needed
    if (nearest) {
      const mid = { x: (s.x + t.x) / 2, y: (s.y + t.y) / 2 };
      const toC = {
        x: nearest.n.position().x - mid.x,
        y: nearest.n.position().y - mid.y,
      };

      const dot = px * toC.x + py * toC.y;

      if (dot > 0) {
        px *= -1;
        py *= -1;
      }
    }

    // distance magnitude based on proximity (closer obstacle => bigger bend)
    const base = 24;
    const maxBend = 80;

    const bend = nearest
      ? Math.min(maxBend, base + 60 * (1 / Math.max(6, nearest.d)))
      : base;

    const dist = Math.round(bend);

    e.style('curve-style', 'unbundled-bezier');
    e.style('control-point-distances', [dist]);
    e.style('control-point-weights', [0.5]);
  });
};

// ===== SISTEMA DE AUTO-ORGANIZAÇÃO AUTOMÁTICA =====
// Sistema que funciona continuamente para manter nós organizados em TODOS os modelos

let autoOrganizationActive = false;
let autoOrganizationInterval = null;
let autoOrganizationConfig = {
  minGap: 50,           // Distância mínima MUITO aumentada entre nós
  damping: 0.6,         // Menos damping para movimento mais eficaz
  stepMax: 20,          // Movimento máximo aumentado
  forceStrength: 2.5,   // Força de repulsão MUITO aumentada
  interval: 16,         // Intervalo menor para 60fps (mais responsivo)
  enableHierarchy: true, // Respeitar hierarquia
  enableRootAnchor: true // Manter nó raiz ancorado
};

// Função principal de auto-organização
function performAutoOrganization(cy) {
  if (!cy || cy.destroyed() || !autoOrganizationActive) return;
  
  const nodes = cy.nodes();
  if (nodes.length < 2) return;
  
  const config = autoOrganizationConfig;
  let moved = 0;
  
  // Criar grid espacial para otimização
  const GG = buildGrid(nodes, 80);
  
  nodes.forEach((node) => {
    const pos = node.position();
    const bbox = nodeBBox(node);
    const near = neighborsFromGrid(node, GG);
    
    let forceX = 0;
    let forceY = 0;
    let overlapCount = 0;
    
    // Calcular forças de repulsão
    near.forEach((other) => {
      if (node === other) return;
      
      const otherPos = other.position();
      const otherBbox = nodeBBox(other);
      
      const dx = pos.x - otherPos.x;
      const dy = pos.y - otherPos.y;
      const distance = Math.hypot(dx, dy) || 0.0001;
      
      const minDistance = bbox.r + otherBbox.r + config.minGap;
      
      if (distance < minDistance) {
        overlapCount++;
        
        // Força MUITO mais agressiva para nós pequenos e aglomerados
        const nodeSize = Math.min(bbox.w, bbox.h);
        const otherSize = Math.min(otherBbox.w, otherBbox.h);
        const sizeFactor = Math.max(2.0, 3.0 - (nodeSize + otherSize) / 80); // Mais agressivo
        
        const force = config.forceStrength * sizeFactor * (minDistance - distance) / distance;
        forceX += (dx / distance) * force;
        forceY += (dy / distance) * force;
      }
    });
    
    // Boost MUITO mais agressivo para nós com muitas sobreposições
    if (overlapCount > 1) {
      const overlapBoost = 1 + (overlapCount * 0.6); // Mais agressivo
      forceX *= overlapBoost;
      forceY *= overlapBoost;
    }
    
    // Aplicar força com damping
    forceX *= config.damping;
    forceY *= config.damping;
    
    // Limitar movimento máximo
    const moveX = Math.max(-config.stepMax, Math.min(config.stepMax, forceX));
    const moveY = Math.max(-config.stepMax, Math.min(config.stepMax, forceY));
    
    // Respeitar hierarquia se habilitado
    if (config.enableHierarchy) {
      const depth = node.data('depth') || 0;
      
      // Nós raiz têm movimento muito limitado
      if (depth === 0 && config.enableRootAnchor) {
        const rootMoveFactor = 0.1;
        moveX *= rootMoveFactor;
        moveY *= rootMoveFactor;
        
        // Força o nó raiz a retornar ao centro se necessário
        const centerPull = 0.05;
        const centerX = (0 - pos.x) * centerPull;
        const centerY = (0 - pos.y) * centerPull;
        moveX += centerX;
        moveY += centerY;
      }
      
      // Nós filhos respeitam limites de movimento baseados na profundidade
      else if (depth > 0) {
        const depthFactor = Math.max(0.4, 1 - (depth * 0.08)); // Menos restritivo
        moveX *= depthFactor;
        moveY *= depthFactor;
      }
    }
    
    // Aplicar movimento se significativo (threshold MUITO menor para máxima sensibilidade)
    if (Math.abs(moveX) + Math.abs(moveY) > 0.1) {
      const newX = pos.x + moveX;
      const newY = pos.y + moveY;
      
      node.position({ x: newX, y: newY });
      moved++;
    }
  });
  
  // Log apenas quando há movimento significativo
  if (moved > 0) {
    console.log(`🧠 Auto-organização: ${moved} nós reposicionados`);
  }
}

// Iniciar sistema de auto-organização
window.LayoutAlgorithm.startAutoOrganization = function(cy, customConfig = {}) {
  if (autoOrganizationActive) {
    console.log('⚠️ Auto-organização já está ativa');
    return;
  }
  
  // Mesclar configurações customizadas
  autoOrganizationConfig = { ...autoOrganizationConfig, ...customConfig };
  
  autoOrganizationActive = true;
  
  // Iniciar loop de auto-organização
  autoOrganizationInterval = setInterval(() => {
    performAutoOrganization(cy);
  }, autoOrganizationConfig.interval);
  
  console.log('🚀 Sistema de auto-organização automática ATIVADO');
  console.log('📊 Configurações:', autoOrganizationConfig);
};

// Parar sistema de auto-organização
window.LayoutAlgorithm.stopAutoOrganization = function() {
  if (!autoOrganizationActive) {
    console.log('⚠️ Auto-organização já está inativa');
    return;
  }
  
  autoOrganizationActive = false;
  
  if (autoOrganizationInterval) {
    clearInterval(autoOrganizationInterval);
    autoOrganizationInterval = null;
  }
  
  console.log('🛑 Sistema de auto-organização PARADO');
};

// Verificar se está ativo
window.LayoutAlgorithm.isAutoOrganizationActive = function() {
  return autoOrganizationActive;
};

// Atualizar configurações em tempo real
window.LayoutAlgorithm.updateAutoOrganizationConfig = function(newConfig) {
  autoOrganizationConfig = { ...autoOrganizationConfig, ...newConfig };
  console.log('⚙️ Configurações de auto-organização atualizadas:', autoOrganizationConfig);
};

// Função para pausar temporariamente (útil durante interações do usuário)
window.LayoutAlgorithm.pauseAutoOrganization = function() {
  if (autoOrganizationInterval) {
    clearInterval(autoOrganizationInterval);
    autoOrganizationInterval = null;
  }
};

// Função para retomar após pausa
window.LayoutAlgorithm.resumeAutoOrganization = function(cy) {
  if (autoOrganizationActive && !autoOrganizationInterval) {
    autoOrganizationInterval = setInterval(() => {
      performAutoOrganization(cy);
    }, autoOrganizationConfig.interval);
  }
};

// Função para forçar reorganização imediata (útil para resolver aglomerações críticas)
window.LayoutAlgorithm.forceReorganization = function(cy, iterations = 5) {
  console.log('🚀 Forçando reorganização imediata...');
  
  for (let i = 0; i < iterations; i++) {
    performAutoOrganization(cy);
  }
  
  console.log('✅ Reorganização forçada concluída');
};

// Função para detectar e resolver aglomerações críticas
window.LayoutAlgorithm.resolveCriticalClusters = function(cy) {
  const nodes = cy.nodes();
  const clusters = [];
  const visited = new Set();
  
  // Detectar clusters de nós muito próximos
  nodes.forEach((node) => {
    if (visited.has(node.id())) return;
    
    const cluster = [node];
    const pos = node.position();
    const bbox = nodeBBox(node);
    
    nodes.forEach((other) => {
      if (other === node || visited.has(other.id())) return;
      
      const otherPos = other.position();
      const otherBbox = nodeBBox(other);
      const distance = Math.hypot(pos.x - otherPos.x, pos.y - otherPos.y);
      const minDistance = bbox.r + otherBbox.r + 20; // 20px de margem
      
      if (distance < minDistance) {
        cluster.push(other);
        visited.add(other.id());
      }
    });
    
    if (cluster.length > 3) { // Cluster crítico se tem mais de 3 nós
      clusters.push(cluster);
      cluster.forEach(n => visited.add(n.id()));
    }
  });
  
  // Resolver clusters críticos
  clusters.forEach((cluster, index) => {
    console.log(`🔧 Resolvendo cluster crítico ${index + 1} com ${cluster.length} nós`);
    
    // Aplicar força de dispersão mais agressiva
    cluster.forEach((node, i) => {
      const angle = (i / cluster.length) * 2 * Math.PI;
      const radius = 50 + (i * 10); // Distância crescente
      
      const newX = node.position().x + Math.cos(angle) * radius;
      const newY = node.position().y + Math.sin(angle) * radius;
      
      node.position({ x: newX, y: newY });
    });
  });
  
  if (clusters.length > 0) {
    console.log(`✅ ${clusters.length} clusters críticos resolvidos`);
  }
  
  return clusters.length;
};