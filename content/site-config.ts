// Switches for the "fun extras for children". Set any of them to false to turn the extra off.
export const siteConfig = {
  /** Visiting each of the six pages earns a sticker; all six earn the Bookworm badge. */
  stickerBook: true,
  /** Three mini activities on the home page (trace अ, name in binary, colour Elu). */
  playCorner: true,
  /** The desk behind the pages gets warmer in the evening and shows a desk lamp. */
  timeOfDayDesk: true,
  /** Small decorations on the dates below. */
  festivals: true,
  /** Speaker toggle for the flip-pad page-turn sound (off by default, choice remembered). */
  pageTurnSound: true,
  /** Evening starts at this hour (24 h, visitor's local time). */
  eveningFromHour: 18,
  /** Festival windows (inclusive ISO dates). [PLACEHOLDER] check the dates each year. */
  festivalDates: [
    { name: 'Diwali', from: '2026-11-06', to: '2026-11-10', decoration: 'diyas' },
    { name: 'Makar Sankranti', from: '2027-01-13', to: '2027-01-15', decoration: 'kites' },
  ] as { name: string; from: string; to: string; decoration: 'diyas' | 'kites' }[],
}
