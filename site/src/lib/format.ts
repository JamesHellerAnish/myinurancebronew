// Prose formatting shared by the page templates and the llms.txt generators.
//
// These read as trivia until you remember every string here is stamped onto every plan
// page and into the file we hand to language models. "1 complaints per 10,000 claims"
// is the kind of detail that makes a data-led site look like it was not read by anyone.

/** "1 complaint" / "2.77 complaints" — complaint counts are per 10,000 claims, so fractional. */
export function complaintsPhrase(count: number): string {
  return `${count} ${count === 1 ? 'complaint' : 'complaints'}`
}
