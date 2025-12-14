"use client";

import Image from "next/image";

export default function ExploreBtn() {
  return (
    <button
      id="explore-btn"
      type="button"
      className="mt-7 mx-auto"
      onClick={() => console.log("CLJICK")}
    >
      <a href="#events">Explore Events</a>
      <Image
        src="/icons/arrow-down.svg"
        alt="arrow-down"
        width={24}
        height={24}
      />
    </button>
  );
}
