export type Event = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
  url?: string;
  description?: string;
};

export const events: Event[] = [
  {
    title: "React Summit",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    location: "Lisbon, Portugal",
    date: "2026-03-10",
    time: "09:00",
    url: "https://reactsummit.com/",
    description:
      "A community-focused conference about React and the surrounding ecosystem.",
  },
  {
    title: "JSConf US",
    image: "/images/event2.png",
    slug: "jsconf-us-2026",
    location: "Austin, TX, USA",
    date: "2026-04-16",
    time: "10:00",
    url: "https://jsconf.com/",
    description:
      "JavaScript conference with talks, workshops, and community events.",
  },
  {
    title: "Google I/O",
    image: "/images/event3.png",
    slug: "google-io-2026",
    location: "Mountain View, CA, USA",
    date: "2026-05-14",
    time: "10:00",
    url: "https://events.google.com/io/",
    description:
      "Google's annual developer conference showcasing the latest in web and mobile.",
  },
  {
    title: "ETHDenver",
    image: "/images/event4.png",
    slug: "ethdenver-2026",
    location: "Denver, CO, USA",
    date: "2026-02-28",
    time: "09:00",
    url: "https://www.ethdenver.com/",
    description:
      "One of the largest Ethereum and web3-focused hackathons and conferences.",
  },
  {
    title: "Microsoft Build",
    image: "/images/event5.png",
    slug: "microsoft-build-2026",
    location: "Seattle, WA, USA",
    date: "2026-05-19",
    time: "09:00",
    url: "https://mybuild.microsoft.com/",
    description:
      "Microsoft's annual conference for developers building applications on Azure and more.",
  },
  {
    title: "Next.js Conf",
    image: "/images/event6.png",
    slug: "nextjs-conf-2026",
    location: "Online",
    date: "2026-03-01",
    time: "10:00",
    url: "https://nextjs.org/conf",
    description:
      "The official conference for the Next.js community and ecosystem.",
  },
  {
    title: "Cloud & Dev Meetup (City)",
    image: "/images/event-full.png",
    slug: "cloud-dev-meetup-city",
    location: "Remote / Local venues",
    date: "2026-01-20",
    time: "18:30",
    description:
      "A monthly meetup for cloud engineers and developers to share stories and demos.",
  },
];

export default events;
