import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import {
  defaultKeymap,
  historyKeymap,
  history as codemirrorHistory,
} from "@codemirror/commands";
import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  foldKeymap,
} from "@codemirror/language";
import { lintKeymap } from "@codemirror/lint";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import {
  EditorView,
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import { Extension, EditorState } from "@codemirror/state";
import { SQLite, sql as codemirrorSql } from "@codemirror/lang-sql";

const extensions: Extension = (() => [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  codemirrorHistory(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),
  codemirrorSql({ dialect: SQLite, upperCaseKeywords: true }),
])();

const editor: EditorView = new EditorView({
  extensions: extensions,
});

export function SqlExplorer() {
  return (
    <>
      <div
        className="text-start"
        ref={(ref) => ref?.appendChild(editor.dom)}
      ></div>
    </>
  );
}
