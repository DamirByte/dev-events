"use server";

import { Event } from "@/_database";
import connectDB from "../mongodb";

/**
 * Finds events that share any tag with the event identified by the given slug, excluding that event.
 *
 * @param slug - The slug of the reference event to find similar events for
 * @returns An array of plain JavaScript objects for events that share at least one tag with the reference event and do not have the same `_id`; returns an empty array if the reference event is not found or on error
 */
export async function getSimilarEventsBySlug(slug: string) {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });

    if (!event) return [];

    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();
  } catch {
    return [];
  }
}