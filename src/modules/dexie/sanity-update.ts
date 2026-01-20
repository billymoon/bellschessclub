"use server";
import { createClient } from "@sanity/client";
// import { unstable_noStore } from "next/cache";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: "2025-02-06",
    token: process.env.SANITY_SECRET, // Needed for certain operations like updating content, accessing drafts or using draft perspectives
});

const _id = process.env.NEXT_PUBLIC_SANITY_EPOCH_KEY || "data-epoch";

export const setDataEpoch = async (epoch: string) => {
    // unstable_noStore();
    const doc = {
        _id,
        _type: "dataEpoch",
        epoch,
    };

    // client.createIfNotExists(doc).then((res) => {
    //   console.log('Bike was created (or was already present)')
    // })

    //     client
    //   .patch('bike-123')
    //   .ifRevisionId('previously-known-revision')
    //   .set({title: 'Little Red Tricycle'})
    //   .commit()
    // 'select(*[_id == "data-epoch-develop"][0].epoch < "2026-01-19T18:59:05Z" => now(), *[_id == "data-epoch-develop"][0].epoch)
    await client.createOrReplace(doc);
};
