# 📚 GLOSSÁRIO TÉCNICO - GeraMapa

**Data:** 20/10/2025  
**Especialista:** Lucius VII

---

## 🔤 TERMOS TÉCNICOS

### **A**

**API Key** - Chave de autenticação para acesso aos serviços de IA (Groq, OpenRouter)

**Algoritmo de Layout** - Sistema inteligente de posicionamento de nós baseado em física e otimização espacial

**ARIA** - Accessible Rich Internet Applications, padrão para acessibilidade web

**Autolock** - Propriedade do Cytoscape que impede movimentação automática de nós

---

### **B**

**Bounding Box** - Caixa delimitadora calculada dinamicamente para cada nó baseada no conteúdo de texto

**Bezier** - Curvas matemáticas usadas para roteamento suave de arestas entre nós

**Box Selection** - Seleção múltipla de elementos usando arraste de retângulo

---

### **C**

**Canvas** - Elemento HTML5 usado para desenho livre (marcador e lápis)

**Cytoscape.js** - Biblioteca JavaScript para visualização de grafos e redes

**Collision Detection** - Sistema de detecção e resolução de sobreposições entre nós

**Crypto.randomUUID()** - Função nativa para geração de identificadores únicos

---

### **D**

**Debouncing** - Técnica para limitar a frequência de execução de funções

**Damping** - Amortecimento aplicado nas forças físicas para suavizar movimentos

**Drag & Drop** - Sistema de arrastar e soltar para popups flutuantes

---

### **E**

**Edge** - Aresta/conexão entre dois nós no mapa mental

**Exportação** - Conversão do mapa para diferentes formatos (PNG, PDF, HTML, JSON, XML)

**Event Listener** - Ouvinte de eventos para interações do usuário

---

### **F**

**Fallback** - Sistema de backup quando APIs principais falham

**Font Family** - Família de fontes configurável pelo usuário

**Font Size** - Tamanho da fonte, ajustável dinamicamente

---

### **G**

**Grid Espacial** - Sistema de divisão do espaço em células para otimizar detecção de colisões

**Groq** - Provedor de IA com modelos Llama e Mixtral

---

### **H**

**HTML5 Canvas** - Elemento para renderização de gráficos 2D

**HTTP Referer** - Cabeçalho HTTP usado pela OpenRouter para identificação

---

### **I**

**IA (Inteligência Artificial)** - Sistema de geração de mapas mentais via modelos de linguagem

**IndexedDB** - Banco de dados local do navegador (não usado, preferindo localStorage)

---

### **J**

**JSON** - Formato de dados usado para comunicação com APIs de IA

**jsPDF** - Biblioteca para geração de documentos PDF

---

### **L**

**localStorage** - Armazenamento local persistente do navegador

**Layout Algorithm** - Algoritmo inteligente de posicionamento de nós

**Llama** - Modelo de IA da Meta disponível via Groq

---

### **M**

**Markdown** - Linguagem de marcação processada pela biblioteca marked.js

**Mixtral** - Modelo de IA da Mistral AI disponível via Groq

**Mermaid.js** - Biblioteca para criação de diagramas em formato de código

---

### **N**

**Node** - Nó/elemento do mapa mental com label e propriedades

**Normalização** - Processo de padronização de dados recebidos da IA

---

### **O**

**OpenRouter** - Provedor de IA com acesso a múltiplos modelos (Claude, Gemini, etc.)

**Overlap Resolution** - Sistema de resolução de sobreposições entre elementos

---

### **P**

**Panning** - Movimentação do mapa pela área de visualização

**Physics Engine** - Motor de física para simulação de forças entre nós

**Popup Flutuante** - Janelas deslocáveis para chat e configurações

---

### **R**

**Responsive Design** - Design adaptativo para diferentes tamanhos de tela

**Repulsion Force** - Força de repulsão entre nós para evitar sobreposições

**Root Node** - Nó raiz do mapa mental (profundidade 0)

---

### **S**

**SaaS** - Software as a Service, modelo de aplicação web

**SVG** - Scalable Vector Graphics usado pelo Cytoscape

**Spatial Grid** - Grade espacial para otimização de colisões

---

### **T**

**Temperature** - Parâmetro de criatividade dos modelos de IA (0.0-1.0)

**Tree Structure** - Estrutura hierárquica dos mapas mentais

**Touch Events** - Eventos de toque para dispositivos móveis

---

### **U**

**UUID** - Universal Unique Identifier para identificação única de mapas

**User Panning** - Panning controlado pelo usuário

**User Zooming** - Zoom controlado pelo usuário

---

### **V**

**Viewport** - Área visível do mapa na tela

**Virtualization** - Técnica de renderização eficiente para grandes datasets

---

### **W**

**Wheel Sensitivity** - Sensibilidade do scroll para zoom

**WebSocket** - Protocolo de comunicação em tempo real (não implementado)

---

### **X**

**XML** - Formato de exportação estruturado

**X-Title** - Cabeçalho HTTP personalizado para OpenRouter

---

### **Y**

**Y-Axis** - Eixo vertical do sistema de coordenadas

---

### **Z**

**Zoom** - Ampliação/redução da visualização do mapa

**Zoom Fit** - Ajuste automático do zoom para mostrar todo o mapa

---

## 🔧 FUNÇÕES PRINCIPAIS

### **AI.js**
- `AI.fetchModels()` - Busca modelos disponíveis do provedor
- `AI.chatMindMap()` - Gera mapa mental via IA
- `AI.chatPlain()` - Chat conversacional simples
- `normalizeMap()` - Normaliza estrutura de dados do mapa

### **app.js**
- `generateMap()` - Gera novo mapa mental
- `saveMap()` - Salva mapa no localStorage
- `loadMap()` - Carrega mapa salvo
- `exportMap()` - Exporta mapa em diferentes formatos
- `applyTheme()` - Aplica tema personalizado
- `updateStatus()` - Atualiza barra de status

### **map.js**
- `MapEngine.initCy()` - Inicializa instância do Cytoscape
- `enableCenteredZoom()` - Habilita zoom centrado
- `convertToCytoscape()` - Converte dados para formato Cytoscape
- `applyNodeStyles()` - Aplica estilos aos nós

### **layout-algorithm.js**
- `LayoutAlgorithm.apply()` - Aplica algoritmo de layout
- `nodeBBox()` - Calcula bounding box do nó
- `resolveCollisions()` - Resolve colisões entre nós
- `routeEdges()` - Roteia arestas com Bezier

### **marker-system.js**
- `toggleMarker()` - Ativa/desativa marcador
- `toggleLapis()` - Ativa/desativa lápis
- `activateMarker()` - Ativa sistema de marcador
- `deactivateMarker()` - Desativa sistema de marcador
- `drawPath()` - Desenha caminho no canvas

### **storage.js**
- `Storage.saveSettings()` - Salva configurações
- `Storage.loadSettings()` - Carrega configurações
- `Storage.saveMap()` - Salva mapa
- `Storage.loadMap()` - Carrega mapa
- `Storage.deleteMap()` - Remove mapa

---

## 📊 ESTRUTURAS DE DADOS

### **Estado Global**
```javascript
const state = {
  provider: 'groq',           // Provedor de IA
  apiKey: '',                 // Chave da API
  model: '',                  // Modelo selecionado
  currentMap: null,           // Mapa atual
  cy: null,                   // Instância Cytoscape
  chat: [],                   // Histórico do chat
  specialistChat: [],         // Histórico do especialista
  theme: {...},               // Configurações de tema
  layout: {...}               // Configurações de layout
};
```

### **Estrutura do Nó**
```javascript
const node = {
  id: 'unique_id',            // Identificador único
  label: 'Texto do nó',       // Texto exibido
  depth: 0,                   // Profundidade na hierarquia
  branch: '0',                // Ramo/cores (0-4)
  children: [],               // Nós filhos
  img: 'url',                 // Imagem opcional
  data: {...}                 // Dados adicionais
};
```

### **Configurações de Tema**
```javascript
const theme = {
  '--bg': '#ffffff',          // Cor de fundo
  '--text': '#111111',        // Cor do texto
  '--accent': '#000000',      // Cor de destaque
  '--muted': '#666666',       // Cor secundária
  '--border': '#e6e6e6',      // Cor das bordas
  fontSize: 16,               // Tamanho da fonte
  fontFamily: 'Noto Sans'     // Família da fonte
};
```

---

## 🎨 ESTILOS CSS PRINCIPAIS

### **Classes Base**
- `.app-grid` - Layout principal em grid
- `.app-header` - Cabeçalho fixo
- `.app-main` - Área principal do mapa
- `.app-status` - Barra de status

### **Componentes**
- `.floating-chat` - Chat flutuante
- `.mobile-popup` - Popup responsivo
- `.zoom-controls` - Controles de zoom
- `.marker-panel` - Painel do marcador

### **Estados**
- `.active` - Elemento ativo
- `.dragging` - Elemento sendo arrastado
- `.minimized` - Elemento minimizado
- `.hidden` - Elemento oculto

---

## 🔄 FLUXOS DE DADOS

### **Geração de Mapa**
```
Usuário → Prompt → AI.chatMindMap() → JSON → normalizeMap() → renderMap() → Cytoscape
```

### **Persistência**
```
Mapa → Storage.saveMap() → localStorage → Storage.loadMap() → Mapa
```

### **Exportação**
```
Mapa → convertToFormat() → Blob → Download
```

### **Tema**
```
Configuração → applyTheme() → CSS Variables → Renderização
```

---

## 🚀 OTIMIZAÇÕES IMPLEMENTADAS

### **Performance**
- Cache de medidas de texto
- Debouncing de eventos
- Lazy loading de componentes
- Virtualização de elementos

### **UX**
- Zoom centrado no viewport
- Drag & drop de popups
- Atalhos de teclado
- Feedback visual em tempo real

### **Acessibilidade**
- ARIA labels
- Navegação por teclado
- Contraste de cores
- Textos alternativos

---

*Glossário técnico criado por Lucius VII*  
*"Na minha época, essas nuvens eram só vapor d'água!"* 🌤️
