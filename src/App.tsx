import { useContext, useEffect, useRef, useState } from 'react'
import './App.css'
import { SqliteContext } from './SqliteContext';
import { MAIN_THIBI_DB } from './constants';
import { Link, Outlet } from 'react-router-dom';


function Parent() {
  const [isSqlClientReady, setIsSqlClientReady] = useState(false);
  const sqlClient = useRef(null);

  useEffect(() => {
    // sqlite3Worker1Promiser is available globally because of this script: sqlite3-worker1-promiser.js
    if (sqlClient.current == null) {
      // @ts-ignore: Trust me, this exists. :(
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
  const sqlite = useContext(SqliteContext);

  useEffect(() => {
    async function initDB() {
      console.info("Initializing database using `opfs`");
      // @ts-ignore: sqlite client currently has no type
      await sqlite('open', { filename: MAIN_THIBI_DB, vfs: 'opfs' })
        .then((x: unknown) => console.log(x))
        .catch((err: unknown) => { console.error(err) });
      setIsDbInitialized(true)
    }

    if (!isDbInitialized) {
      initDB();
    }
  }, [sqlite, isDbInitialized])


  return (
    <>
      <aside className='flex w-1/4 flex-col border-r-2 border-gray-200 bg-white p-2'>
        <nav className='flex flex-col items-center'>
          <ul className='space-y-4'>
            <li>
              <Link to='/' className='flex space-x-4'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <p> Home </p>
              </Link>
            </li>
            <li>
              <Link to='/upload' className='flex space-x-4'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p> Upload </p>
              </Link>
            </li>
          </ul>
        </nav >
      </aside >
      <main className='w-3/4'>
        <Outlet />
      </main>
    </>
  )
}

export default Parent
