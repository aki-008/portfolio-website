"use client";

import { useEffect, useState } from 'react';
import { RESUME_DATA } from "../data/resume-data";
import { getIcon } from "@/lib/icon-map";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";
import { CommandMenu } from "../components/command-menu";
import { Section } from "../components/ui/section";
import { GlobeIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { ProjectCard } from "../components/project-card";
import { SunIcon, MoonIcon } from "lucide-react";
import { ContactForm } from "../components/contact-form";
import type { ComponentType } from "react";

interface Project {
  id?: string;
  title: string;
  techStack: string[];
  description: string;
  link?: { label: string; href: string };
  deployLink?: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface Publication {
  title: string;
  authors: string;
  date: string;
  link?: { label: string; href: string };
  description?: string;
}

interface SiteData {
  profile: {
    name: string;
    initials: string;
    about: string;
    summary: string;
    avatarUrl: string;
    personalWebsiteUrl: string;
  };
  social: SocialLink[];
  skills: { category: string; items: string[] }[];
  interests: string[];
  projects: (Project & { status: string })[];
  publications: Publication[];
}

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  const d = data ?? {
    profile: RESUME_DATA,
    social: RESUME_DATA.contact.social.map(s => ({ name: s.name, url: s.url, icon: s.name })),
    skills: RESUME_DATA.skills,
    interests: RESUME_DATA.interests,
    projects: [
      ...RESUME_DATA.projects.map(p => ({ ...p, status: "completed" as const, deployLink: undefined as string | undefined })),
      ...RESUME_DATA.underDevelopment.map(p => ({ ...p, status: "under-development" as const, deployLink: undefined as string | undefined })),
    ],
    publications: [],
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then((siteData: SiteData) => setData(siteData))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completedProjects = d.projects.filter(p => p.status === "completed");
  const underDevProjects = d.projects.filter(p => p.status === "under-development");

  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 bg-gray-800 text-white rounded-md dark:bg-gray-200 dark:text-gray-800 print:hidden"
      >
        {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
      </button>
      <section className="mx-auto w-full max-w-5xl space-y-8 bg-white dark:bg-black print:space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold dark:text-white">{d.profile.name}</h1>
            <p className="text-pretty font-mono text-sm text-muted-foreground dark:text-gray-400">
              {d.profile.about}
            </p>
            <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground dark:text-gray-400">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href={d.profile.personalWebsiteUrl}
                target="_blank"
              >
                <GlobeIcon className="h-3 w-3" style={{ marginTop: "-2px" }} />
                {d.profile.personalWebsiteUrl}
              </a>
            </p>
            <div className="flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground">
              {d.social.map((social) => {
                const Icon = getIcon(social.icon) as ComponentType<{ className?: string }>;
                return (
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
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          <Avatar className="h-28 w-28">
            <AvatarImage alt={d.profile.name} src={d.profile.avatarUrl} />
            <AvatarFallback>{d.profile.initials}</AvatarFallback>
          </Avatar>
        </div>
        <Section>
          <h2 className="text-xl font-bold dark:text-white">About</h2>
          <p className="text-pretty font-mono text-sm text-muted-foreground dark:text-gray-400 w-full max-w-[105ch]">
            {d.profile.summary}
          </p>
        </Section>
        <Section>
          <h2 className="text-xl font-bold dark:text-white">Skills</h2>
          <div className="space-y-2">
            {d.skills.map((skillCategory) => (
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
            {d.interests.map((interest) => {
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
        {d.publications.length > 0 && (
          <Section>
            <h2 className="text-xl font-bold dark:text-white">Publications</h2>
            <div className="space-y-4">
              {d.publications.map((pub, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-base">
                          {pub.link ? (
                            <a href={pub.link.href} target="_blank" className="hover:underline">{pub.title}</a>
                          ) : pub.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{pub.authors}</p>
                        <p className="text-xs text-muted-foreground">{pub.date}</p>
                      </div>
                    </div>
                  </CardHeader>
                  {pub.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{pub.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </Section>
        )}
        <Section className="scroll-mb-16">
          <h2 className="text-xl font-bold dark:text-white">Projects</h2>
          <div className="-mx-3 grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-muted-foreground font-mono text-sm">Loading...</p>
            ) : (
              completedProjects.map((project) => {
                return (
                  <ProjectCard
                    key={project.id || project.title}
                    title={project.title}
                    description={project.description}
                    tags={project.techStack}
                    link={project.link?.href}
                    deployLink={project.deployLink}
                  />
                );
              })
            )}
          </div>
        </Section>
        <Section className="scroll-mb-16">
          <h2 className="text-xl font-bold dark:text-white">Under Development Projects</h2>
          <div className="-mx-3 grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-muted-foreground font-mono text-sm">Loading...</p>
            ) : (
              underDevProjects.map((project) => {
                return (
                  <ProjectCard
                    key={project.id || project.title}
                    title={project.title}
                    description={project.description}
                    tags={project.techStack}
                    link={project.link?.href}
                    deployLink={project.deployLink}
                  />
                );
              })
            )}
          </div>
        </Section>
        <ContactForm />
      </section>
      <CommandMenu
        links={[
          {
            url: d.profile.personalWebsiteUrl,
            title: "Personal Website",
          },
          ...d.social.map((link) => ({
            url: link.url,
            title: link.name,
          })),
          {
            url: "/admin",
            title: "Admin (Owner Only)",
          },
        ]}
      />
    </main>
  );
}
