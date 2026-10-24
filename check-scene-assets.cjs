const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('scene-layout.js','utf8'),ctx);const layout=vm.runInContext('sceneLayout',ctx);
const assets=[...new Set(layout.roomObjects.flatMap(o=>o.states?Object.values(o.states):[o.asset]))];assert.equal(assets.length,13);
for(const path of [layout.background.asset,...assets]){assert.ok(fs.existsSync(path),'Missing '+path);const bytes=fs.readFileSync(path);assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a','PNG '+path);assert.ok(bytes.readUInt32BE(16)>0&&bytes.readUInt32BE(20)>0,'Dimensions '+path);if(path!==layout.background.asset)assert.ok([4,6].includes(bytes[25])||bytes.includes(Buffer.from('tRNS')),'Transparency '+path);}
console.log('PASS: wall/floor shell and 13 independent transparent scene sprite files.');
