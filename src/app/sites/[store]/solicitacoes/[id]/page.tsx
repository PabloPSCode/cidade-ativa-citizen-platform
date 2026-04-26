import SolicitationDetailsPage from "../../../../solicitacoes/[id]/page";

export default async function StoreSolicitationDetailsPage({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) {
  const { id } = await params;

  return <SolicitationDetailsPage params={Promise.resolve({ id })} />;
}
