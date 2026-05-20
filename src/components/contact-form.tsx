"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/ui/section";

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus("sent");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <Section>
      <h2 className="text-xl font-bold dark:text-white">Get in Touch</h2>
      <p className="text-pretty font-mono text-sm text-muted-foreground dark:text-gray-400">
        Have a question or want to collaborate? Send me a message and I&apos;ll get back to you.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.message}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" disabled={status === "sending"} className="w-full">
          {status === "sending" ? "Sending..." : "Send Message"}
        </Button>
        {status === "sent" && (
          <p className="text-center text-sm text-green-600 dark:text-green-400">Message sent! I&apos;ll get back to you soon.</p>
        )}
        {status === "error" && (
          <p className="text-center text-sm text-destructive">Something went wrong. Please try again.</p>
        )}
      </form>
    </Section>
  );
}
