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
import { ColumnDef, RowSelection, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

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

interface ResultsTableProps {
  data: object[],
  // columns: ColumnDef<object[]>[]
}

const columnHelper = createColumnHelper<object>(); // this doesn't have to exist, we can just use objects

const defaultColumns = [
  // Accessor Column
  columnHelper.accessor('col1', {
    cell: info => info.getValue(),
    footer: props => props.column.id,
  }),
  // Accessor Column
  columnHelper.accessor(row => row.col2, {
    // id: crypto.randomUUID(),
    // cell: info => info.getValue(),
    header: "Column II</span>",
    // footer: props => props.column.id,
  }),
  {
    // header: "Column III",
    accessorKey: "col2"
  }
]

function QueryResultsTable(props: ResultsTableProps) {
  const table = useReactTable({
    data: props.data,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}

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
            ? <QueryResultsTable data={[{"col1": "columbia", "col3": "colombia", "col2": "astro"}]}/>
            : ""}
          {Object.keys(sqlResults).length != 0
            ? JSON.stringify(sqlResults, null, 4)
            : ""}

        </pre>
      </div>
    </>
  );
}
