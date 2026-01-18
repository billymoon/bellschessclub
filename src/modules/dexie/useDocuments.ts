import { useDexieStore } from "./dexie-store-provider";
import jsonata from "@mmkal/jsonata/sync";

export const useDocuments = (query?: string) => {
    const documents = useDexieStore((state) => state.documents);
    if (query) {
        return jsonata(query).evaluate(documents);
    } else {
        return documents;
    }
};
