/* GeraMapas Storage - Convertido para JavaScript tradicional */
window.Storage = window.Storage || {};

const KEY_SETTINGS = 'mm.settings.v1';
const KEY_MAPS = 'mm.maps.v1';
const KEY_SUMMARIES = 'mm.summaries.v1';

window.Storage.GeraMapas = {
  saveSettings({ provider, apiKey, model, theme, layout }) {
    // theme: { --bg, --text, --accent, --muted, --border, fontSize, fontFamily }
    localStorage.setItem(KEY_SETTINGS, JSON.stringify({ provider, apiKey, model, theme, layout }));
  },
  loadSettings() {
    const raw = localStorage.getItem(KEY_SETTINGS);
    return raw ? JSON.parse(raw) : null;
  },
  saveMap({ title, data }) {
    const id = crypto.randomUUID();
    const list = window.Storage.GeraMapas._listRaw();
    list.push({ id, title, data, ts: Date.now() });
    localStorage.setItem(KEY_MAPS, JSON.stringify(list));
    return id;
  },
  listMaps() {
    return window.Storage.GeraMapas._listRaw().map(({ id, title }) => ({ id, title }));
  },
  getMap(id) {
    return window.Storage.GeraMapas._listRaw().find(x => x.id === id) || null;
  },
  deleteMap(id) {
    const mapToDelete = window.Storage.GeraMapas._listRaw().find(x => x.id === id);
    
    // ✅ CORREÇÃO: Limpar cache associado ao mapa deletado
    if (mapToDelete) {
      const mapTitle = mapToDelete.title || mapToDelete.data.title || '';
      
      // Buscar todos os resumos e filtrar os que pertencem a este mapa
      const summaries = window.Storage.GeraMapas._listSummariesRaw();
      const cleanedSummaries = summaries.filter(summary => {
        // Extrair título do mapa do sumário através da chave
        // Formato da chave: summary_{mapTitle}_{nodeLabel}
        const keyParts = summary.key.split('_');
        if (keyParts.length >= 2) {
          const summaryMapTitle = keyParts.slice(1, -1).join('_'); // Tudo entre 'summary_' e último '_'
          const cleanMapTitle = mapTitle.replace(/[^a-zA-Z0-9]/g, '_');
          return summaryMapTitle !== cleanMapTitle;
        }
        return true; // Manter resumos com formato inválido
      });
      
      // Salvar lista limpa
      localStorage.setItem(KEY_SUMMARIES, JSON.stringify(cleanedSummaries));
      console.log(`🗑️ Cache do mapa "${mapTitle}" limpo automaticamente`);
    }
    
    const list = window.Storage.GeraMapas._listRaw().filter(x => x.id !== id);
    localStorage.setItem(KEY_MAPS, JSON.stringify(list));
  },
  updateMap(id, { title, data }) {
    const list = window.Storage.GeraMapas._listRaw();
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) { list[idx] = { ...list[idx], title, data, ts: Date.now() }; }
    localStorage.setItem(KEY_MAPS, JSON.stringify(list));
  },
  saveSummary({ nodeLabel, mapTitle, summary, readingMode, layoutModel }) {
    try {
      const summaries = window.Storage.GeraMapas._listSummariesRaw();
      const summaryKey = window.Storage.GeraMapas._generateSummaryKey(nodeLabel, mapTitle);

      const summaryData = {
        key: summaryKey,
        nodeLabel,
        mapTitle,
        summary,
        readingMode,
        layoutModel,
        timestamp: Date.now()
      };

      // Remove resumo existente com a mesma chave
      const filtered = summaries.filter(s => s.key !== summaryKey);
      filtered.push(summaryData);

      localStorage.setItem(KEY_SUMMARIES, JSON.stringify(filtered));
      console.log(`💾 Resumo salvo no localStorage: ${nodeLabel}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar resumo no localStorage:', error);
      return false;
    }
  },
  loadSummary(nodeLabel, mapTitle) {
    try {
      const summaries = window.Storage.GeraMapas._listSummariesRaw();
      const summaryKey = window.Storage.GeraMapas._generateSummaryKey(nodeLabel, mapTitle);
      const summary = summaries.find(s => s.key === summaryKey);

      if (summary) {
        console.log(`📂 Resumo carregado do localStorage: ${nodeLabel}`);
        return summary;
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao carregar resumo do localStorage:', error);
      return null;
    }
  },
  hasSummary(nodeLabel, mapTitle) {
    try {
      const summaries = window.Storage.GeraMapas._listSummariesRaw();
      const summaryKey = window.Storage.GeraMapas._generateSummaryKey(nodeLabel, mapTitle);
      return summaries.some(s => s.key === summaryKey);
    } catch (error) {
      return false;
    }
  },
  deleteSummary(nodeLabel, mapTitle) {
    try {
      const summaries = window.Storage.GeraMapas._listSummariesRaw();
      const summaryKey = window.Storage.GeraMapas._generateSummaryKey(nodeLabel, mapTitle);
      const filtered = summaries.filter(s => s.key !== summaryKey);
      localStorage.setItem(KEY_SUMMARIES, JSON.stringify(filtered));
      console.log(`🗑️ Resumo removido do localStorage: ${nodeLabel}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao remover resumo do localStorage:', error);
      return false;
    }
  },
  listAllSummaries() {
    try {
      return window.Storage.GeraMapas._listSummariesRaw();
    } catch (error) {
      console.error('❌ Erro ao listar resumos:', error);
      return [];
    }
  },
  _listSummariesRaw() {
    try {
      const raw = localStorage.getItem(KEY_SUMMARIES);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('❌ Erro ao carregar lista de resumos:', error);
      return [];
    }
  },
  _generateSummaryKey(nodeLabel, mapTitle) {
    // Gera uma chave única baseada no nome do nó e do mapa
    const cleanNodeLabel = nodeLabel.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanMapTitle = mapTitle.replace(/[^a-zA-Z0-9]/g, '_');
    return `summary_${cleanMapTitle}_${cleanNodeLabel}`;
  },
  _listRaw() {
    const raw = localStorage.getItem(KEY_MAPS);
    return raw ? JSON.parse(raw) : [];
  }
};