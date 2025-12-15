import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

export interface IEvent {
  title: string;
  // Auto-generated from title (kept optional for create calls; enforced in pre-save).
  slug?: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // normalized ISO date (YYYY-MM-DD)
  time: string; // normalized 24h time (HH:mm)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

export type EventDocument = HydratedDocument<IEvent>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const slugify = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeISODate = (raw: string): string => {
  const value = raw.trim();

  // Prefer keeping an explicit YYYY-MM-DD, but still validate it.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const asDate = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(asDate.getTime())) throw new Error("Invalid date");
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new Error("Invalid date");
  // Build YYYY-MM-DD from UTC components to avoid timezone drift.
  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const day = String(parsed.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeTime = (raw: string): string => {
  const value = raw.trim();

  // 24h formats: HH:mm or HH:mm:ss
  const hm = /^([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(value);
  if (hm) {
    const hh = hm[1].padStart(2, "0");
    const mm = hm[2];
    return `${hh}:${mm}`;
  }

  // 12h formats: h(:mm) am/pm
  const ap = /^(\d{1,2})(?::([0-5]\d))?\s*(am|pm)$/i.exec(value);
  if (ap) {
    let hours = Number(ap[1]);
    const minutes = ap[2] ? Number(ap[2]) : 0;
    const suffix = ap[3].toLowerCase();

    if (hours < 1 || hours > 12) throw new Error("Invalid time");
    if (minutes < 0 || minutes > 59) throw new Error("Invalid time");

    if (suffix === "pm" && hours !== 12) hours += 12;
    if (suffix === "am" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }

  throw new Error("Invalid time");
};

const nonEmptyArray = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((item) => typeof item === "string" && item.trim().length > 0);

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: nonEmptyArray,
        message: "Agenda must be a non-empty array of non-empty strings",
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: nonEmptyArray,
        message: "Tags must be a non-empty array of non-empty strings",
      },
    },
  },
  {
    timestamps: true, // auto-manage createdAt/updatedAt
  }
);

EventSchema.pre<EventDocument>("save", function () {
  // Guard against whitespace-only strings that pass `required: true`.
  const requiredStrings: Array<
    keyof Pick<
      IEvent,
      | "title"
      | "description"
      | "overview"
      | "image"
      | "venue"
      | "location"
      | "date"
      | "time"
      | "mode"
      | "audience"
      | "organizer"
    >
  > = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const key of requiredStrings) {
    if (!isNonEmptyString(this[key])) {
      throw new Error(`${key} is required`);
    }
  }

  if (!nonEmptyArray(this.agenda)) throw new Error("agenda is required");
  if (!nonEmptyArray(this.tags)) throw new Error("tags is required");

  // Only regenerate slug when title changes (or if it's missing on a new document).
  if (this.isNew || this.isModified("title") || !isNonEmptyString(this.slug)) {
    const nextSlug = slugify(this.title);
    if (!nextSlug) throw new Error("Unable to generate slug from title");
    this.slug = nextSlug;
  }

  // Normalize date/time to consistent storage formats.
  if (this.isNew || this.isModified("date"))
    this.date = normalizeISODate(this.date);
  if (this.isNew || this.isModified("time"))
    this.time = normalizeTime(this.time);
});

export const Event: Model<IEvent> =
  (models.Event as Model<IEvent>) || model<IEvent>("Event", EventSchema);
