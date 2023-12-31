"use client";

import { FieldValues, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useId, useState, useContext } from "react";
// @ts-ignore: Doesn't have types or something?
import { DateTime, Settings } from "luxon";

import { SqliteContext } from "./SqliteContext";
import { MessageType, SqliteClientFunction } from "./types/sqlite.promiser";

Settings.defaultZone = "utc";

interface FormProps {
  setFormSubmitted: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<never[]>>;
}

function ThibiForm(props: FormProps) {
  const { register, handleSubmit } = useForm();
  const id = useId();
  const sqlite = useContext(SqliteContext);

  return (
    <>
      <form onSubmit={handleSubmit((e) => submitHandler(e, props, sqlite))}>
        <div>
          <label
            htmlFor={id}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Choose a CSV
          </label>

          <input
            {...register("thibi-file", { required: true })}
            id={id}
            type="file"
            required
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="file_upload_help"
          />
          <p
            id="file_upload_help"
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          >
            Upload a file to start an analysis job for Thibi
          </p>
        </div>

        <input
          className="btn-primary text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="submit"
          value="Upload File"
        ></input>
      </form>
    </>
  );
}

async function submitHandler(
  values: FieldValues,
  props: FormProps,
  sqlite: SqliteClientFunction,
) {
  props.setFormSubmitted(true);
  // TODO: Parse file inputs and input those into its own file table
  await sqlite(MessageType.Exec, {
    sql: "INSERT INTO jobs (timestamp, file_name, table_identifier) VALUES ( ?, ?, ? )",
    bind: [
      DateTime.now().setZone("default").toISO(),
      values["thibi-file"][0].name,
      crypto.randomUUID(),
    ],
  });

  let results: never[] = [];
  await sqlite(MessageType.Exec, {
    sql: "SELECT * FROM jobs ORDER BY timestamp DESC",
    bind: [],
    returnValue: "resultRows",
    rowMode: "array",
  })
    .then((x: unknown) => {
      // @ts-ignore: TODO, will try to map to actual interface instead of unknown
      results = x.result?.resultRows;
    })
    .catch((err: unknown) => {
      console.error(err);
    });
  props.setLoading(results);
}

interface PreviewProps {
  uploadDone: string[][];
}

interface JobsProps {
  data: string[];
}

function JobsTable(props: JobsProps) {
  const data = props.data;
  const ts = DateTime.fromISO(data[1]).setZone("system").toISO();
  return (
    <tr className="border-b hover:bg-gray-50" key={data[0]}>
      <td key={crypto.randomUUID()}>{ts}</td>
      <td key={crypto.randomUUID()}>{data[2]}</td>
      <td key={crypto.randomUUID()}>{data[3]}</td>
    </tr>
  );
}

function UploadPreview(props: PreviewProps) {
  // https://upmostly.com/tutorials/how-to-add-a-dynamic-table-to-my-react-project
  const renderJobs = () => {
    return props.uploadDone.map((data) => {
      return <JobsTable key={data[0]} data={data}></JobsTable>;
    });
  };

  return props.uploadDone ? (
    <>
      <table className="w-full text-left table-auto border border-slate-200">
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-3">
              File Name
            </th>
            <th scope="col" className="px-6 py-3">
              Table Identifier
            </th>
          </tr>
        </thead>
        <tbody>{renderJobs()}</tbody>
      </table>
    </>
  ) : (
    <button
      type="button"
      className="btn-primary bg-lime-600 inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white hover:bg-lime-400 transition ease-in-out duration-150 cursor-not-allowed"
      disabled
    >
      {/* wow going to have to go learn how to do SVG animations now. holy smokes. */}
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Loading...
    </button>
  );
}

export default function Upload() {
  const [loaded, setLoaded] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <>
      <section className="text-left pl-4">
        <h2 className="text-4xl font-bold">Upload Documents</h2>
        <p>This is the upload page</p>
      </section>
      <section className="text-left pl-4 pt-4">
        <h3 className="text-3xl font-bold"> Upload Form</h3>
        <ThibiForm setFormSubmitted={setFormSubmitted} setLoading={setLoaded} />
      </section>

      {formSubmitted && (
        <section className="text-left pl-4 pt-4">
          <h4 className="text-2xl font-bold">Latest Upload Jobs</h4>
          <UploadPreview uploadDone={loaded} />
        </section>
      )}
    </>
  );
}
