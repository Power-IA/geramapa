/* GeraMapas Storage - Convertido para JavaScript tradicional */
window.Storage = window.Storage || {};

const KEY_SETTINGS = 'mm.settings.v1';
const KEY_MAPS = 'mm.maps.v1';
const KEY_SUMMARIES = 'mm.summaries.v1';

window.Storage.GeraMapas = {
  saveSettings({ provider, apiKey, model, theme, layout }) {
    // theme: { --bg, --text, --accent, --muted, --border, fontSize, fontFamily }
    const settings = JSON.parse(localStorage.getItem(KEY_SETTINGS) || '{}');
    
    // ❌ NÃO salvar apiKey aqui - isso deve ser feito apenas via saveApiKey()
    // Se apiKey for passado, ignorar (para evitar sobrescrever chaves existentes)
    
    if (provider !== undefined) settings.provider = provider;
    if (model !== undefined) settings.model = model;
    if (theme !== undefined) settings.theme = theme;
    if (layout !== undefined) settings.layout = layout;
    
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
  },
  loadSettings() {
    const raw = localStorage.getItem(KEY_SETTINGS);
    const parsed = raw ? JSON.parse(raw) : null;
    
    if (!parsed) return null;
    
    // ✅ MIGRAÇÃO: Converter sistema antigo (apiKey) para novo (apiKeys)
    if (parsed.apiKey && !parsed.apiKeys) {
      console.log('🔄 Migrando API key antigo para novo sistema...');
      parsed.apiKeys = {};
      if (parsed.provider) {
        parsed.apiKeys[parsed.provider] = parsed.apiKey;
        console.log(`✅ API key migrada para provedor "${parsed.provider}"`);
      }
      // Remover apiKey antigo após migração
      delete parsed.apiKey;
      localStorage.setItem(KEY_SETTINGS, JSON.stringify(parsed));
      console.log('✅ Migração concluída');
    }
    
    // Retornar compatibilidade com código antigo
    if (parsed.apiKeys && parsed.provider) {
      parsed.apiKey = parsed.apiKeys[parsed.provider] || '';
    }
    
    // Debug: log para detectar problemas
    if (parsed.apiKeys) {
      console.log('🔍 API Keys carregadas:', Object.keys(parsed.apiKeys));
    }
    
    return parsed;
  },
  getApiKey(provider) {
    const settings = this.loadSettings();
    
    console.log(`🔍 getApiKey chamado para provedor: "${provider}"`);
    console.log(`🔍 Settings:`, JSON.stringify(settings, null, 2));
    
    if (settings && settings.apiKeys && settings.apiKeys[provider]) {
      console.log(`✅ API Key encontrada para "${provider}"`);
      return settings.apiKeys[provider];
    }
    
    // Compatibilidade com código antigo
    if (settings && !settings.apiKeys && settings.apiKey) {
      console.log(`⚠️ Usando API key antiga (compatibilidade)`);
      return settings.apiKey;
    }
    
    console.log(`⚠️ Nenhuma API key encontrada para "${provider}"`);
    return '';
  },
  saveApiKey(provider, apiKey) {
    const settings = JSON.parse(localStorage.getItem(KEY_SETTINGS) || '{}');
    if (!settings.apiKeys) settings.apiKeys = {};
    settings.apiKeys[provider] = apiKey;
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
    console.log(`✅ API Key salva para provedor "${provider}"`);
    console.log(`🔍 Estado atual das API keys:`, settings.apiKeys);
  },
  deleteApiKey(provider) {
    const settings = JSON.parse(localStorage.getItem(KEY_SETTINGS) || '{}');
    
    console.log(`🗑️ Excluindo API key do provedor: ${provider}`);
    console.log(`🔍 Estado ANTES da exclusão:`, JSON.stringify(settings, null, 2));
    
    let deleted = false;
    
    // ✅ NOVO: Sistema com apiKeys (por provedor)
    if (settings.apiKeys) {
      const hadKey = settings.apiKeys[provider];
      delete settings.apiKeys[provider];
      deleted = true;
      
      console.log(`🔍 Chave existia em apiKeys?: ${hadKey ? 'SIM' : 'NÃO'}`);
      
      // Se não tem mais nenhuma API key, remover o objeto apiKeys
      if (Object.keys(settings.apiKeys).length === 0) {
        console.log(`🗑️ Removendo objeto apiKeys (está vazio)`);
        delete settings.apiKeys;
      }
    }
    
    // ✅ NOVO: Sistema antigo (compatibilidade) - sempre deletar apiKey global
    if (settings.apiKey) {
      console.log(`🗑️ Deletando apiKey antigo (sistema legado)`);
      delete settings.apiKey;
      deleted = true;
    }
    
    if (deleted) {
      localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
      console.log(`✅ API Key(s) excluída(s) do provedor "${provider}"`);
    } else {
      console.warn(`⚠️ Nenhuma API key encontrada para o provedor "${provider}"`);
    }
    
    // Verificar se realmente foi excluída
    const verify = JSON.parse(localStorage.getItem(KEY_SETTINGS) || '{}');
    console.log(`🔍 Estado após salvar:`, JSON.stringify(verify, null, 2));
    
    if ((verify.apiKeys && verify.apiKeys[provider]) || verify.apiKey) {
      console.error(`❌ ERRO: A chave ainda existe após exclusão!`);
    } else {
      console.log(`✅ Confirmação: API Key completamente removida`);
    }
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