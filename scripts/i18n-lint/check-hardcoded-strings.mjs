import fs from "node:fs";
import ts from "typescript";

const IGNORE_ATTRS = new Set(["placeholder", "title", "aria-label", "alt"]);
const IGNORE_MARKER = "i18n-ignore";

function hasLetters(text) {
  return /\p{L}/u.test(text);
}

// Suppression is a plain substring match on the flagged line (or the line above),
// e.g. `<span>ETH</span> {/* i18n-ignore */}` or a `// i18n-ignore` comment above.
function isSuppressed(sourceFile, node) {
  const lines = sourceFile.getFullText().split("\n");
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  const currentLine = lines[line] ?? "";
  const previousLine = lines[line - 1] ?? "";
  return currentLine.includes(IGNORE_MARKER) || previousLine.includes(IGNORE_MARKER);
}

function recordIfViolation(sourceFile, node, rawText, violations) {
  const text = rawText.trim();
  if (!text || !hasLetters(text) || isSuppressed(sourceFile, node)) return;

  const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  violations.push({ file: sourceFile.fileName, line: line + 1, column: character + 1, text });
}

export function checkSource(sourceText, fileName) {
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  const violations = [];

  function visit(node) {
    if (ts.isJsxText(node)) {
      recordIfViolation(sourceFile, node, node.getText(), violations);
    } else if (
      ts.isJsxAttribute(node) &&
      ts.isIdentifier(node.name) &&
      IGNORE_ATTRS.has(node.name.text) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer)
    ) {
      recordIfViolation(sourceFile, node, node.initializer.text, violations);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return violations;
}

export function checkFile(filePath) {
  return checkSource(fs.readFileSync(filePath, "utf8"), filePath);
}

export function checkFiles(filePaths) {
  return filePaths.flatMap(checkFile);
}
