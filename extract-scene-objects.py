"""Extract individually verified generated room objects; maintain true aspect ratios."""
from PIL import Image, ImageDraw
from pathlib import Path
import json

names=['entry-door-closed','entry-door-open','pendant-on','pendant-off','barista','service-counter','stool','espresso-machine','pastry-case','floor-plant','trailing-vine','flower-vase']
boxes=[(104,2,320,392),(435,2,689,396),(806,2,1006,398),(1172,2,1366,378),(16,397,352,737),(365,421,812,720),(854,431,1084,726),(1142,430,1428,745),(76,750,361,1078),(468,724,705,1080),(818,724,1028,1086),(1174,802,1366,1051)]
source=Image.open('assets/room-objects-source.png').convert('RGBA');out=Path('assets/scene');out.mkdir(exist_ok=True)
preview=Image.new('RGB',(4*220,4*245),'#fff6df');draw=ImageDraw.Draw(preview)
for i,(name,box) in enumerate(zip(names,boxes)):
    sprite=source.crop(box)
    sprite.save(out/(name+'.png'))
    assert sprite.getchannel('A').getextrema()[0]==0
    thumb=sprite.copy();thumb.thumbnail((205,205),Image.Resampling.LANCZOS)
    x=i%4*220+(220-thumb.width)//2;y=i//4*245+205-thumb.height
    preview.paste(thumb,(x,y),thumb);draw.text((i%4*220+8,i//4*245+212),name,fill='#5b4334')
counter=Image.open('assets/foreground-counter-source.png').convert('RGBA')
box=counter.getchannel('A').point(lambda a:255 if a>20 else 0).getbbox()
box=(box[0],box[1],box[2],min(box[3],575))  # Retain a small fascia, matching the reference counter proportions.
counter=counter.crop(box);counter.save(out/'foreground-counter.png')
thumb=counter.copy();thumb.thumbnail((860,200),Image.Resampling.LANCZOS);preview.paste(thumb,((880-thumb.width)//2,3*245),thumb);draw.text((8,3*245+212),'foreground-counter',fill='#5b4334')
(out/'bounds.json').write_text(json.dumps(dict(zip(names,boxes)),indent=2))
preview.save('assets/scene-objects-preview.jpg')
print('13 standalone PNG state assets extracted; architecture remains separate.')
