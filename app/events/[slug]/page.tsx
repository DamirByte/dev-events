import EventDetails from "@/app/_components/EventDetails";
import { Suspense } from "react";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = params.then((p) => p.slug);

  return (
    <main>
      <Suspense fallback={<div>Loading event details...</div>}>
        <EventDetails params={slug} />
      </Suspense>
    </main>
  );
}
