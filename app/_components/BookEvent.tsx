"use client";
import { useState } from "react";

/**
 * Renders an email sign-up form and, after submission, displays a short confirmation message.
 *
 * The form accepts an email address and, when submitted, prevents the default navigation and
 * switches the UI to a "Thank you for signing up!" message after a short delay.
 *
 * @returns A React element containing the sign-up form or the confirmation message
 */
export default function BookEvent() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  }

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
            />
          </div>
          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}