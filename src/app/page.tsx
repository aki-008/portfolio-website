"use client";

import { useEffect, useState } from 'react';
import { RESUME_DATA } from "../data/resume-data";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CommandMenu } from "../components/command-menu";
import { Section } from "../components/ui/section";
import { GlobeIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { ProjectCard } from "../components/project-card";
import { SunIcon, MoonIcon } from "lucide-react";
import { ContactForm } from "../components/contact-form";

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 bg-gray-800 text-white rounded-md dark:bg-gray-200 dark:text-gray-800 print:hidden"
      >
        {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
      </button>
      <section className="mx-auto w-full max-w-5xl space-y-8 bg-white dark:bg-gray-800 print:space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold dark:text-white">{RESUME_DATA.name}</h1>
            <p className="text-pretty font-mono text-sm text-muted-foreground dark:text-gray-400">
              {RESUME_DATA.about}
            </p>
            <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground dark:text-gray-400">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href={RESUME_DATA.personalWebsiteUrl}
                target="_blank"
              >
                <GlobeIcon className="h-3 w-3" style={{ marginTop: "-2px" }} />
                {RESUME_DATA.personalWebsiteUrl}
              </a>
            </p>
            <div className="flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground">
              {RESUME_DATA.contact.social.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="icon"
                  asChild
                  className="h-8 w-8 hover:text-blue-500 hover:underline"
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    title={`${social.name}: ${social.url}`}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* <div className="flex flex-col gap-y-1 font-mono text-sm text-muted-foreground text-right">
            {RESUME_DATA.location ? (
              <p className="text-muted-foreground dark:text-gray-400">
                <span>{RESUME_DATA.location}</span>
              </p>
            ) : null}
            {RESUME_DATA.contact.email ? (
              <a href={`mailto:${RESUME_DATA.contact.email}`}>
                <span>Email: {RESUME_DATA.contact.email}</span>
              </a>
            ) : null}
            {RESUME_DATA.contact.tel ? (
              <a href={`tel:${RESUME_DATA.contact.tel}`}>
                <span>Phone: {RESUME_DATA.contact.tel}</span>
              </a>
            ) : null}
          </div> */}

          <Avatar className="h-28 w-28">
            <AvatarImage alt={RESUME_DATA.name} src={RESUME_DATA.avatarUrl} />
            <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
          </Avatar>
        </div>
        <Section>
          <h2 className="text-xl font-bold dark:text-white">About</h2>
          <p className="text-pretty font-mono text-sm text-muted-foreground dark:text-gray-400 w-full max-w-[105ch]">
            {RESUME_DATA.summary}
          </p>
        </Section>
        <Section>
          <h2 className="text-xl font-bold dark:text-white">Skills</h2>
          <div className="space-y-2">
            {RESUME_DATA.skills.map((skillCategory) => (
              <div key={skillCategory.category} className="mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{skillCategory.category}</h3>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {skillCategory.items.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 print:bg-gray-100 print:text-black print:border print:border-gray-400"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section>
          <h2 className="print-force-new-page text-xl font-bold dark:text-white">Interests</h2>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {RESUME_DATA.interests.map((interest) => {
              return (
                <Badge
                  key={interest}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 print:bg-gray-100 print:text-black print:border print:border-gray-400"
                >
                  {interest}
                </Badge>
              );
            })}
          </div>
        </Section>
        <Section className="scroll-mb-16">
          <h2 className="text-xl font-bold dark:text-white">Projects</h2>
          <div className="-mx-3 grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
            {RESUME_DATA.projects.map((project) => {
              return (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  tags={project.techStack}
                  link={"link" in project ? project.link.href : undefined}
                />
              );
            })}
          </div>
        </Section>
        <Section className="scroll-mb-16">
          <h2 className="text-xl font-bold dark:text-white">Under Development Projects</h2>
          <div className="-mx-3 grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
            {RESUME_DATA.underDevelopment.map((project) => {
              return (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  tags={project.techStack}
                  link={"link" in project ? project.link.href : undefined}
                />
              );
            })}
          </div>
        </Section>
      </section>
      <CommandMenu
        links={[
          {
            url: RESUME_DATA.personalWebsiteUrl,
            title: "Personal Website",
          },
          ...RESUME_DATA.contact.social.map((socilaMediaLink) => ({
            url: socilaMediaLink.url,
            title: socilaMediaLink.name,
          })),
        ]}
      />
    {/* <ContactForm /> */}
    </main>
  );
}

