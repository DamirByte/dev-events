import EventCard from "./_components/EventCard";
import ExploreBtn from "./_components/ExploreBtn";
import { events } from "../lib/constants";

export default function page() {
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
          {events.map((event) => (
            <li className="list-none" key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
