"""Original LTAP infographic: English, 1280x960, 100 frames, 10-second loop.

Code-native artwork matching the Genie palette and typography. No source GIF
frames reused. See SOURCES.md for capability scope and artwork attribution.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math
import os
import sys

ROOT, TEMP = map(Path, sys.argv[1:3])
OUT = ROOT / 'public/images/blog/databricks-ltap'
OUT.mkdir(parents=True, exist_ok=True)
S = 2
F = Path('/System/Library/Fonts/Supplemental')
REG = os.environ.get('LTAP_FONT_REGULAR', str(F / 'Arial.ttf'))
BOLD = os.environ.get('LTAP_FONT_BOLD', str(F / 'Arial Bold.ttf'))
BG, CARD, INK, MUTED = '#081B20', '#193A44', '#FAF9F6', '#AEC4C9'
RED, GOLD, MINT = '#FF3621', '#FFCF66', '#89DFC3'
im = Image.new('RGB', (1280*S, 960*S), BG)
d = ImageDraw.Draw(im)
def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REG, int(size*S))
def text(x, y, value, size=18, color=INK, bold=False):
    # Guard against text silently leaving the canvas.
    assert x + d.textlength(value, font=font(size, bold))/S <= 1250, value
    d.text((x*S, y*S), value, font=font(size, bold), fill=color)
def rect(x, y, w, h, fill, r=18, outline=None):
    d.rounded_rectangle((x*S, y*S, (x+w)*S, (y+h)*S), radius=r*S, fill=fill, outline=outline, width=2*S)
def line(points, color='#745134', width=3):
    d.line([(x*S, y*S) for x,y in points], fill=color, width=width*S, joint='curve')
def arrow(x, y, direction='right', color=GOLD):
    pts = {'right': [(0,0),(-7,-4),(-7,4)], 'down': [(0,0),(-4,-7),(4,-7)],
           'up': [(0,0),(-4,7),(4,7)], 'left': [(0,0),(7,-4),(7,4)]}[direction]
    d.polygon([((x+a)*S, (y+b)*S) for a,b in pts], fill=color)
def label(x, y, value):
    text(x, y, value, 13, MUTED, True)
def badge(x, y, value, fill='#102C34', color=INK):
    w = d.textlength(value, font=font(12, True))/S + 22
    rect(x,y,w,25,fill,12)
    text(x+11,y+6,value,12,color,True)
def icon(name,x,y,size=34):
    logo = Image.open(TEMP / (name+'.png')).convert('RGBA').resize((size*S,size*S), Image.Resampling.LANCZOS)
    im.paste(logo,(x*S,y*S),logo)

for x in range(20,1280,40):
    for y in range(20,960,40):
        d.ellipse((x*S,y*S,(x+1)*S,(y+1)*S), fill='#173039')
icon('databricks',40,38,39)
text(96,32,'Databricks LTAP, explained',39,INK,True)
text(97,84,'Applications + analytics. Shared storage. Purpose-built engines.',20,MUTED)
badge(1130,40,'OCT 2026',fill='#203C43')
label(40,134,'USER EXPERIENCE')
label(300,134,'APPLICATION RUNTIME')
label(600,134,'TRANSACTIONS / OLTP')
label(940,134,'ANALYTICS / OLAP')

# Paths are drawn behind panels. Gold is operational / analytical data;
# mint is the separate, managed serving path back to application reads.
paths = [
    ([(260,252),(300,252)], GOLD),
    ([(560,252),(600,252)], GOLD),
    ([(740,330),(740,370)], GOLD),
    ([(1090,370),(1090,330)], GOLD),
    ([(650,502),(650,530),(220,530),(220,568)], GOLD),
    ([(400,630),(450,630)], GOLD),
    ([(810,630),(860,630)], MINT),
    ([(1220,568),(1220,535),(909,535),(909,284),(880,284)], MINT),
]
for pts,color in paths:
    line(pts, '#365B56' if color==MINT else '#745134')

rect(40,172,220,158,CARD)
badge(58,187,'01  USE')
icon('databricks-apps',202,187,34)
text(58,224,'Business app',22,INK,True)
text(58,259,'Orders / support',17,MUTED)
text(58,286,'Web / mobile / agent',16,MUTED)

rect(300,172,260,158,CARD)
badge(318,187,'02  VALIDATE')
icon('python',466,186,32)
icon('nodejs',510,185,34)
text(318,224,'Backend / API',24,INK,True)
text(318,259,'Python / Node.js',17,INK,True)
text(318,286,'Databricks Apps or external',16,MUTED)

rect(600,172,280,158,RED)
badge(618,187,'03  READ / WRITE',fill='#B82718')
rect(818,187,46,54,'#FAF9F6',10)
icon('postgresql',823,195,36)
text(618,224,'Lakebase',29,INK,True)
text(618,263,'Postgres transactions',19)
text(618,293,'App-owned tables + SQL drivers',16)

rect(940,172,300,158,CARD)
icon('sql-warehouse',958,186,30)
text(1000,190,'Lakehouse',25,INK,True)
text(958,232,'SQL / notebooks / dashboards',17,MUTED)
text(958,264,'Live Lakebase via RT',18,INK,True)
badge(958,295,'PRIVATE PREVIEW',color=GOLD)

# Backend responsibilities remain visibly outside the database.
rect(40,370,514,132,CARD)
text(60,387,'Your backend keeps its job',24,INK,True)
text(60,426,'Business rules, APIs and service integrations',18,MUTED)
text(60,459,'Lakebase stores state. Apps hosts app code.',18,MINT,True)

rect(600,370,640,132,'#32171C',22)
text(620,386,'LTAP  /  SHARED STORAGE FOUNDATION',21,INK,True)
text(620,423,'WAL durability → pageservers → columnar Parquet',18,'#FFE1D8')
text(620,453,'Delta / Iceberg • one logical dataset • physical caches',17,MUTED)
text(620,480,'Storage transcoding ≠ business transformation',15,GOLD,True)

label(40,545,'OPTIONAL CHANGE HISTORY')
label(450,545,'DATA ENGINEERING STILL BUILDS')
label(860,545,'LAKEHOUSE → APPLICATION READS')
rect(40,568,360,139,CARD)
text(58,586,'Lakebase CDF',24,INK,True)
badge(244,590,'PUBLIC PREVIEW',color=GOLD)
text(58,626,'Row changes → Delta history',18,MUTED)
text(58,660,'Downstream pipelines / audit',17,MUTED)

rect(450,568,360,139,CARD)
text(468,586,'ETL / ELT + models',24,INK,True)
text(468,626,'Quality • joins • business metrics',18,MUTED)
text(468,660,'Silver / gold / recommendations',17,MUTED)

rect(860,568,380,139,'#163D3A')
text(878,586,'Synced tables',24,INK,True)
badge(1124,590,'GA',color=MINT)
text(878,626,'Managed copy + sync to Postgres',18,MUTED)
text(878,658,'Direct Writes: faster bulk loads',16,MUTED)
badge(1136,655,'BETA',color=GOLD)

# Explicitly separate governance scopes, matching current documentation.
rect(40,735,1200,75,'#F6F3EC')
icon('unity-catalog',58,753,37)
text(108,749,'Unity Catalog',23,'#142E36',True)
text(108,781,'Registered analytical access',15,'#36545E')
line([(492,750),(492,794)],'#CBD2CD',2)
text(520,750,'Postgres roles + GRANT / REVOKE',22,'#142E36',True)
text(520,781,'Direct database connections • separate permissions',16,'#36545E')

for x,w,title,body in [
    (40,380,'LTAP IS AN ARCHITECTURE','Adopt capabilities by workload.'),
    (438,382,'BACKEND + TRANSFORMS STAY','Simplify the data-copying bridge.'),
    (838,402,'CHECK EACH CAPABILITY','Cloud, region and preview access.')]:
    rect(x,830,w,76,'#122D35',16)
    text(x+16,845,title,16,INK,True)
    text(x+16,875,body,16,MUTED)
icon('databricks',41,927,23)
text(77,926,'Daniel DataShow',16,INK,True)
text(408,928,'Conceptual flows • AWS status checked 28 Oct 2026 • not a latency SLA',14,MUTED)

for pts,color in paths:
    x,y=pts[-1]
    px,py=pts[-2]
    direction=('right' if x>px else 'left') if x!=px else ('down' if y>py else 'up')
    arrow(x,y,direction,color)

base = im.resize((1280,960),Image.Resampling.LANCZOS).convert('RGBA')
base.convert('RGB').save(ROOT/'src/assets/ltap-explained.png',optimize=True)
base.convert('RGB').save(OUT/'ltap-explained.png',optimize=True)

def at_path(pts,t):
    lengths=[math.dist(a,b) for a,b in zip(pts,pts[1:])]
    v=t*sum(lengths)
    for a,b,length in zip(pts,pts[1:],lengths):
        if v<=length:
            return a[0]+(b[0]-a[0])*v/length,a[1]+(b[1]-a[1])*v/length
        v-=length
    return pts[-1]

frames=[]
for i in range(100):
    layer=Image.new('RGBA',base.size)
    a=ImageDraw.Draw(layer)
    for k,(pts,color) in enumerate(paths):
        rgb=(137,223,195) if color==MINT else (255,207,102)
        for offset in [0,.5] if len(pts)>2 else [0]:
            x,y=at_path(pts,(i/50+offset+k*.13)%1)
            for radius,alpha in [(11,15),(7,40),(3,255)]:
                a.ellipse((x-radius,y-radius,x+radius,y+radius),fill=(*rgb,alpha))
    for k,box in enumerate([(300,172,560,330),(600,172,880,330),(600,370,1240,502),(940,172,1240,330)]):
        alpha=int(28+90*max(0,math.cos(2*math.pi*i/100-k*math.pi/2))**4)
        a.rounded_rectangle(box,radius=18,outline=(255,237,199,alpha),width=2)
    frames.append(Image.alpha_composite(base,layer).convert('RGB'))

palette=frames[0].quantize(colors=192,method=Image.Quantize.MEDIANCUT)
indexed=[frame.quantize(palette=palette,dither=Image.Dither.NONE) for frame in frames]
indexed[0].save(OUT/'ltap-explained.gif',save_all=True,append_images=indexed[1:],duration=100,loop=0,optimize=True,disposal=1)
with Image.open(OUT/'ltap-explained.gif') as gif:
    assert gif.size==(1280,960) and gif.n_frames==100
    assert gif.info.get('loop')==0
    total=0
    for i in range(gif.n_frames):
        gif.seek(i)
        total+=gif.info['duration']
    assert total==10000
print(f'GIF: 100 frames, 10 s, {(OUT/"ltap-explained.gif").stat().st_size/1024/1024:.2f} MiB')
