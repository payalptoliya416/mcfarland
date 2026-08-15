import ClientPage from "./ClientPage";

export function generateStaticParams() {
  return [{ slug: [] }];
}

export default function Page() {
  return <ClientPage />;
}
