import test from "node:test";
import assert from "node:assert/strict";

import { frequencyToNoteNumber, noteNumberToName } from "../docs/js/tuner-core.mjs";

test("frequencyToNoteNumber maps concert A4 to MIDI note 69", () => {
   assert.equal(frequencyToNoteNumber(440), 69);
});

test("frequencyToNoteNumber maps middle C to MIDI note 60", () => {
   assert.ok(Math.abs(frequencyToNoteNumber(261.625565) - 60) < 0.000001);
});

test("noteNumberToName formats notes and octaves", () => {
   assert.equal(noteNumberToName(60), "C4");
   assert.equal(noteNumberToName(69), "A4");
   assert.equal(noteNumberToName(70), "A♯4");
});

test("noteNumberToName rounds to the nearest note", () => {
   assert.equal(noteNumberToName(60.49), "C4");
   assert.equal(noteNumberToName(60.51), "C♯4");
});
