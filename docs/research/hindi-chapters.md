# Basic Hindi Reader — chapter lists (विषय-सूची) for Class 1 and Class 3

> **Status: NEEDS CHECKING BY VAIBHAV.** Every entry below was read by eye from page images
> rendered out of the two source PDFs. No text was extracted (the PDFs use Kruti Dev fonts).
> Devanagari was retyped in Unicode by hand, so spellings, nukta dots (ज़, ड़) and candrabindu /
> anusvara choices (ँ vs ं) must be checked against the printed book before they go live.

## How the pages were read

- Source PDFs (never modified):
  - `_source-assets/books/hindi/Hindi_Book-1_2.pdf` — 72 pages, 612 x 792 pt (`pdfinfo`)
  - `_source-assets/books/hindi/Hindi_Book-3_2.pdf` — 84 pages, 612 x 792 pt (`pdfinfo`)
- Rendered with `pdftoppm -r 110 -png` (contents pages re-rendered at 200 dpi and cropped), then
  viewed as images. The syllabus tables in Book 3 are printed rotated 90 degrees and were rotated
  back with Pillow before reading.
- **Printed page number = PDF page number in both books** (checked: Book 1 printed "7" is PDF
  page 7; Book 3 printed "9" is PDF page 9). So `pdftoppm -f N -l N` gives printed page N.
- Spot checks: the opening page of every numbered chapter and every extra reading in both books
  was rendered and its heading compared with the contents page. All page numbers matched. One
  heading differs from the contents page (see "Discrepancies").

## Common structure (both books)

- The contents page is titled **विषय-सूची**.
- Numbered rows (1., 2., ...) are the main chapters (पाठ).
- Rows marked with a red flower bullet (❋ in these notes) are extras that are not numbered:
  "आनंद के लिए पठन" readings, activities, revision pages and the two test papers.
- Pages headed **केवल पढ़ने के लिए** (Book 1) or **आनंद के लिए पठन** (Book 3) are read-only
  enrichment pages, not teaching chapters.
- Prices printed on the imprint page (PDF page 2): **Book 1 ₹240.00**, **Book 3 ₹300.00**.
  (Confidence: clear. Whether to show prices on the site is still governed by PLAYBOOK.md.)
- The preface (प्रस्तावना, PDF page 3) calls the series **बेसिक हिंदी पाठमाला** and says it is a
  Text-cum-Workbook for classes 1 to 8, aligned to NEP 2020 and NCF 2023. The covers say
  **Basic Hindi Reader / बेसिक हिंदी रीडर**. Vaibhav to confirm which series name the site uses.

---

## Book 1 — बेसिक हिंदी रीडर, क्लास 1 (`Hindi_Book-1_2.pdf`)

- Contents page: **PDF page 6** (printed विषय-सूची). Columns printed: क्र. | पाठ का नाम | कौशल | पृष्ठ क्र.
- Pages 4-5 are a "पुस्तक की विशेषताएँ" (book features) spread, not a contents page.
- **13 numbered chapters** (पाठ 1-13), **15 unnumbered extras** including two test papers.
- Overall confidence: **clear** for every row; the 200 dpi crop was fully legible.

| # | पाठ का नाम (as printed) | कौशल (as printed) | Page | Confidence |
| --- | --- | --- | --- | --- |
| ❋ | स्वस्थ दाँत, खुशहाल जीवन! | पठन एवं स्वास्थ्य जागरूकता | 7 | clear |
| ❋ | हाथ धोना है जरूरी! | पठन एवं स्वास्थ्य जागरूकता | 8 | clear |
| 1 | स्वर | पठन, लेखन एवं पहचान | 9 | clear |
| ❋ | स्वर गीत | पठन एवं उच्चारण | 17 | clear |
| 2 | व्यंजन | पठन, उच्चारण एवं पहचान | 18 | clear |
| 3 | ‘क’ वर्ग | पठन, लेखन एवं पहचान | 20 | clear |
| ❋ | नन्हा इंद्रधनुष | आनंद के लिए पठन | 23 | clear |
| 4 | ‘च’ वर्ग | पठन, लेखन एवं पहचान | 24 | clear |
| ❋ | आलसी बंदर और केला | आनंद के लिए पठन | 28 | clear |
| 5 | ‘ट’ वर्ग | पठन, लेखन एवं पहचान | 29 | clear |
| ❋ | मेले की सैर | आनंद के लिए पठन | 33 | clear |
| ❋ | **टेस्ट पेपर-1** | — | 35 | clear |
| 6 | ‘त’ वर्ग | पठन, लेखन एवं पहचान | 36 | clear |
| ❋ | छोटी चिड़िया की मदद | आनंद के लिए पठन | 40 | clear |
| 7 | ‘प’ वर्ग | पठन, लेखन एवं पहचान | 41 | clear |
| 8 | य से व | पठन, लेखन एवं पहचान | 46 | clear |
| ❋ | रोबोट की छुट्टी | आनंद के लिए पठन | 49 | clear |
| 9 | श से ह | पठन, लेखन एवं पहचान | 51 | clear |
| ❋ | प्यासा कौआ | आनंद के लिए पठन | 54 | clear |
| 10 | क्ष से श्र | पठन, लेखन एवं पहचान | 55 | clear |
| ❋ | वर्णमाला दोहराइए | पठन एवं पुनरावृत्ति | 58 | clear |
| 11 | दो अक्षर वाले शब्द | पठन एवं शब्द निर्माण | 59 | clear |
| 12 | तीन अक्षर वाले शब्द | पठन एवं शब्द निर्माण | 62 | clear |
| 13 | चार अक्षर वाले शब्द | पठन एवं शब्द निर्माण | 65 | clear |
| ❋ | दिनों और महीनों के नाम | पठन एवं पहचान | 68 | clear |
| ❋ | एक-अनेक | पठन एवं पहचान | 70 | clear |
| ❋ | गिनती | पठन एवं पहचान | 71 | clear |
| ❋ | **टेस्ट पेपर-2** | — | 72 | clear |

### Book 1 section groupings (implied by the कौशल column and chapter pages)

The contents page has no printed section headers; the natural groups are:

1. **स्वास्थ्य जागरूकता** (read-only health pages, p. 7-8)
2. **वर्णमाला**: स्वर (पाठ 1), व्यंजन (पाठ 2), then the व्यंजन groups पाठ 3-10
   (‘क’ वर्ग, ‘च’ वर्ग, ‘ट’ वर्ग, ‘त’ वर्ग, ‘प’ वर्ग, य से व, श से ह, क्ष से श्र), ending with
   वर्णमाला दोहराइए (p. 58)
3. **शब्द निर्माण**: दो / तीन / चार अक्षर वाले शब्द (पाठ 11-13)
4. **पहचान pages**: दिनों और महीनों के नाम, एक-अनेक, गिनती (p. 68-71)
5. **मूल्यांकन**: टेस्ट पेपर-1 (p. 35, after पाठ 5) and टेस्ट पेपर-2 (p. 72, after पाठ 13)

English sub-titles printed under each chapter heading on the chapter pages (useful for the
English-only interface): 1 Vowels; 2 Consonants; 3 Words Beginning with Letters ‘क’ to ‘ङ’;
4 ‘च’ to ‘ञ’; 5 ‘ट’ to ‘ण’; 6 ‘त’ to ‘न’; 7 ‘प’ to ‘म’; 8 ‘य’ to ‘व’; 9 ‘श’ to ‘ह’;
10 ‘क्ष’ to ‘श्र’; 11 Two-letter words; 12 Three-letter words; 13 Four-letter words.
(Confidence: clear, read from the 60 dpi spot-check sheet; re-check exact capitalisation.)

---

## Book 3 — बेसिक हिंदी रीडर, क्लास 3 (`Hindi_Book-3_2.pdf`)

- Contents page: **PDF page 8** (printed विषय-सूची). Columns printed: क्र. | पाठ का नाम | पृष्ठ क्र.
  (no कौशल column in this book's contents page).
- Pages 4-5: "पुस्तक की विशेषताएँ" feature spread. Pages 6-7: a two-page **पाठ्यवस्तु**
  (syllabus) table, printed sideways, which gives the term split, विधा (genre), language skills
  and life values for every row. The term split and विधा are transcribed below.
- **9 numbered chapters** (पाठ 1-9), **9 unnumbered extras** including two test papers.
- Overall confidence: **clear** for every row.

| # | पाठ का नाम (as printed) | विधा (from syllabus table) | Page | Confidence |
| --- | --- | --- | --- | --- |
| ❋ | मेरा प्यारा स्कूल | जानकारीपरक पाठ | 9 | clear |
| ❋ | ऋतुएँ | जानकारीपरक पाठ | 10 | clear (see discrepancy 1) |
| ❋ | योगासन | जानकारीपरक पाठ | 12 | clear |
| 1 | गधे जी चश्मा लाए | कविता | 13 | clear |
| 2 | मौसम और हम | कहानी | 20 | clear |
| ❋ | खेल-खेल में | गतिविधि | 27 | clear |
| 3 | खेल जीता किसने? | कहानी | 28 | clear |
| 4 | दो मित्र और भालू | कहानी | 35 | clear |
| ❋ | दयालु बालक | कहानी | 41 | clear |
| ❋ | **टेस्ट पेपर-1** | मूल्यांकन | 43 | clear |
| 5 | चंद्रशेखर आज़ाद | जीवनी | 45 | clear |
| 6 | समय का महत्व | कहानी | 53 | clear |
| ❋ | छोटी-सी पहल | कहानी | 60 | clear |
| 7 | नन्हा बीज | कविता | 62 | clear |
| ❋ | खेल-खेल में | गतिविधि | 68 | clear |
| 8 | पिकनिक का मज़ा | कहानी | 69 | clear |
| 9 | बीरबल की खिचड़ी | कविता | 76 | clear |
| ❋ | गिनती | अभ्यास | 82 | clear |
| ❋ | **टेस्ट पेपर-2** | मूल्यांकन | 83 | clear |

### Book 3 section groupings (printed on the syllabus table, PDF pages 6-7)

- **अप्रैल से सितंबर (पाठ्यवस्तु- पाठ 1 से 4 तक)**: मेरा प्यारा स्कूल, ऋतुएँ, योगासन,
  पाठ 1-4, खेल-खेल में (p. 27), दयालु बालक, टेस्ट पेपर-1 ("पाठ 1 से 4 की पुनरावृत्ति एवं मूल्यांकन").
- **अक्टूबर से मार्च (पाठ्यवस्तु- पाठ 5 से 9 तक)**: पाठ 5-9, छोटी-सी पहल, खेल-खेल में (p. 68),
  गिनती ("1 से 30 तक गिनती, संख्या-पहचान, क्रमबोध"), टेस्ट पेपर-2 ("पाठ 5 से 9 की पुनरावृत्ति एवं
  मूल्यांकन").
- Syllabus-table columns: क्रम संख्या | पाठ का नाम | विधा | भाषायी कौशल और योग्यताएँ | जीवन-मूल्य / नैतिक-मूल्य.
- जीवन-मूल्य column, per chapter (needs checking): 1 सावधानी, सोच-समझकर वस्तुओं का उपयोग,
  ज़िम्मेदारी · 2 प्रकृति-प्रेम, सभी ऋतुओं का महत्व समझना, पर्यावरण के प्रति संवेदनशीलता ·
  3 खेल-भावना, सहयोग, टीमवर्क, सोच-समझकर निर्णय लेना · 4 सच्ची मित्रता, संकट में साथ देना,
  विश्वास और सहयोग · 5 देशप्रेम, साहस, आत्मसम्मान और जिम्मेदारी · 6 समय का सदुपयोग, अनुशासन,
  कार्य समय पर पूरा करना · 7 मेहनत, धैर्य, निरंतर प्रयास और प्रकृति-प्रेम · 8 स्वच्छता,
  मिल-बाँटकर खाना, अनुशासन, सहयोग और सामूहिक आनंद · 9 न्याय, बुद्धिमानी, साहस और गलती स्वीकार करना.
- The two activity pages are both titled खेल-खेल में; their sub-topics on the page are
  **महीनों के नाम** (p. 27) and **पेड़ के भाग** (p. 68, syllabus: "पेड़ के भागों की पहचान").
  Give them distinct slugs if they become selectable items.

---

## Discrepancies and things to check

1. **Book 3, p. 10**: contents page and syllabus table say **ऋतुएँ**, but the printed heading on
   page 10 is **हमारे मौसम** (page 11 continues it). Keep the contents-page title or the page
   heading? Vaibhav to decide.
2. **Series name**: preface says बेसिक हिंदी पाठमाला; cover says Basic Hindi Reader / बेसिक हिंदी
   रीडर. Use the cover name unless told otherwise.
3. **Nukta and spelling** to confirm on the printed book: चिड़िया, छुट्टी, आज़ाद, मज़ा, खिचड़ी,
   इंद्रधनुष, ऋतुएँ, जरूरी (printed without nukta on the contents page), नन्हा (printed as
   न + न्ह ligature, read here as नन्हा).
4. Quotation marks around वर्ग names in Book 1 are printed as typographic single quotes (‘क’ वर्ग).
   Decide whether the site keeps the quotes.
5. Nothing on either contents page was unreadable; no `[unclear]` entries.

---

## Ready-to-copy data (`content/hindi-chapters.ts` shape; adjust to the real `content/` types)

```ts
// Transcribed by eye from the PDFs — needs checking by Vaibhav (docs/research/hindi-chapters.md).
export type HindiChapter = {
  no: number | null;        // null = unnumbered extra (❋)
  title: string;            // Unicode Devanagari exactly as printed on the contents page
  page: number;             // printed page = PDF page in both books
  kind: 'chapter' | 'reading' | 'activity' | 'revision' | 'test';
};

export const hindiReader1: HindiChapter[] = [
  { no: null, title: 'स्वस्थ दाँत, खुशहाल जीवन!', page: 7, kind: 'reading' },
  { no: null, title: 'हाथ धोना है जरूरी!', page: 8, kind: 'reading' },
  { no: 1, title: 'स्वर', page: 9, kind: 'chapter' },
  { no: null, title: 'स्वर गीत', page: 17, kind: 'reading' },
  { no: 2, title: 'व्यंजन', page: 18, kind: 'chapter' },
  { no: 3, title: '‘क’ वर्ग', page: 20, kind: 'chapter' },
  { no: null, title: 'नन्हा इंद्रधनुष', page: 23, kind: 'reading' },
  { no: 4, title: '‘च’ वर्ग', page: 24, kind: 'chapter' },
  { no: null, title: 'आलसी बंदर और केला', page: 28, kind: 'reading' },
  { no: 5, title: '‘ट’ वर्ग', page: 29, kind: 'chapter' },
  { no: null, title: 'मेले की सैर', page: 33, kind: 'reading' },
  { no: null, title: 'टेस्ट पेपर-1', page: 35, kind: 'test' },
  { no: 6, title: '‘त’ वर्ग', page: 36, kind: 'chapter' },
  { no: null, title: 'छोटी चिड़िया की मदद', page: 40, kind: 'reading' },
  { no: 7, title: '‘प’ वर्ग', page: 41, kind: 'chapter' },
  { no: 8, title: 'य से व', page: 46, kind: 'chapter' },
  { no: null, title: 'रोबोट की छुट्टी', page: 49, kind: 'reading' },
  { no: 9, title: 'श से ह', page: 51, kind: 'chapter' },
  { no: null, title: 'प्यासा कौआ', page: 54, kind: 'reading' },
  { no: 10, title: 'क्ष से श्र', page: 55, kind: 'chapter' },
  { no: null, title: 'वर्णमाला दोहराइए', page: 58, kind: 'revision' },
  { no: 11, title: 'दो अक्षर वाले शब्द', page: 59, kind: 'chapter' },
  { no: 12, title: 'तीन अक्षर वाले शब्द', page: 62, kind: 'chapter' },
  { no: 13, title: 'चार अक्षर वाले शब्द', page: 65, kind: 'chapter' },
  { no: null, title: 'दिनों और महीनों के नाम', page: 68, kind: 'reading' },
  { no: null, title: 'एक-अनेक', page: 70, kind: 'reading' },
  { no: null, title: 'गिनती', page: 71, kind: 'reading' },
  { no: null, title: 'टेस्ट पेपर-2', page: 72, kind: 'test' },
];

export const hindiReader3: HindiChapter[] = [
  { no: null, title: 'मेरा प्यारा स्कूल', page: 9, kind: 'reading' },
  { no: null, title: 'ऋतुएँ', page: 10, kind: 'reading' }, // page heading reads हमारे मौसम
  { no: null, title: 'योगासन', page: 12, kind: 'reading' },
  { no: 1, title: 'गधे जी चश्मा लाए', page: 13, kind: 'chapter' },
  { no: 2, title: 'मौसम और हम', page: 20, kind: 'chapter' },
  { no: null, title: 'खेल-खेल में', page: 27, kind: 'activity' }, // महीनों के नाम
  { no: 3, title: 'खेल जीता किसने?', page: 28, kind: 'chapter' },
  { no: 4, title: 'दो मित्र और भालू', page: 35, kind: 'chapter' },
  { no: null, title: 'दयालु बालक', page: 41, kind: 'reading' },
  { no: null, title: 'टेस्ट पेपर-1', page: 43, kind: 'test' },
  { no: 5, title: 'चंद्रशेखर आज़ाद', page: 45, kind: 'chapter' },
  { no: 6, title: 'समय का महत्व', page: 53, kind: 'chapter' },
  { no: null, title: 'छोटी-सी पहल', page: 60, kind: 'reading' },
  { no: 7, title: 'नन्हा बीज', page: 62, kind: 'chapter' },
  { no: null, title: 'खेल-खेल में', page: 68, kind: 'activity' }, // पेड़ के भाग
  { no: 8, title: 'पिकनिक का मज़ा', page: 69, kind: 'chapter' },
  { no: 9, title: 'बीरबल की खिचड़ी', page: 76, kind: 'chapter' },
  { no: null, title: 'गिनती', page: 82, kind: 'activity' },
  { no: null, title: 'टेस्ट पेपर-2', page: 83, kind: 'test' },
];
```

Render Hindi titles in **Noto Sans Devanagari** (CLAUDE.md rule); never pull text from the PDFs.

## Re-render commands (for re-checking)

```bash
OUT=/tmp/claude-0/-home-user-elara-universe-website/c7c6e4c3-8f11-53de-9161-8f44dcdf7ece/scratchpad/hindi-pages
pdftoppm -r 200 -f 6 -l 6 -png _source-assets/books/hindi/Hindi_Book-1_2.pdf "$OUT/book1-toc"   # Book 1 contents
pdftoppm -r 200 -f 8 -l 8 -png _source-assets/books/hindi/Hindi_Book-3_2.pdf "$OUT/book3-toc"   # Book 3 contents
pdftoppm -r 200 -f 6 -l 7 -png _source-assets/books/hindi/Hindi_Book-3_2.pdf "$OUT/book3-syll"  # Book 3 syllabus (rotate 90° clockwise)
```

## Sources

No web documentation was needed or used for this topic. Every fact above comes from the two
PDFs in `_source-assets/books/hindi/` (listed at the top), read as rendered images:

- Book 1: cover (p. 1), imprint and price (p. 2), preface (p. 3), features (p. 4-5),
  विषय-सूची (p. 6), chapter-start pages 7, 8, 9, 17, 18, 20, 24, 29, 36, 41, 46, 51, 55, 58, 59, 62,
  65, 68, 70, 71.
- Book 3: cover (p. 1), imprint and price (p. 2), preface (p. 3), features (p. 4-5),
  पाठ्यवस्तु tables (p. 6-7), विषय-सूची (p. 8), chapter-start pages 9, 10, 12, 13, 20, 27, 28, 35,
  41, 45, 53, 60, 62, 68, 69, 76, 82.
- Tools: `pdfinfo` and `pdftoppm` (poppler-utils, installed locally), Pillow 12.3.0 for rotation
  and cropping.
