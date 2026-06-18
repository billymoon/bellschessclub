import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { MapLinkButton } from "@/components/MapLinkButton";
import Image from "next/image";
import venue from "../../public/venue.png";

export default function Home() {
  return (
    <div className="pt-6 flex flex-col items-center max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <h2 className="text-4xl md:text-5xl font-bold text-foreground">
        Chess Club Nights
      </h2>
      <div className="text-center space-y-6 text-foreground pt-4">
        <p className="text-2xl md:text-3xl font-semibold">
          Tuesday Evenings <br /> 7.00 pm - 10:30 pm
        </p>

        <h3 className="text-3xl md:text-4xl font-bold text-foreground">
          Edinburgh West End Bowling Club
        </h3>
        <p className="font-semibold">
          13 Hailes St, Edinburgh EH3 9NF
          <MapLinkButton href="https://maps.app.goo.gl/hEGp6269cyveNRqH8" />
        </p>
        <div className="max-w-[800px]">
          <Image src={venue} alt="" />
        </div>

        <div className="text-lg md:text-xl leading-relaxed space-y-2">
          <p>
            Come along for a friendly game or contact us to find out more...
          </p>
        </div>
        <div className="text-center text-lg md:text-xl leading-relaxed space-y-2">
          <p className="p-0 m-0 font-semibold">Mike Wallace</p>
          <p className="p-0 m-0">(club secretary)</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            className="text-lg gap-2 bg-transparent"
            asChild
          >
            <a href="tel:07503448568">
              <Phone className="h-5 w-5" />
              07503 448568
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg gap-2 bg-transparent"
            asChild
          >
            <a href="mailto:mike.j.wallace17@outlook.com">
              <Mail className="h-5 w-5" />
              Email Mike
            </a>
          </Button>
        </div>
      </div>
      <p className="my-5">
        Feel free to share this website with others who are interested to join
        us
      </p>
      <QRCodeSVG
        value="https://www.sandybells.club/"
        style={{
          width: "200px",
          maxWidth: "100%",
          height: "200px",
          maxHeight: "100%",
        }}
      />
      <div className="p-2">https://www.sandybells.club/</div>
    </div>
  );
}
