# QA round 1 — 2026-10-24

ขอบเขต: เกม 30 ด่าน, JavaScript input/state, การโต้ตอบฉาก, ความยากตาม LEVEL-DESIGN.md และต้นทุนภาพ

## Requests จาก Tester

| ID | ระดับ | เจ้าของ | ปัญหา / เกณฑ์รับงาน | สถานะ |
|---|---|---|---|---|
| QA-01 | P2 | Dev | คำใบ้หลังชนะอ่าน step ที่ไม่มี; ต้องไม่เกิด exception ทั้ง 30 ด่าน | Verified — solved hint guard |
| QA-02 | P1 | Dev | เมนูกระดาษทุกด่านถูกเงื่อนไขชิบะบล็อก; ด่าน 24 ต้องจบด้วยแตะ/คีย์บอร์ดได้ | Verified — tap/keyboard paths |
| QA-03 | P2 | Dev + Optimizer review | up/cancel นิ้วอื่นจบการลาก; ต้องรักษา pointer owner และกัน pointerdown ซ้อน | Verified — pointer ownership regression |
| QA-04 | P2 | Dev | success timer อ้าง index ใหม่หลังเปลี่ยนด่าน; ยกเลิก callback เก่าหรือ guard session | Verified — timer cancellation regression |
| QA-05 | P2 | Dev + Optimizer | state ภาพม่าน หน้าต่าง ป้ายไม่ตรง action เปิด/ปิด; ต้องมีสถานะที่ตรงข้อความและ reset ได้ | Verified source/state/CSS; rendered visuals Pending |
| QA-06 | P2 candidate | Dev | ลำดับบางขั้นเป็นอิสระแต่บังคับตาม script; เพิ่มเหตุผล/เบาะแสก่อนปฏิเสธ ไม่อ้าง Flow ผ่านจนมี playtest | Fixed/Verified contextual clues; human playtest Pending |
| QA-07 | P2 | Dev tests + Tester | ขาด event/timer/state/migration assertions; เพิ่ม regression โดยไม่อ้างว่าแทน browser QA | Verified expanded simulation coverage; real mobile Pending |
| QA-08 | P2 candidate | Dev + Optimizer review | reverse DOM drop priority อาจต่างจากชั้นภาพ; ตรวจ overlapping foreground/scenery และแก้ถ้าทำซ้ำได้ | Verified overlap regression/source; browser stacking Pending |

## หลักฐาน baseline

`node check-background.cjs` ผ่าน 30 solution paths ก่อนแก้ แต่ใช้การเรียกฟังก์ชันโดยตรง ยังไม่ครอบคลุม handlers/timeouts/ภาพจริง จึงไม่ใช่หลักฐานว่าเล่นจริงได้ครบทุกวิธี

QA-01, 02, 03 ทำซ้ำด้วย DOM simulation; QA-04 และ 05 ยืนยันจาก source และต้อง regression เพิ่ม QA-06 เป็น design candidate ต้องผู้เล่นจริงยืนยันความรู้สึก QA-08 เป็น geometry/input candidate ที่ต้องตรวจกรณีซ้อนทับ

## ข้อจำกัด

Browser file:// ถูกนโยบายปิดการตรวจ ไม่ใช้ทางเลี่ยง การเห็นภาพบนมือถือ สัมผัสจริง ความลื่น จำนวนผู้เล่นที่ติดด่าน และ Flow ยัง Pending

Optimizer ตรวจแล้ว runtime ไม่ใช้ atlas ต้นฉบับ และยังไม่มี profiling ที่แสดงปัญหาความเร็ว จึงไม่บีบภาพหรือลดคุณภาพโดยคาดเดา

## ผลหลังแก้

Dev และ Optimizer รวมการแก้แล้ว Tester ตรวจซ้ำอิสระ ไม่พบ blocking bug ใหม่ในขอบเขตจำลอง

- `node --check game.js` และ `node check.cjs` ผ่าน ทั้ง 30 solution paths และ focused regressions
- Tester เรียก actual keyboard click listener (detail=0) เล่นครบ 30 ด่าน รวมทางเลือกแตะสองครั้ง แล้วกดคำใบ้หลังชนะทุกด่าน ผ่าน
- progress migration assert [0,5,14] → [0,10,19] ผ่าน
- ตรวจเหตุการณ์ pointerdown/cancel คนละนิ้ว, timer cleanup เมื่อ load/menu และ priority ของไอเทมเหนือฉากในกรณีซ้อนทับ ผ่าน
- พบและแก้เพิ่มเติม: คำว่า “เปิด” มี substring “ปิด” จึงใช้ startsWith ตรวจสถานะให้ถูกต้อง
- Optimizer แก้ CSS สถานะม่าน หน้าต่าง และข้อความป้าย ตรวจ asset paths ครบ 44 ภาพ ทุกภาพ 256×256; ไม่อ้างว่าความเร็วดีขึ้นโดยไม่มี profiling
- QA-06 ปรับเบาะแสและเหตุผลที่ขั้นยังทำไม่ได้; ยังไม่ยืนยันว่าความยากสมดุลสำหรับคนจริง

ไม่มี verified blocker ค้างในขอบเขตรอบนี้ ข้อจำกัด browser/mobile/playtest ข้างต้นยัง Pending ไม่ใช่ Passed
## QA round 2 — Illustrated interactive scenery

- เปลี่ยนฉากเป็น layered background และภาพคู่สถานะ20 PNG แทนเส้น/รูปทรง CSS
- Dev เพิ่มภาพเปิด–ปิดจริงและการตรวจของตกแต่ง โดยเปิดซ้ำไม่ให้รางวัลซ้ำ; ตู้เย็น/กล่องเปลี่ยนภาพเมื่อ reveal ถูกขั้น
- Optimizer ลบภาพ placeholder CSS ใช้ aspect ratio เดียวทุก breakpoint จัด handle ม่านแยกจากหน้าต่างและใช้ animation ที่เคารพ reduced-motion
- Tester อิสระ: node check.cjs ผ่าน30ด่าน, actual keyboard click listener เล่นครบและ reset states ครบ30, ภาพ20ไฟล์320x320 มีครบ ตรวจ contact sheet ไม่ crop ติดชิ้นอื่น
- ตรวจรูปใหม่ด้วยตา: window panes open outward, curtain pulled to sides, storage interiors visible on frame/cushion/shelf/hatch/fridge/box
- ไม่มี verified blocker; final rendered layout/touch และ onboarding difficulty ของผู้เล่นจริงยัง Pending จนตรวจเบราว์เซอร์/ผู้เล่นจริง
- Live browser check: ภาพโหลดครบ เปิดบานหน้าต่างและตู้เย็นจริงได้; พบชั้นภาพหน้าต่างทับม่านปิด จึงแก้ curtainz3/windowz2 พร้อมปรับความคมชัดข้อความท้ายฉาก และตรวจซ้ำหลัง deploy
## QA round 3 — Layout and fat cat

User clarified firstlevel issue as images/positions overlapping. Existing live firstlevel answer verified by real click fish→cup and real drag fish→cup; no solution-rule failure reproduced.

- Portable items now occupy four columns/two counter rows, with reflow after each spawn/removal.
- Every solution step checked: max7 props, no portable item intersections, bounds inside counter; target geometry checked at320/390/460px (calculated, not native touch).
- Independent Tester checked125 stage snapshots across30 levels: exactly one resident OR interactive cat; actor/fixture overlaps only intentional cat sitting on cushion.
- Moved bubble/caption outside scene; moved hatch away from props, separated switch/shelf and frame/cat; resident cat is noninteractive so cannot steal a hit.
- New generated fat-cat-boss.png restores grumpy orange chubby cafe boss. Complete original ears/tail/paws preserved.
- check.cjs passes all30 actual pointer-tap solution paths; firstlevel tap and drag both directions; new rendered version awaiting final live visual verification.
- Final live check on deployed bd58755: navigated all30 levels through actual UI; initial portable-item DOM rectangles had zero overlaps, exactly1 cat and zero horizontal overflow in every level. Newly laid-out firstlevel completed via real drag fish→cup. All scene images loaded. Screenshot: render-deploy-layout-cat.png (local QA artifact, ignored by Git). Human difficulty/native mobile touch remains unverified.
## QA round 4 — Garden café interior

- Design: explicit service-left / clear middle / cat seating-right zones; ivory botanical wall, sage wainscoting, honey oak, brass task light, natural light and restrained plants. Background anchors and prop counter unchanged.
- Default decorative curtains open; teaching/dark levels still start opposite required action. Sign captions match actual state and sit inside plaque.
- Dev + Optimizer merged; node check.cjs PASS all30 solutions/pointer paths/counter geometry/max7/fatcat invariants. Final live visual pending coordinator.
- Final live visual verified e8decaa: gardenbackground, fatcat, window/curtain/cabinet and OPEN plaque render together without avoidable intersection; all12 scene images loaded. Plaque text fits face; controls/counter retain clear separation. Proof screenshot render-deploy-cafe-garden.png. Native mobile touch/humanplaytest remains pending.
## QA round 5 — Integrated furniture and functional lighting

- Confirmed rootcause: switch previously changed sprite only; curtain alone changed roomshade. Added syncRoomLighting for every switch/curtain change and load/reset.
- Four visible lightstates: on/open .02, on/closed .12, off/open .32, off/closed .62 overlay. Overlay above artwork and ignores input; switch remains reachable.
- Background cafe-integrated-v4.png removes duplicate barebench; storageottoman sprite now sole seatbase. Plant anchoredfloor. Cabinet/frame/sign scaled as wallfixtures; switch at actualwallheight; hatch oncentralfloor56–65%, actorfeet end56, portableprops70%+.
- Tests pass all30 solution/pointer paths, real class truth tables at eachstage, switch prerequisite/hold alternatives, reset, 4lightcombos; livecomputedstyle verification pending coordinator.
- Final live9e22dea accepted: actual computed ::before opacity on/open0.02 → off/open0.32 → off/closed0.62 → on/closed0.12 after UI clicks. Reset restoreson/open. Screenshots render-deploy-light-on.png and render-deploy-light-off.png prove visible change across room+objects. Inspected rightottoman singlebase and wallfixture/floor alignment. No source/runtime blocker observed; native mobile touch and humanplaytest remain pending.
## QA round 6 — User reference composition

- Matches supplied reference: centralgreenentrydoor, leftcountertabletop sign, top-rightwallcabinet, rightpicture+switch, largecatonottoman, centralfloorhatch and first3largecounterprops.
- Cleanbackground referencev5 removes bakedinteractiveart, preservescentraldoor/shiba/floor/counter; newtableboards and fishplate/latteartsaucer/icepuddle separated into5transparent320PNGs via verifiedbounds (not gridcropping).
- <=3 portableprops use large3columnlayout;4+ uses compact4x2.125stages x320/390/460 geometry passes,nooutbounds/propintersections,max7. Defaultdecorcurtainclosed matchesreference; requiredaction states preserved and4lightmodes unchanged.
- check.cjs PASS30actualpointertappaths and firstdrag bothways. Allassetpaths exist. Live composition/captionfit pendingcoordinator.
- Final live21a16a0 verified: reference composition withcentraldoor/tabletopOPEN/cabinetvine/catseat and fishplate/latte/ice; allimagesloaded. Firstlevel solved via actual fish→cup clicks. Corrected catvisiblepaws y38.5 to touchpinkseat (spritepadding compensation). Proof render-deploy-reference-layout.png. All30 logic/geometry suites passed; native mobiletouch/humanplaytest stillpending.
## QA round 7 — Every scene element is an object

- Root image QA: shell contains onlywall/floor; 13 transparent spritefiles independentlyextracted, no fixedgridcropping.
- Declarative scene-layout.js: 11uniqueroomobjects,13stateassets, centralized fixture/actor/prop geometry. #roomObjects excludes gameplay.objselectors.
- Dev: door toggles; espresso steam; pendant sharedswitchstate; requiredswitchlevel23/29 cannot bypass. Reset recreates11objects no duplicates. Servicecounter fill and pastrycase cover reflect referenceframe.
- Tester independent nodecheck.cjs and nodecheck-scene-assets.cjs PASS; all30paths and newscene state/asset rules PASS. Rootlive finalalignment/visibility pending.

Live browser verification (0ac8f07): Render Deploy succeeded/Live. All 23 scene/puzzle images loaded; 11 room object nodes present. Door image toggled, pendant and wall switch synchronized, lights-off/curtain-closed overlay opacity 0.62, espresso feedback shown, first puzzle solved through visible tap controls, replay restored initial scene. Composite screenshot: render-deploy-object-scene.png. Physical mobile touch testing remains outside this browser check.

## QA round 8 — Actual deployed browser playtest (2026-10-25)
Tested the public HTTPS Render site through visible browser controls, screenshots, coordinate clicks, and real pointer drags. This is separate from the 30-level DOM simulation.

Confirmed bug LIVE-001: Level 6 asks to tap the curtain, but clicking the center of the visible closed fabric activated the window underneath. Only its right-edge handle advanced the puzzle. Fixed closed curtain pointer hit area and aligned drag target resolution with rendered z-order. Valid current window combinations remain usable through closed fabric, preserving level 25.

Deployed fix b82452e and retested the actual page:
- Level 6: center fabric coordinate click now opens curtain and wins.
- Level 25: mirror-to-covered-window advances stage 2 using both coordinate tap and real drag; curtain remains closed. Opening curtain then clicking exposed window changes window state.
- Completed levels 1, 6, 7, 8, 9, 10, 25, 29 and 30 through the live UI. Level 1 includes real fish-to-latte drag; level 30 includes all six stages. Tested picture/seat reveals, double-click gesture alternative, hints, replay, menu selection, saved completed count after reload, and level 29 pendant prerequisite guard + two-tap hold alternative.
- Reset immediately after a level 6 win restored the starting state; subsequent state check found no stale success dialog.

Evidence: render-deploy-live-qa.png (actual final-level success dialog). Scope limits: desktop IAB viewport, not physical Android/iOS; actual 3-second finger hold, multitouch, and remaining 21 levels have not been manually completed in this round. Do not describe all 30 as real-browser playtested.

## QA round 9 — Movable cat in every level
Feature: exactly one `.obj[data-type=cat]` per level, including resident and puzzle cats. Cat drag retains a bounded location throughout the current level; spawning/reflow preserves it; reset/level change restores the cushion. Decorative resident cats cannot advance unrelated puzzle steps. Puzzle cat combinations work in both directions.
Tester independently added pointer-handler regression coverage across all 30 levels: movement bounds, persistence, cancellation, reset, resident guards, and symmetric valid cat tap/drag combinations. `node check.cjs` and syntax check pass. Real deployed browser movement/reflow/target tests recorded below after deployment.

Live verification on deployed 3fcb0d2: at narrow 304px desktop browser viewport, dragged resident cat in level 1 from cushion to center floor; release retained its new location. Reset restored x66/y38.5. In level 10 dragged puzzle cat to x38.3635/y50.292, opened curtain to spawn sunlight, verified coordinates unchanged, and completed sun-to-relocated-cat pairing through visible controls. Captured render-deploy-movable-cat.png. This checks real browser pointer input; physical phone touch remains untested.
