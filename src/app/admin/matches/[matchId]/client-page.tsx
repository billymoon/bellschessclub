"use client";
import { useDocuments } from "@/modules/dexie/useDocuments";
import { EditPage } from "../EditPage";

export default function Page({ params: { matchId } }) {
  const venueNames = useDocuments('$[_type = "match"].venue ~> $distinct');
  const opponentNames = useDocuments(
    '$[_type = "match"].opponent ~> $distinct',
  );
  const currentDocument = useDocuments(`$[_id = "${matchId}"]`);
  // const mapLinks = useDocuments('$[_type = "match"].mapLink ~> $distinct')
  console.log({ currentDocument });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <EditPage
        venueNames={venueNames}
        opponentNames={opponentNames}
        currentDocument={currentDocument}
      />
    </div>
  );
}
