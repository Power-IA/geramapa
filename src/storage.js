/* GeraMapas Storage - Convertido para JavaScript tradicional */
window.Storage = window.Storage || {};

const KEY_SETTINGS = 'mm.settings.v1';
const KEY_MAPS = 'mm.maps.v1';

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
    const list = window.Storage.GeraMapas._listRaw().filter(x => x.id !== id);
    localStorage.setItem(KEY_MAPS, JSON.stringify(list));
  },
  updateMap(id, { title, data }) {
    const list = window.Storage.GeraMapas._listRaw();
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) { list[idx] = { ...list[idx], title, data, ts: Date.now() }; }
    localStorage.setItem(KEY_MAPS, JSON.stringify(list));
  },
  _listRaw() {
    const raw = localStorage.getItem(KEY_MAPS);
    return raw ? JSON.parse(raw) : [];
  }
};