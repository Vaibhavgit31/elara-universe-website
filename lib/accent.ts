/** Splits a name so its last word can take the crayon underline: "Basic Hindi Reader" →
 *  { title: 'Basic Hindi', accent: 'Reader' }; a one-word name (TechNova) gets no accent. */
export function splitAccent(name: string) {
  const cut = name.lastIndexOf(' ')
  return cut > 0 ? { title: name.slice(0, cut), accent: name.slice(cut + 1) } : { title: name }
}
