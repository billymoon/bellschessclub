// db.ts
import { Dexie, type EntityTable } from "dexie"
import { DexieDocument } from "./dexie-schema"

const db = new Dexie("DocumentDatabase") as Dexie & {
  documents: EntityTable<
    DexieDocument,
    "_id" // primary key "_id" (for the typings only)
  >
}

// Schema declaration:
db.version(1).stores({
  documents: "&_id, _type, _createdAt, _updatedAt, _rev", // primary key "_id" (for the runtime!)
})

export { db }
