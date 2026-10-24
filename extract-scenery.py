"""Extract verified state bounds, preserving a common scale within each pair."""
from PIL import Image, ImageDraw
from pathlib import Path
import json

names=['window-closed','window-open','curtain-closed','curtain-open','frame-closed','frame-open','cushion-closed','cushion-open','shelf-closed','shelf-open','floor-closed','floor-open','sign-open','sign-closed','switch-off','switch-on','fridge-closed','fridge-open','box-closed','box-open']
bounds=[(33,76,264,284),(293,71,544,283),(566,69,822,287),(841,69,1103,288),(57,329,230,534),(288,328,517,550),(573,390,809,550),(856,323,1082,545),(37,585,247,797),(282,584,548,797),(566,633,822,788),(847,596,1095,795),(46,838,269,1062),(332,839,566,1062),(647,879,800,1060),(899,880,1046,1057),(49,1111,233,1341),(283,1109,556,1340),(587,1147,796,1332),(827,1124,1110,1341)]
source=Image.open('assets/scenery-atlas-v2.png').convert('RGBA')
out=Path('assets/scenery');out.mkdir(exist_ok=True)
preview=Image.new('RGB',(4*220,5*245),'#f8edd8');draw=ImageDraw.Draw(preview)
for pair in range(0,len(names),2):
    crops=[source.crop(b) for b in bounds[pair:pair+2]]
    scale=288/max(max(c.size) for c in crops)
    for offset,crop in enumerate(crops):
        i=pair+offset
        size=tuple(round(v*scale) for v in crop.size)
        crop=crop.resize(size,Image.Resampling.LANCZOS)
        canvas=Image.new('RGBA',(320,320))
        canvas.alpha_composite(crop,((320-crop.width)//2,304-crop.height))
        canvas.save(out/(names[i]+'.png'))
        thumb=canvas.resize((210,210),Image.Resampling.LANCZOS)
        x=i%4*220+5;y=i//4*245+4
        preview.paste(thumb,(x,y),thumb);draw.text((x+5,y+215),names[i],fill='#503c35')
        assert canvas.getchannel('A').getbbox()
(out/'bounds.json').write_text(json.dumps(dict(zip(names,bounds)),indent=2))
preview.save('assets/scenery-preview.jpg')
print('20 transparent state PNGs extracted; paired scale and baseline preserved.')
