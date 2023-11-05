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
import React, { useContext, useState } from "react";
import { MessageType } from "../types/sqlite.promiser.ts";
import { SqliteContext } from "../SqliteContext";

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
  const sqlite = useContext(SqliteContext);
  const [sqlResults, setSqlResults] = useState({});

  return (
    <>
      <div
        className="text-start"
        ref={(ref) => ref?.appendChild(editor.dom)}
      ></div>
      <form className="text-start">
        <textarea id="sql-editor" hidden></textarea>{" "}
        {/* TODO: Not sure that I need this textarea per se. */}
        <button
          type="submit"
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            // TODO: Add try-catch and display nice error message
            const r = await sqlite(MessageType.Exec, {
              sql: editor.state.doc.toString(),
              bind: [],
              returnValue: "resultRows",
              rowMode: "object",
            });
            setSqlResults(r);
          }}
        >
          Run
        </button>
      </form>
      <div className="text-start">
        TODO: A nice tabular display of the query results.
        <br />
        <pre className="text-start">
          {Object.keys(sqlResults).length != 0
            ? JSON.stringify(sqlResults, null, 4)
            : ""}
        </pre>
      </div>
    </>
  );
}
