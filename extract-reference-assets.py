"""Verified individual bounds from generated strips; no fixed-grid cropping."""
from PIL import Image, ImageDraw
from pathlib import Path

jobs=[('assets/sign-table-source.png',[(132,204,827,704),(952,204,1647,704)],['assets/scenery/sign-table-open.png','assets/scenery/sign-table-closed.png'],[296,296]),('assets/counter-reference-source.png',[(34,190,867,634),(892,157,1574,651),(1625,265,2153,646)],['assets/items/fish-reference.png','assets/items/cup-reference.png','assets/items/ice-reference.png'],[296,270,224])]
preview=Image.new('RGB',(5*210,240),'#fff6df');draw=ImageDraw.Draw(preview);i=0
for source,boxes,paths,widths in jobs:
    atlas=Image.open(source).convert('RGBA')
    for box,path,width in zip(boxes,paths,widths):
        sprite=atlas.crop(box);sprite.thumbnail((width,270),Image.Resampling.LANCZOS)
        canvas=Image.new('RGBA',(320,320));canvas.alpha_composite(sprite,((320-sprite.width)//2,304-sprite.height));canvas.save(path)
        assert canvas.getchannel('A').getbbox()
        thumb=canvas.resize((200,200),Image.Resampling.LANCZOS);preview.paste(thumb,(i*210+5,0),thumb);draw.text((i*210+8,210),Path(path).stem,fill='#5b4334');i+=1
preview.save('assets/reference-assets-preview.jpg')
print('5 reference-matched transparent PNGs extracted at verified bounds.')
