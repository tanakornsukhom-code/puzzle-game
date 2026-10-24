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
