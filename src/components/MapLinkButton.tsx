import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import Link from "next/link";

type MapLinkButton = (props: { href: string; Icon?: typeof Map }) => ReactNode;

export const MapLinkButton: MapLinkButton = ({ href, Icon = Map }) => (
  <Button
    variant="ghost"
    size="lg"
    className="text-lg gap-2 bg-transparent"
    asChild
  >
    <Link href={href} target="_blank">
      <Icon className="h-5 w-5" />
      Map
    </Link>
  </Button>
);
