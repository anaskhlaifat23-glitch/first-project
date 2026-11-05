# -*- coding: utf-8 -*-
import html, pathlib, asyncio, sys
sys.path.insert(0, '/home/claude/bonus')
from content import DAYS, TITLE, SUB
B = pathlib.Path('/home/claude/bonus')
E = html.escape

def ff(name, file, w, rng=None):
    r = f"unicode-range:{rng};" if rng else ""
    return f"@font-face{{font-family:'{name}';font-weight:{w};src:url('fonts/{file}') format('woff2');{r}}}"
LAT = "U+0000-00FF,U+2000-206F,U+2190-21FF,U+2713,U+2192"
FONTS = "".join([ff('W','cl4-plex-ar-400.woff2',400), ff('W','cl4-plex-ar-600.woff2',600), ff('W','cl4-plex-ar-700.woff2',700),
                 ff('W','cl4-plex-la-400.woff2',400,LAT), ff('W','cl4-plex-la-600.woff2',600,LAT), ff('W','cl4-plex-la-700.woff2',700,LAT),
                 ff('S','cl4-serif-600.woff2',600), ff('M','cl4-mono.woff2',400)])

CSS = FONTS + """
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:'W',sans-serif;color:#17181C;direction:rtl;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;position:relative;overflow:hidden;background:#F7F3EC;padding:17mm 17mm 20mm;page-break-after:always}
.pg:last-child{page-break-after:auto}
.ft{position:absolute;bottom:9mm;left:17mm;right:17mm;display:flex;justify-content:space-between;font-size:8pt;color:#8A8577;border-top:.4pt solid #D9D1C3;padding-top:2.5mm}
.ft .n{font-family:'S',serif;font-size:11pt;color:#17181C;direction:ltr}
.k{font-size:8.5pt;font-weight:600;letter-spacing:0;color:#C2583A;margin-bottom:3mm;display:flex;align-items:center;gap:2mm}
.k:before{content:"";width:6mm;height:.8pt;background:#C2583A;display:inline-block}
h1{font-size:25pt;line-height:1.35;font-weight:700}
h2{font-size:19pt;line-height:1.4;font-weight:700;margin-bottom:3mm}
h3{font-size:11.5pt;font-weight:700;margin:4.5mm 0 2mm}
p,li{font-size:10.4pt;line-height:1.85}
.lead{font-size:11.5pt;line-height:1.85;color:#3A3B40}
.en{font-family:'W';direction:ltr;unicode-bidi:isolate}
.c{color:#C2583A}.g{color:#1C2A44}.s{color:#4F7464}
/* cover */
.cover{background:#F4EFE7;padding:20mm 20mm}
.cover .top{display:flex;justify-content:space-between;font-size:9pt;color:#5B5A55}
.cover .brand{font-weight:700;color:#17181C;direction:ltr}
.cover .art{position:absolute;top:58mm;left:0;right:0;display:flex;justify-content:center}
.cover h1{position:absolute;top:168mm;right:20mm;left:20mm;font-size:40pt;line-height:1.25}
.cover .sub{position:absolute;top:212mm;right:20mm;left:44mm;font-size:13pt;line-height:1.8;color:#3A3B40}
.cover .bot{position:absolute;bottom:18mm;right:20mm;left:20mm;display:flex;justify-content:space-between;align-items:flex-end;border-top:.6pt solid #17181C;padding-top:4mm;font-size:9pt;color:#5B5A55}
.cover .bot b{color:#17181C}
/* boxes */
.box{border:.6pt solid #D9D1C3;background:#FFFDF9;border-radius:3mm;padding:4mm 5mm}
.note{background:#EFE7DA;border-radius:3mm;padding:4mm 5mm}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
table{width:100%;border-collapse:collapse;font-size:9.6pt}
th,td{border-bottom:.5pt solid #D9D1C3;padding:2.2mm 2mm;text-align:right;vertical-align:top;line-height:1.6}
th{font-weight:700;font-size:9pt;color:#5B5A55;border-bottom:1pt solid #17181C}
/* day page */
.dh{display:flex;align-items:flex-start;justify-content:space-between;gap:6mm;margin-bottom:4mm}
.dn{font-family:'W';font-weight:700;font-size:58pt;line-height:.9;color:#C2583A;direction:ltr}
.dn small{display:block;font-family:'W';font-size:8.5pt;color:#5B5A55;text-align:center;margin-top:2mm;direction:rtl}
.res{display:flex;gap:3mm;align-items:center;font-size:10pt;margin-top:2mm}
.res b{background:#17181C;color:#F7F3EC;border-radius:10mm;padding:.6mm 3.2mm;font-size:8.5pt;font-weight:600;white-space:nowrap}
.route{display:flex;align-items:center;gap:2mm;margin:3.5mm 0 1mm}
.chip{border-radius:10mm;padding:1.2mm 4mm;font-size:9.4pt;font-weight:600;color:#fff;white-space:nowrap}
.chip.cl{background:#C2583A}.chip.gp{background:#1C2A44}.chip.you{background:#17181C}
.arr{color:#8A8577;font-size:11pt}
ol.st{list-style:none;counter-reset:s}
ol.st li{counter-increment:s;position:relative;padding-right:8mm;margin-bottom:1.2mm}
ol.st li:before{content:counter(s);position:absolute;right:0;top:.6mm;width:5.4mm;height:5.4mm;border-radius:50%;border:.7pt solid #17181C;font-size:8pt;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1}
.pr{border-radius:3mm;padding:3.5mm 4.5mm 4mm;margin-top:3mm;break-inside:avoid}
.pr.cl{background:#FBEEE8;border-right:2.2mm solid #C2583A}
.pr.gp{background:#E9EDF3;border-right:2.2mm solid #1C2A44}
.pr .lb{font-size:8.6pt;font-weight:700;margin-bottom:1.5mm;display:flex;justify-content:space-between}
.pr .lb span{font-weight:400;color:#5B5A55}
.pr pre{font-family:'W';white-space:pre-wrap;font-size:10.6pt;line-height:1.85;color:#17181C}
.day ol.st li{font-size:11pt;line-height:1.9;margin-bottom:1.8mm}.day .pr{margin-top:4.5mm;padding:4.5mm 5mm 5mm}.day h3{margin-top:6mm}
/* worksheet */
.ws h3{margin-top:3.5mm}
.line{border-bottom:.6pt dotted #9E978A;height:8.2mm}
.chk li{list-style:none;position:relative;padding-right:7mm;margin-bottom:1.6mm}
.chk li:before{content:"";position:absolute;right:0;top:1.6mm;width:3.8mm;height:3.8mm;border:.8pt solid #17181C;border-radius:.8mm}
.fieldrow{display:grid;grid-template-columns:34mm 1fr;align-items:end;gap:3mm;font-size:9.6pt;color:#5B5A55}
.meta{display:flex;gap:6mm;font-size:9.4pt;color:#5B5A55;margin-top:3mm}
.meta span{flex:1;border-bottom:.6pt dotted #9E978A;padding-bottom:1.6mm}
.tl{display:flex;gap:3mm;margin-top:2mm}
.tl div{flex:1;border-radius:2.4mm;padding:3mm 3.5mm;font-size:9.2pt;line-height:1.65}
"""

def foot(n):
    return f'<div class="ft"><span>{E(TITLE)} · ملحق المجموعة الكاملة · AI Step Ahead</span><span class="n">{n}</span></div>'

def chip(tool, role):
    cls = 'cl' if tool == 'Claude' else 'gp'
    return f'<span class="chip {cls}">{role}: <span class="en">{tool}</span></span>'

VENN = """<svg width="150mm" height="100mm" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
<circle cx="225" cy="200" r="150" fill="#1C2A44" fill-opacity=".92"/>
<circle cx="375" cy="200" r="150" fill="#C2583A" fill-opacity=".88"/>
<path d="M300 70 A150 150 0 0 1 300 330 A150 150 0 0 1 300 70Z" fill="#17181C"/>
<text x="160" y="208" fill="#F4EFE7" font-family="S" font-size="34" text-anchor="middle">ChatGPT</text>
<text x="442" y="208" fill="#F4EFE7" font-family="S" font-size="38" text-anchor="middle">Claude</text>
<text x="300" y="196" fill="#F4EFE7" font-family="W" font-weight="700" font-size="25" text-anchor="middle">أنت</text>
<text x="300" y="228" fill="#E9D9C9" font-family="W" font-size="15" text-anchor="middle">تقرّر</text>
<text x="160" y="246" fill="#C9D2E0" font-family="W" font-size="15" text-anchor="middle">يكتب أو يراجع</text>
<text x="442" y="246" fill="#F6DCCF" font-family="W" font-size="15" text-anchor="middle">يكتب أو يراجع</text>
</svg>"""

pages = []
# 1 cover
pages.append(f"""<section class="pg cover">
<div class="top"><span class="brand">AI Step Ahead</span><span>ملحق «المجموعة الكاملة»: Claude بلا تخمين + ChatGPT بلا تخمين</span></div>
<div class="art">{VENN}</div>
<h1>{E(TITLE)}</h1>
<p class="sub">{E(SUB)}</p>
<div class="bot"><span><b>دفتر عمل</b> · سبع مهام حقيقية · 20 إلى 30 دقيقة في اليوم</span><span>طبعة نوفمبر 2026</span></div>
</section>""")

# 2 how to use
pages.append(f"""<section class="pg">
<div class="k">قبل أن تبدأ</div>
<h2>هذا ليس كتابًا ثالثًا. إنه أسبوع عمل.</h2>
<p class="lead">في الكتابين تعلّمتَ كل أداة على حدة: إطار <span class="en">ARROWS</span> في كتاب <span class="en">Claude</span>، و«المِقاس» و«تأكَّد» في كتاب <span class="en">ChatGPT</span>. هذا الدفتر يجمعهما في طريقة واحدة: تطلب النتيجة من أداة، وتجعل الأخرى تراجعها، ثم تقرّر أنت.</p>
<h3>ما ستخرج به بعد سبعة أيام</h3>
<table><tr><th style="width:12mm">اليوم</th><th>المهمة</th><th>النتيجة التي تحتفظ بها</th></tr>
{''.join(f'<tr><td class="c" style="font-weight:700">{d["n"]}</td><td>{E(d["title"])}</td><td>{E(d["result"])}</td></tr>' for d in DAYS)}
</table>
<div class="grid2" style="margin-top:5mm">
<div class="box"><h3 style="margin-top:0">ما تحتاج إليه</h3>
<ul style="padding-right:4mm"><li>حساب في <span class="en">Claude</span> وحساب في <span class="en">ChatGPT</span>. الحساب المجاني يكفي لمعظم المهام.</li>
<li>مهمة حقيقية لكل يوم من عملك أو دراستك أو حياتك.</li>
<li>20 إلى 30 دقيقة، وهذا الدفتر مطبوعًا أو مفتوحًا بجانبك.</li></ul></div>
<div class="box"><h3 style="margin-top:0">كيف تقرأ كل يوم</h3>
<ul style="padding-right:4mm"><li><b>الصفحة الأولى:</b> المهمة، والخطوات، وطلبان جاهزان: طلب للكاتب وطلب للمراجع.</li>
<li><b>الصفحة الثانية:</b> ورقة عمل تملؤها، وفحص قبل الاعتماد، وما تحتفظ به.</li>
<li>بدّل الأدوار متى شئت. المهم أن يراجع النموذج الآخر.</li></ul></div>
</div>
<div class="note" style="margin-top:5mm"><h3 style="margin-top:0">قاعدة واحدة طوال الأسبوع: ما لا تلصقه أبدًا</h3>
<p>كلمات المرور ورموز التحقّق، وأرقام الهويات والحسابات والبطاقات، وبيانات العملاء الشخصية قبل إخفائها، والعقود والمستندات السرّية ما لم تسمح بها جهة عملك، والسجلات الصحّية وملفات الموظفين. استبدل الأسماء والأرقام الحسّاسة بعلامات مثل [العميل أ]. التفاصيل في الفصل 30 من كتاب <span class="en">Claude</span>، وفي بطاقة كتاب <span class="en">ChatGPT</span> المختصرة.</p></div>
{foot(2)}</section>""")

# 3 principle + mapping
pages.append(f"""<section class="pg">
<div class="k">الطريقة</div>
<h2>الكاتب، والمراجع، وصاحب القرار</h2>
<p class="lead">نموذجان مختلفان لا يقعان دائمًا في الخطأ نفسه، فقد يلتقط أحدهما ما فات الآخر. لكن اتفاقهما ليس دليلًا على الصواب: قد يخطئان معًا. لذلك يوزّع هذا الدفتر الأدوار هكذا:</p>
<div class="route" style="margin:4mm 0 2mm;flex-wrap:wrap">
<span class="chip you" style="background:#5B5A55">1 · الكاتب: ينتج المسودة</span><svg class="arr" width="5mm" height="3mm" viewBox="0 0 20 12"><path d="M19 6H2M7 1L2 6l5 5" fill="none" stroke="#8A8577" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
<span class="chip you" style="background:#8A8577">2 · المراجع: يفتّش ولا يعيد الكتابة</span><svg class="arr" width="5mm" height="3mm" viewBox="0 0 20 12"><path d="M19 6H2M7 1L2 6l5 5" fill="none" stroke="#8A8577" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
<span class="chip you">3 · أنت: تقبل ما يخدم هدفك وتفحص بنفسك</span></div>
<p>المراجع لا يعيد الكتابة لسبب عملي: إن أعاد الكتابة، صرتَ أمام مسودّتين بدل مسودّة وملاحظات، وضاع عليك سبب التعديل. اطلب منه أن يقتبس الموضع الضعيف ويشرح لماذا هو ضعيف.</p>
<h3>لغة واحدة لكتابين</h3>
<p>الإطاران في الكتابين يطرحان الأسئلة نفسها تقريبًا بأسماء مختلفة. لهذا يعمل الطلب الجيّد في الأداتين دون تعديل.</p>
<table style="margin-top:2mm"><tr><th>السؤال</th><th>في كتاب <span class="en">Claude</span> (<span class="en">ARROWS</span>)</th><th>في كتاب <span class="en">ChatGPT</span> («المِقاس»)</th></tr>
<tr><td>ماذا يجب أن يتغيّر بعد النتيجة؟</td><td>الهدف <span class="en">(Aim)</span></td><td>الهدف</td></tr>
<tr><td>ما الذي لا يعرفه النموذج عنك وعن الموقف؟</td><td>الخلفية والسياق <span class="en">(Reality)</span></td><td>السياق</td></tr>
<tr><td>من سيقرأ النتيجة؟</td><td>ضمن الخلفية والسياق: من المتكلّم ومن القارئ</td><td>الجمهور</td></tr>
<tr><td>ما المطلوب إنجازه بالضبط؟</td><td>المهمة المطلوبة <span class="en">(Request)</span></td><td>لا عنصر مستقلّ؛ تظهر في صياغة طلبك</td></tr>
<tr><td>بأيّ لغة وطول وشكل؟</td><td>مواصفات المخرجات <span class="en">(Output)</span></td><td>الشكل</td></tr>
<tr><td>ما الممنوع أو غير المقبول؟</td><td>القيود والحدود <span class="en">(Walls)</span></td><td>الحدود</td></tr>
<tr><td>هل عندك نموذج تريد مثله؟</td><td>الأمثلة والقوالب: الفصل 6</td><td>المثال</td></tr>
<tr><td>متى تكون النتيجة جاهزة؟</td><td>معيار قبول النتيجة <span class="en">(Standard)</span></td><td>المعيار</td></tr></table>
<h3>قبل أن تعتمد أيّ نتيجة: «تأكَّد»</h3>
<p>من كتاب <span class="en">ChatGPT</span>، وتنطبق على الأداتين: <b>التاريخ</b> (هل ما زالت صحيحة اليوم؟) و<b>الأصل</b> (هل تطابق الملف أو النص الأصلي؟) و<b>الكمّ</b> (أعِد حساب الأرقام بنفسك) و<b>الدليل</b> (مصدر فتحتَه وقرأته لكل ادّعاء مهم). وعمق الفحص بحسب ثمن الخطأ:</p>
<div class="tl"><div style="background:#E3EDE6"><b>أخضر</b> · فكرة أو مسوّدة لنفسك: قراءة سريعة.</div><div style="background:#F6EBC9"><b>أصفر</b> · نصّ سيُرسَل أو يُستخدَم: الفحوص الأربعة.</div><div style="background:#F3D9D0"><b>أحمر</b> · مال أو قانون أو صحّة: الفحوص الأربعة ومختصّ مؤهّل.</div></div>
{foot(3)}</section>""")

pn = 4
for d in DAYS:
    w, r = d['writer'], d['reviewer']
    wc = 'cl' if w == 'Claude' else 'gp'; rc = 'cl' if r == 'Claude' else 'gp'
    steps = ''.join(f'<li>{E(s)}</li>' for s in d['steps'])
    def enw(t):
        return E(t).replace('Claude','<span class="en">Claude</span>').replace('ChatGPT','<span class="en">ChatGPT</span>')
    steps = ''.join(f'<li>{enw(s)}</li>' for s in d['steps'])
    pages.append(f"""<section class="pg day">
<div class="dh"><div><div class="k">اليوم {d['n']} من 7 · نحو {d['minutes']} دقيقة</div><h2 style="margin-bottom:1mm">{E(d['title'])}</h2>
<div class="res"><b>النتيجة</b><span>{E(d['result'])}</span></div></div>
<div class="dn">{d['n']}<small>اليوم</small></div></div>
<p class="lead" style="font-size:10.8pt">{enw(d['why'])}</p>
<div class="route">{chip(w,'يكتب')}<svg class="arr" width="5mm" height="3mm" viewBox="0 0 20 12"><path d="M19 6H2M7 1L2 6l5 5" fill="none" stroke="#8A8577" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>{chip(r,'يراجع')}<svg class="arr" width="5mm" height="3mm" viewBox="0 0 20 12"><path d="M19 6H2M7 1L2 6l5 5" fill="none" stroke="#8A8577" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="chip you">يقرّر: أنت</span></div>
<h3>الخطوات</h3><ol class="st">{steps}</ol>
<div class="pr {wc}"><div class="lb">طلب الكاتب<span>انسخه إلى <span class="en">{w}</span> واملأ ما بين المعقوفين</span></div><pre>{E(d['wp'])}</pre></div>
<div class="pr {rc}"><div class="lb">طلب المراجع<span>انسخه إلى <span class="en">{r}</span></span></div><pre>{E(d['rp'])}</pre></div>
{foot(pn)}</section>""")
    pn += 1
    # worksheet
    chk = ''.join(f'<li>{E(c)}</li>' for c in d['check'])
    if d['n'] == 6:
        body = """<h3>بطاقة سير العمل</h3><div class="box">
<div class="fieldrow"><span>اسم سير العمل</span><div class="line"></div></div>
<div class="fieldrow"><span>متى أستخدمه</span><div class="line"></div></div>
<div class="fieldrow"><span>الكاتب / المراجع</span><div class="line"></div></div>
<div class="fieldrow"><span>القالب</span><div class="line"></div></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div>
<div class="fieldrow"><span>معيار القبول</span><div class="line"></div></div>
<div class="fieldrow"><span>أين حفظته</span><div class="line"></div></div></div>"""
    elif d['n'] == 7:
        rows = ''.join('<tr><td style="height:11mm"></td><td></td><td></td><td></td><td></td></tr>' for _ in range(8))
        body = f"""<h3>جدول روتينك</h3><table><tr><th>العمل المتكرّر</th><th style="width:24mm">يكتب</th><th style="width:24mm">يراجع</th><th style="width:26mm">عمق الفحص</th><th style="width:30mm">لا يُسلَّم لهما</th></tr>{rows}</table>"""
    else:
        body = """<h3>مسودّتي الأولى: ما الذي أعجبني وما الذي نقص؟</h3><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div>
<h3>أهم ملاحظات المراجع التي قبلتُها، ولماذا</h3><div class="line"></div><div class="line"></div><div class="line"></div>
<h3>ملاحظات رفضتُها، ولماذا</h3><div class="line"></div><div class="line"></div><div class="line"></div>
<h3>النتيجة النهائية: أين حفظتُها؟</h3><div class="line"></div>"""
    pages.append(f"""<section class="pg ws">
<div class="k">ورقة عمل · اليوم {d['n']}</div><h2>{E(d['title'])}</h2>
<div class="box" style="margin-bottom:2mm"><div class="fieldrow"><span>مهمتي الحقيقية اليوم</span><div class="line"></div></div><div class="line"></div></div>
{body}
<div class="grid2" style="margin-top:5mm">
<div class="box"><h3 style="margin-top:0">قبل أن تعتمد</h3><ul class="chk">{chk}</ul></div>
<div class="note"><h3 style="margin-top:0">ما تحتفظ به</h3><p>{E(d['keep'])}</p></div></div>
<div class="meta"><span>الوقت الذي استغرقته:</span><span>كم كان سيستغرق دون الأداتين (تقديرك):</span></div>
{foot(pn)}</section>""")
    pn += 1

# week log
rows = ''.join(f'<tr><td class="c" style="font-weight:700">{d["n"]}</td><td>{E(d["result"])}</td><td style="width:22mm"></td><td style="width:22mm"></td><td style="width:16mm"></td></tr>' for d in DAYS)
pages.append(f"""<section class="pg">
<div class="k">نهاية الأسبوع</div><h2>سجلّ أسبوعك</h2>
<p class="lead">املأ هذه الصفحة في اليوم السابع. الأرقام هنا تقديرك أنت لوقتك، وهي أصدق مقياس لفائدة ما تعلّمته.</p>
<table style="margin-top:3mm"><tr><th style="width:10mm">اليوم</th><th>النتيجة</th><th>وقتي مع الأداتين</th><th>تقديري دونهما</th><th>أنجزت</th></tr>{rows}</table>
<h3>ثلاث عادات أحتفظ بها من هذا الأسبوع</h3>
<div class="line"></div><div class="line"></div><div class="line"></div>
<h3>أكثر خطأ التقطه المراجع وكان سيكلّفني</h3>
<div class="line"></div><div class="line"></div>
<h3>عمل واحد قرّرتُ ألّا أسلّمه للذكاء الاصطناعي، ولماذا</h3>
<div class="line"></div><div class="line"></div>
{foot(pn)}</section>""")
pn += 1

# closing
pages.append(f"""<section class="pg">
<div class="k">بعد الأسبوع</div><h2>أين تتعمّق بعد ذلك؟</h2>
<p class="lead">كل يوم في هذا الدفتر تطبيق مختصر لفصول كاملة في الكتابين. حين تريد أن تتقن مهارة يوم بعينه، ارجع إلى الفصول المقابلة:</p>
<table style="margin-top:3mm"><tr><th style="width:44mm">المهارة</th><th>في كتاب <span class="en">Claude</span></th><th>في كتاب <span class="en">ChatGPT</span></th></tr>
<tr><td>كتابة الطلب</td><td>الفصل 5: إطار <span class="en">ARROWS</span>، والفصل 6: الأمثلة والقوالب</td><td>«المِقاس»، والمِقاسان السريع والكامل</td></tr>
<tr><td>حين لا تصيب الإجابة</td><td>الفصل 7: تفكيك المشكلات وسلاسل البرومبتات</td><td>«البروفة»: أصلح مِقاسًا واحدًا في رسالة واحدة</td></tr>
<tr><td>التحقّق</td><td>الفصل 9: الهلوسة والتحقّق واختبار البرومبتات</td><td>بروتوكول «تأكَّد» وألوان عمق الفحص</td></tr>
<tr><td>الرسائل والتقارير</td><td>الفصل 11: البريد الإلكتروني والتقارير والاجتماعات والخطط</td><td>مكتبة الطلبات الجاهزة (120 طلبًا)</td></tr>
<tr><td>البحث والمصادر</td><td>الفصل 13: البحث على الويب وفحص المصادر</td><td>بروتوكول «تأكَّد»: التاريخ والدليل</td></tr>
<tr><td>الملفات</td><td>الفصل 15: المستندات والصور، والفصل 16: Excel وCSV</td><td>ملفات التدريب المرفقة بالكتاب</td></tr>
<tr><td>سير العمل الدائم</td><td>الفصل 17: المشاريع، والفصل 29: سير عمل موثوق</td><td>التعليمات المخصّصة والذاكرة</td></tr>
<tr><td>الأمان والخصوصية</td><td>الفصل 30</td><td>البطاقة المختصرة: «خمسة أشياء لا تلصقها أبدًا»</td></tr></table>
<div class="note" style="margin-top:6mm"><h3 style="margin-top:0">تنبيه صادق</h3>
<p>أسماء الميزات وحدود الخطط في الأداتين تتغيّر باستمرار. هذا الدفتر لا يعتمد على ميزة بعينها: يكفيه أن تكتب طلبًا وتلصق نصًّا وترفع ملفًّا. وحين تحتاج ميزة مثل البحث على الويب، تجد في الكتابين كيف تتحقّق من توفّرها في خطتك.</p></div>
<div class="box" style="margin-top:5mm;display:flex;justify-content:space-between;align-items:center">
<div><b>AI Step Ahead</b> · ناشر عربي مستقل لأدلّة الذكاء الاصطناعي العملية<br><span style="color:#5B5A55;font-size:9.6pt">للاستفسار: support@aistepahead.com · ملحق «المجموعة الكاملة» · طبعة نوفمبر 2026</span></div>
<div class="dn" style="font-size:44pt">7</div></div>
{foot(pn)}</section>""")

doc = f"<!doctype html><html lang='ar' dir='rtl'><head><meta charset='utf-8'><style>{CSS}</style></head><body>{''.join(pages)}</body></html>"
(B/'workbook.html').write_text(doc)

async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page()
        await pg.goto('file:///home/claude/bonus/workbook.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("document.fonts.ready")
        # overflow check per page
        ov = await pg.evaluate("""()=>[...document.querySelectorAll('.pg')].map((s,i)=>{const ft=s.querySelector('.ft');const lim=ft?ft.getBoundingClientRect().top:s.getBoundingClientRect().bottom;let m=0;s.querySelectorAll('*').forEach(e=>{if(e.closest('.ft')||e.closest('.art'))return;const r=e.getBoundingClientRect();if(r.height&&r.bottom>m)m=r.bottom});return [i+1,Math.round(lim-m)]})""")
        print('slack(px) per page:', ov)
        await pg.pdf(path=str(B/'out.pdf'), format='A4', print_background=True, prefer_css_page_size=True)
        await b.close()
asyncio.run(main())
print('pages', len(pages))
