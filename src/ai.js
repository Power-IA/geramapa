/* GeraMapas AI - Convertido para JavaScript tradicional */
window.AI = window.AI || {};

const ENDPOINTS = {
  groq: {
    models: 'https://api.groq.com/openai/v1/models',
    chat: 'https://api.groq.com/openai/v1/chat/completions',
    headers: (key) => ({ 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Accept': 'application/json' })
  },
  openrouter: {
    models: 'https://openrouter.ai/api/v1/models',
    chat: 'https://openrouter.ai/api/v1/chat/completions',
    headers: (key) => ({
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'HTTP-Referer': (typeof location !== 'undefined' ? location.origin : 'https://example.com'),
      'X-Title': 'Mapa Mental IA'
    })
  }
};

window.AI.fetchModels = async function(provider, apiKey) {
  const ep=ENDPOINTS[provider]; if(!ep) throw new Error('Provedor inválido.');
  let data, models = [];
  const headers = ep.headers(apiKey);
  try {
    const r = await fetch(ep.models, { headers });
    if (r.ok) data = await r.json(); else throw new Error(`HTTP ${r.status}`);
  } catch (err) {
    if (provider === 'openrouter') {
      try { const r2 = await fetch(ep.models); if (r2.ok) data = await r2.json(); } catch {}
    } else {
      throw new Error('Erro ao listar modelos da Groq. Verifique a API Key.');
    }
  }
  if(data){models=(data.data||[]).map(m=>({id:m.id,label:(provider==='openrouter'?(m.name||m.id):m.id)}));}
  if(!models.length){models=provider==='groq'
  ?[{id:'llama-3.1-8b-instant',label:'llama-3.1-8b-instant'},{id:'llama-3.1-70b-versatile',label:'llama-3.1-70b-versatile'},{id:'mixtral-8x7b-32768',label:'mixtral-8x7b-32768'}]
  :[{id:'anthropic/claude-3.5-sonnet',label:'Claude 3.5 Sonnet'},{id:'google/gemini-1.5-pro',label:'Gemini 1.5 Pro'},{id:'meta-llama/llama-3.1-70b-instruct',label:'Llama 3.1 70B Instruct'}];}
  return models.filter(m=>typeof m.id==='string');
};

window.AI.chatMindMap = async function({ provider, apiKey, model, message }) {
  const ep = ENDPOINTS[provider];
  const body = {
    model,
    messages: [
      {
        role: 'system',
        content:
          'Você é um gerador de mapas mentais. Responda SOMENTE em JSON válido com o formato: ' +
          '{"title":"<título>","nodes":[{"id":"root","label":"<assunto>","children":[{"id":"n1","label":"<tópico>","children":[...]}, ...]}]}} ' +
          'Evite texto fora do JSON. Crie estrutura clara com 3-6 tópicos principais e sub-tópicos concisos.'
      },
      { role: 'user', content: message }
    ],
    temperature: 0.2
  };

  const res = await fetch(ep.chat, {
    method: 'POST',
    headers: ep.headers(apiKey),
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Falha na geração (${res.status}): ${txt}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Resposta vazia do modelo.');
  let json;
  try {
    json = JSON.parse(content);
  } catch (e) {
    // attempt to extract JSON block
    const m = content.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Não foi possível parsear o JSON do modelo.');
    json = JSON.parse(m[0]);
  }
  return normalizeMap(json);
};

window.AI.chatPlain = async function({ provider, apiKey, model, message, temperature = 0.2 }) {
  const ep = ENDPOINTS[provider];
  if (!ep) throw new Error('Provedor inválido.');
  const body = {
    model,
    messages: [
      { role: 'system', content: 'Você é um assistente conciso. Responda de forma clara e direta, sem JSON, apenas texto.' },
      { role: 'user', content: message }
    ],
    temperature
  };

  const res = await fetch(ep.chat, {
    method: 'POST',
    headers: ep.headers(apiKey),
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Falha na geração (${res.status}): ${txt}`);
  }

  const data = await res.json();
  // Support different response shapes (OpenRouter/Groq/OpenAI-like)
  const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || data.output?.[0]?.content?.[0]?.content?.[0]?.text;
  if (!content) {
    // try raw text
    return typeof data === 'string' ? data : JSON.stringify(data);
  }
  return content;
};

/* Normalize to expected tree format */
function normalizeMap(obj) {
  const title = obj.title || 'Mapa Mental';
  const nodes = Array.isArray(obj.nodes) ? obj.nodes : [];
  // ensure root existence
  let root = nodes.find(n => n.id === 'root') || nodes[0];
  if (!root) {
    root = { id: 'root', label: title, children: [] };
  }
  return { title, nodes: [root] };
}