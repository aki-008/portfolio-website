"use client";

import { useState } from "react";
import { Section } from "@/components/ui/section";

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const scriptURL = "https://script.google.com/macros/s/AKfycbySQV343fXKgMbJlcBGZCpOAokfavDjYvU2gaHM0obkunTs3L6_5tSZqU3TTTTU3QB1/exec";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const form = new FormData(e.currentTarget);
      const response = await fetch(scriptURL, { method: "POST", body: form });
      if (response.ok) {
        setStatus("sent");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <Section className="mt-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center dark:text-white">Contact Us</h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">We will get back to you asap!</p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono mb-1">First Name</label>
              <input
                type="text" name="firstName" required
                className="w-full border rounded px-3 py-2"
                value={formData.firstName} onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-mono mb-1">Last Name</label>
              <input
                type="text" name="lastName" required
                className="w-full border rounded px-3 py-2"
                value={formData.lastName} onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-mono mb-1">Email</label>
            <input
              type="email" name="email" required
              className="w-full border rounded px-3 py-2"
              value={formData.email} onChange={handleChange}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block font-mono mb-1">Message</label>
            <textarea
              name="message" rows={5} required
              className="w-full border rounded px-3 py-2"
              value={formData.message} onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send"}
          </button>

          {status === "sent" && <p className="text-center text-green-600 mt-2">Message sent!</p>}
          {status === "error" && <p className="text-center text-red-600 mt-2">Oops, something went wrong.</p>}
        </form>
      </div>
    </Section>
  );
}
