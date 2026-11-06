/*
 * swarm-animation: plays a "team of agents is building this page" animation over a
 * finished web page. It works best on static pages and has no dependencies.
 *
 *   <script src="swarm.js" data-auto></script>   plays on load
 *   Swarm.run({ agents: 20, speed: 1.5 })        plays from code
 *   Swarm.skip()                                 jumps to the finished page
 *
 * Mark an element with data-swarm-skip to leave it out, or data-swarm="media"
 * to reveal it as one block. The real content stays in the DOM throughout, so
 * search engines and screen readers still get it, and links stay clickable.
 * Visitors who prefer reduced motion get the finished page straight away.
 */
(function () {
  'use strict';

  const DEFAULTS = {
    agents: 28,
    mobileAgents: 10,
    speed: 1,
    tour: true,          // scroll the page automatically as it builds
    returnToTop: true,   // scroll back to the top when finished
    replayButton: false, // leave a replay button on the page afterwards
    once: false,         // play only once per browser
    targetSeconds: 15,   // long pages speed up to finish in about this time
    maxSeconds: 40,      // always show the finished page after this long
    storageKey: 'swarm-played',
  };

  const COLORS = ['#d2f547', '#ededed', '#e03131', '#d2f547', '#ededed', '#8a8a8a', '#d2f547', '#e03131'];
  const SPEEDS = [1, 1.6, 2, 4];
  const MEDIA = new Set(['IMG', 'SVG', 'CANVAS', 'VIDEO', 'PICTURE', 'IFRAME']);

  const CSS = `
  html.sw-boot body { opacity: 0 !important; }
  .sw-nopaint { background: transparent !important; background-image: none !important; border-color: transparent !important; box-shadow: none !important; }
  .sw-hide { opacity: 0 !important; }
  .sw-ghost { opacity: 0; }
  @media print { .sw-hide, .sw-ghost { opacity: 1 !important; } .sw-layer { display: none !important; } }
  .sw-layer { position: fixed; inset: 0; z-index: 2147483000; pointer-events: none; overflow: hidden; transition: opacity .35s; font: 600 10px/1 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace; letter-spacing: .04em; text-transform: uppercase; }
  .sw-layer * { box-sizing: border-box; }
  .sw-layer.sw-out { opacity: 0; }
  .sw-abs { position: absolute; left: 0; top: 0; will-change: transform; }
  .sw-sel { border: 1.5px solid #d2f547; transition: opacity .2s; }
  .sw-sel.sw-red { border-color: #e03131; }
  .sw-sel.sw-out, .sw-fill.sw-out, .sw-line.sw-out, .sw-guide.sw-out, .sw-clone.sw-out { opacity: 0; }
  .sw-handle { position: absolute; width: 7px; height: 7px; background: #0a0a0a; border: 1.5px solid #d2f547; border-radius: 0; }
  .sw-red .sw-handle { border-color: #e03131; }
  .sw-h0 { left: -4px; top: -4px; } .sw-h1 { right: -4px; top: -4px; } .sw-h2 { left: -4px; bottom: -4px; } .sw-h3 { right: -4px; bottom: -4px; }
  .sw-badge { position: absolute; left: 50%; top: calc(100% + 5px); transform: translateX(-50%); padding: 3px 5px; border-radius: 0; background: #d2f547; color: #0a0a0a; white-space: nowrap; }
  .sw-red .sw-badge { background: #e03131; color: #ededed; }
  .sw-fill { background: repeating-linear-gradient(-45deg, rgba(210,245,71,.22) 0 6px, rgba(210,245,71,.06) 6px 12px); outline: 1px dashed rgba(210,245,71,.55); transition: opacity .18s; }
  .sw-line { background: #d2f547; height: 2px; width: 2px; transition: opacity .25s; }
  .sw-guide { background: #e03131; transition: opacity .25s; }
  .sw-clone { white-space: nowrap; transition: opacity .12s; }
  .sw-cursor { width: 0; height: 0; transition: opacity .3s; filter: drop-shadow(2px 2px 0 #000); }
  .sw-tag { position: absolute; left: 13px; top: 19px; padding: 2px 4px; background: var(--c); color: #0a0a0a; font-size: 9px; white-space: nowrap; }
  .sw-tag:empty { display: none; }
  .sw-qa { border: 1.5px dashed #ededed; transition: opacity .25s; }
  .sw-qa .sw-badge { background: #ededed; color: #0a0a0a; left: 0; transform: none; top: -19px; }
  .sw-qa.sw-ok { border-color: #d2f547; } .sw-qa.sw-ok .sw-badge { background: #d2f547; }
  .sw-qa.sw-out { opacity: 0; }
  .sw-frame { border: 1px dashed rgba(210,245,71,.75); transition: opacity .3s; }
  .sw-frame::after { content: attr(data-k); position: absolute; left: 0; top: -13px; font-size: 8px; color: rgba(210,245,71,.8); white-space: nowrap; }
  .sw-frame.sw-out { opacity: 0; }
  .sw-final { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%) scale(.96); min-width: min(520px, 88vw); padding: 18px 20px 16px; background: #0a0a0a; border: 1px solid #d2f547; box-shadow: 8px 8px 0 #d2f547; color: #ededed; font-size: 12px; line-height: 1.7; opacity: 0; transition: opacity .25s, transform .25s; }
  .sw-final.sw-in { opacity: 1; transform: translate(-50%,-50%) scale(1); }
  .sw-final .sw-ln { white-space: pre; color: #8a8a8a; }
  .sw-final .sw-ln b { color: #d2f547; font-weight: 600; }
  .sw-final .sw-big { margin-top: 10px; padding: 10px 12px; background: #d2f547; color: #0a0a0a; font-size: clamp(14px, 2.4vw, 22px); font-weight: 700; letter-spacing: .06em; white-space: nowrap; transform-origin: left; transform: scaleX(0); transition: transform .35s cubic-bezier(.2,.9,.2,1); }
  .sw-final .sw-big.sw-in { transform: scaleX(1); }
  .sw-flash { position: absolute; inset: 0; background: #d2f547; opacity: 0; transition: opacity .5s; }
  .sw-cursor svg { position: absolute; display: none; overflow: visible; }
  .sw-cursor[data-mode=arrow] .sw-i-arrow, .sw-cursor[data-mode=cross] .sw-i-cross, .sw-cursor[data-mode=text] .sw-i-text, .sw-cursor[data-mode=pen] .sw-i-pen { display: block; }
  .sw-i-arrow { left: 0; top: 0; } .sw-i-cross { left: -9px; top: -9px; } .sw-i-text { left: -5px; top: -10px; } .sw-i-pen { left: 0; top: -18px; }
  .sw-bar { position: fixed; left: 50%; bottom: 84px; transform: translateX(-50%); z-index: 2147483001; display: flex; align-items: center; gap: 10px; max-width: calc(100vw - 32px); padding: 7px 8px 7px 12px; border: 1px solid #262626; border-radius: 0; background: #0a0a0a; color: #ededed; box-shadow: 4px 4px 0 #d2f547; font: 600 11px/1 'JetBrains Mono', ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; transition: opacity .3s; }
  .sw-bar.sw-out { opacity: 0; pointer-events: none; }
  .sw-dots { display: flex; }
  .sw-dots i { width: 9px; height: 9px; margin-left: 2px; border-radius: 0; }
  .sw-dots i:first-child { margin-left: 0; }
  .sw-count { font-variant-numeric: tabular-nums; }
  .sw-count b { font-weight: 600; }
  .sw-count span { color: #737373; }
  .sw-track { width: 64px; height: 4px; border-radius: 0; background: #262626; overflow: hidden; }
  .sw-track i { display: block; height: 100%; width: 100%; background: #d2f547; transform-origin: left; transform: scaleX(0); }
  .sw-btn { all: unset; box-sizing: border-box; min-width: 28px; height: 26px; padding: 0 8px; border-radius: 0; background: #1c1c1c; color: inherit; font: inherit; text-align: center; line-height: 26px; cursor: pointer; }
  .sw-btn:hover { background: #d2f547; color: #0a0a0a; }
  .sw-btn:focus-visible { outline: 2px solid #d2f547; outline-offset: 1px; }
  .sw-btn[aria-pressed=false] { color: #8d8f98; background: transparent; }
  .sw-replay { position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%); z-index: 2147483001; height: 34px; padding: 0 14px; line-height: 34px; background: rgba(20,21,26,.92); border: 1px solid rgba(255,255,255,.14); color: #e9e9ec; font: 500 12px/34px ui-sans-serif, system-ui, sans-serif; }
  @media (max-width: 560px) { .sw-track, .sw-dots { display: none; } .sw-bar { gap: 7px; } }
  `;

  const icon = (name, w, h, body) =>
    `<svg class="sw-i-${name}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${body}</svg>`;
  const cursorMarkup = (c) =>
    icon('arrow', 16, 20, `<path d="M1 1v16l4.5-4.2 3 6.2 2.6-1.2-3-6.1H14z" fill="${c}" stroke="#0a0a0a" stroke-width="1.4" stroke-linejoin="miter"/>`) +
    icon('cross', 18, 18, `<path d="M9 1v16M1 9h16" stroke="#0a0a0a" stroke-width="4.5" stroke-linecap="square"/><path d="M9 1.5v15M1.5 9h15" stroke="${c}" stroke-width="2.2" stroke-linecap="square"/>`) +
    icon('text', 10, 20, `<path d="M2 1.5h6M5 1.5v17M2 18.5h6" stroke="#0a0a0a" stroke-width="3.6" stroke-linecap="square"/><path d="M2 1.5h6M5 1.5v17M2 18.5h6" stroke="${c}" stroke-width="1.5" stroke-linecap="square"/>`) +
    icon('pen', 18, 18, `<path d="M1 17l1.6-5L13 1.6l3.4 3.4L6 15.4z" fill="${c}" stroke="#0a0a0a" stroke-width="1.4" stroke-linejoin="miter"/>`);

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ease = (t) => t * t * (3 - 2 * t);
  const rand = (a, b) => a + Math.random() * (b - a);
  const prefersStill = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (cls, parent, tag) => {
    const n = document.createElement(tag || 'div');
    n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  };
  const fadeOut = (node, ms) => {
    if (!node) return;
    node.classList.add('sw-out');
    setTimeout(() => node.remove(), ms || 240);
  };
  const visibleAlpha = (color) => {
    if (!color || color === 'transparent') return false;
    const m = color.match(/rgba?\(([^)]+)\)/);
    if (!m) return true;
    const parts = m[1].split(/[\s,/]+/).filter(Boolean);
    return parts.length < 4 || parseFloat(parts[3]) > 0;
  };

  function injectStyles() {
    if (document.getElementById('sw-styles')) return;
    const s = document.createElement('style');
    s.id = 'sw-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- Scanning: turn the page into a list of layers ---------- */

  function paintOf(node, cs, rect) {
    const bg = visibleAlpha(cs.backgroundColor) || cs.backgroundImage !== 'none';
    const sides = ['Top', 'Right', 'Bottom', 'Left'].filter((s) =>
      parseFloat(cs['border' + s + 'Width']) > 0 &&
      cs['border' + s + 'Style'] !== 'none' &&
      visibleAlpha(cs['border' + s + 'Color']));
    if (!bg && !sides.length) return null;
    if (rect.height <= 4 || rect.width <= 4) return { type: 'rule', edge: rect.height <= 4 ? 'h' : 'v' };
    if (!bg && sides.length === 1) return { type: 'rule', edge: sides[0] };
    return { type: 'box' };
  }

  function isMedia(node) {
    return MEDIA.has(node.tagName.toUpperCase()) || node.getAttribute('data-swarm') === 'media';
  }

  function inlineOnly(node) {
    for (const child of node.children) {
      if (isMedia(child)) return false;
      if (child.tagName === 'BR') continue;
      const d = getComputedStyle(child).display;
      if (d !== 'inline' && d !== 'contents') return false;
      if (!inlineOnly(child)) return false;
    }
    return true;
  }

  function textNodesOf(node, deep) {
    const out = [];
    node.childNodes.forEach((c) => {
      if (c.nodeType === 3 && c.data.trim()) out.push(c);
      else if (deep && c.nodeType === 1) out.push(...textNodesOf(c, true));
    });
    return out;
  }

  /* known: elements and text nodes already taken by earlier layers. A rescan with it
     returns only what the page added since (lazy sections, menus, live log lines). */
  function scan(root, known) {
    const layers = [];
    const visit = (node, parentBox) => {
      if (node.hasAttribute('data-swarm-skip')) return;
      if (/^SW-/.test(node.tagName) || (node.classList && (node.classList.contains('sw-layer') || node.classList.contains('sw-bar')))) return;
      const cs = getComputedStyle(node);
      // Things hidden at load, like closed menus, are left for the page to show.
      // The root is exempt because the body is transparent while the script boots.
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      // Opacity set inline is an entrance animation (framer-motion) that will play, so it is built too.
      if (node !== root && parseFloat(cs.opacity) === 0 && !(node.style && node.style.opacity !== '')) return;
      const rect = node.getBoundingClientRect();
      if (isMedia(node)) {
        if (rect.width > 1 && rect.height > 1 && !(known && known.has(node))) layers.push({ type: 'media', el: node, d: 1.25, after: parentBox || null });
        return;
      }
      let box = null;
      if (node !== root && node !== document.body) {
        const paint = known && known.has(node) ? null : paintOf(node, cs, rect);
        if (paint) {
          box = { el: node, type: paint.type, edge: paint.edge, d: paint.type === 'rule' ? 0.5 : 0.55, after: paint.type === 'rule' ? null : (parentBox || null) };
          layers.push(box);
        }
      }
      const leaf = inlineOnly(node);
      let nodes = textNodesOf(node, leaf);
      if (known) nodes = nodes.filter((n) => !known.has(n) && !(n.parentElement && n.parentElement.closest('sw-ghost')));
      if (nodes.length) layers.push({ type: 'text', el: node, after: box || parentBox || null, textNodes: nodes, leaf, pre: cs.whiteSpace.startsWith('pre') });
      if (!leaf) for (const child of node.children) visit(child, (box && box.type === 'box') ? box : parentBox);
    };
    visit(root, null);
    linkDuplicates(layers);
    return layers;
  }

  /* Repeated short items (nav links, stats) are built by copying the first one
     and then correcting the text. */
  function linkDuplicates(layers) {
    const groups = new Map();
    layers.forEach((l) => {
      if (l.type !== 'text' || !l.leaf) return;
      const size = l.textNodes.reduce((n, t) => n + t.data.trim().length, 0);
      if (size > 28 || l.el.children.length) return;
      const scope = l.el.parentElement && l.el.parentElement.parentElement;
      if (!scope) return;
      const key = l.el.tagName + '|' + l.el.className;
      if (!groups.has(scope)) groups.set(scope, new Map());
      const byKey = groups.get(scope);
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key).push(l);
    });
    groups.forEach((byKey) => byKey.forEach((list) => {
      if (list.length < 3) return;
      list.slice(1).forEach((l) => { l.dupOf = list[0]; });
    }));
  }

  /* ---------- Hiding and restoring layer content ---------- */

  /* The page can change its own text while it is hidden (counters, live stats).
     Those changes are kept: the layer takes the new text and is shown at once. */
  const watched = new Map();
  let pageChanged = false;
  let watcher = null;
  function watch(l, p) {
    if (!watcher && window.MutationObserver) {
      watcher = new MutationObserver((records) => {
        for (const m of records) {
          if (m.type === 'characterData') {
            const hit = watched.get(m.target);
            if (hit && m.target.data !== hit.p.lastWrite) retext(hit.l, hit.p, m.target.data);
          } else {
            m.removedNodes.forEach((n) => { const hit = watched.get(n); if (hit) commit(hit.l); });
            m.addedNodes.forEach((n) => {
              const e = n.nodeType === 1 ? n : n.parentElement;
              if (e && !/^SW-/.test(e.tagName) && !e.closest('.sw-layer, .sw-bar, sw-ghost')) pageChanged = true;
            });
          }
        }
      });
      watcher.observe(document.body, { characterData: true, childList: true, subtree: true });
    }
    watched.set(p.n, { l, p });
  }

  /* The page wrote new text into a layer that is not built yet (a counter ticking):
     keep it hidden under the new value so the cursors still type it. */
  function retext(l, p, data) {
    if (l.committed) return;
    p.original = data;
    p.shown = l.pre ? data : data.replace(/\s+/g, ' ');
    l.chars = l.parts.reduce((sum, q) => sum + q.shown.length, 0);
    const count = Math.min(l.typed, l.chars);
    l.typed = -1;
    setTyped(l, count);
  }

  function prepare(l) {
    if (l.type === 'media') l.el.classList.add('sw-hide');
    else if (l.type === 'box' || l.type === 'rule') l.el.classList.add('sw-nopaint');
    else {
      l.parts = l.textNodes.map((n) => {
        const original = n.data;
        const shown = l.pre ? original : original.replace(/\s+/g, ' ');
        const ghost = document.createElement('sw-ghost'); // a custom tag, so page CSS like "nav span" can't match it
        ghost.className = 'sw-ghost';
        ghost.textContent = shown;
        // In flex and grid layouts, split text would become two items and shift
        // the layout, so keep both parts together in one wrapper.
        let wrap = null;
        if (/flex|grid/.test(getComputedStyle(n.parentNode).display)) {
          wrap = document.createElement('sw-wrap');
          wrap.className = 'sw-wrap';
          n.parentNode.insertBefore(wrap, n);
          wrap.appendChild(n);
        }
        n.parentNode.insertBefore(ghost, n.nextSibling);
        n.data = '';
        const part = { n, original, shown, ghost, wrap, lastWrite: '' };
        watch(l, part);
        return part;
      });
      l.chars = l.parts.reduce((sum, p) => sum + p.shown.length, 0);
      const fs = parseFloat(getComputedStyle(l.el).fontSize) || 16;
      l.big = fs >= 40;
      l.d = l.dupOf ? 0.85 : clamp(l.chars * 0.014 * Math.max(1, fs / 14), 0.28, 2.6);
      l.typed = 0;
      l.range = document.createRange();
      l.range.selectNodeContents(l.el);
    }
  }

  function setTyped(l, count) {
    if (l.committed) return;
    if (count === l.typed) return;
    l.typed = count;
    let left = count;
    for (const p of l.parts) {
      const k = Math.min(left, p.shown.length);
      left -= k;
      p.n.data = p.lastWrite = p.shown.slice(0, k);
      p.ghost.firstChild.data = p.shown.slice(k);
    }
  }

  function commit(l) {
    if (l.committed) return;
    if (l.type === 'frame') { l.committed = true; return; }
    l.committed = true;
    if (l.type === 'media') {
      l.el.classList.remove('sw-hide');
      l.el.style.clipPath = '';
    } else if (l.type === 'box' || l.type === 'rule') {
      l.el.classList.remove('sw-nopaint');
    } else {
      l.parts.forEach((p) => {
        watched.delete(p.n);
        p.n.data = p.lastWrite = p.original;
        p.ghost.remove();
        if (p.wrap) {
          if (p.wrap.parentNode) p.wrap.parentNode.insertBefore(p.n, p.wrap);
          p.wrap.remove();
        }
      });
    }
  }

  /* ---------- One playback ---------- */

  function createRun(options) {
    const opt = Object.assign({}, DEFAULTS, options);
    const small = innerWidth < 768;
    const maxAgents = small ? opt.mobileAgents : opt.agents;
    let frameCandidates = null;
    const layers = scan(document.body);
    layers.forEach(prepare);
    window.__swarmLayers = layers;
    // Blueprint pass: every sizeable block is first sketched as a dashed wireframe.
    for (let i = layers.length - 1; i >= 0; i--) {
      const l = layers[i];
      if (l.type === 'rule' || l.dupOf || (l.type === 'text' && !l.big && l.chars < 60)) continue;
      const r = l.type === 'text' && l.leaf ? l.range.getBoundingClientRect() : l.el.getBoundingClientRect();
      if (r.width < 40 || r.height < 14) continue;
      const f = { type: 'frame', el: l.el, target: l, after: l.after || null, d: 0.32 + Math.min(0.4, (r.width + r.height) / 3000) };
      l.after = f;
      layers.splice(i, 0, f);
    }
    // Slower, more readable build: stretch every layer's work time.
    layers.forEach((l) => { l.d *= opt.pace || 1; });

    // Estimate the build time from the amount of work and scrolling, then speed
    // up as needed so long pages and small screens don't keep visitors waiting.
    const workSeconds = layers.reduce((sum, l) => sum + l.d + 0.2, 0) / maxAgents;
    const scrollSeconds = (document.documentElement.scrollHeight / innerHeight) * 2.2;
    const sizeRate = clamp((workSeconds + scrollSeconds) / opt.targetSeconds, 1, 4);

    const pending = layers.slice();
    let total = layers.length;

    // The page keeps changing while it is being built: lazy sections mount, the floating
    // nav appears, live panels add lines. Anything new is hidden and queued for the cursors.
    const known = new Set();
    const boxOf = new Map();
    const remember = (l) => {
      if (l.type === 'text') l.parts.forEach((q) => known.add(q.n));
      else if (l.type !== 'frame') { known.add(l.el); if (l.type === 'box') boxOf.set(l.el, l); }
    };
    // New content inside a block the cursors already finished is a live update
    // (log lines, metrics): it belongs to that block and is shown as is.
    const insideBuilt = (el) => {
      for (let e = el && el.parentElement; e && e !== document.body; e = e.parentElement) {
        const b = boxOf.get(e);
        if (b) return b.state === 'done';
      }
      return false;
    };
    layers.forEach(remember);
    let lastAdopt = 0;
    function adopt(now) {
      if (!pageChanged && now - lastAdopt < 600) return;
      pageChanged = false;
      lastAdopt = now;
      const fresh = scan(document.body, known);
      if (!fresh.length) return;
      const queued = [];
      fresh.forEach((l) => {
        if (insideBuilt(l.el) || (l.type !== 'text' && insideBuilt(l.el.parentElement))) {
          if (l.type === 'text') l.textNodes.forEach((n) => known.add(n));
          else known.add(l.el);
          (window.__swarmLive = window.__swarmLive || []).push(l);
          return;
        }
        prepare(l); l.d *= opt.pace || 1; remember(l); pending.push(l); queued.push(l);
      });
      total += queued.length;
      if (window.__swarmLayers) window.__swarmLayers.push(...queued);
    }
    let done = 0;
    let speed = opt.speed;
    let tour = opt.tour;
    let stopped = false;
    let ending = false;
    let elapsed = 0;
    let lastFrame = 0;
    let lastUser = -1e9;
    let userScrolled = false;
    let camTarget = null;
    let camY = scrollY;
    let calmSince = 0;
    let lastProgress = performance.now();
    let endStart = 0;
    let raf = 0;

    const layer = el('sw-layer');
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    const agents = Array.from({ length: maxAgents }, (_, i) => {
      const node = el('sw-cursor sw-abs', layer);
      const color = COLORS[i % COLORS.length];
      node.innerHTML = cursorMarkup(color) + '<span class="sw-tag"></span>';
      node.style.setProperty('--c', color);
      node.dataset.mode = 'arrow';
      node.style.opacity = 0;
      const x = rand(0, innerWidth);
      const y = rand(0, innerHeight);
      return { node, tag: node.lastChild, id: 'A' + String(i + 1).padStart(2, '0'), color, x, y, mx: x, my: y, tx: x, ty: y, on: false, task: null, wanderAt: 0, travel: 0, review: null, pair: null, parked: false };
    });
    let activeCount = 0;

    /* Control bar */
    const bar = el('sw-bar');
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Page build animation controls');
    const dots = el('sw-dots', bar);
    COLORS.slice(0, 5).forEach((c) => { el('', dots, 'i').style.background = c; });
    const count = el('sw-count', bar);
    const track = el('sw-track', bar);
    const fill = el('', track, 'i');
    const tourBtn = el('sw-btn', bar, 'button');
    tourBtn.type = 'button';
    tourBtn.textContent = 'Tour';
    tourBtn.title = 'Scroll automatically as the page builds';
    tourBtn.setAttribute('aria-pressed', String(tour));
    const speedBtn = el('sw-btn', bar, 'button');
    speedBtn.type = 'button';
    speedBtn.setAttribute('aria-label', 'Change animation speed');
    speedBtn.textContent = speed + 'x';
    const closeBtn = el('sw-btn', bar, 'button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Skip animation');
    closeBtn.textContent = '✕';
    document.body.appendChild(bar);

    tourBtn.onclick = () => {
      tour = !tour;
      tourBtn.setAttribute('aria-pressed', String(tour));
      camTarget = null;
    };
    speedBtn.onclick = () => {
      const i = SPEEDS.indexOf(speed);
      speed = SPEEDS[(i + 1) % SPEEDS.length];
      speedBtn.textContent = speed + 'x';
    };
    closeBtn.onclick = () => stop();

    const onUser = () => {
      lastUser = performance.now();
      userScrolled = true;
      camTarget = null;
    };
    const onKey = (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) onUser();
    };
    addEventListener('wheel', onUser, { passive: true });
    addEventListener('touchmove', onUser, { passive: true });
    addEventListener('keydown', onKey);

    /* ---------- Chrome (selection boxes and fills) ---------- */

    function makeSelection(l) {
      const sel = el('sw-sel sw-abs', layer);
      for (let i = 0; i < 4; i++) el('sw-handle sw-h' + i, sel);
      sel.badge = el('sw-badge', sel);
      l.sel = sel;
    }

    function place(node, x, y, w, h) {
      node.style.transform = `translate3d(${x}px,${y}px,0)`;
      node.style.width = Math.max(0, w) + 'px';
      node.style.height = Math.max(0, h) + 'px';
    }

    function placeSelection(l, x, y, w, h) {
      place(l.sel, x, y, w, h);
      const label = Math.round(w) + ' × ' + Math.round(h);
      if (l.sel.label !== label) {
        l.sel.label = label;
        l.sel.badge.textContent = label;
      }
    }

    function maybeGuide(rect) {
      if (Math.random() > 0.35) return;
      const g = el('sw-guide sw-abs', layer);
      place(g, rect.left - 1, 0, 1.5, innerHeight);
      setTimeout(() => fadeOut(g), 420 / speed);
    }

    function clearChrome(l) {
      fadeOut(l.sel);
      fadeOut(l.fill);
      fadeOut(l.line, 300);
      if (l.clone) { l.clone.remove(); l.clone = null; }
      l.sel = l.fill = l.line = null;
    }

    /* ---------- Assigning work ---------- */

    function rectOf(l) {
      if (l.type === 'frame') return rectOf(l.target);
      return l.type === 'text' && l.leaf ? l.range.getBoundingClientRect() : l.el.getBoundingClientRect();
    }
    const inView = (r) => r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
    const ready = (l) => (!l.after || l.after.state === 'done') && (!l.dupOf || l.dupOf.state === 'done');

    // Layers that can be worked on now. Measured at most once per frame, because
    // measuring every layer for every idle cursor slows the page down badly.
    function candidates() {
      if (!frameCandidates) {
        frameCandidates = [];
        for (const l of pending.slice()) {
          // The page may have removed or hidden this since the scan. Don't wait for it.
          const r = l.el.isConnected ? rectOf(l) : null;
          if (!r || (r.width === 0 && r.height === 0)) {
            pending.splice(pending.indexOf(l), 1);
            commit(l);
            l.state = 'done';
            done++;
            lastProgress = performance.now();
            continue;
          }
          if (ready(l) && inView(r)) frameCandidates.push({ l, r });
        }
      }
      return frameCandidates;
    }

    function pick(agent) {
      const options = candidates();
      if (!options.length) return null;
      if (!options.sorted) { options.sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left); options.sorted = true; }
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < Math.min(5, options.length); i++) {
        const o = options[i];
        const d = Math.hypot(o.r.left - agent.x, o.r.top - agent.y) * rand(0.7, 1.3);
        if (d < bestDist) { best = i; bestDist = d; }
      }
      const l = options.splice(best, 1)[0].l;
      pending.splice(pending.indexOf(l), 1);
      return l;
    }

    function startWork(agent, l) {
      l.state = 'active';
      l.p = 0;
      agent.working = true;
      agent.node.dataset.mode = l.type === 'rule' ? 'pen' : l.type === 'text' ? (l.dupOf ? 'arrow' : 'text') : 'cross';
      setTag(agent, l.type === 'rule' ? 'draw' : l.type === 'text' ? (l.dupOf ? 'copy' : 'type') : l.type === 'media' ? 'img' : 'fill');
      const r = l.rect;
      if (l.type === 'frame') {
        agent.node.dataset.mode = 'cross';
        setTag(agent, 'sketch');
        l.fill = el('sw-frame sw-abs', layer);
        l.fill.dataset.k = (l.target.el.tagName || '').toLowerCase();
        return;
      }
      if (l.type === 'box' || l.type === 'media') {
        l.fill = el('sw-fill sw-abs', layer);
        makeSelection(l);
        maybeGuide(r);
      } else if (l.type === 'rule') {
        l.line = el('sw-line sw-abs', layer);
      } else {
        makeSelection(l);
        if (l.dupOf) {
          l.sel.classList.add('sw-red');
          const cs = getComputedStyle(l.dupOf.el);
          const clone = el('sw-clone sw-abs', layer);
          clone.textContent = l.dupOf.parts.map((p) => p.shown).join('').trim();
          ['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'textTransform', 'color'].forEach((k) => { clone.style[k] = cs[k]; });
          l.clone = clone;
        }
      }
    }

    function finish(agent, l) {
      if (l.type === 'frame') { l.target.wire = l.fill; l.fill = null; }
      if (l.wire) { fadeOut(l.wire, 320); l.wire = null; }
      commit(l);
      l.state = 'done';
      done++;
      lastProgress = performance.now();
      clearChrome(l);
      agent.task = null;
      agent.working = false;
      agent.node.dataset.mode = 'arrow';
      agent.wanderAt = 0;
      setTag(agent, '');
      if (l.type !== 'frame') doneList.push(l);
    }

    /* ---------- Idle agents: review finished work, pair up, or step aside ---------- */

    const doneList = [];
    function setTag(agent, word) {
      const t = word ? agent.id + ' ' + word : '';
      if (agent.tagText !== t) { agent.tagText = t; agent.tag.textContent = t; }
    }
    function show(agent, on) {
      agent.parked = !on;
      agent.node.style.opacity = on ? 1 : 0;
    }
    function endReview(agent) {
      if (!agent.review) return;
      fadeOut(agent.review.box, 260);
      agent.review = null;
    }
    function freeIdle(agent) {
      endReview(agent);
      agent.pair = null;
      if (agent.parked) show(agent, true);
    }
    function findReview() {
      for (let i = doneList.length - 1, n = 0; i >= 0 && n < 40; i--, n++) {
        const l = doneList[i];
        if (l.reviewed || l.dupOf || l.type === 'frame' || !l.el.isConnected) continue;
        const r = rectOf(l);
        if (r.width < 24 || r.height < 10 || !inView(r) || r.top < 0 || r.bottom > innerHeight) continue;
        return l;
      }
      return null;
    }
    function idle(agent, now) {
      if (agent.review) {
        const rv = agent.review;
        const r = rectOf(rv.l);
        place(rv.box, r.left - 3, r.top - 3, r.width + 6, r.height + 6);
        const q = clamp((now - rv.start) / (rv.until - rv.start), 0, 1);
        agent.tx = r.left + r.width * (0.1 + 0.8 * q);
        agent.ty = r.top + r.height * (q < 0.5 ? 0.3 : 0.75);
        if (q > 0.7 && !rv.ok) { rv.ok = true; rv.box.classList.add('sw-ok'); rv.badge.textContent = 'QA ✓ ok'; }
        if (q >= 1 || !inView(r)) { endReview(agent); agent.wanderAt = 0; }
        return;
      }
      if (agent.pair) {
        const b = agent.pair;
        if (!b.task || !b.working) { agent.pair = null; agent.wanderAt = 0; }
        else { agent.tx = b.x + agent.pairDx; agent.ty = b.y + agent.pairDy; if (now < agent.wanderAt) return; }
      }
      if (now < agent.wanderAt) return;
      agent.wanderAt = now + rand(350, 700) / speed;
      const l = findReview();
      if (l) {
        l.reviewed = true;
        if (agent.parked) show(agent, true);
        const box = el('sw-qa sw-abs', layer);
        const badge = el('sw-badge', box);
        badge.textContent = 'QA …';
        const dur = rand(700, 1100) / (speed * Math.min(sizeRate, 2));
        agent.review = { l, box, badge, start: now, until: now + dur, ok: false };
        agent.node.dataset.mode = 'arrow';
        setTag(agent, 'review');
        return;
      }
      const busy = agents.filter((b) => b !== agent && b.task && b.working && agents.filter((c) => c.pair === b).length < (b.task.big ? 3 : 1));
      if (busy.length) {
        const b = busy[Math.floor(Math.random() * busy.length)];
        if (agent.parked) show(agent, true);
        agent.pair = b;
        agent.pairDx = b.task.big ? rand(-120, 60) : rand(-46, -22);
        agent.pairDy = b.task.big ? rand(-60, 70) : rand(18, 34);
        setTag(agent, 'assist ' + b.id);
        agent.wanderAt = now + rand(900, 1500) / speed;
        return;
      }
      // Nothing useful to do on this screen: step out of frame instead of clicking at nothing.
      setTag(agent, '');
      agent.pair = null;
      agent.tx = agent.x < innerWidth / 2 ? -40 : innerWidth + 40;
      agent.ty = clamp(agent.y, 40, innerHeight - 40);
      if (!agent.parked) show(agent, false);
    }

    /* ---------- Per-frame stages ---------- */

    // Stage 1: move progress on, and change the page's own DOM.
    function advance(agent, dt) {
      const l = agent.task;
      if (!l || !agent.working) return;
      l.p = Math.min(1, l.p + dt / l.d);
      if (l.type === 'text') {
        const q = l.dupOf ? clamp((l.p - 0.55) / 0.45, 0, 1) : l.p;
        setTyped(l, Math.round(q * l.chars));
      } else if ((l.type === 'box') && l.p > 0.55) {
        l.el.classList.remove('sw-nopaint');
      } else if (l.type === 'media' && l.p > 0.33) {
        l.el.classList.remove('sw-hide');
        const q = ease((l.p - 0.33) / 0.67);
        l.el.style.clipPath = `inset(0 0 ${(1 - q) * 100}% 0)`;
      }
      if (l.p >= 1) finish(agent, l);
    }

    // Stage 2: read the geometry in one go, so layout runs once per frame.
    function measure(agent) {
      const l = agent.task;
      if (!l) return;
      l.rect = rectOf(l);
      if (l.dupOf) l.fromRect = l.dupOf.range.getBoundingClientRect();
      if (l.type === 'text' && agent.working && !(l.dupOf && l.p < 0.55)) {
        const part = l.parts.find((p) => p.ghost.firstChild.data.length) || l.parts[l.parts.length - 1];
        l.caret = part.ghost.getClientRects()[0] || null;
      }
    }

    // Stage 3: draw the overlay and set where each cursor is heading.
    function render(agent) {
      const l = agent.task;
      if (!l) return;
      const r = l.rect;
      if (!agent.working) {
        const from = l.dupOf ? l.fromRect : r;
        agent.tx = l.dupOf ? from.left + from.width / 2 : from.left;
        agent.ty = l.type === 'text' && !l.dupOf ? from.top + from.height / 2 : from.top + (l.dupOf ? from.height / 2 : 0);
        return;
      }
      const p = l.p;
      if (l.type === 'frame') {
        const q = ease(p);
        const w = r.width * q, h = r.height * Math.min(1, q * 1.6);
        place(l.fill, r.left - 2, r.top - 2, w + 4, h + 4);
        agent.tx = r.left + w;
        agent.ty = r.top + h;
        return;
      }
      if (l.type === 'text') {
        if (l.dupOf) {
          const f = l.fromRect;
          if (p < 0.55) {
            const q = ease(Math.min(1, p / 0.4));
            const x = f.left + (r.left - f.left) * q;
            const y = f.top + (r.top - f.top) * q;
            l.clone.style.transform = `translate3d(${x}px,${y}px,0)`;
            placeSelection(l, x - 2, y - 2, f.width + 4, f.height + 4);
            agent.tx = x + f.width / 2;
            agent.ty = y + f.height / 2;
          } else {
            if (l.clone) {
              l.clone.remove();
              l.clone = null;
              l.sel.classList.remove('sw-red');
              agent.node.dataset.mode = 'text';
            }
            placeSelection(l, r.left - 2, r.top - 2, r.width + 4, r.height + 4);
          }
        } else {
          placeSelection(l, r.left - 2, r.top - 2, r.width + 4, r.height + 4);
        }
        if (l.caret && (!l.dupOf || p >= 0.55)) {
          agent.tx = l.caret.left;
          agent.ty = l.caret.top + l.caret.height / 2;
        }
      } else if (l.type === 'box') {
        const q = ease(Math.min(1, p / 0.55));
        const w = r.width * q;
        const h = r.height * q;
        place(l.fill, r.left, r.top, w, h);
        l.fill.style.opacity = p > 0.55 ? 1 - (p - 0.55) / 0.45 : 1;
        l.fill.style.borderRadius = getRadius(l);
        placeSelection(l, r.left, r.top, w, h);
        agent.tx = r.left + w;
        agent.ty = r.top + h;
      } else if (l.type === 'media') {
        const q = ease(Math.min(1, p / 0.33));
        const w = r.width * q;
        const h = r.height * q;
        place(l.fill, r.left, r.top, w, h);
        if (p > 0.33) {
          const wipe = ease((p - 0.33) / 0.67) * 100;
          l.fill.style.clipPath = `inset(${wipe}% 0 0 0)`;
        }
        placeSelection(l, r.left, r.top, w, h);
        agent.tx = r.left + w;
        agent.ty = r.top + h;
      } else if (l.type === 'rule') {
        const q = ease(p);
        const vertical = l.edge === 'v' || l.edge === 'Left' || l.edge === 'Right';
        const y = l.edge === 'Bottom' ? r.bottom - 1 : r.top;
        const x = l.edge === 'Right' ? r.right - 1 : r.left;
        if (vertical) {
          place(l.line, x, r.top, 2, r.height * q);
          agent.tx = x;
          agent.ty = r.top + r.height * q;
        } else {
          place(l.line, r.left, y, r.width * q, 2);
          agent.tx = r.left + r.width * q;
          agent.ty = y;
        }
      }
    }

    function getRadius(l) {
      if (l.radius === undefined) l.radius = getComputedStyle(l.el).borderRadius;
      return l.radius;
    }

    function moveCursor(agent, dt) {
      const k = agent.working ? 26 : 9;
      const a = 1 - Math.exp(-k * dt);
      const b = 1 - Math.exp(-(k * 1.6) * dt);
      agent.mx += (agent.tx - agent.mx) * a;
      agent.my += (agent.ty - agent.my) * a;
      agent.x += (agent.mx - agent.x) * b;
      agent.y += (agent.my - agent.y) * b;
      agent.node.style.transform = `translate3d(${agent.x}px,${agent.y}px,0)`;
    }

    function camera(dt, now) {
      if (ending) return;
      if (!tour || now - lastUser < 1500) return;
      if (camTarget === null) {
        const busy = agents.filter((a) => a.task).length;
        const stuck = now - lastProgress > 1800 && !busy;
        let wantsScroll = false;
        if ((pending.length || scrollY < document.documentElement.scrollHeight - innerHeight - 2) && (stuck || (busy <= Math.max(2, activeCount * 0.15) && !candidates().length && !pending.some((l) => { const r = rectOf(l); return r.width && r.top < innerHeight * 0.9 && r.bottom > 0 && r.right > 0 && r.left < innerWidth; })))) wantsScroll = true;
        if (!wantsScroll) {
          calmSince = 0;
        } else {
          // Hold for a moment so each finished screen can be seen before moving on.
          if (!calmSince) calmSince = now;
          if (now - calmSince > (pending.length ? 1000 : 200) / (speed * sizeRate)) {
            calmSince = 0;
            const max = document.documentElement.scrollHeight - innerHeight;
            // Layers left above the viewport will never be watched: finish them.
            let below = Infinity, side = false;
            for (const l of pending.slice()) {
              const r = rectOf(l);
              if (r.bottom <= 0) { pending.splice(pending.indexOf(l), 1); commit(l); if (l.wire) { fadeOut(l.wire, 320); l.wire = null; } l.state = 'done'; done++; continue; }
              if (r.top >= innerHeight * 0.6 && r.top < below) below = r.top;
              if (r.left >= innerWidth && r.top < innerHeight && r.bottom > 0) side = true;
            }
            lastProgress = now;
            if (scrollY >= max - 2) {
              // Bottom of the page: whatever is left (off to the side) is finished directly.
              for (const l of pending.splice(0)) { commit(l); l.state = 'done'; done++; }
            } else {
              // Step down to the next unbuilt block, but never jump more than most of a screen,
              // so tall scroll-driven sections (sticky, horizontal tracks) are walked through.
              // Nothing left below means the rest sits on a horizontal track: cross it in big strides.
              const step = side ? innerHeight : below === Infinity ? innerHeight * (pending.length ? 1.0 : 1.1) : clamp(below - innerHeight * 0.16, innerHeight * 0.25, innerHeight * 0.85);
              camTarget = clamp(scrollY + step, 0, max);
              camY = scrollY;
            }
          }
        }
      }
      if (camTarget !== null) {
        camY += (camTarget - camY) * (1 - Math.exp(-3.4 * dt));
        scrollTo({ top: camY, behavior: 'instant' });
        if (Math.abs(camTarget - camY) < 2) { scrollTo({ top: camTarget, behavior: 'instant' }); camTarget = null; }
      }
    }

    function updateBar() {
      const text = `<b>${activeCount}</b> <span>agents</span> &nbsp;<b>${done}</b> <span>/ ${total} layers</span>`;
      if (count.lastText !== text) {
        count.lastText = text;
        count.innerHTML = text;
        fill.style.transform = `scaleX(${total ? done / total : 1})`;
      }
    }

    /* ---------- Main loop ---------- */

    // Any error ends the animation and shows the finished page, never a blank one.
    function frame(now) {
      try {
        tick(now);
      } catch (e) {
        console.error('swarm.js stopped early', e);
        stop();
      }
    }

    function tick(now) {
      if (stopped) return;
      const real = lastFrame ? Math.min(0.1, (now - lastFrame) / 1000) : 0.016;
      lastFrame = now;
      const dt = real * speed * sizeRate;
      elapsed += dt;
      frameCandidates = null;
      if (!ending) adopt(now);

      const want = Math.min(maxAgents, Math.round(8 + elapsed * 8));
      while (activeCount < want) {
        const a = agents[activeCount++];
        a.on = true;
        a.node.style.opacity = 1;
      }

      // Assign free agents and start the ones that have arrived.
      for (const a of agents) {
        if (!a.on) continue;
        if (!a.task && pending.length && !ending) {
          const l = pick(a);
          if (l) {
            freeIdle(a);
            setTag(a, 'go');
            l.state = 'assigned';
            l.rect = rectOf(l);
            a.task = l;
            a.travel = 0;
          }
        }
        if (a.task && !a.working) {
          a.travel += dt;
          const r = a.task.dupOf ? a.task.dupOf.range.getBoundingClientRect() : a.task.rect;
          const near = Math.hypot(a.x - (a.tx ?? r.left), a.y - (a.ty ?? r.top)) < 16;
          if ((a.travel > 0.08 && near) || a.travel > 0.55) {
            a.task.rect = rectOf(a.task);
            if (a.task.dupOf) a.task.fromRect = r;
            startWork(a, a.task);
          }
        }
      }

      agents.forEach((a) => advance(a, dt));
      agents.forEach(measure);
      agents.forEach(render);

      for (const a of agents) {
        if (!a.on) continue;
        if (!a.task && !ending) idle(a, now);
        moveCursor(a, dt);
      }

      camera(real * Math.sqrt(speed * sizeRate), now);
      updateBar();

      if (!ending && done === total && (!tour || userScrolled || scrollY >= document.documentElement.scrollHeight - innerHeight - 2)) beginEnding(now);
      if (ending) { if (finale(now)) return; }
      raf = requestAnimationFrame(frame);
    }

    /* ---------- Finale: jump to the top and "publish" the page ---------- */
    let fin = null;
    function beginEnding(now) {
      ending = true;
      endStart = now;
      for (const a of agents) {
        endReview(a);
        a.pair = null;
        a.wanderAt = Infinity;
        a.node.dataset.mode = 'arrow';
        a.parked = false;
        a.node.style.opacity = 1;
        if (!a.on) { a.on = true; a.x = a.mx = rand(0, innerWidth); a.y = a.my = innerHeight + 40; }
      }
      bar.classList.add('sw-out');
      if (opt.returnToTop && !userScrolled) scrollTo({ top: 0, behavior: 'instant' });
      const box = el('sw-final', layer);
      const lines = [
        ['> npm run build', ' <b>✓ ' + total + ' layers</b>'],
        ['> optimizing assets', ' <b>✓</b>'],
        ['> deploying to production', ' <b>✓ live</b>'],
      ].map(([a, b]) => { const n = el('sw-ln', box); n.full = a; n.tail = b; return n; });
      const big = el('sw-big', box);
      big.textContent = 'PAGE PUBLISHED SUCCESSFULLY ✓';
      const flash = el('sw-flash', layer);
      fin = { box, lines, big, flash, t0: now, phase: 0 };
      requestAnimationFrame(() => box.classList.add('sw-in'));
    }

    // Returns true once the animation has stopped.
    function finale(now) {
      const t = now - fin.t0;
      const rb = fin.box.getBoundingClientRect();
      const cx = rb.left + rb.width / 2, cy = rb.top + rb.height / 2;
      // Type the deploy log line by line.
      fin.lines.forEach((n, i) => {
        const start = 150 + i * 380;
        const k = clamp(Math.floor((t - start) / 18), 0, n.full.length);
        const html = n.full.slice(0, k).replace(/</g, '&lt;') + (k === n.full.length && t > start + n.full.length * 18 + 120 ? n.tail : '');
        if (n.last !== html) { n.last = html; n.innerHTML = html || '&nbsp;'; }
      });
      if (t > 1400 && fin.phase === 0) { fin.phase = 1; fin.big.classList.add('sw-in'); fin.flash.style.opacity = '.18'; setTimeout(() => { fin.flash.style.opacity = '0'; }, 160); }
      // Cursors gather around the card, then burst outward.
      const n = agents.length;
      agents.forEach((a, i) => {
        const ang = (i / n) * Math.PI * 2 + t / 2200;
        if (t < 2500) {
          const rx = rb.width / 2 + 40 + (i % 3) * 14, ry = rb.height / 2 + 34 + (i % 3) * 10;
          a.tx = cx + Math.cos(ang) * rx;
          a.ty = cy + Math.sin(ang) * ry;
          setTag(a, t > 1400 && i % 3 === 0 ? (i % 2 ? 'ship it' : 'gg') : '');
        } else {
          setTag(a, '');
          a.tx = cx + Math.cos(ang) * innerWidth;
          a.ty = cy + Math.sin(ang) * innerHeight;
        }
      });
      if (t > 2600 && fin.phase === 1) { fin.phase = 2; layer.classList.add('sw-out'); }
      if (t > 3100) { stop(); return true; }
      return false;
    }

    function stop() {
      if (stopped) return;
      stopped = true;
      clearTimeout(watchdog);
      cancelAnimationFrame(raf);
      layers.forEach(commit);
      if (watcher && !watched.size) { watcher.disconnect(); watcher = null; }
      removeEventListener('wheel', onUser);
      removeEventListener('touchmove', onUser);
      removeEventListener('keydown', onKey);
      layer.remove();
      bar.remove();
      if (current === api) current = null;
      if (opt.once) { try { localStorage.setItem(opt.storageKey, '1'); } catch (e) { /* storage blocked */ } }
      if (opt.replayButton) showReplay(opt);
    }

    // On a very slow device or a throttled tab, frames can nearly stop. Don't keep
    // visitors waiting: after this long, jump straight to the finished page.
    const watchdog = setTimeout(() => {
      stop();
      if (opt.returnToTop && !userScrolled) scrollTo({ top: 0, behavior: 'instant' });
    }, opt.maxSeconds * 1000);

    updateBar();
    raf = requestAnimationFrame(frame);
    const api = { stop, state: () => ({ done, total, agents: activeCount, elapsed, ending, pending: pending.length }) };
    return api;
  }

  /* ---------- Public API ---------- */

  let current = null;
  let replayEl = null;

  function showReplay(opt) {
    if (replayEl) replayEl.remove();
    replayEl = el('sw-btn sw-replay', document.body, 'button');
    replayEl.type = 'button';
    replayEl.textContent = '↻ Replay build';
    replayEl.onclick = () => {
      scrollTo({ top: 0, behavior: 'instant' });
      run(opt);
    };
  }

  function run(options) {
    injectStyles();
    if (current) current.stop();
    if (replayEl) { replayEl.remove(); replayEl = null; }
    current = createRun(options);
    return current;
  }

  window.Swarm = {
    run,
    skip: () => current && current.stop(),
    state: () => (current ? current.state() : null),
  };

  /* ---------- Auto start ---------- */

  const script = document.currentScript;
  if (!script || !script.hasAttribute('data-auto')) return;

  const auto = {
    agents: Number(script.dataset.agents) || DEFAULTS.agents,
    speed: Number(script.dataset.speed) || DEFAULTS.speed,
    once: script.hasAttribute('data-once'),
    replayButton: script.hasAttribute('data-replay'),
  };
  let played = false;
  try { played = auto.once && localStorage.getItem(DEFAULTS.storageKey) === '1'; } catch (e) { /* storage blocked */ }
  if (prefersStill() || played) return;

  injectStyles();
  const docEl = document.documentElement;
  docEl.classList.add('sw-boot');
  const unboot = () => docEl.classList.remove('sw-boot');
  setTimeout(unboot, 3000); // never leave the page blank if something goes wrong

  const start = async () => {
    try {
      if (document.fonts && document.fonts.ready) {
        await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 800))]);
      }
      scrollTo({ top: 0, behavior: 'instant' });
      run(auto);
    } catch (e) {
      console.error('swarm.js could not start', e);
    } finally {
      unboot();
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
