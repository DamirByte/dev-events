import mongoose from "mongoose";
import { NextResponse, type NextRequest } from "next/server";

import { Event } from "@/_database";
import connectDB from "@/lib/mongodb";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

const isValidSlug = (value: string): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

/**
 * Handle GET requests for the event identified by the route `slug`.
 *
 * Validates the slug, loads the event from the database, and returns a JSON HTTP response
 * reflecting the outcome.
 *
 * @param context - Route context whose `params` Promise resolves to an object with `slug`
 * @returns A NextResponse with a JSON body:
 *   - 200: `{ message: "Event fetched successfully", event }`
 *   - 400: `{ message: "Missing slug parameter" }` when slug is empty
 *   - 400: `{ message: "Invalid slug format" }` when slug fails validation
 *   - 400: `{ message: "Validation error", error }` for Mongoose validation errors
 *   - 404: `{ message: "Event not found" }` when no matching event exists
 *   - 500: `{ message: "Failed to fetch event", error }` for other errors
 */
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { slug: rawSlug } = await context.params;
    const slug = rawSlug.trim();

    // Validate dynamic route input early to return consistent 400s.
    if (!slug) {
      return NextResponse.json(
        { message: "Missing slug parameter" },
        { status: 400 }
      );
    }

    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { message: "Invalid slug format" },
        { status: 400 }
      );
    }

    await connectDB();

    const event = await Event.findOne({ slug }).lean().exec();

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Normalize known Mongoose error types into client-friendly responses.
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: "Validation error", error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to fetch event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}