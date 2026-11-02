"""Original Lakehouse Federation infographic: English, 1280x960, 125 frames, 10-second loop.

Code-native artwork matching the Genie/LTAP palette and typography, with a
timeline: setup → query → pushdown / direct read → governed results.
Decision guidance lives in the articles, so the canvas is the flow itself.
No source GIF frames reused. See SOURCES.md for scope and attribution.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math
import os
import sys

ROOT, TEMP = map(Path, sys.argv[1:3])
OUT = ROOT / 'public/images/blog/databricks-lakehouse-federation'
OUT.mkdir(parents=True, exist_ok=True)
S = 2
N = 125
F = Path('/System/Library/Fonts/Supplemental')
REG = os.environ.get('FED_FONT_REGULAR', str(F / 'Arial.ttf'))
BOLD = os.environ.get('FED_FONT_BOLD', str(F / 'Arial Bold.ttf'))
MONO = os.environ.get('FED_FONT_MONO', '/System/Library/Fonts/Menlo.ttc')
BG, CARD, INK, MUTED = '#081B20', '#193A44', '#FAF9F6', '#AEC4C9'
RED, GOLD, MINT = '#FF3621', '#FFCF66', '#89DFC3'
PANEL, ROW, ROWTXT, LANE = '#2A171A', '#3A1E21', '#E8C9C2', '#341B1E'
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
def label(x, y, value, color=MUTED):
    text(x, y, value, 13, color, True)
def badge(x, y, value, fill='#102C34', color=INK, size=12):
    w = width(value, size, True) + 22
    rect(x, y, w, 25, fill, 12)
    text(x+11, y+6, value, size, color, True)
    return w
_logos = {}
def logo(name, size):
    """Official artwork rasterised by render.mjs; None when a mark is unavailable."""
    path = TEMP / (name+'.png')
    if not path.exists():
        return None
    key = (name, size)
    if key not in _logos:
        _logos[key] = Image.open(path).convert('RGBA').resize((int(size*S), int(size*S)), Image.Resampling.LANCZOS)
    return _logos[key]
def icon(name, x, y, size=34, target=None):
    mark = logo(name, size)
    assert mark is not None, name
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
text(96, 32, 'Lakehouse Federation, explained', 39, INK, True)
text(97, 84, 'Query data where it lives. Govern it in Unity Catalog. No copy, read-only.', 20, MUTED)
badge(1130, 40, 'OCT 2026', fill='#203C43')
label(40, 140, 'YOU ASK')
label(940, 140, 'WHERE THE DATA LIVES')

# Ports: centre panel spans x 380–860; sources start at x 940; consumer ends at x 310.
PATHS = {
    'setup_qf': (bezier((860, 231), (940, 215)), INK),
    'setup_cf': (bezier((860, 231), (940, 515)), INK),
    'q_left':   (bezier((310, 330), (380, 453)), GOLD),
    'q_qf':     (bezier((860, 588), (940, 330)), GOLD),
    'q_cf':     (bezier((860, 700), (940, 600)), GOLD),
    'r_qf':     (bezier((940, 380), (860, 612)), MINT),
    'r_cf':     (bezier((940, 640), (860, 722)), MINT),
    'r_left':   (bezier((380, 470), (310, 580)), MINT),
}
DIM = {INK: '#2F4A52', GOLD: '#5E4A2E', MINT: '#2E5550'}
for pts, color in PATHS.values():
    line(pts, DIM[color], 2)

# Left: the consumer query.
rect(40, 165, 270, 595, CARD)
badge(56, 180, '01  QUERY')
text(56, 214, 'Your SQL', 24, INK, True)
rect(54, 252, 242, 178, '#0B2329', 12)
CODE = [
    ('SELECT c.segment,', INK),
    ('  SUM(o.amount)', INK),
    ('FROM pg.sales.orders o', GOLD),
    ('JOIN main.gold.cust c', MINT),
    ('  ON o.cust_id = c.id', INK),
    ('GROUP BY 1;', INK),
]
for value, _ in CODE:
    assert 66 + width(value, 13.5, mono=True) <= 290, value
label(56, 446, 'RUN IT FROM')
icon('sql-warehouse', 56, 468, 26)
text(90, 472, 'SQL warehouse or cluster', 15, INK, True, limit=300)
text(56, 504, 'SQL editor · notebooks · dashboards', 13, MUTED, limit=300)
label(56, 540, 'RESULT  ·  ILLUSTRATIVE')
SEGMENTS = [('Retail', .72), ('SMB', .48), ('Enterprise', .9)]
for k, (name, _) in enumerate(SEGMENTS):
    text(56, 563+k*26, name, 14, MUTED)
    rect(146, 566+k*26, 146, 12, '#102C34', 6)
LINEAGE_Y = 652
icon('data-lineage', 56, LINEAGE_Y, 26)
text(90, LINEAGE_Y+5, 'Lineage + audit', 15, INK, True, limit=300)
text(56, LINEAGE_Y+40, 'pg.sales.orders → result', 11.5, MUTED, mono=True, limit=300)
text(56, LINEAGE_Y+70, 'Foreign + UC tables, one query', 13, MUTED, limit=300)

# Centre: the federation flow inside Unity Catalog.
rect(380, 165, 480, 595, PANEL, 22, outline='#5A2A26')
pill_w = width('Lakehouse Federation', 20, True) + 72
rect(620-pill_w/2, 148, pill_w, 38, '#0E252B', 19, outline='#5A2A26')
icon('lakehouse-federation', 620-pill_w/2+14, 152, 30)
text(620-pill_w/2+54, 157, 'Lakehouse Federation', 20, INK, True)
STEPS = [
    ('Connection', 'Host + credentials, or the external catalog', 'SETUP', 'lakehouse-federation'),
    ('Foreign catalog', 'Mirrors schemas and tables in Unity Catalog', 'SETUP', 'unity-catalog'),
    ('Grant access', 'USE CATALOG · USE SCHEMA · SELECT', 'SETUP', 'shield-check'),
    ('Query in place', 'UC checks permissions, then picks a path', 'EVERY QUERY', 'sql-warehouse'),
]
ROW_Y = [198, 272, 346, 420]
def draw_step(k, amount=0.0, draw=None, target=None):
    """Draws a step row; amount > 0 renders the lit state on the animation layer."""
    y = ROW_Y[k]
    title, body, tag, mark = STEPS[k]
    lit = amount > 0
    rect(396, y, 448, 66, (205, 64, 44, int(240*amount)) if lit else ROW, 14, draw=draw)
    dd = draw or d
    cx, cy = 418, y+33
    if lit:
        dd.ellipse(((cx-13)*S, (cy-13)*S, (cx+13)*S, (cy+13)*S), fill=(250, 249, 246, 255))
    else:
        dd.ellipse(((cx-13)*S, (cy-13)*S, (cx+13)*S, (cy+13)*S), outline=ROWTXT, width=2*S)
    n = str(k+1)
    text(cx - width(n, 14, True)/2, cy-8, n, 14, '#7A1C10' if lit else ROWTXT, True, draw=draw)
    rect(442, y+15, 36, 36, (250, 249, 246, 255) if lit else '#4A2629', 9, draw=draw)
    icon(mark, 446, y+19, 28, target)
    text(492, y+11, title, 19, INK, True, draw=draw)
    text(492, y+39, body, 14, INK if lit else ROWTXT, draw=draw, limit=836)
    tw = width(tag, 11, True) + 18
    rect(832-tw, y+11, tw, 21, (0, 0, 0, 70) if lit else '#2A171A', 10, draw=draw)
    text(841-tw, y+16, tag, 11, INK if lit else ROWTXT, True, draw=draw)
for k in range(4):
    draw_step(k)

# Two execution lanes: pushdown to the source, or direct file reads.
label(396, 498, 'TWO WAYS TO ANSWER', ROWTXT)
rect(396, 520, 448, 114, LANE, 14)
text(412, 532, 'Query federation  ·  pushdown', 16, INK, True)
text(412, 556, 'Source engine runs the delegated SQL', 13, ROWTXT)
CLAUSES = []
cx = 412
for value in ['WHERE', 'GROUP BY', 'SUM()', 'LIMIT']:
    w = width(value, 12.5, True, True) + 22
    CLAUSES.append((cx, 590, w, value))
    rect(cx, 590, w, 26, '#4A2629', 12)
    text(cx+11, 596, value, 12.5, ROWTXT, True, True)
    cx += w + 8
text(cx+4, 596, '+ rest on Databricks', 12, ROWTXT, limit=840)
rect(396, 644, 448, 104, LANE, 14)
text(412, 656, 'Catalog federation  ·  direct read', 16, INK, True)
text(412, 680, 'Databricks compute reads the table files', 13, ROWTXT)
icon('lakehouse-storage', 412, 704, 30)
TILES = [(452 + k*36, 709) for k in range(8)]
for x, y in TILES:
    rect(x, y, 28, 20, '#4A2629', 5)
rect(752, 700, 76, 38, '#4A2629', 10)
icon('databricks', 760, 705, 28)
text(793, 712, 'run', 13, ROWTXT, True)

# Right: the two federation types, with official vendor marks where available.
def tiles(x, y, items, cols=2, w=131, h=30, step=37, fill='#102C34'):
    boxes = []
    for k, (name, mark) in enumerate(items):
        tx, ty = x + (k % cols)*(w+6), y + (k // cols)*step
        rect(tx, ty, w, h, fill, 9)
        has = mark and logo(mark, 20) is not None
        if has:
            rect(tx+5, ty+4, 22, 22, '#F6F3EC', 6)
            icon(mark, tx+6, ty+5, 20)
        size = 12
        while width(name, size, True) > w - (36 if has else 20):
            size -= .5
        text(tx + (34 if has else 10), ty + (h - size)/2 - 1, name, size, INK, True, limit=tx+w)
        boxes.append((tx, ty, w, h, name, mark if has else None, size))
    return boxes
rect(940, 165, 300, 300, CARD)
text(956, 180, 'Query federation', 21, INK, True)
badge(1176, 180, 'JDBC', color=GOLD)
text(956, 209, 'Pushdown to the source engine', 13, MUTED, limit=1230)
QF = tiles(956, 236, [('MySQL', 'logo-mysql'), ('PostgreSQL', 'postgresql'), ('SQL Server', 'logo-sqlserver'),
                      ('Oracle', 'logo-oracle'), ('Teradata', 'logo-teradata'), ('Redshift', 'logo-redshift'),
                      ('Snowflake', 'logo-snowflake'), ('BigQuery', 'logo-bigquery'), ('Synapse', 'logo-synapse'),
                      ('Salesforce', 'logo-salesforce'), ('Databricks', 'databricks')])
assert QF[-1][1] + 30 <= 458
rect(940, 480, 300, 280, '#163D3A')
text(956, 495, 'Catalog federation', 21, INK, True)
badge(1166, 495, 'FILES', color=MINT)
text(956, 524, 'Metadata from the catalog, files from storage', 13, MUTED, limit=1230)
CF = tiles(956, 551, [('Hive Metastore', 'logo-hive'), ('AWS Glue', 'logo-aws-glue'), ('Snowflake', 'logo-snowflake'),
                      ('Salesforce', 'logo-salesforce'), ('Palantir', 'logo-palantir'), ('Workday', 'logo-workday')],
           fill='#0F2E2C')
rect(956, 680, 268, 64, '#0F2E2C', 12)
icon('lakehouse-storage', 968, 693, 36)
text(1016, 692, 'Object storage', 16, INK, True)
text(1016, 716, 'Authorized paths + external location', 12, MUTED, limit=1222)

# Unity Catalog governance strip.
rect(40, 785, 1200, 66, '#F6F3EC')
icon('unity-catalog', 58, 799, 37)
text(106, 797, 'Unity Catalog', 22, '#142E36', True)
text(106, 825, 'governs every foreign table', 14, '#36545E')
UC = []
cx = 360
for value in ['Table-level GRANTs', 'Lineage + audit', 'Read-only', 'REFRESH FOREIGN CATALOG']:
    mono = value.isupper()
    w = width(value, 13, True, mono) + 24
    UC.append((cx, w, value, mono))
    cx += w + 12
assert cx <= 1232, cx
def draw_uc(draw=None, hot=None):
    for k, (x, w, value, mono) in enumerate(UC):
        h = hot[k] if hot else 0
        if mono:
            fill, color = (20, 46, 54, 255), INK
        else:
            fill = '#E9E2D6' if not h else (205, 64, 44, int(140+115*h))
            color = '#7A2A1C' if not h else INK
        rect(x, 805, w, 28, fill, 14, draw=draw)
        text(x+12, 812, value, 13, color, True, mono, draw=draw)
draw_uc()

# Signature.
icon('databricks', 40, 883, 34)
text(86, 880, 'Daniel DataShow', 18, INK, True)
rect(86, 906, 18, 18, '#2D6A8A', 4)
text(90, 907, 'in', 13, INK, True)
text(110, 907, 'linkedin.com/in/danielportugalr', 14, MINT, True)
note = 'Conceptual flows • docs checked 30 Oct 2026 • sources vary by cloud'
text(1240-width(note, 14), 898, note, 14, MUTED)

base = im.resize((1280, 960), Image.Resampling.LANCZOS)
base.save(ROOT/'src/assets/federation-explained.png', optimize=True)
base.save(OUT/'federation-explained.png', optimize=True)

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
    return p*p*(3-2*p)
def bump(t, a, b):
    """0 → 1 → 0 across [a, b], used for glows."""
    p = window(t, a, b)
    return 0 if p is None else math.sin(math.pi*p)
def lit(t, a, b, edge=.025):
    """Plateau: ramps up after a, holds, ramps down before b."""
    if t < a or t > b:
        return 0
    return min(1, (t-a)/edge, (b-t)/edge)

def comet(a, name, p, reverse=False, color=None):
    pts, base_color = PATHS[name]
    pts = pts[::-1] if reverse else pts
    rgb = RGB[color or base_color]
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
def dot(a, x, y, rgb, r=5, al=255):
    for rr, aa in [(r*2.4, al*.1), (r*1.6, al*.25), (r, al)]:
        a.ellipse(((x-rr)*S, (y-rr)*S, (x+rr)*S, (y+rr)*S), fill=(*rgb, int(aa)))

def glow_box(a, box, rgb, amount, r=18):
    if amount <= 0:
        return
    x0, y0, x1, y1 = box
    for grow, al in [(6, 30), (3, 70), (0, 230)]:
        a.rounded_rectangle(((x0-grow)*S, (y0-grow)*S, (x1+grow)*S, (y1+grow)*S), radius=(r+grow)*S,
                            outline=(*rgb, int(al*amount)), width=2*S)
def scan(a, layer, boxes, p, rgb):
    """Highlight wave across source tiles; redraws the tile so marks stay crisp."""
    for j, (x, y, w, h, name, mark, size) in enumerate(boxes):
        amount = max(0, 1 - abs(p*(len(boxes)+2) - 1 - j)/1.4)
        if amount:
            a.rounded_rectangle((x*S, y*S, (x+w)*S, (y+h)*S), radius=9*S,
                                fill=(*[int(c*.35) for c in rgb], 255), outline=(*rgb, int(255*amount)), width=2*S)
            if mark:
                rect(x+5, y+4, 22, 22, (246, 243, 236, 255), 6, draw=a)
                icon(mark, x+6, y+5, 20, layer)
            text(x + (34 if mark else 10), y + (h - size)/2 - 1, name, size, INK, True, draw=a)

TOTAL = sum(len(v) for v, _ in CODE)
QF_BOX, CF_BOX, LEFT_BOX = (940, 165, 1240, 465), (940, 480, 1240, 760), (40, 165, 310, 760)
LANE_A, LANE_B = (396, 520, 844, 634), (396, 644, 844, 748)
frames = []
for i in range(N):
    t = i/N
    layer = Image.new('RGBA', im.size)
    a = ImageDraw.Draw(layer)
    fade = 1 if t < .93 else max(0, 1-(t-.93)/.06)

    # Ambient traffic keeps every path alive at low intensity.
    for k, (pts, color) in enumerate(PATHS.values()):
        x, y = at_path(pts, (t*2 + k*.17) % 1)
        a.ellipse(((x-2.5)*S, (y-2.5)*S, (x+2.5)*S, (y+2.5)*S), fill=(*RGB[color], 90))

    # 1–3 · one-time setup.
    for k, (s0, s1) in enumerate([(0, .1), (.1, .2), (.2, .29)]):
        amount = lit(t, s0, s1)
        if amount:
            draw_step(k, amount, a, layer)
    for name in ['setup_qf', 'setup_cf']:
        p = window(t, .01, .09)
        if p is not None:
            comet(a, name, p)
        p = window(t, .11, .19)
        if p is not None:  # schemas and tables flow back into the foreign catalog
            comet(a, name, p, reverse=True, color=MINT)
    glow_box(a, QF_BOX, RGB[INK], bump(t, .06, .14))
    glow_box(a, CF_BOX, RGB[INK], bump(t, .06, .14))
    grant = bump(t, .2, .3)

    # SQL being typed, with a blinking cursor.
    left = int(TOTAL*min(1, max(0, t/.27)))
    alpha = int(255*fade)
    for k, (value, color) in enumerate(CODE):
        shown = value[:max(0, left)]
        left -= len(value)
        if shown:
            text(66, 266+k*26, shown, 13.5, (*RGB[color], alpha), mono=True, draw=a)
        if 0 < len(shown) < len(value) or (left <= 0 and k == len(CODE)-1):
            if (i // 4) % 2 == 0 and fade > .5:
                cx = 66 + width(shown, 13.5, mono=True) + 2
                a.rectangle((cx*S, (266+k*26)*S, (cx+8)*S, (283+k*26)*S), fill=(255, 207, 102, 220))
            break

    # 4 · query in place: UC checks permissions, then two execution lanes.
    step4 = lit(t, .31, .86, .03)
    if step4:
        draw_step(3, step4, a, layer)
    p = window(t, .3, .38)
    if p is not None:
        comet(a, 'q_left', p)
    glow_box(a, LANE_A, RGB[GOLD], max(bump(t, .37, .5), bump(t, .62, .72)), 14)
    for j, (x, y, w, value) in enumerate(CLAUSES):
        p = window(t, .38 + j*.018, .5 + j*.018)
        if p is None:
            continue
        on = math.sin(math.pi*min(1, p*1.6))
        mix = [int(c0 + (c1-c0)*on) for c0, c1 in zip((74, 38, 41), (255, 207, 102))]
        rect(x, y, w, 26, (*mix, 255), 12, draw=a)
        text(x+11, y+6, value, 12.5, (60, 35, 10, 255) if on > .5 else ROWTXT, True, True, draw=a)
        # Each delegated clause flies to the panel edge on its way to the source.
        q = min(1, max(0, (p-.25)/.75))
        if 0 < q < 1:
            fx = x + w/2 + (860 - x - w/2)*ease(q)
            dot(a, fx, 603 - 15*math.sin(math.pi*q), RGB[GOLD], 4)
    p = window(t, .45, .54)
    if p is not None:
        comet(a, 'q_qf', p)
    p = window(t, .41, .5)
    if p is not None:  # metadata lookup in the external catalog
        comet(a, 'q_cf', p)

    # Sources answer.
    glow_box(a, QF_BOX, RGB[GOLD], bump(t, .52, .66))
    glow_box(a, CF_BOX, RGB[MINT], bump(t, .48, .64))
    p = window(t, .53, .65)
    if p is not None:
        scan(a, layer, QF, p, RGB[GOLD])
    p = window(t, .49, .6)
    if p is not None:
        scan(a, layer, CF, p, RGB[MINT])
        glow_box(a, (956, 680, 1224, 744), RGB[MINT], math.sin(math.pi*p), 12)
    for name, (s0, s1) in [('r_qf', (.62, .71)), ('r_cf', (.57, .66))]:
        p = window(t, s0, s1)
        if p is not None:
            comet(a, name, p)
    # File blocks stream through the lane into Databricks compute.
    glow_box(a, LANE_B, RGB[MINT], bump(t, .62, .8), 14)
    p = window(t, .64, .8)
    if p is not None:
        for j, (x, y) in enumerate(TILES):
            amount = max(0, 1 - abs(p*(len(TILES)+3) - 1 - j)/1.6)
            if amount:
                rect(x, y, 28, 20, (137, 223, 195, int(255*amount)), 5, draw=a)
        pulse = max(0, (p-.7)/.3)
        if pulse:
            glow_box(a, (752, 700, 828, 738), RGB[MINT], math.sin(math.pi*pulse), 10)
    p = window(t, .72, .8)
    if p is not None:
        comet(a, 'r_left', p)

    # Results land, governed end to end.
    grow = ease(min(1, max(0, (t-.78)/.08)))
    if grow and fade:
        for k, (_, share) in enumerate(SEGMENTS):
            w = 146*share*grow
            if w > 4:
                rect(146, 566+k*26, w, 12, (137, 223, 195, int(255*fade)), 6, draw=a)
    glow_box(a, LEFT_BOX, RGB[MINT], bump(t, .77, .95))
    lin = bump(t, .84, .96)
    if lin:
        a.rounded_rectangle((50*S, (LINEAGE_Y-6)*S, 300*S, (LINEAGE_Y+60)*S), radius=10*S,
                            outline=(255, 207, 102, int(220*lin)), width=2*S)
    hot = [grant, bump(t, .8, .9), bump(t, .84, .94), 0]
    if any(hot):
        draw_uc(a, hot)

    frame = Image.alpha_composite(im.convert('RGBA'), layer).convert('RGB')
    frames.append(frame.resize((1280, 960), Image.Resampling.LANCZOS))

PICKS = [8, 22, 40, 52, 60, 66, 76, 86, 100, 112]
palette = Image.new('RGB', (1280, 960*len(PICKS)))
for k, idx in enumerate(PICKS):
    palette.paste(frames[idx], (0, 960*k))
palette = palette.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
indexed[0].save(OUT/'federation-explained.gif', save_all=True, append_images=indexed[1:],
                duration=80, loop=0, optimize=True, disposal=1)
with Image.open(OUT/'federation-explained.gif') as gif:
    assert gif.size == (1280, 960) and gif.n_frames == N
    assert gif.info.get('loop') == 0
    total = 0
    for i in range(gif.n_frames):
        gif.seek(i)
        total += gif.info['duration']
    assert total == 10000
print(f'GIF: {N} frames, 10 s, {(OUT/"federation-explained.gif").stat().st_size/1024/1024:.2f} MiB')
