import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
  type Types,
} from 'mongoose';

import { Event } from './event.model';

export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
}

export type BookingDocument = HydratedDocument<IBooking>;

const isValidEmail = (value: string): boolean =>
  // Pragmatic email check suitable for most product use-cases.
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // speeds up event-based lookups
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => isValidEmail(value),
        message: 'Invalid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.pre<BookingDocument>('save', async function () {
  // Ensure bookings can only reference existing events.
  if (this.isNew || this.isModified('eventId')) {
    const exists = await Event.exists({ _id: this.eventId });
    if (!exists) throw new Error('Referenced event does not exist');
  }

  if (!isValidEmail(this.email)) throw new Error('Invalid email address');
});

export const Booking: Model<IBooking> =
  (models.Booking as Model<IBooking>) || model<IBooking>('Booking', BookingSchema);
