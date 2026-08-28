const A4 = 440;
const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

export function frequencyToNoteNumber(frequency) {
   return 69 + 12 * Math.log2(frequency / A4);
}

export function noteNumberToName(noteNumber) {
   const rounded = Math.round(noteNumber);
   const name = NOTE_NAMES[(rounded + 1200) % 12];
   const octave = Math.floor(rounded / 12) - 1;
   return name + octave;
}
