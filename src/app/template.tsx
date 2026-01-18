"use client";
import { db } from "@/modules/dexie/db";
import { getDocumentsSince } from "@/modules/turso";
import { useEffect, useState } from "react";
import {
  DexieStoreProvider,
  useDexieStore,
} from "@/modules/dexie/dexie-store-provider";
import { DexieDocument } from "@/modules/dexie/dexie-schema";
import { useLiveQuery } from "dexie-react-hooks";
import { createClient } from "@sanity/client";
import { useServerStore } from "@/stores/server-store-provider";
import { MembersHeader } from "@/components/MembersHeader";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2025-02-06",
});

const freshenLocalDocumentsFromRemoteDatabase = async (dataEpoch: string) => {
  const newDocuments = await getDocumentsSince(dataEpoch);
  newDocuments.map((newDocument) => db.documents.put(newDocument));
};

const UpdateDox = () => {
  const setDexieData = useDexieStore((state) => state.setDexieData);
  const documents = useLiveQuery(() => db.documents.toArray());

  useEffect(() => {
    const sanityListener = sanityClient
      .listen(`*[_id == "${process.env.NEXT_PUBLIC_SANITY_EPOCH_KEY || "data-epoch"}"]`)
      .subscribe(async (update) => {
        if (update.result?.epoch) {
          freshenLocalDocumentsFromRemoteDatabase(update.result?.epoch);
        }
      });

    return () => {
      sanityListener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (documents?.length) {
      setDexieData({ documents });
    }
  }, [documents]);

  return null;
};

const LoadingComponent = () => "Loading...";
const useLoadingMessage = ({ delay } = { delay: 1000 }) => {
  const [loadingMessage, setLoadingMessage] = useState(
    delay ? "" : <LoadingComponent />,
  );
  useEffect(() => {
    const timeout = delay
      ? setTimeout(() => {
          setLoadingMessage(<LoadingComponent />);
        }, delay)
      : undefined;

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return loadingMessage;
};

const useInitialDocuments = () => {
  const [loadedDocuments, setLoadedDocuments] = useState<
    DexieDocument[] | null
  >(null);

  useEffect(() => {
    void (async () => {
      const currentDocuments = await db.documents.toArray();
      const dataEpoch =
        currentDocuments?.sort((a, b) =>
          a._updatedAt > b._updatedAt ? -1 : 1,
        )[0]?._updatedAt || new Date("1000").toISOString();

      await freshenLocalDocumentsFromRemoteDatabase(dataEpoch);
      setLoadedDocuments(await db.documents.toArray());
    })();
  }, []);

  return loadedDocuments;
};

export default function Template({ children }: { children: React.ReactNode }) {
  try {
    const cookieUserInfo = useServerStore((state) => state.cookieUserInfo);
    const loadingMessage = useLoadingMessage();
    const documents = useInitialDocuments();

    if (!cookieUserInfo!.isMember) {
      db.delete();
      return children;
    }

    return documents ? (
      <DexieStoreProvider
        initialData={{
          documents,
          cookieUserInfo,
        }}
      >
        <MembersHeader />
        <UpdateDox />
        {children}
      </DexieStoreProvider>
    ) : (
      <>{loadingMessage}</>
    );
  } catch (err) {
    console.log({ err })
    return children
  }
}
