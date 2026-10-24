"""Extract existing generated sprites at verified individual pixel bounds."""
from PIL import Image, ImageOps, ImageDraw
from pathlib import Path
import json

keys = ['fish','cup','house','bag','dog','mouth','ticket','bone','fridge','ghost','ice','lamp','cat','shadow','key','clock','bell','moon','sun','flower','water','seed','bee','honey','mirror','phone','battery','plug','umbrella','cloud','towel','fan','cake','candle','balloon','box','magnet','note','door','soap','sponge','plate','star','light']
bounds = [
 (24,43,208,171),(236,45,386,171),(401,33,554,183),(572,40,703,185),(740,36,893,185),(922,65,1057,174),(1092,40,1221,187),(1264,51,1422,172),
 (46,201,174,375),(214,217,366,370),(396,222,534,363),(577,207,699,370),(736,201,904,376),(930,213,1076,370),(1111,211,1222,369),(1273,202,1410,374),
 (27,408,186,548),(220,402,365,546),(390,388,558,552),(580,389,703,554),(735,406,907,540),(935,398,1061,552),(1096,393,1255,550),(1281,399,1426,548),
 (36,563,173,736),(223,574,340,730),(397,576,480,720),(530,601,710,724),(727,569,893,729),(909,569,1072,723),(1085,588,1257,713),(1279,567,1415,735),
 (31,750,177,898),(239,741,324,898),(388,733,503,913),(547,751,708,887),(738,747,887,898),(927,751,1051,879),(1102,730,1229,891),(1270,764,1420,879),
 (29,918,190,1050),(205,922,372,1048),(393,913,532,1047),(571,906,703,1058)
]
image = Image.open('assets/items-atlas-v1.png').convert('RGBA')
out = Path('assets/items'); out.mkdir(exist_ok=True)
sheet = Image.new('RGB',(8*150,6*175),'#f7eddc'); draw = ImageDraw.Draw(sheet)
for i,(key,box) in enumerate(zip(keys,bounds)):
    sprite=image.crop(box)
    sprite.thumbnail((224,224),Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',(256,256))
    canvas.alpha_composite(sprite,((256-sprite.width)//2,(256-sprite.height)//2))
    canvas.save(out/(key+'.png'))
    assert canvas.getchannel('A').getbbox() is not None
    thumb=canvas.resize((140,140),Image.Resampling.LANCZOS)
    x=(i%8)*150+5; y=(i//8)*175+3
    sheet.paste(thumb,(x,y),thumb)
    draw.text((x+8,y+144),key,fill='#503c35')
sheet.save('assets/items-preview.jpg')
(out/'bounds.json').write_text(json.dumps(dict(zip(keys,bounds)),indent=2))
print(f'Extracted and checked {len(keys)} transparent PNGs; preview: assets/items-preview.jpg')
