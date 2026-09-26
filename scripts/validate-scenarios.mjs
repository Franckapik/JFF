import { AstBuilder, compile, GherkinClassicTokenMatcher, Parser } from "@cucumber/gherkin";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const directory = new URL("../docs/bot-spec/scenarios/", import.meta.url);
const files = readdirSync(directory).filter(file => file.endsWith(".feature")).sort();
const identifiers = new Set();
let nextId = 0;
let cases = 0;
const newId = () => String(++nextId);
assert.ok(files.length > 0, "No feature files found");

function validateChildren(children, file) {
  for (const child of children) {
    if (child.rule) validateChildren(child.rule.children, file);
    if (!child.scenario) continue;
    const scenario = child.scenario;
    const ids = scenario.tags.filter(tag => /^@[A-Z]+-\d{2}$/.test(tag.name));
    assert.equal(ids.length, 1, `${file}: ${scenario.name} must have one stable identifier`);
    assert.ok(!identifiers.has(ids[0].name), `Duplicate identifier: ${ids[0].name}`);
    identifiers.add(ids[0].name);
    assert.ok(scenario.steps.length > 0, `${file}: empty scenario ${scenario.name}`);
    for (const example of scenario.examples) assert.ok(example.tableBody.length > 0, `${file}: empty examples`);
  }
}

for (const file of files) {
  const document = new Parser(new AstBuilder(newId), new GherkinClassicTokenMatcher()).parse(readFileSync(new URL(file, directory), "utf8"));
  assert.ok(document.feature, `${file}: missing feature`);
  assert.equal(document.feature.language, "fr", `${file}: expected French dialect`);
  assert.ok(document.feature.tags.some(tag => tag.name === "@socle"), `${file}: missing scope tag`);
  validateChildren(document.feature.children, file);
  const pickles = compile(document, file, newId);
  assert.ok(pickles.length > 0, `${file}: no concrete examples`);
  cases += pickles.length;
}
console.log(`${files.length} fichiers, ${identifiers.size} scenarios identifies, ${cases} cas decrits.`);
console.log("Syntaxe et identifiants verifies ; les etapes Gherkin ne sont pas executees.");