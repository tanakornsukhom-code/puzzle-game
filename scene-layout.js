// Normalized scene graph: one editable location for artwork, bounds and layers.
const sceneLayout=Object.freeze({
  background:{id:'room-shell',name:'ผนังและพื้นคาเฟ่',asset:'assets/room-shell-v6.png',state:'idle',x:0,y:0,w:100,h:100,z:0,interactive:false,role:'architecture'},
  ratio:[1142,1377],
  layers:{fixture:2,curtain:3,actor:3,prop:5,control:11},
  fixtures:{curtain:[3,2,33,25],window:[4,3,31,24],frame:[88,16,11,10],shelf:[65,5,23,21],cushion:[65,53,31,14],floor:[40,61,18,7],sign:[26,33,12,9],switch:[88,26,11,8]},
  actors:{cat:[66,38.5,28,21],dog:[8,44,23,16],ghost:[8,44,23,16],mouth:[14,48,14,10],shadow:[11,44,18,16],dogTicket:[15,52,12,8]},
  counter:{large:{x:[5,36,67],y:[73],w:28,h:17},compact:{x:[3,27,51,75],y:[72,85],w:20,h:12}},
  roomObjects:[
    {id:'entry-door',name:'ประตูทางเข้า',asset:'assets/scene/entry-door-closed.png',states:{closed:'assets/scene/entry-door-closed.png',open:'assets/scene/entry-door-open.png'},state:'closed',x:38,y:12,w:27,h:47,z:1,interactive:true,role:'architecture'},
    {id:'pendant',name:'โคมไฟเพดาน',asset:'assets/scene/pendant-on.png',states:{on:'assets/scene/pendant-on.png',off:'assets/scene/pendant-off.png'},state:'on',x:34,y:0,w:13,h:12,z:2,interactive:true,role:'fixture'},
    {id:'barista',name:'ชิบะบาริสต้า',asset:'assets/scene/barista.png',state:'idle',x:6,y:24,w:22,h:17,z:2,interactive:false,role:'actor'},
    {id:'service-counter',name:'เคาน์เตอร์บริการ',asset:'assets/scene/service-counter.png',state:'idle',x:1,y:40,w:39,h:28,z:3,interactive:false,role:'decor',fit:'fill',position:'bottom'},
    {id:'stool',name:'เก้าอี้บาริสต้า',asset:'assets/scene/stool.png',state:'idle',x:15,y:48,w:18,h:19,z:4,interactive:false,role:'decor',fit:'contain',position:'bottom'},
    {id:'espresso-machine',name:'เครื่องชงกาแฟ',asset:'assets/scene/espresso-machine.png',state:'idle',x:0,y:26,w:9,h:14,z:1,interactive:true,role:'fixture'},
    {id:'pastry-case',name:'ตู้ขนม',asset:'assets/scene/pastry-case.png',state:'idle',x:0,y:38,w:8,h:24,z:4,interactive:false,role:'decor',fit:'cover',position:'right bottom'},
    {id:'floor-plant',name:'ต้นไม้ประจำร้าน',asset:'assets/scene/floor-plant.png',state:'idle',x:92,y:38,w:8,h:22,z:2,interactive:false,role:'decor',fit:'contain',position:'bottom'},
    {id:'trailing-vine',name:'เถาไม้เลื้อย',asset:'assets/scene/trailing-vine.png',state:'idle',x:63,y:4,w:19,h:32,z:1,interactive:false,role:'decor',fit:'contain',position:'bottom'},
    {id:'flower-vase',name:'แจกันดอกไม้',asset:'assets/scene/flower-vase.png',state:'idle',x:0,y:24,w:7,h:5,z:2,interactive:false,role:'decor',fit:'contain',position:'bottom'},
    {id:'foreground-counter',fit:'fill',name:'เคาน์เตอร์ออเดอร์',asset:'assets/scene/foreground-counter.png',state:'idle',x:0,y:67.5,w:100,h:32.5,z:3,interactive:false,role:'decor',position:'bottom'}
  ]
});
