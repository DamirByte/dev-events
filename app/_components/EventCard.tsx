import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

/**
 * Renders a clickable event card that links to the event detail page derived from `slug`.
 *
 * @param title - The event's title shown on the card
 * @param image - Source URL or path for the event poster image
 * @param slug - URL-friendly identifier used to build the event detail link (e.g., `/events/{slug}`)
 * @param location - The event's venue or location text
 * @param date - Human-readable date string to display
 * @param time - Human-readable time string to display
 * @returns A JSX element representing the event card linking to the event's detail page
 */
export default function EventCard({
  title,
  image,
  slug,
  location,
  date,
  time,
}: Props) {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        src={image}
        alt={title}
        className="poster"
        width={410}
        height={300}
      />

      <div className="flex flex-row gap-2">
        <Image
          src="/icons/pin.svg"
          alt="location icon"
          width={14}
          height={14}
        />
        <p>{location}</p>
      </div>

      <p className="title">{title}</p>

      <div className="datetime">
        <div>
          <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
          <p>{date}</p>
        </div>
        <div>
          <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
}