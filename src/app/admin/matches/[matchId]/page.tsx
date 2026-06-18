"use server";
import ClientPage from "./client-page";

export default async function Page({ params }) {
  return <ClientPage params={await params} />;
}
