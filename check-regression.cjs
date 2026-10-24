const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let all=[];class El{constructor(){this.dataset={};this.style={};this.attrs={};this.children=[];this.listeners={};this.rect={left:0,top:0,right:100,bottom:100,width:100,height:100};this.classList={add(){},remove(){},toggle(){}}}setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]}append(e){this.children.push(e);all.push(e)}replaceChildren(){for(const e of this.children)all=all.filter(x=>x!==e);this.children=[]}remove(){all=all.filter(x=>x!==this)}addEventListener(type,fn){this.listeners[type]=fn}getBoundingClientRect(){return this.rect}setPointerCapture(id){this.capture=id}hasPointerCapture(id){return this.capture===id}releasePointerCapture(){this.capture=null}showModal(){this.open=true}close(){this.open=false}}
const ids={};const document={querySelector(s){if(s.startsWith('#'))return ids[s]??=new El();const m=s.match(/data-type="(.*?)"/);return m?all.find(e=>e.dataset.type===m[1]):null},querySelectorAll(s){return s==='.obj'?all:[]},createElement(){return new El()}};
const timers=new Map();let timerId=0;const ctx=vm.createContext({document,localStorage:{getItem(){},setItem(){}},window:{},Image:class{},setTimeout(fn){timers.set(++timerId,fn);return timerId},clearTimeout(id){timers.delete(id)},console});vm.runInContext(fs.readFileSync('game.js','utf8'),ctx);
vm.runInContext(`muted=true;const find=t=>$('[data-type="'+t+'"]');
load(5);advance('tap','curtain');$('#hint').onclick();if(!won||!$('#toast').textContent.includes('สำเร็จ'))throw Error('QA-01 solved hint');
load(23);advance('tap','window');advance('swipe','floor');advance('tap','shelf');interact(find('towel'),find('ticket'));find('ticket').closest=()=>find('ticket');$('#objects').listeners.click({detail:0,target:find('ticket')});if(selected!==find('ticket'))throw Error('QA-02 ticket not selectable');find('sign').closest=()=>find('sign');$('#objects').listeners.click({detail:0,target:find('sign')});if(!won)throw Error('QA-02 tap solution blocked');
load(2);tap(find('dog'));tap(find('ticket'));if(selected)throw Error('Legacy ticket gate removed');
load(0);const held={id:1,b:find('fish')};drag=held;release({pointerId:2},true);if(drag!==held)throw Error('QA-03 foreign pointer released drag');drag=null;
load(0);const fish=find('fish'),cup=find('cup');fish.closest=()=>fish;
$('#objects').listeners.pointerdown({target:fish,button:0,pointerId:1,clientX:1,clientY:1});const owned=drag;
$('#objects').listeners.pointerdown({target:fish,button:0,pointerId:2,clientX:2,clientY:2});if(drag!==owned)throw Error('QA-03 secondary down stole drag');
release({pointerId:2},true);if(drag!==owned)throw Error('QA-03 secondary cancel');release({pointerId:1},true);if(drag||fish.style.left!=='16%')throw Error('QA-03 owner cancel');
interact(fish,cup);if(successTimer===null)throw Error('QA-04 timer missing');load(1);if(successTimer!==null)throw Error('QA-04 load retained timer');
load(0);interact(find('fish'),find('cup'));menu();if(successTimer!==null)throw Error('QA-04 menu retained timer');
load(22);if(find('curtain').dataset.sceneState!=='open')throw Error('QA-05 initial curtain');advance('tap','curtain');if(find('curtain').dataset.sceneState!=='closed')throw Error('QA-05 curtain close');
load(5);if(find('curtain').dataset.sceneState!=='closed')throw Error('QA-05 initial closed curtain');advance('tap','curtain');if(find('curtain').dataset.sceneState!=='open')throw Error('QA-05 curtain open');
load(26);if(find('sign').dataset.sceneState!=='open')throw Error('QA-05 sign initial');advance('swipe','sign');if(find('sign').dataset.sceneState!=='closed')throw Error('QA-05 sign close');
load(10);interact(find('towel'),find('mirror'));if(!$('#toast').textContent.includes('มืด'))throw Error('QA-06 blocked reason');
load(16);interact(find('key')||{dataset:{type:'key'}},find('door'));if(!$('#toast').textContent.includes('หวง'))throw Error('QA-06 key gate reason');
// Illustrated fixture state changes are visual inspections, never repeated puzzle rewards.
load(6);if(Object.keys(sceneryNames).some(t=>!find(t)))throw Error('Fixture missing from set dressing');
const initialFrame=find('frame').innerHTML;advance('tap','frame');if(!find('frame').innerHTML.includes('frame-open.png'))throw Error('Frame image did not open');
const reached=stage;tap(find('frame'));if(stage!==reached||!find('frame').innerHTML.includes('frame-closed.png'))throw Error('Inspection repeated puzzle step');
tap(find('frame'));if(stage!==reached||document.querySelectorAll('.obj').filter(b=>b.dataset.type==='ticket').length!==1)throw Error('Inspection duplicated reward');
load(6);if(find('frame').innerHTML!==initialFrame)throw Error('Reset failed illustrated initial state');
load(3);if(!find('fridge').innerHTML.includes('fridge-closed.png'))throw Error('Initial fridge art');tap(find('fridge'));if(stage!==1||!find('fridge').innerHTML.includes('fridge-open.png'))throw Error('Fridge reveal art');tap(find('fridge'));if(stage!==1||document.querySelectorAll('.obj').filter(b=>b.dataset.type==='ghost').length!==1)throw Error('Fridge repeated reveal');
load(21);advance('tap','frame');advance('tap','cushion');const box=find('box');interact(find('cat'),box);if(box.dataset.sceneState!=='closed')throw Error('Wrong action opened box');interact(find('key'),box);if(box.dataset.sceneState!=='open'||!box.innerHTML.includes('box-open.png'))throw Error('Key did not open box art');
load(27);advance('tap','curtain');interact(find('lamp'),find('frame'));if(find('frame').dataset.sceneState!=='open'||find('frame').dataset.clue!=='floor')throw Error('Frame pair clue missing');
// At equal hit coordinates, the visible item layer wins over later-added scenery.
load(20);const water=add('water',40,74,'น้ำฝน'),flower=find('flower');stage=2;drag={id:7,b:water,left:40,top:74,moved:true};release({pointerId:7,clientX:50,clientY:50});if(!won)throw Error('Drop priority chose scenery over flower');
`,ctx);
assert.equal(timers.size,1);
console.log('PASS: hints, ticket taps, multitouch events, success timer cleanup, scenery states, fair feedback and item drop priority.');
