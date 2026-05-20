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

interface Achievement {
  heading: string;
  description: string;
  link?: { label: string; href: string };
}

interface Education {
  school: string;
  course: string;
  coursework?: string;
  duration: string;
  gpa?: string;
}

interface Certificate {
  name: string;
  link?: { label: string; href: string };
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
  achievements: Achievement[];
  education: Education[];
  certificates: Certificate[];
  themeColors?: {
    light: { bg: string; text: string; border: string; cardBg: string; cardText: string };
    dark: { bg: string; text: string; border: string; cardBg: string; cardText: string };
  };
  hiddenSections?: string[];
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
    achievements: [],
    education: [],
    certificates: [],
    themeColors: {
      light: { bg: "#ffffff", text: "#000000", border: "#e5e7eb", cardBg: "#f9fafb", cardText: "#000000" },
      dark: { bg: "#000000", text: "#f9fafb", border: "#1f2937", cardBg: "#111111", cardText: "#f9fafb" },
    },
    hiddenSections: [],
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
      .then((siteData: SiteData) => {
        setData({ ...siteData, achievements: siteData.achievements || [], education: siteData.education || [], certificates: siteData.certificates || [] });
        const tc = siteData.themeColors;
        if (tc?.dark) {
          document.documentElement.style.setProperty("--theme-dark-bg", tc.dark.bg);
          document.documentElement.style.setProperty("--theme-dark-text", tc.dark.text);
          document.documentElement.style.setProperty("--theme-dark-border", tc.dark.border);
          document.documentElement.style.setProperty("--theme-dark-card-bg", tc.dark.cardBg);
          document.documentElement.style.setProperty("--theme-dark-card-text", tc.dark.cardText);
        }
        if (tc?.light) {
          document.documentElement.style.setProperty("--theme-light-bg", tc.light.bg);
          document.documentElement.style.setProperty("--theme-light-text", tc.light.text);
          document.documentElement.style.setProperty("--theme-light-border", tc.light.border);
          document.documentElement.style.setProperty("--theme-light-card-bg", tc.light.cardBg);
          document.documentElement.style.setProperty("--theme-light-card-text", tc.light.cardText);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completedProjects = d.projects.filter(p => p.status === "completed");
  const underDevProjects = d.projects.filter(p => p.status === "under-development");

  return (
    <main className="relative min-h-screen w-full overflow-auto p-4 print:p-12 md:p-16"
      style={{
        backgroundColor: darkMode ? (d.themeColors?.dark?.bg || "#000000") : (d.themeColors?.light?.bg || "#ffffff"),
        color: darkMode ? (d.themeColors?.dark?.text || "#f9fafb") : (d.themeColors?.light?.text || "#000000"),
      }}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 bg-gray-800 text-white rounded-md dark:bg-gray-200 dark:text-gray-800 print:hidden"
      >
        {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
      </button>
      <section className="mx-auto w-full max-w-5xl space-y-8 print:space-y-6">
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
                if (social.icon.startsWith("http")) {
                  return (
                    <Button
                      key={social.name}
                      variant="outline"
                      size="icon"
                      asChild
                      className="h-8 w-8"
                    >
                      <a href={social.url} target="_blank" rel="noreferrer" title={social.name}>
                        <img src={social.icon} alt={social.name} className="h-4 w-4" />
                      </a>
                    </Button>
                  );
                }
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
        {(!d.hiddenSections?.includes("about")) && (
        <Section>
          <h2 className="text-xl font-bold dark:text-white">About</h2>
          <p className="text-pretty font-mono text-sm text-muted-foreground dark:text-gray-400 w-full max-w-[105ch]">
            {d.profile.summary}
          </p>
        </Section>
        )}
        {(!d.hiddenSections?.includes("skills")) && (
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
        )}
        {(!d.hiddenSections?.includes("interests")) && (
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
        )}
        {d.achievements.length > 0 && !d.hiddenSections?.includes("achievements") && (
          <Section>
            <h2 className="text-xl font-bold dark:text-white">Achievements</h2>
            <div className="space-y-3">
              {d.achievements.map((a, i) => (
                <div key={i} className="p-3 border rounded-lg" style={{ backgroundColor: darkMode ? d.themeColors?.dark?.cardBg : d.themeColors?.light?.cardBg, borderColor: darkMode ? d.themeColors?.dark?.border : d.themeColors?.light?.border }}>
                  <h3 className="font-semibold text-base">{a.heading}</h3>
                  <p className="text-sm mt-1" style={{ opacity: 0.8 }}>{a.description}</p>
                  {a.link && (
                    <a href={a.link.href} target="_blank" className="text-sm inline-flex items-center gap-1 mt-1 hover:underline" style={{ opacity: 0.7 }}>
                      {a.link.label || "Link"}
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}
        {d.education.length > 0 && !d.hiddenSections?.includes("education") && (
          <Section>
            <h2 className="text-xl font-bold dark:text-white">Education</h2>
            <div className="space-y-3">
              {d.education.map((e, i) => (
                <div key={i} className="p-3 border rounded-lg" style={{ backgroundColor: darkMode ? d.themeColors?.dark?.cardBg : d.themeColors?.light?.cardBg, borderColor: darkMode ? d.themeColors?.dark?.border : d.themeColors?.light?.border }}>
                  <h3 className="font-semibold text-base">{e.course}</h3>
                  <p className="text-sm mt-1" style={{ opacity: 0.8 }}>{e.school} — {e.duration}</p>
                  {e.coursework && <p className="text-xs mt-1" style={{ opacity: 0.6 }}>Coursework: {e.coursework}</p>}
                  {e.gpa && <p className="text-xs mt-1" style={{ opacity: 0.6 }}>GPA: {e.gpa}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}
        {d.certificates.length > 0 && !d.hiddenSections?.includes("certificates") && (
          <Section>
            <h2 className="text-xl font-bold dark:text-white">Certificates</h2>
            <div className="flex flex-wrap gap-2">
              {d.certificates.map((c, i) => (
                c.link ? (
                  <a key={i} href={c.link.href} target="_blank" className="inline-flex items-center gap-1.5 p-2 border rounded-lg text-sm hover:underline"
                    style={{ backgroundColor: darkMode ? d.themeColors?.dark?.cardBg : d.themeColors?.light?.cardBg, borderColor: darkMode ? d.themeColors?.dark?.border : d.themeColors?.light?.border }}>
                    {c.name}
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                ) : (
                  <span key={i} className="inline-flex p-2 border rounded-lg text-sm"
                    style={{ backgroundColor: darkMode ? d.themeColors?.dark?.cardBg : d.themeColors?.light?.cardBg, borderColor: darkMode ? d.themeColors?.dark?.border : d.themeColors?.light?.border }}>
                    {c.name}
                  </span>
                )
              ))}
            </div>
          </Section>
        )}
        {d.publications.length > 0 && !d.hiddenSections?.includes("publications") && (
          <Section>
            <h2 className="text-xl font-bold dark:text-white">Publications</h2>
            <div className="-mx-3 space-y-3">
              {d.publications.map((pub, i) => {
                const cardBg = darkMode ? (d.themeColors?.dark?.cardBg || "#111111") : (d.themeColors?.light?.cardBg || "#f9fafb");
                const cardText = darkMode ? (d.themeColors?.dark?.cardText || "#f9fafb") : (d.themeColors?.light?.cardText || "#000000");
                const cardBorder = darkMode ? (d.themeColors?.dark?.border || "#1f2937") : (d.themeColors?.light?.border || "#e5e7eb");
                return (
                <Card key={i} style={{ backgroundColor: cardBg, color: cardText, borderColor: cardBorder }} className="border p-3 group">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {pub.title}
                          {pub.link && (
                            <a href={pub.link.href} target="_blank" className="inline-flex hover:opacity-70">
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </a>
                          )}
                        </CardTitle>
                        <p className="text-sm mt-1" style={{ color: cardText, opacity: 0.7 }}>{pub.authors}</p>
                        <p className="text-xs" style={{ color: cardText, opacity: 0.5 }}>{pub.date}</p>
                      </div>
                    </div>
                  </CardHeader>
                  {pub.description && (
                    <CardContent>
                      <p className="text-sm line-clamp-2 group-hover:line-clamp-none" style={{ color: cardText, opacity: 0.7 }}>{pub.description}</p>
                    </CardContent>
                  )}
                </Card>
                );
              })}
            </div>
          </Section>
        )}
        {(!d.hiddenSections?.includes("projects")) && (
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
                    cardBg={darkMode ? (d.themeColors?.dark?.cardBg || "#111111") : (d.themeColors?.light?.cardBg || "#f9fafb")}
                    cardText={darkMode ? (d.themeColors?.dark?.cardText || "#f9fafb") : (d.themeColors?.light?.cardText || "#000000")}
                    cardBorder={darkMode ? (d.themeColors?.dark?.border || "#1f2937") : (d.themeColors?.light?.border || "#e5e7eb")}
                  />
                );
              })
            )}
          </div>
        </Section>
        )}
        {(!d.hiddenSections?.includes("underDevelopment") && underDevProjects.length > 0) && (
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
                    cardBg={darkMode ? (d.themeColors?.dark?.cardBg || "#111111") : (d.themeColors?.light?.cardBg || "#f9fafb")}
                    cardText={darkMode ? (d.themeColors?.dark?.cardText || "#f9fafb") : (d.themeColors?.light?.cardText || "#000000")}
                    cardBorder={darkMode ? (d.themeColors?.dark?.border || "#1f2937") : (d.themeColors?.light?.border || "#e5e7eb")}
                  />
                );
              })
            )}
          </div>
        </Section>
        )}
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
