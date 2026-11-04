"""Original Databricks AI Search infographic: English, 1280x960, 150 frames, 12-second loop.

Code-native artwork matching the Genie/LTAP/Federation palette and typography.
Timeline: data lands → index syncs → a question is embedded → ANN + BM25 →
RRF merge → rerank → results fan out to every consumer. Decision guidance and
pricing detail live in the articles. See SOURCES.md for scope and attribution.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math
import os
import random
import sys

ROOT, TEMP = map(Path, sys.argv[1:3])
OUT = ROOT / 'public/images/blog/databricks-ai-search'
OUT.mkdir(parents=True, exist_ok=True)
S = 2
N = 150
F = Path('/System/Library/Fonts/Supplemental')
REG = os.environ.get('AIS_FONT_REGULAR', str(F / 'Arial.ttf'))
BOLD = os.environ.get('AIS_FONT_BOLD', str(F / 'Arial Bold.ttf'))
MONO = os.environ.get('AIS_FONT_MONO', '/System/Library/Fonts/Menlo.ttc')
BG, CARD, INK, MUTED = '#081B20', '#193A44', '#FAF9F6', '#AEC4C9'
GOLD, MINT = '#FFCF66', '#89DFC3'
PANEL, ROW, ROWTXT, SPACE = '#2A171A', '#3A1E21', '#E8C9C2', '#0B2329'
RGB = {GOLD: (255, 207, 102), MINT: (137, 223, 195), INK: (250, 249, 246)}

_fonts = {}
def font(size, bold=False, mono=False):
    key = (size, bold, mono)
    if key not in _fonts:
        _fonts[key] = (ImageFont.truetype(MONO, int(size*S), index=1 if bold else 0) if mono
                       else ImageFont.truetype(BOLD if bold else REG, int(size*S)))
    return _fonts[key]

im = Image.new('RGB', (1280*S, 960*S), BG)
d = ImageDraw.Draw(im)
def width(value, size, bold=False, mono=False):
    return d.textlength(value, font=font(size, bold, mono))/S
def text(x, y, value, size=18, color=INK, bold=False, mono=False, draw=None, limit=1250):
    # Guard against text silently leaving its box or the canvas.
    assert x + width(value, size, bold, mono) <= limit, value
    (draw or d).text((x*S, y*S), value, font=font(size, bold, mono), fill=color)
def rect(x, y, w, h, fill, r=18, outline=None, draw=None, stroke=2):
    (draw or d).rounded_rectangle((x*S, y*S, (x+w)*S, (y+h)*S), radius=r*S, fill=fill,
                                  outline=outline, width=stroke*S)
def label(x, y, value, color=MUTED, size=13):
    text(x, y, value, size, color, True)
def pill(x, y, value, fill='#102C34', color=INK, size=12, mono=False, h=25, draw=None):
    w = width(value, size, True, mono) + 22
    rect(x, y, w, h, fill, h/2, draw=draw)
    text(x+11, y+(h-size)/2-1, value, size, color, True, mono, draw=draw)
    return w
_logos = {}
def icon(name, x, y, size=34, target=None):
    key = (name, size)
    if key not in _logos:
        _logos[key] = Image.open(TEMP / (name+'.png')).convert('RGBA').resize(
            (int(size*S), int(size*S)), Image.Resampling.LANCZOS)
    mark = _logos[key]
    (target or im).paste(mark, (int(x*S), int(y*S)), mark)

def bezier(a, b, n=48):
    """Horizontal-tangent cubic curve between two ports, as a polyline."""
    (x0, y0), (x3, y3) = a, b
    mx = (x0 + x3) / 2
    pts = []
    for k in range(n+1):
        t = k/n
        u = 1-t
        x = u**3*x0 + 3*u*u*t*mx + 3*u*t*t*mx + t**3*x3
        y = u**3*y0 + 3*u*u*t*y0 + 3*u*t*t*y3 + t**3*y3
        pts.append((x, y))
    return pts
def line(points, color, w=3, draw=None):
    (draw or d).line([(x*S, y*S) for x, y in points], fill=color, width=w*S, joint='curve')

# ---------- Static artwork ----------
for x in range(20, 1280, 40):
    for y in range(20, 960, 40):
        d.ellipse((x*S, y*S, (x+1)*S, (y+1)*S), fill='#173039')
icon('databricks', 40, 38, 39)
text(96, 32, 'Databricks AI Search, explained', 39, INK, True)
text(97, 84, 'Vector + keyword retrieval over your lakehouse. Governed by Unity Catalog.', 20, MUTED)
pill(1126, 40, 'NOV 2026', fill='#203C43')
label(40, 140, 'HOW DATA GETS IN')
label(950, 140, 'WHO CONSUMES IT')

# Ports: left column ends at x 330; centre panel spans 400–880; consumers start at 950.
PATHS = {
    'ing_a': (bezier((330, 419), (416, 340)), INK),
    'ing_b': (bezier((330, 560), (416, 410)), INK),
    'ing_c': (bezier((330, 701), (416, 480)), INK),
    'q_in':  (bezier((950, 250), (880, 549)), GOLD),
    'r_1':   (bezier((880, 655), (950, 410)), MINT),
    'r_2':   (bezier((880, 662), (950, 515)), MINT),
    'r_3':   (bezier((880, 669), (950, 620)), MINT),
    'r_4':   (bezier((880, 676), (950, 725)), MINT),
}
DIM = {INK: '#2F4A52', GOLD: '#5E4A2E', MINT: '#2E5550'}
for pts, color in PATHS.values():
    line(pts, DIM[color], 2)

# Left: source table and the three ways an index takes data.
rect(40, 165, 290, 175, CARD)
icon('lakehouse-storage', 56, 179, 30)
text(96, 184, 'Source table', 21, INK, True)
pill(270, 183, 'CDF', color=GOLD)
text(56, 219, 'Delta · streaming · MV · Iceberg v3', 13, MUTED, limit=326)
ROWS = [('101', 'Refunds within 30 days…'), ('102', 'SKU-4471 waterproof…'),
        ('103', 'Ships to Lima in 48 h…'), ('104', 'Warranty covers soles…')]
def table_row(k, y, draw=None, fill='#102C34', color=MUTED):
    rect(54, y, 262, 20, fill, 6, draw=draw)
    rid, body = ROWS[k]
    text(62, y+4, rid, 11, GOLD if draw else '#8C7A52', mono=True, draw=draw)
    text(96, y+4, body, 11, color, mono=True, draw=draw, limit=314)
for k in range(3):
    table_row(k, 244 + k*22)

INDEX_CARDS = [
    (356, 'Delta Sync · managed', 'model-serving',
     ['Databricks embeds the text with a', 'Foundation Model API or serving endpoint'], True),
    (497, 'Delta Sync · self-managed', 'lakehouse-storage',
     ['You bring the embedding column;', 'the index follows the table'], True),
    (638, 'Direct Vector Access', 'rest-api',
     ['Upsert vectors via REST / SDK.', 'No automatic sync from a table.'], False),
]
SYNC_PILLS = {}
for y, title, mark, body, synced in INDEX_CARDS:
    rect(40, y, 290, 126, CARD)
    text(56, y+14, title, 15, INK, True, limit=280)
    rect(286, y+9, 32, 32, '#102C34', 8)
    icon(mark, 289, y+12, 26)
    for k, value in enumerate(body):
        text(56, y+44+k*19, value, 12.5, MUTED, limit=326)
    if synced:
        x = 56
        boxes = []
        for value in ['Triggered sync', 'Continuous']:
            w = pill(x, y+89, value, fill='#102C34', color=MUTED, size=11.5, h=24)
            boxes.append((x, y+89, w, value))
            x += w + 6
        SYNC_PILLS[y] = boxes
    else:
        pill(56, y+89, 'API-managed', fill='#102C34', color=MUTED, size=11.5, h=24)

# Centre: endpoint, index space, retrieval pipeline and results.
rect(400, 165, 480, 600, PANEL, 22, outline='#5A2A26')
pill_w = width('Databricks AI Search', 20, True) + 72
rect(640-pill_w/2, 148, pill_w, 38, '#0E252B', 19, outline='#5A2A26')
icon('ai-search', 640-pill_w/2+14, 152, 30)
text(640-pill_w/2+54, 157, 'Databricks AI Search', 20, INK, True)

rect(416, 198, 448, 80, ROW, 14)
icon('serverless-compute', 428, 210, 26)
text(462, 208, 'Endpoint', 17, INK, True)
text(462, 231, 'Serverless · up to 50 indexes', 12.5, ROWTXT)
ENDPOINT = []
x = 864
for value in ['Storage-optimized', 'Standard']:
    w = width(value, 12, True) + 20
    x -= w
    ENDPOINT.insert(0, (x, w, value))
    x -= 6
def draw_endpoint(active, draw=None):
    for k, (x, w, value) in enumerate(ENDPOINT):
        on = k == active
        rect(x, 207, w, 24, (205, 64, 44, 255) if on else '#4A2629', 12, draw=draw)
        text(x+10, 213, value, 12, INK if on else ROWTXT, True, draw=draw)
SPECS = ['≈320M vectors · high QPS · lowest latency', '1B+ vectors · 10–20× faster indexing · ~+250 ms']
draw_endpoint(0)
text(462, 255, SPECS[0], 12.5, GOLD)

# Index space: deterministic clusters of document vectors.
SPACE_BOX = (416, 290, 864, 520)
rect(416, 290, 448, 230, SPACE, 14)
label(430, 300, 'INDEX  ·  HNSW  ·  L2', MUTED, 11)
uc_w = width('UC securable · SELECT to query', 11, True) + 34
rect(850-uc_w, 296, uc_w, 22, '#102C34', 11)
icon('unity-catalog', 850-uc_w+6, 299, 16)
text(850-uc_w+26, 301, 'UC securable · SELECT to query', 11, MUTED, True)
rng = random.Random(11)
CENTERS = [(480, 380), (590, 450), (700, 370), (790, 460), (600, 360)]
POINTS = []
for c, (cx, cy) in enumerate(CENTERS):
    for _ in range(22):
        px = min(852, max(428, rng.gauss(cx, 26)))
        py = min(510, max(330, rng.gauss(cy, 20)))
        POINTS.append((px, py, c))
for px, py, c in POINTS:
    d.ellipse(((px-2.6)*S, (py-2.6)*S, (px+2.6)*S, (py+2.6)*S), fill='#3E5C63')
NEW_POINTS = [(612, 437), (626, 452), (598, 462)]
QUERY = (604, 446)
NEAREST = sorted(POINTS + [(x, y, 1) for x, y in NEW_POINTS],
                 key=lambda p: math.dist(p[:2], QUERY))[:6]
KEYWORD = [POINTS[30], POINTS[71], NEAREST[1], POINTS[5]]

PIPE = []
x = 416
for value in ['Embed query', 'ANN', 'BM25', 'RRF merge', 'Rerank']:
    w = width(value, 12.5, True) + 22
    PIPE.append((x, 534, w, value))
    x += w + (20 if value != 'ANN' else 16)
assert x - 20 <= 864, x
def draw_pipe(k, amount=0.0, draw=None):
    x, y, w, value = PIPE[k]
    if amount:
        mix = [int(c0 + (c1-c0)*amount) for c0, c1 in zip((74, 38, 41), (255, 207, 102))]
        rect(x, y, w, 30, (*mix, 255), 15, draw=draw)
        text(x+11, y+8, value, 12.5, (60, 35, 10, 255) if amount > .5 else ROWTXT, True, draw=draw)
    else:
        rect(x, y, w, 30, '#4A2629', 15)
        text(x+11, y+8, value, 12.5, ROWTXT, True)
for k in range(len(PIPE)):
    draw_pipe(k)
for k in range(len(PIPE)-1):
    x, y, w, value = PIPE[k]
    nx = PIPE[k+1][0]
    glyph = '+' if value == 'ANN' else '→'
    text((x+w+nx)/2 - width(glyph, 13, True)/2, 541, glyph, 13, ROWTXT, True)

rect(416, 578, 448, 172, ROW, 14)
label(430, 590, 'TOP-K RESULTS', ROWTXT, 11)
pill(700, 585, "filter: region = 'PE'", fill='#4A2629', color=ROWTXT, size=11, mono=True, h=22)
RESULT_Y = [612, 650, 688]
RESULTS = [('101', 'Refund policy · 30 days', .82), ('102', 'SKU-4471 · waterproof boots', .78),
           ('104', 'Warranty · footwear', .64)]
for y in RESULT_Y:
    rect(430, y, 420, 32, '#2E181B', 9)

# Right: the question and every consumer of the index.
rect(950, 165, 290, 186, CARD)
pill(966, 180, '01  ASK')
text(966, 214, 'A question', 20, INK, True)
rect(964, 242, 262, 34, SPACE, 9)
QTEXT = 'refund for SKU-4471?'
label(966, 283, 'USE CASES', MUTED, 11)
USES = []
x, y = 966, 299
for value in ['RAG', 'Product search', 'Recommenders', 'Image / video']:
    w = width(value, 11.5, True) + 18
    if x + w > 1228:
        x, y = 966, y + 24
    USES.append((x, y, w, value))
    rect(x, y, w, 22, '#102C34', 11)
    text(x+9, y+5, value, 11.5, MUTED, True)
    x += w + 6
assert USES[-1][1] + 22 <= 346

CONSUMERS = [
    (360, 'Agents', 'agent-bricks', 'VectorSearchRetrieverTool', 'AI Bridge · LangChain / OpenAI', None),
    (465, 'MCP clients', None, '/api/2.0/mcp/ai-search/…', 'Claude Code, Cursor, any MCP client', 'PREVIEW'),
    (570, 'SQL', 'databricks-sql', 'vector_search()', 'Databricks SQL · notebooks', 'PREVIEW'),
    (675, 'Apps & services', 'databricks-apps', 'REST · AISearchClient', 'Databricks Apps or external', None),
]
for y, title, mark, code, body, status in CONSUMERS:
    rect(950, y, 290, 90, CARD)
    rect(964, y+12, 32, 32, '#102C34', 8)
    if mark:
        icon(mark, 967, y+15, 26)
    else:
        text(980 - width('MCP', 10, True)/2, y+23, 'MCP', 10, GOLD, True)
    text(1006, y+18, title, 16, INK, True)
    if status:
        pill(1166, y+14, status, color=GOLD, size=10.5, h=22)
    text(966, y+52, code, 11.5, MINT, mono=True, limit=1232)
    text(966, y+70, body, 12, MUTED, limit=1232)

# Costs strip: what the bill is made of, without prices.
rect(40, 785, 1200, 66, '#F6F3EC')
icon('system-tables', 56, 797, 36)
text(104, 795, 'Costs', 22, '#142E36', True)
text(104, 823, 'per vector search unit', 13, '#36545E')
label(292, 795, 'UNITS', '#36545E', 11)
UNITS = [(292 + k*22, 812) for k in range(8)]
for k, (x, y) in enumerate(UNITS):
    rect(x, y, 16, 22, '#C9533D' if k < 3 else '#E2DACD', 4)
text(474, 793, '1 unit ≈ 2M vectors (Standard)', 12, '#36545E', True)
text(474, 813, '1 unit ≈ 64M (Storage-optimized)', 12, '#36545E', True)
text(474, 832, 'at 768 dimensions', 11, '#5D7880')
COSTS = []
x = 698
for value in ['Billed once an index exists', 'Triggered < continuous', '+ embedding endpoint']:
    w = width(value, 12.5, True) + 24
    COSTS.append((x, w, value))
    x += w + 8
assert x <= 1234, x
def draw_costs(hot, draw=None):
    for (x, w, value), h in zip(COSTS, hot):
        rect(x, 805, w, 28, (205, 64, 44, int(140+115*h)) if h else '#E9E2D6', 14, draw=draw)
        text(x+12, 812, value, 12.5, INK if h else '#7A2A1C', True, draw=draw)
draw_costs([0, 0, 0])

# Signature.
icon('databricks', 40, 883, 34)
text(86, 880, 'Daniel DataShow', 18, INK, True)
rect(86, 906, 18, 18, '#2D6A8A', 4)
text(90, 907, 'in', 13, INK, True)
text(110, 907, 'linkedin.com/in/danielportugalr', 14, MINT, True)
note = 'Conceptual flows • docs checked 3 Nov 2026 • no prices shown'
text(1240-width(note, 14), 898, note, 14, MUTED)

base = im.resize((1280, 960), Image.Resampling.LANCZOS)
base.save(ROOT/'src/assets/ai-search-explained.png', optimize=True)
base.save(OUT/'ai-search-explained.png', optimize=True)

# ---------- Animation ----------
def at_path(pts, t):
    t = min(max(t, 0), 1)
    lengths = [math.dist(a, b) for a, b in zip(pts, pts[1:])]
    v = t*sum(lengths)
    for a, b, length in zip(pts, pts[1:], lengths):
        if v <= length:
            return a[0]+(b[0]-a[0])*v/length, a[1]+(b[1]-a[1])*v/length
        v -= length
    return pts[-1]
def window(t, a, b):
    return (t-a)/(b-a) if a <= t <= b else None
def ease(p):
    p = min(max(p, 0), 1)
    return p*p*(3-2*p)
def bump(t, a, b):
    """0 → 1 → 0 across [a, b], used for glows."""
    p = window(t, a, b)
    return 0 if p is None else math.sin(math.pi*p)
def lit(t, a, b, edge=.02):
    """Plateau: ramps up after a, holds, ramps down before b."""
    if t < a or t > b:
        return 0
    return min(1, (t-a)/edge, (b-t)/edge)

def comet(a, name, p):
    pts, color = PATHS[name]
    rgb = RGB[color]
    head = ease(p)
    upto = [at_path(pts, head*k/24) for k in range(25)]
    a.line([(x*S, y*S) for x, y in upto], fill=(*rgb, 150), width=3*S, joint='curve')
    for k in range(9, -1, -1):
        x, y = at_path(pts, head - k*.035)
        r = 6 - k*.45
        a.ellipse(((x-r)*S, (y-r)*S, (x+r)*S, (y+r)*S), fill=(*rgb, int(255*(1-k/10)**1.6)))
    x, y = at_path(pts, head)
    for r, al in [(16, 22), (11, 50), (7, 255)]:
        a.ellipse(((x-r)*S, (y-r)*S, (x+r)*S, (y+r)*S), fill=(*rgb, al))
    a.ellipse(((x-3)*S, (y-3)*S, (x+3)*S, (y+3)*S), fill=(255, 255, 255, 255))
def dot(a, x, y, rgb, r=4, al=255):
    for rr, aa in [(r*2.4, al*.12), (r*1.6, al*.3), (r, al)]:
        a.ellipse(((x-rr)*S, (y-rr)*S, (x+rr)*S, (y+rr)*S), fill=(*rgb, int(aa)))
def glow_box(a, box, rgb, amount, r=18):
    if amount <= 0:
        return
    x0, y0, x1, y1 = box
    for grow, al in [(6, 30), (3, 70), (0, 230)]:
        a.rounded_rectangle(((x0-grow)*S, (y0-grow)*S, (x1+grow)*S, (y1+grow)*S), radius=(r+grow)*S,
                            outline=(*rgb, int(al*amount)), width=2*S)

def result_row(a, slot_y, k, alpha, score_grow):
    rid, body, score = RESULTS[k]
    rect(430, slot_y, 420, 32, (46, 24, 27, alpha), 9, draw=a)
    text(442, slot_y+9, rid, 12, (255, 207, 102, alpha), True, True, draw=a)
    text(480, slot_y+9, body, 13, (250, 249, 246, alpha), True, draw=a, limit=736)
    rect(744, slot_y+11, 92, 10, (74, 38, 41, alpha), 5, draw=a)
    w = 92*score*score_grow
    if w > 3:
        rect(744, slot_y+11, w, 10, (137, 223, 195, alpha), 5, draw=a)

frames = []
for i in range(N):
    t = i/N
    layer = Image.new('RGBA', im.size)
    a = ImageDraw.Draw(layer)
    fade = 1 if t < .93 else max(0, 1-(t-.93)/.06)
    alpha = int(255*fade)

    # Ambient traffic keeps every path alive at low intensity.
    for k, (pts, color) in enumerate(PATHS.values()):
        x, y = at_path(pts, (t*2 + k*.13) % 1)
        a.ellipse(((x-2.5)*S, (y-2.5)*S, (x+2.5)*S, (y+2.5)*S), fill=(*RGB[color], 90))

    # Endpoint type alternates each half-loop; the spec line follows.
    active = 0 if t < .5 else 1
    draw_endpoint(active, a)
    rect(460, 252, 400, 20, ROW, 4, draw=a)
    text(462, 255, SPECS[active], 12.5, GOLD, draw=a)

    # Use cases light up in turn across the loop.
    for k, (x, y, w, value) in enumerate(USES):
        h = lit(t, k/4, (k+1)/4, .03)
        if h:
            rect(x, y, w, 22, (*[int(c*.45) for c in RGB[GOLD]], 255), 11, outline=(255, 207, 102, int(255*h)),
                 draw=a, stroke=1)
            text(x+9, y+5, value, 11.5, INK, True, draw=a)

    # 1 · a new row lands in the source table (change data feed).
    p = window(t, .02, .1)
    if p is not None or (.1 < t and fade):
        slide = ease(p) if p is not None else 1
        y = 244 + 3*22 - 12*(1-slide)
        table_row(3, y, a, fill=(26, 60, 66, int(255*slide*fade)), color=(250, 249, 246, int(255*slide*fade)))
    glow_box(a, (40, 165, 330, 340), RGB[GOLD], bump(t, .02, .14))

    # 2 · the index syncs: each ingestion path delivers vectors.
    for k, (name, (s0, s1)) in enumerate([('ing_a', (.08, .18)), ('ing_b', (.11, .21)), ('ing_c', (.14, .24))]):
        p = window(t, s0, s1)
        if p is not None:
            comet(a, name, p)
        y = INDEX_CARDS[k][0]
        glow_box(a, (40, y, 330, y+126), RGB[INK], bump(t, s0-.03, s0+.08))
    for y, boxes in SYNC_PILLS.items():
        h = bump(t, .06, .22)
        if h:
            x, py, w, value = boxes[0]
            rect(x, py, w, 24, (255, 207, 102, int(255*h)), 12, draw=a)
            text(x+11, py+5.5, value, 11.5, (60, 35, 10, 255) if h > .4 else MUTED, True, draw=a)
    grow = ease((t-.16)/.08) * fade
    for x, y in NEW_POINTS:
        if grow:
            dot(a, x, y, RGB[INK], 3.2, 255*grow)
    if grow:
        x, y = UNITS[3]
        rect(x, y+22*(1-grow), 16, 22*grow, (201, 83, 61, 255), 4, draw=a)

    # 3 · a question is typed and sent.
    typed = int(len(QTEXT)*min(1, max(0, (t-.22)/.1)))
    if typed and fade:
        shown = QTEXT[:typed]
        text(974, 252, shown, 13, (*RGB[GOLD], alpha), mono=True, draw=a)
        if (i // 4) % 2 == 0:
            cx = 974 + width(shown, 13, mono=True) + 2
            a.rectangle((cx*S, 251*S, (cx+8)*S, 268*S), fill=(255, 207, 102, 200))
    glow_box(a, (950, 165, 1240, 351), RGB[GOLD], bump(t, .3, .4))
    glow_box(a, (950, 360, 1240, 450), RGB[GOLD], bump(t, .3, .4))
    p = window(t, .33, .41)
    if p is not None:
        comet(a, 'q_in', p)

    # 4 · embed, search two ways, merge and rerank.
    stages = [(.4, .5), (.46, .6), (.48, .6), (.58, .66), (.65, .75)]
    for k, (s0, s1) in enumerate(stages):
        h = lit(t, s0, s1)
        if h:
            draw_pipe(k, h, a)
    star = ease((t-.42)/.05) * fade
    if star:
        qx, qy = QUERY
        for r, al in [(14, 40), (9, 90)]:
            a.ellipse(((qx-r*star)*S, (qy-r*star)*S, (qx+r*star)*S, (qy+r*star)*S), fill=(255, 207, 102, int(al*star)))
        a.regular_polygon(((qx*S, qy*S), 7*S*star), 4, rotation=45, fill=(255, 207, 102, int(255*star)))
    p = window(t, .46, .62)
    if p is not None:  # HNSW-style neighbourhood growing around the query
        for ring in [p, p-.35]:
            if 0 < ring < 1:
                r = 10 + 70*ring
                a.ellipse(((QUERY[0]-r)*S, (QUERY[1]-r)*S, (QUERY[0]+r)*S, (QUERY[1]+r)*S),
                          outline=(255, 207, 102, int(150*(1-ring))), width=2*S)
    near = ease((t-.5)/.08) * lit(t, .5, .72, .04)
    for k, (px, py, _) in enumerate(NEAREST):
        if near:
            a.line(((QUERY[0]*S, QUERY[1]*S), ((QUERY[0]+(px-QUERY[0])*near)*S, (QUERY[1]+(py-QUERY[1])*near)*S)),
                   fill=(255, 207, 102, int(200*near)), width=2*S)
            dot(a, px, py, RGB[GOLD], 3.4, 255*near)
    kw = lit(t, .5, .66, .03)
    for px, py, _ in KEYWORD:
        if kw:
            a.rectangle(((px-5)*S, (py-5)*S, (px+5)*S, (py+5)*S), outline=(137, 223, 195, int(255*kw)), width=2*S)
    merge = bump(t, .58, .68)
    if merge:
        glow_box(a, SPACE_BOX, RGB[GOLD], merge, 14)

    # 5 · results appear, then the reranker reorders them.
    swap = ease((t-.68)/.06)
    crossing = math.sin(math.pi*swap)
    for k in range(3):
        appear = ease((t-.6-k*.02)/.04) * fade
        if not appear:
            continue
        y = RESULT_Y[k]
        if k == 0:  # demoted row dims while the promoted one passes over it
            y = RESULT_Y[0] + (RESULT_Y[1]-RESULT_Y[0])*swap
            appear *= 1 - .65*crossing
        elif k == 1:
            y = RESULT_Y[1] - (RESULT_Y[1]-RESULT_Y[0])*swap
        result_row(a, y, k, int(255*appear), appear)
    glow_box(a, (416, 578, 864, 750), RGB[GOLD], bump(t, .66, .76), 14)

    # 6 · results reach every consumer.
    for k, name in enumerate(['r_1', 'r_2', 'r_3', 'r_4']):
        p = window(t, .76 + k*.025, .85 + k*.025)
        if p is not None:
            comet(a, name, p)
        y = CONSUMERS[k][0]
        glow_box(a, (950, y, 1240, y+90), RGB[MINT], bump(t, .82 + k*.025, .94 + k*.025))

    # Cost drivers pulse with the stage that incurs them.
    draw_costs([bump(t, .14, .3), bump(t, .06, .22), bump(t, .38, .52)], a)

    frame = Image.alpha_composite(im.convert('RGBA'), layer).convert('RGB')
    frames.append(frame.resize((1280, 960), Image.Resampling.LANCZOS))

PICKS = [6, 18, 30, 50, 66, 78, 90, 100, 112, 124, 136]
palette = Image.new('RGB', (1280, 960*len(PICKS)))
for k, idx in enumerate(PICKS):
    palette.paste(frames[idx], (0, 960*k))
palette = palette.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
indexed[0].save(OUT/'ai-search-explained.gif', save_all=True, append_images=indexed[1:],
                duration=80, loop=0, optimize=True, disposal=1)
with Image.open(OUT/'ai-search-explained.gif') as gif:
    assert gif.size == (1280, 960) and gif.n_frames == N
    assert gif.info.get('loop') == 0
    total = 0
    for i in range(gif.n_frames):
        gif.seek(i)
        total += gif.info['duration']
    assert total == 12000
print(f'GIF: {N} frames, 12 s, {(OUT/"ai-search-explained.gif").stat().st_size/1024/1024:.2f} MiB')
