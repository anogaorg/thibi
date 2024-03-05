# thibi

(Data) Verification as a Service

# Local Development

Install dependencies with `yarn` command. (Install Nodejs if you do not have it)

`yarn dev` to start development server with hot reload.

To run what would be the production build, do `yarn build` and `yarn preview`.

## Offline Tests

To test the Offline Service worker, use Chrome >> DevTools >> Application >> Service workers >> (verify the service worker is activated and running) >> click the checkbox that says "Offline". Now the worker will operate as if offline.

## Local SQLite3 Testing

You can run `sqlite3` locally. There are some helpful commands to know:

```
.headers on (show table columns when returning query results)
.mode line (equivalent of \G in MySQL)
```

# Icons

For icons, use [Heroicons](https://heroicons.com/). Copying the SVG seems to be working okay so far.

Another icon provider is [Flowbite](https://flowbite.com/icons/).

# SQLite

I am still new to the JS ecosystem, but so far it seems like to get this to work, even with the NPM module, one still has to copy a bunch of the JS assets to your final deployed assets. This is primarily because I am interested in using the Worker1 Promiser approach to querying. In the past, I used [this client](https://github.com/magieno/sqlite-client-demo/tree/master) to get better egonomics. I do want to fuss with the lower-level APIs a little bit before choosing a higher-level abstraction. I think I spent a lot of time primarily because I don't fully understand how packaging/bundlers/etc. work in Javascript land. It's been a configuration nightmare and will take some getting used to.

NOTE: The NPM package is still helpful, at least for types. Though types themselves have also been kind of painful. There's a world where I just stay up to date with the releases directly and update as needed directly from [their release page/WASM .zip file.](https://sqlite.org/download.html)

But hey, it works for now.

## Query Options

The `Exec` options aren't easily discoverable. This is a reminder of myself to review this and the code to understand how it's supposed to work/what options you can use: https://sqlite.org/wasm/file/demo-123.js?txt.

# Tailwind Tips

Tailwind is nice, but it might still be a little low-level than what I'm looking for as a beginner CSS human. Liked what [Flowbite](https://flowbite.com/docs/components/forms/#file-upload) has done. It will be good to use them as a learning reference for doing custom components/stylings.

# Gratitude

If I end up using the `codemirror` project, I should consider giving thanks via contributions.
