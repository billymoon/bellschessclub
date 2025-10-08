// eslint-ignore-next-line  @typescript-eslint/ban-ts-comment
// @ts-nocheck
const stack = [];

const promisedDatabase: Promise<Worker> = new Promise(async (resolve) => {
  // don't try to run service worker server side
  if (typeof window === "undefined") return;
  // TODO: why don't we need to run initBackend?
  // const { initBackend } =
  await import(
    "@aphro/absurd-sql/dist/indexeddb-main-thread"
  );
  const databaseWorker = new Worker(
    new URL("../modules/database.worker.ts", import.meta.url),
  );
  databaseWorker.onmessage = (evt) => {
    stack.shift()(evt.data);
  };
  resolve(databaseWorker);
});

export const run = (sql) =>
  new Promise(async (resolve) => {
    const documentDB = await promisedDatabase;
    stack.push(() => resolve(null));
    documentDB.postMessage({ action: "run", args: [sql] });
  });

export const exec = (sql) =>
  new Promise(async (resolve) => {
    const documentDB = await promisedDatabase;
    stack.push(resolve);
    documentDB.postMessage({ action: "exec", args: [sql] });
  });
