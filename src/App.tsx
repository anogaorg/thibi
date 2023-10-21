import { useContext, useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SqliteContext } from './SqliteContext';


function Parent() {
  const [isSqlClientReady, setIsSqlClientReady] = useState(false);
  const sqlClient = useRef(null);

  useEffect(() => {
    // sqlite3Worker1Promiser is available globally because of this script: sqlite3-worker1-promiser.js
    if (sqlClient.current == null) {
      const client = self.sqlite3Worker1Promiser({
        onready: () => {
          setIsSqlClientReady(true);
        }
      });
      sqlClient.current = client;
    }
  }, []);

  // TODO: Put a message/note if the client is not ready; not just an empty div.
  return (
    <SqliteContext.Provider value={sqlClient.current}>
      <>
        {isSqlClientReady ? <App /> : <div></div>}
      </>
    </SqliteContext.Provider>
  )
}

function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const sqlClient = useContext(SqliteContext);

  useEffect(() => {
    async function initDB() {
      console.info("Initializing database using `opfs`");
      await sqlClient('open', { filename: '/dev.anoga.thibi.db', vfs: 'opfs' })
        .then((x: unknown) => console.log(x))
        .catch((err: unknown) => { console.error(err) });
      setIsDbInitialized(true)
    }

    if (!isDbInitialized) {
      initDB();
    }
  }, [])


  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p className="text-3xl font-bold underline">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default Parent
