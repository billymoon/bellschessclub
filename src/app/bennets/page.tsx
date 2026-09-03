import { MapLinkButton } from "@/components/MapLinkButton";
import Image from "next/image";
import jamesOutsideBennetsBubble from "../../../public/james-outside-bennets-bubble.jpg";

export default function Home() {
  return (
    <>
      <Image
        src={jamesOutsideBennetsBubble}
        alt="Pre Season Scramble Poster 2026"
        className="w-full h-140 md:h-full object-cover m-auto max-w-4xl"
      />
      <div className="pt-6 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <h3 className="text-3xl md:text-4xl font-bold text-foreground">
          Back Stage at Bennets Bar
        </h3>
        <p className="font-semibold">
          8 Leven St, Edinburgh EH3 9LG
          <MapLinkButton href="https://maps.app.goo.gl/yTHbsmWTdC7i9vBT7" />
        </p>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <p>
          Come along on any Thursday from 8pm, where there will be a few tables
          reserved for chess. Bring a board or grab one from the games cupboard.
          There is always a good atmosphere so you can turn up on your own, or
          with friends and get a game.
        </p>
        <br />
        <p>
          The barman James who runs the show, can invite you to a WhatsApp group
          to stay in the loop.
        </p>
        <br />
        <p>
          There are usually a number of players from Bells Chess Club, because
          it's the most fun chess night in Edinburgh.
        </p>
      </div>
      <div className="mt-10" />
    </>
  );
}
