import { IEvent } from "@/_database/event.model";
import EventCard from "./_components/EventCard";
import ExploreBtn from "./_components/ExploreBtn";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Server component that fetches events from the application's API and renders the home section with a heading, an explore button, and featured event cards.
 *
 * @returns The homepage JSX section containing the heading, subheading, an Explore button, and a list of featured event cards (the list may be empty if the API returns no events).
 */
export default async function page() {
  "use cache";
  cacheLife("hours");

  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

  return (
    <section id="home">
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups and Conferences, All in One Place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7 ">
        <h3>Featured Events</h3>

        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li className="list-none" key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}