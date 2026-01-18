"use server";
import { createClient } from "@sanity/client";
import { unstable_noStore } from "next/cache";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: "2025-02-06",
    token: process.env.SANITY_SECRET, // Needed for certain operations like updating content, accessing drafts or using draft perspectives
});

export const setDataEpoch = async (epoch: string) => {
    unstable_noStore();
    const doc = {
        _id: "data-epoch",
        _type: "dataEpoch",
        epoch,
    };

    client.createOrReplace(doc);
};
