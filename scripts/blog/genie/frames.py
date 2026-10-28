"""Original Genie infographic, English, 1280x960 / 80 frames / 8-second loop.
Source artwork: community Databricks Architecture Icons; see adjacent SOURCES.md.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import math, sys, os
ROOT, TEMP = map(Path, sys.argv[1:3])
OUT = ROOT/'public/images/blog/databricks-genie'
OUT.mkdir(parents=True, exist_ok=True)
S=2
F=Path('/System/Library/Fonts/Supplemental')
# Override for rendering on a different OS; use metrically compatible sans fonts.
REG=os.environ.get('GENIE_FONT_REGULAR',str(F/'Arial.ttf'))
BOLD=os.environ.get('GENIE_FONT_BOLD',str(F/'Arial Bold.ttf'))
BG='#081B20'; CARD='#193A44'; INK='#FAF9F6'; MUTED='#AEC4C9'; RED='#FF3621'; GOLD='#FFCF66'
im=Image.new('RGB',(1280*S,960*S),BG); d=ImageDraw.Draw(im)
def font(size,bold=False): return ImageFont.truetype(BOLD if bold else REG,int(size*S))
def text(x,y,t,size=18,color=INK,bold=False): d.text((x*S,y*S),t,font=font(size,bold),fill=color)
def rect(x,y,w,h,fill,r=18,outline=None,width=1):
 d.rounded_rectangle((x*S,y*S,(x+w)*S,(y+h)*S),radius=r*S,fill=fill,outline=outline,width=width*S)
def line(points,fill,width=2): d.line([(x*S,y*S) for x,y in points],fill=fill,width=width*S,joint='curve')
def icon(name,x,y,size=38,tint=None):
 logo=Image.open(TEMP/(name+'.png')).convert('RGBA').resize((size*S,size*S),Image.Resampling.LANCZOS)
 if tint:
  mask=logo.getchannel('A');logo=Image.new('RGBA',logo.size,tint);logo.putalpha(mask)
 im.paste(logo,(x*S,y*S),logo)
def badge(x,y,label,w=None,fill='#102C34',color=INK):
 w=w or int(d.textlength(label,font=font(14,True))/S)+24
 rect(x,y,w,29,fill,14);text(x+12,y+6,label,14,color,True)
def label(x,y,t): text(x,y,t,13,MUTED,True)
def arrow(x,y,color=GOLD):
 d.polygon([(x*S,y*S),((x-7)*S,(y-4)*S),((x-7)*S,(y+4)*S)],fill=color)
# Quiet dotted texture and original editorial branding.
for x in range(20,1280,40):
 for y in range(20,960,40): d.ellipse((x*S,y*S,(x+1)*S,(y+1)*S),fill='#173039')
icon('genie',39,32,48);text(100,32,'Databricks Genie, explained',39,INK,True)
text(101,84,'One governed foundation. Three ways to work with data and AI.',20,MUTED)
rect(1130,39,110,28,'#203C43',14);text(1146,46,'OCT 2026',12,INK,True)
label(40,137,'WHO USES IT');label(338,137,'THE GENIE FAMILY');label(1007,137,'WHAT YOU GET')
# Connectors behind cards.
paths=[[(270,245),(290,245),(310,253),(338,253)],[(270,413),(292,413),(306,472),(338,472)],[(270,590),(289,590),(289,690),(790,690),(790,657)],[(942,251),(965,251),(982,249),(1004,249)],[(481,657),(481,690),(978,690),(978,423),(1004,423)],[(942,589),(967,589),(983,588),(1004,588)]]
for pts in paths: line(pts,'#745134',3)
# Left column: personas.
for y,n,title,desc in [(169,'01','Business teams',['Ask questions','Explore dashboards','Use business apps']), (338,'02','Data experts',['Define metrics','Curate business rules','Test trusted answers']), (507,'03','Developers',['Build data products','Debug and optimize','Review generated code'])]:
 rect(40,y,230,151,CARD)
 badge(56,y+16,n,36,fill='#2C505B',color=GOLD)
 text(104,y+20,title,20,INK,True)
 for j,t in enumerate(desc): text(58,y+60+j*23,t,17,MUTED)
# Genie family container and cards.
rect(318,161,644,515,'#32171C',24)
rect(338,179,604,150,RED,20)
icon('genie-one',357,194,38,tint=INK);text(406,195,'Genie One',29,INK,True)
badge(754,198,'BUSINESS EXPERIENCE',166,fill='#B82718')
text(360,239,'Ask → discover → explore',22,INK,True)
text(360,273,'Chat, dashboards and Databricks Apps',18)
text(360,301,'Previously Databricks One',14,'#FFE1D8')
# Semantic handoff, intentionally not a mandatory topology claim.
line([(490,330),(490,347)],'#EAB7A7',3);d.polygon([(486*S,343*S),(494*S,343*S),(490*S,350*S)],fill='#EAB7A7')
rect(338,352,286,305,'#ED3B25',18)
icon('genie-agents',355,368,38,tint=INK);text(400,373,'Genie Agents',24,INK,True)
text(356,419,'Trusted domain context',18,INK,True)
for i,t in enumerate(['Curated data + definitions','SQL examples + instructions','SQL results + visualizations']):text(356,452+i*28,t,16)
rect(354,548,254,57,'#AD281B',12)
text(369,560,'“Revenue by region?”',17,INK,True);text(369,584,'Question → SQL → answer',14,'#FFE1D8')
text(357,624,'Previously Genie Spaces',14,'#FFE1D8')
rect(646,352,296,305,CARD,18)
icon('genie-code',663,368,38);text(708,373,'Genie Code',26,INK,True)
text(664,419,'AI partner for data teams',18,INK,True)
for i,t in enumerate(['Notebooks + SQL + pipelines','Build, explain and fix code','Review → run → improve']):text(664,452+i*28,t,16,MUTED)
rect(662,548,264,57,'#0B242D',12)
text(676,560,'Plan  /  Code  /  Validate',17,'#89DFC3',True)
text(676,584,'Use your workspace context',14,MUTED)
text(664,624,'Technical work inside Databricks',14,MUTED)
# Right column: outputs.
rect(1004,169,236,160,CARD);text(1022,187,'Answers & actions',20,INK,True)
text(1022,218,'Business-ready insights',16,MUTED)
# Chart baseline (animated bars layered later).
line([(1025,299),(1217,299)],'#50727C',2)
for j,h in enumerate([25,42,33,55,48]): rect(1031+j*36,296-h,22,h,GOLD,4)
rect(1004,352,236,140,CARD);text(1022,370,'Trusted analytics',20,INK,True)
text(1022,407,'Queries • tables • charts',16,MUTED)
text(1022,439,'Business definitions',16,MUTED)
rect(1004,515,236,142,CARD);text(1022,533,'Data products',20,INK,True)
text(1022,569,'Pipelines • dashboards',16,MUTED)
text(1022,599,'Notebooks • ML workflows',16,MUTED)
# Foundation: cream governance strip, open data below.
rect(40,709,1200,73,'#F6F3EC',18)
icon('unity-catalog',58,726,39);text(108,727,'Unity Catalog',24,'#142E36',True)
for x,t,w in [(328,'Permissions',142),(484,'Business context',180),(678,'Governed data',166),(858,'Trusted access',164)]:badge(x,731,t,w,fill=RED)
text(1041,737,'Across experiences',15,'#36545E',True)
rect(40,800,1200,105,'#122D35',18)
for x,title,body,body2 in [(60,'AI USAGE','Genie LLM consumption','Usage-based DBUs'),(462,'EXECUTION COMPUTE','SQL warehouses and jobs','Billed separately'),(866,'COST CONTROLS','Unity Gateway budgets','Monitor system.billing.usage')]:
 label(x,817,title);text(x,844,body,18,INK,True);text(x,874,body2,16,MUTED)
line([(440,819),(440,884)],'#36545E');line([(844,819),(844,884)],'#36545E')
icon('databricks',41,924,25);text(76,923,'Databricks ecosystem',17,INK,True)
text(730,925,'Daniel DataShow  ·  Names verified 28 Oct 2026',14,MUTED)
base=im.resize((1280,960),Image.Resampling.LANCZOS).convert('RGBA')
base.convert('RGB').save(ROOT/'src/assets/genie-explained.png',optimize=True)
base.convert('RGB').save(OUT/'genie-explained.png',optimize=True)
# Continuous packet motion, progressive chart bars, and a quiet active-surface pulse.
frames=[]
def at_path(pts,t):
 lengths=[math.dist(a,b) for a,b in zip(pts,pts[1:])];v=t*sum(lengths)
 for a,b,l in zip(pts,pts[1:],lengths):
  if v<=l: return a[0]+(b[0]-a[0])*v/l,a[1]+(b[1]-a[1])*v/l
  v-=l
 return pts[-1]
for i in range(80):
 fr=base.copy();layer=Image.new('RGBA',fr.size);a=ImageDraw.Draw(layer)
 for k,pts in enumerate(paths):
  for offset in [0,.5]:
   x,y=at_path(pts,(i/40+offset+k*.12)%1)
   for r,alpha in [(13,12),(9,25),(5,60),(2.5,255)]:a.ellipse((x-r,y-r,x+r,y+r),fill=(255,211,126,alpha))
 phase=(i//27)%3
 box=[(338,179,942,329),(338,352,624,657),(646,352,942,657)][phase]
 alpha=int(110+80*math.sin(math.pi*(i%27)/27))
 a.rounded_rectangle(box,radius=20,outline=(255,237,199,alpha),width=2)
 a.rectangle((1025,238,1218,297),fill=(25,58,68,255))
 for j,h in enumerate([25,42,33,55,48]):
  scale=.72+.28*(.5+.5*math.sin(2*math.pi*i/80-j*.45))
  x=1031+j*36;a.rounded_rectangle((x,296-h*scale,x+22,296),radius=4,fill=(255,207,102,255))
 fr=Image.alpha_composite(fr,layer).convert('RGB')
 frames.append(fr)
# A single palette prevents flickering in text and panels; delta optimization limits file size.
palette=frames[0].quantize(colors=192,method=Image.Quantize.MEDIANCUT)
indexed=[f.quantize(palette=palette,dither=Image.Dither.NONE) for f in frames]
indexed[0].save(OUT/'genie-explained.gif',save_all=True,append_images=indexed[1:],duration=100,loop=0,optimize=True,disposal=1)
gif=Image.open(OUT/'genie-explained.gif')
assert gif.n_frames==80 and gif.size==(1280,960)
assert gif.info.get('loop')==0
print(f'GIF: {gif.n_frames} frames, 8 s, {(OUT/"genie-explained.gif").stat().st_size/1024/1024:.2f} MiB')
