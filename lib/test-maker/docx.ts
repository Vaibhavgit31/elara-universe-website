import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  PageBreak,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TabStopPosition,
  TabStopType,
  TextRun,
  WidthType,
  convertMillimetersToTwip as mm,
} from 'docx'
import { paperLabels, type Paper } from '@/lib/test-maker/paper'
import type { Settings } from '@/lib/test-maker/types'

// The same paper as a Word file, so teachers can edit it (docx 9.11, https://docx.js.org; notes in
// docs/research/docx-print.md). Text is Unicode; Latin uses Calibri and Devanagari the complex-
// script slot with Mangal, which ships with Windows and Office (Word substitutes a Devanagari font
// on a Mac). Built in the browser and only loaded when the teacher asks for it.

const FONT = { ascii: 'Calibri', hAnsi: 'Calibri', cs: 'Mangal' }
const run = (text: string, extra: { bold?: boolean; size?: number } = {}) =>
  new TextRun({
    text,
    font: FONT,
    size: extra.size ?? 23,
    sizeComplexScript: (extra.size ?? 23) + 2,
    bold: extra.bold,
  })
const line = (children: TextRun[], options: { center?: boolean; before?: number } = {}) =>
  new Paragraph({
    children,
    alignment: options.center ? AlignmentType.CENTER : undefined,
    spacing: { before: options.before ?? 0, after: 80 },
    // A right tab for the marks at the end of a question line.
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
  })

const logoRun = (logo: string) => {
  const type = /^data:image\/png/.test(logo)
    ? 'png'
    : /^data:image\/jpe?g/.test(logo)
      ? 'jpg'
      : null
  return type ? new ImageRun({ type, data: logo, transformation: { width: 64, height: 64 } }) : null
}

const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
}

export function paperDocument(paper: Paper, settings: Settings, withKey: boolean) {
  const l = paperLabels(paper.language)
  const { book } = paper
  const logo = settings.logo ? logoRun(settings.logo) : null
  const header = [
    ...(logo ? [new Paragraph({ children: [logo], alignment: AlignmentType.CENTER })] : []),
    ...(settings.schoolName
      ? [line([run(settings.schoolName, { bold: true, size: 30 })], { center: true })]
      : []),
    ...(settings.examName
      ? [line([run(settings.examName, { bold: true, size: 26 })], { center: true })]
      : []),
    line(
      [
        run(
          `${l.class} ${book.class} · ${paper.language === 'hi' ? (book.titleHindi ?? book.series) : book.series} (${l.subject[book.subject]}) · ${l.set} ${paper.set}`,
        ),
      ],
      { center: true },
    ),
    line([
      run(`${l.time}: ${settings.minutes} ${l.minutes}`),
      ...(settings.date ? [run(`    ${l.date}: ${settings.date}`)] : []),
      run(`\t${l.maxMarks}: ${paper.totalMarks}`),
    ]),
    line([run(`${l.name}: ______________________`), run(`\t${l.roll}: ________`)]),
    ...(settings.instructions
      ? [
          line([run(l.instructions, { bold: true })], { before: 160 }),
          ...settings.instructions.split('\n').map((text) => line([run(text)])),
        ]
      : []),
  ]
  const body = paper.sections.flatMap((section) => [
    line(
      [
        run(section.title, { bold: true, size: 25 }),
        run(`\t(${section.subtitle})`, { bold: true }),
      ],
      {
        before: 240,
      },
    ),
    ...section.items.flatMap(({ n, question, options, right }) => [
      line([
        run(`${n}. `, { bold: true }),
        run(
          question.type === 'truefalse'
            ? `${question.text} (${l.true} / ${l.false})`
            : question.text,
        ),
        run(`\t[${question.marks}]`),
      ]),
      ...(question.type === 'mcq'
        ? [
            line(
              options.map((o, i) =>
                run(`(${l.options[i]}) ${o}${i < options.length - 1 ? '      ' : ''}`),
              ),
            ),
          ]
        : []),
      ...(question.type === 'match'
        ? [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                ...noBorders,
                insideHorizontal: noBorders.top,
                insideVertical: noBorders.top,
              },
              rows: question.pairs.map(
                (pair, i) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [line([run(`${i + 1}. ${pair.left}`)])] }),
                      new TableCell({ children: [line([run(`(${l.options[i]}) ${right[i]}`)])] }),
                    ],
                  }),
              ),
            }),
          ]
        : []),
    ]),
  ])
  const key = withKey
    ? [
        new Paragraph({ children: [new PageBreak()] }),
        line([run(`${l.key} · ${l.set} ${paper.set}`, { bold: true, size: 28 })]),
        ...paper.key.map(({ n, answer }) => line([run(`${n}. `, { bold: true }), run(answer)])),
      ]
    : []
  return new Document({
    creator: settings.schoolName || 'Elara Universe Test Maker',
    title: settings.examName || book.title,
    styles: { default: { document: { run: { font: FONT, size: 23 } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: mm(210), height: mm(297) },
            margin: { top: mm(15), right: mm(15), bottom: mm(15), left: mm(15) },
          },
        },
        children: [...header, ...body, ...key],
      },
    ],
  })
}

/** The .docx file as a Blob for a download link. */
export const paperDocx = (paper: Paper, settings: Settings, withKey: boolean) =>
  Packer.toBlob(paperDocument(paper, settings, withKey))
