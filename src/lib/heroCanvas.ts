/**
 * Hero coverage-graph canvas animation.
 * Runs once to final state then holds. Pauses when tab hidden.
 * Usage: const cleanup = mountHeroCanvas(canvasEl); // call cleanup on unmount
 */

interface Node { id: number; nx: number; ny: number; kind: 'root' | 'route' | 'endpoint' | 'leaf'; parent?: number; }
interface Edge { a: number; b: number; }
interface NodeState { discoveredAt: number; }
interface EdgeState { startedAt: number; done: boolean; }

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1));

function buildLatent(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  nodes.push({ id: 0, nx: 0, ny: 0, kind: 'root' });

  const routes = 7;
  const baseAngles: number[] = [];
  for (let i = 0; i < routes; i++) {
    baseAngles.push((i / routes) * Math.PI * 2 + rand(-0.25, 0.25));
  }
  const r1: { id: number; a: number }[] = [];
  baseAngles.forEach((a) => {
    const dist = rand(0.2, 0.3);
    const id = nodes.length;
    nodes.push({ id, nx: Math.cos(a) * dist, ny: Math.sin(a) * dist * 0.78, kind: 'route', parent: 0 });
    r1.push({ id, a });
  });

  const endpoints: number[] = [];
  r1.forEach((r) => {
    const n = randInt(2, 4);
    for (let j = 0; j < n; j++) {
      const spread = (j - (n - 1) / 2) * rand(0.28, 0.45) + rand(-0.12, 0.12);
      const a = r.a + spread;
      const dist = rand(0.62, 0.82);
      const id = nodes.length;
      nodes.push({ id, nx: Math.cos(a) * dist, ny: Math.sin(a) * dist * 0.78, kind: 'endpoint', parent: r.id });
      endpoints.push(id);
    }
  });

  endpoints.forEach((eid) => {
    if (Math.random() < 0.55) {
      const p = nodes[eid];
      const a = Math.atan2(p.ny / 0.78, p.nx) + rand(-0.16, 0.16);
      const dist = rand(0.95, 1.12);
      const id = nodes.length;
      nodes.push({ id, nx: Math.cos(a) * dist, ny: Math.sin(a) * dist * 0.78, kind: 'leaf', parent: eid });
    }
  });

  const edges: Edge[] = [];
  nodes.forEach((n) => { if (n.parent != null) edges.push({ a: n.parent, b: n.id }); });
  return { nodes, edges };
}

export function mountHeroCanvas(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0, H = 0;
  let rafId = 0;
  let destroyed = false;

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const latent = buildLatent();

  function nodePos(n: Node) {
    const cx = W * 0.5, cy = H * 0.52;
    const rx = Math.min(W * 0.6, 880);
    const ry = Math.min(H * 0.42, 440);
    return { x: cx + n.nx * rx, y: cy + n.ny * ry };
  }

  function bfsOrder(): number[] {
    const adj: number[][] = latent.nodes.map(() => []);
    latent.edges.forEach((e) => { adj[e.a].push(e.b); adj[e.b].push(e.a); });
    const order: number[] = [];
    const seen = new Set([0]);
    let frontier = [0];
    while (frontier.length) {
      const shuffled = frontier.slice().sort(() => Math.random() - 0.5);
      order.push(...shuffled);
      const next: number[] = [];
      shuffled.forEach((id) => { adj[id].forEach((n) => { if (!seen.has(n)) { seen.add(n); next.push(n); } }); });
      frontier = next;
    }
    return order;
  }

  function buildDiscoveryOrder(): number[] {
    const bfs = bfsOrder();
    const parentOf: Record<number, number> = {};
    latent.nodes.forEach((n) => { if (n.parent != null) parentOf[n.id] = n.parent; });
    const outers = latent.nodes.filter((n) => n.kind === 'leaf' || n.kind === 'endpoint').slice().sort(() => Math.random() - 0.5);
    const left  = outers.find((n) => n.nx < -0.3) || outers.find((n) => n.nx < 0);
    const right = outers.find((n) => n.nx > 0.3 && n.id !== (left?.id)) || outers.find((n) => n.nx > 0 && n.id !== (left?.id));
    const priority: number[] = [];
    function addChain(target: Node | undefined) {
      if (!target) return;
      const chain: number[] = [];
      let cur: number | undefined = target.id;
      while (cur != null) { chain.unshift(cur); cur = parentOf[cur]; }
      chain.forEach((id) => { if (!priority.includes(id)) priority.push(id); });
    }
    addChain(left);
    addChain(right);
    if (priority[0] !== 0) priority.unshift(0);
    return priority.concat(bfs.filter((id) => !priority.includes(id)));
  }

  const discoveryOrder = buildDiscoveryOrder();
  const TOTAL_BUILD_MS = 9000;
  const FAST_COUNT = Math.min(6, discoveryOrder.length);
  const FAST_WINDOW_MS = 900;
  const scheduleOffsets = discoveryOrder.map((_, i) => {
    if (i < FAST_COUNT) return (i / FAST_COUNT) * FAST_WINDOW_MS + rand(-30, 30);
    const remaining = discoveryOrder.length - FAST_COUNT;
    const u = (i - FAST_COUNT) / Math.max(1, remaining - 1);
    return FAST_WINDOW_MS + u * (TOTAL_BUILD_MS - FAST_WINDOW_MS) + rand(-80, 80);
  });

  const nodeState: Record<number, NodeState> = {};
  const edgeState: Record<number, EdgeState> = {};
  const discovered = new Set<number>();
  let discoveryIndex = 0;
  let finished = false;

  function discoverNode(id: number, now: number) {
    if (discovered.has(id)) return;
    discovered.add(id);
    nodeState[id] = { discoveredAt: now };
    const idx = latent.edges.findIndex((e) => (e.a === id && discovered.has(e.b)) || (e.b === id && discovered.has(e.a)));
    if (idx >= 0 && !edgeState[idx]) edgeState[idx] = { startedAt: now, done: false };
  }

  function progress() {
    const totalN = latent.nodes.length, totalE = latent.edges.length;
    const dN = discovered.size;
    const dE = Object.values(edgeState).filter((e) => e.done).length;
    return { coverage: Math.min(1, (dN / totalN) * 0.55 + (dE / totalE) * 0.45) };
  }

  function drawBackgroundDots(fade: number) {
    const spacing = 46;
    const cx = W * 0.5, cy = H * 0.52;
    const rMax = Math.hypot(W, H) * 0.55;
    for (let y = spacing / 2; y < H; y += spacing) {
      for (let x = spacing / 2; x < W; x += spacing) {
        const d = Math.hypot(x - cx, y - cy) / rMax;
        const alpha = Math.max(0, 0.08 * (1 - d * 1.05)) * fade;
        if (alpha < 0.004) continue;
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawEdges(now: number, fade: number) {
    for (const k in edgeState) {
      const idx = +k;
      const es = edgeState[idx];
      const e = latent.edges[idx];
      const a = nodePos(latent.nodes[e.a]);
      const b = nodePos(latent.nodes[e.b]);
      const age = now - es.startedAt;
      const t = Math.min(1, age / 520);
      const eased = 1 - Math.pow(1 - t, 3);
      if (!es.done && t >= 1) es.done = true;
      ctx.strokeStyle = `rgba(170,190,240,${(0.28 * fade).toFixed(3)})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x + (b.x - a.x) * eased, a.y + (b.y - a.y) * eased);
      ctx.stroke();
    }
  }

  function drawNodes(now: number, fade: number) {
    for (const id of discovered) {
      const n = latent.nodes[id];
      const p = nodePos(n);
      const st = nodeState[id];
      const age = now - st.discoveredAt;
      const intro = Math.min(1, age / 420);
      if (age < 900) {
        const u = age / 900;
        ctx.strokeStyle = `rgba(190,210,255,${((1 - u) * 0.75 * fade).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 + u * 26, 0, Math.PI * 2);
        ctx.stroke();
      }
      let size: number, fill: string, stroke: string;
      if (n.kind === 'root')          { size = 7;   fill = 'rgba(139,92,246,0.35)'; stroke = 'rgba(225,225,255,0.95)'; }
      else if (n.kind === 'route')    { size = 5;   fill = 'rgba(79,143,255,0.3)';  stroke = 'rgba(200,215,255,0.85)'; }
      else if (n.kind === 'endpoint') { size = 3.4; fill = 'rgba(79,143,255,0.26)'; stroke = 'rgba(180,200,250,0.78)'; }
      else                            { size = 2.8; fill = 'rgba(210,215,240,0.22)'; stroke = 'rgba(210,215,240,0.65)'; }
      const a = intro * fade;
      ctx.fillStyle   = fill.replace(/,([\d.]+)\)/, (_, v) => `,${(parseFloat(v) * a).toFixed(3)})`);
      ctx.strokeStyle = stroke.replace(/,([\d.]+)\)/, (_, v) => `,${(parseFloat(v) * a).toFixed(3)})`);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * intro, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  const VULN_TARGETS = { critical: 3, high: 5, medium: 9, low: 4 };
  const VULN_ORDER = ['low', 'medium', 'high', 'critical'] as const;
  const VULN_COLORS: Record<string, [number,number,number]> = { critical: [239,68,68], high: [249,115,22], medium: [234,179,8], low: [139,92,246] };
  const vulnSchedule = (() => {
    const arr: { sev: string; at: number }[] = [];
    VULN_ORDER.forEach((sev, i) => {
      const count = VULN_TARGETS[sev];
      const start = 0.10 + i * 0.18, end = 0.60 + i * 0.10;
      for (let k = 0; k < count; k++) {
        const frac = count === 1 ? 0.5 : k / (count - 1);
        arr.push({ sev, at: start + (end - start) * frac });
      }
    });
    return arr;
  })();
  const hudVulns: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  const hudVulnsEased: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  let hudCoverage = 0;

  function tickVulns(coverage: number) {
    hudVulns.critical = hudVulns.high = hudVulns.medium = hudVulns.low = 0;
    for (const v of vulnSchedule) if (coverage >= v.at) hudVulns[v.sev]++;
  }

  function drawHUD(now: number, fade: number) {
    const prog = progress();
    tickVulns(prog.coverage);
    const ease = (cur: number, target: number, k: number) => cur + (target - cur) * k;
    hudCoverage = ease(hudCoverage, prog.coverage * 100, 0.06);
    for (const s of VULN_ORDER) hudVulnsEased[s] = ease(hudVulnsEased[s], hudVulns[s], 0.15);
    const pct = Math.round(hudCoverage);
    const padX = 26, padY = 22;
    const x = padX, y = H - padY;
    ctx.save();
    ctx.textBaseline = 'alphabetic';

    ctx.font = '500 9px ui-monospace,"SF Mono",Menlo,monospace';
    ctx.fillStyle = `rgba(255,255,255,${(0.4 * fade).toFixed(3)})`;
    const covLabelY = y - 24;
    ctx.fillText('COVERAGE', x, covLabelY);
    const labelW = ctx.measureText('COVERAGE').width;

    ctx.font = '500 10px ui-monospace,"SF Mono",Menlo,monospace';
    ctx.fillStyle = `rgba(180,195,230,${(0.55 * fade).toFixed(3)})`;
    const pctStr = pct + '%';
    ctx.fillText(pctStr, x + labelW + 10, covLabelY);
    const pctW = ctx.measureText(pctStr).width;

    const barX = x + labelW + 10 + pctW + 10, barY = covLabelY - 3, barW = 130, barH = 2;
    ctx.fillStyle = `rgba(255,255,255,${(0.06 * fade).toFixed(3)})`;
    ctx.fillRect(barX, barY, barW, barH);
    const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    grad.addColorStop(0, `rgba(79,143,255,${fade})`);
    grad.addColorStop(0.6, `rgba(139,92,246,${fade})`);
    grad.addColorStop(1, `rgba(239,68,68,${fade})`);
    ctx.fillStyle = grad;
    ctx.fillRect(barX, barY, (barW * hudCoverage) / 100, barH);

    const vulnY = y - 6;
    let cx2 = x;
    for (const sev of VULN_ORDER) {
      const col = VULN_COLORS[sev];
      const label = sev.toUpperCase();
      const numStr = String(Math.round(hudVulnsEased[sev])).padStart(2, '0');
      ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${(0.95 * fade).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(cx2 + 2.5, vulnY - 3, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.font = '500 11px ui-monospace,"SF Mono",Menlo,monospace';
      ctx.fillStyle = `rgba(220,225,240,${(0.85 * fade).toFixed(3)})`;
      ctx.fillText(numStr, cx2 + 9, vulnY);
      const numW = ctx.measureText(numStr).width;
      ctx.font = '500 9px ui-monospace,"SF Mono",Menlo,monospace';
      ctx.fillStyle = `rgba(255,255,255,${(0.4 * fade).toFixed(3)})`;
      ctx.fillText(label, cx2 + 9 + numW + 5, vulnY);
      cx2 += 9 + numW + 5 + ctx.measureText(label).width + 16;
    }

    const status = finished ? 'FLEURET COMPLETE' : 'FLEURET SCANNING';
    ctx.font = '500 10px ui-monospace,"SF Mono",Menlo,monospace';
    const sw = ctx.measureText(status).width;
    const pillX = W - padX - sw - 24, pillY = y - 24;
    ctx.fillStyle = `rgba(255,255,255,${(0.04 * fade).toFixed(3)})`;
    ctx.strokeStyle = `rgba(255,255,255,${(0.14 * fade).toFixed(3)})`;
    ctx.lineWidth = 1;
    const pw = sw + 24, ph = 22, pr = 11;
    ctx.beginPath();
    ctx.moveTo(pillX + pr, pillY);
    ctx.lineTo(pillX + pw - pr, pillY);
    ctx.arcTo(pillX + pw, pillY, pillX + pw, pillY + pr, pr);
    ctx.lineTo(pillX + pw, pillY + ph - pr);
    ctx.arcTo(pillX + pw, pillY + ph, pillX + pw - pr, pillY + ph, pr);
    ctx.lineTo(pillX + pr, pillY + ph);
    ctx.arcTo(pillX, pillY + ph, pillX, pillY + ph - pr, pr);
    ctx.lineTo(pillX, pillY + pr);
    ctx.arcTo(pillX, pillY, pillX + pr, pillY, pr);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    const dotX = pillX + 11, dotY = pillY + ph / 2;
    const blink = finished ? 1 : (Math.sin(now / 400) * 0.35 + 0.65);
    const dc = finished ? [139, 92, 246] : [79, 143, 255];
    ctx.fillStyle = `rgba(${dc[0]},${dc[1]},${dc[2]},${(blink * fade).toFixed(3)})`;
    ctx.beginPath(); ctx.arc(dotX, dotY, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${(0.7 * fade).toFixed(3)})`;
    ctx.textBaseline = 'middle';
    ctx.fillText(status, pillX + 20, dotY + 0.5);
    ctx.restore();
  }

  const startT = performance.now();

  function frame(now: number) {
    if (destroyed) return;
    if (document.visibilityState !== 'visible') {
      rafId = requestAnimationFrame(frame);
      return;
    }
    const elapsed = now - startT;
    const introFade = Math.min(1, elapsed / 700);

    while (!finished && discoveryIndex < discoveryOrder.length && elapsed >= scheduleOffsets[discoveryIndex]) {
      discoverNode(discoveryOrder[discoveryIndex], now);
      discoveryIndex++;
    }
    if (!finished && discoveryIndex >= discoveryOrder.length) {
      if (progress().coverage >= 0.9999) finished = true;
    }

    ctx.clearRect(0, 0, W, H);
    drawBackgroundDots(introFade);
    drawEdges(now, introFade);
    drawNodes(now, introFade);
    drawHUD(now, introFade);

    if (!finished) rafId = requestAnimationFrame(frame);
    else {
      // Hold final state — redraw once per second to keep HUD eased values settling
      rafId = requestAnimationFrame(frame);
    }
  }

  if (reduced) {
    discoveryOrder.forEach((id) => discoverNode(id, performance.now() - 1000));
    Object.values(edgeState).forEach((e) => { e.done = true; });
    finished = true;
    ctx.clearRect(0, 0, W, H);
    const now = performance.now();
    drawBackgroundDots(1); drawEdges(now, 1); drawNodes(now, 1); drawHUD(now, 1);
  } else {
    rafId = requestAnimationFrame(frame);
  }

  return () => {
    destroyed = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
  };
}
