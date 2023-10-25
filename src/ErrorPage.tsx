import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>
        These are not the droids you are looking for. Something went wrong and
        it's probably not your fault.
      </p>
      <p>
        {/* @ts-ignore: Not sure what to do to get type coverage from this React Router object */}
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
