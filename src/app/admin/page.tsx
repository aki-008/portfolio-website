"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { SunIcon, MoonIcon } from "lucide-react";

interface Project {
  id?: string;
  title: string;
  techStack: string[];
  description: string;
  logo?: string;
  link?: { label: string; href: string };
  deployLink?: string;
  status: string;
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
    email: string;
    tel: string;
  };
  social: { name: string; url: string; icon: string }[];
  skills: { category: string; items: string[] }[];
  interests: string[];
  projects: Project[];
  publications: Publication[];
  achievements: Achievement[];
  education: Education[];
  certificates: Certificate[];
  themeColors?: {
    light: { bg: string; text: string; border: string; cardBg: string; cardText: string };
    dark: { bg: string; text: string; border: string; cardBg: string; cardText: string };
  };
  hiddenSections?: string[];
  iconSize?: number;
  fallingPatternColor?: { light: string; dark: string };
  fallingPatternBlur?: string;
  fallingPatternDensity?: number;
  fallingPatternDuration?: number;
}

interface Message {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
}

const defaultSiteData: SiteData = {
  profile: { name: "", initials: "", about: "", summary: "", avatarUrl: "", personalWebsiteUrl: "", email: "", tel: "" },
  social: [],
  skills: [],
  interests: [],
  projects: [],
  publications: [],
  achievements: [],
  education: [],
  certificates: [],
  themeColors: {
    light: { bg: "#ffffff", text: "#000000", border: "#e5e7eb", cardBg: "#f9fafb", cardText: "#000000" },
    dark: { bg: "#000000", text: "#f9fafb", border: "#1f2937", cardBg: "#111111", cardText: "#f9fafb" },
  },
  hiddenSections: [],
  iconSize: 4,
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("admin-dark-mode") === "true";
      document.documentElement.classList.toggle("dark", isDark);
      return isDark;
    }
    return false;
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"profile" | "social" | "skills" | "interests" | "projects" | "publications" | "achievements" | "education" | "certificates" | "colors" | "sections" | "messages">("projects");

  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile form
  const [profile, setProfile] = useState(siteData.profile);

  // Social form
  const [socialForm, setSocialForm] = useState({ name: "", url: "", icon: "" });
  const [editingSocial, setEditingSocial] = useState<number | null>(null);

  // Skills form
  const [skillCat, setSkillCat] = useState("");
  const [skillItems, setSkillItems] = useState("");
  const [editingSkill, setEditingSkill] = useState<number | null>(null);

  // Interests form
  const [interestInput, setInterestInput] = useState("");
  const [editingInterest, setEditingInterest] = useState<number | null>(null);

  // Project form
  const [projectForm, setProjectForm] = useState({ title: "", description: "", techStack: "", linkLabel: "", linkHref: "", deployLink: "", status: "completed" });

  // Publication form
  const [pubForm, setPubForm] = useState({ title: "", authors: "", date: "", linkUrl: "", description: "" });
  const [pubMsg, setPubMsg] = useState("");
  const [editingPub, setEditingPub] = useState<number | null>(null);

  // Achievement form
  const [achievementForm, setAchievementForm] = useState({ heading: "", description: "", linkLabel: "", linkUrl: "" });
  const [editingAchievement, setEditingAchievement] = useState<number | null>(null);

  // Education form
  const [educationForm, setEducationForm] = useState({ school: "", course: "", coursework: "", duration: "", gpa: "" });
  const [editingEducation, setEditingEducation] = useState<number | null>(null);

  // Certificate form
  const [certificateForm, setCertificateForm] = useState({ name: "", linkLabel: "", linkUrl: "" });
  const [editingCertificate, setEditingCertificate] = useState<number | null>(null);

  // Theme form
  const [previewColors, setPreviewColors] = useState<{ light: { bg: string; text: string; border: string; cardBg: string; cardText: string }; dark: { bg: string; text: string; border: string; cardBg: string; cardText: string } } | null>(null);
  const [previewPattern, setPreviewPattern] = useState<{ color: { light: string; dark: string }; blur: string; density: number; duration: number } | null>(null);
  const [editingProject, setEditingProject] = useState<string | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/site-data");
    const data = await res.json();
    setSiteData({ ...data, achievements: data.achievements || [], education: data.education || [], certificates: data.certificates || [], iconSize: data.iconSize || 4 });
    setProfile(data.profile);
    setPreviewColors(data.themeColors || { light: { bg: "#ffffff", text: "#000000", border: "#e5e7eb", cardBg: "#f9fafb", cardText: "#000000" }, dark: { bg: "#000000", text: "#f9fafb", border: "#1f2937", cardBg: "#111111", cardText: "#f9fafb" } });
    setPreviewPattern({ color: data.fallingPatternColor || { light: "#e5e7eb", dark: "#1f2937" }, blur: data.fallingPatternBlur || "0.5rem", density: data.fallingPatternDensity || 2, duration: data.fallingPatternDuration || 80 });
    setLoading(false);
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) setMessages(await res.json());
    } catch {}
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
      fetchMessages();
    }
  }, [status]);

  const saveSiteData = async (updated: SiteData) => {
    setSaving(true);
    await fetch("/api/site-data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setSiteData(updated);
    setSaving(false);
  };

  const toggleDark = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("admin-dark-mode", next.toString());
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    return () => document.documentElement.classList.remove("dark");
  }, [darkMode]);

  if (status === "loading") {
    return <main className="container mx-auto p-8 max-w-md bg-background text-foreground"><p className="text-center text-muted-foreground">Loading...</p></main>;
  }

  if (status === "unauthenticated") {
    return (
      <main className="container mx-auto p-8 max-w-md bg-background text-foreground">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="icon" onClick={toggleDark}>
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
        </div>
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={(e) => { e.preventDefault(); signIn("credentials", { email, password, redirect: false }); }} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </main>
    );
  }

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "social", label: "Social" },
    { key: "skills", label: "Skills" },
    { key: "interests", label: "Interests" },
    { key: "projects", label: "Projects" },
    { key: "publications", label: "Publications" },
    { key: "achievements", label: "Achievements" },
    { key: "education", label: "Education" },
    { key: "certificates", label: "Certificates" },
    { key: "colors", label: "Colors" },
    { key: "sections", label: "Sections" },
    { key: "messages", label: `Messages (${messages.length})` },
  ] as const;

  return (
    <main className="container mx-auto p-4 max-w-4xl bg-background text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" onClick={toggleDark}>
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
          <Button variant="outline" onClick={() => signOut()}>Logout</Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <Button key={t.key} variant={tab === t.key ? "default" : "outline"} onClick={() => setTab(t.key)}>{t.label}</Button>
        ))}
      </div>

      {/* ===== PROFILE TAB ===== */}
      {tab === "profile" && (
        <Section>
          <Card>
            <CardHeader><CardTitle>Edit Profile</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Initials</Label>
                    <Input value={profile.initials} onChange={e => setProfile({ ...profile, initials: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>About (headline)</Label>
                  <Input value={profile.about} onChange={e => setProfile({ ...profile, about: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <textarea value={profile.summary} onChange={e => setProfile({ ...profile, summary: e.target.value })}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Avatar URL</Label>
                  <Input value={profile.avatarUrl} onChange={e => setProfile({ ...profile, avatarUrl: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Personal Website URL</Label>
                  <Input value={profile.personalWebsiteUrl} onChange={e => setProfile({ ...profile, personalWebsiteUrl: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={profile.tel} onChange={e => setProfile({ ...profile, tel: e.target.value })} />
                  </div>
                </div>
                <Button onClick={() => saveSiteData({ ...siteData, profile })} disabled={saving}>
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* ===== SOCIAL TAB ===== */}
      {tab === "social" && (
        <Section>
          <Card>
            <CardHeader><CardTitle>{editingSocial !== null ? "Edit Social Link" : "Add Social Link"}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={socialForm.name} onChange={e => setSocialForm({ ...socialForm, name: e.target.value })} placeholder="GitHub" />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input value={socialForm.url} onChange={e => setSocialForm({ ...socialForm, url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Input value={socialForm.icon} onChange={e => setSocialForm({ ...socialForm, icon: e.target.value })} placeholder="GitHub / X / Discord" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => {
                    const newSocial = [...siteData.social];
                    if (editingSocial !== null) {
                      newSocial[editingSocial] = socialForm;
                    } else {
                      newSocial.push(socialForm);
                    }
                    saveSiteData({ ...siteData, social: newSocial });
                    setSocialForm({ name: "", url: "", icon: "" });
                    setEditingSocial(null);
                  }}>{editingSocial !== null ? "Update" : "Add"}</Button>
                  {editingSocial !== null && <Button variant="outline" onClick={() => { setEditingSocial(null); setSocialForm({ name: "", url: "", icon: "" }); }}>Cancel</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground mb-2">Drag to reorder</p>
            {siteData.social.map((s, i) => (
              <div key={i} draggable
                onDragStart={e => { e.dataTransfer.setData("text/plain", i.toString()); (e.currentTarget as HTMLElement).classList.add("opacity-50"); }}
                onDragOver={e => { e.preventDefault(); }}
                onDragLeave={e => { (e.currentTarget as HTMLElement).classList.remove("opacity-50"); }}
                onDrop={e => { e.preventDefault(); const from = parseInt(e.dataTransfer.getData("text/plain")); if (from === i) return; const u = [...siteData.social]; const [m] = u.splice(from, 1); u.splice(i, 0, m); saveSiteData({ ...siteData, social: u }); }}
                className="flex items-center justify-between p-3 border rounded-md cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground cursor-grab">⠿</span>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.url}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingSocial(i); setSocialForm(s); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => saveSiteData({ ...siteData, social: siteData.social.filter((_, j) => j !== i) })}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===== SKILLS TAB ===== */}
      {tab === "skills" && (
        <Section>
          <Card>
            <CardHeader><CardTitle>{editingSkill !== null ? "Edit Skill Category" : "Add Skill Category"}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Category Name</Label>
                  <Input value={skillCat} onChange={e => setSkillCat(e.target.value)} placeholder="Languages" />
                </div>
                <div className="space-y-2">
                  <Label>Items (comma separated)</Label>
                  <Input value={skillItems} onChange={e => setSkillItems(e.target.value)} placeholder="Python, JavaScript, TypeScript" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => {
                    const newSkills = [...siteData.skills];
                    const entry = { category: skillCat, items: skillItems.split(",").map(s => s.trim()).filter(Boolean) };
                    if (editingSkill !== null) {
                      newSkills[editingSkill] = entry;
                    } else {
                      newSkills.push(entry);
                    }
                    saveSiteData({ ...siteData, skills: newSkills });
                    setSkillCat(""); setSkillItems(""); setEditingSkill(null);
                  }}>{editingSkill !== null ? "Update" : "Add"}</Button>
                  {editingSkill !== null && <Button variant="outline" onClick={() => { setEditingSkill(null); setSkillCat(""); setSkillItems(""); }}>Cancel</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 space-y-2">
            {siteData.skills.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">{s.category}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {s.items.map((item) => <Badge key={item} className="text-xs">{item}</Badge>)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingSkill(i); setSkillCat(s.category); setSkillItems(s.items.join(", ")); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => saveSiteData({ ...siteData, skills: siteData.skills.filter((_, j) => j !== i) })}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===== INTERESTS TAB ===== */}
      {tab === "interests" && (
        <Section>
          <Card>
            <CardHeader><CardTitle>{editingInterest !== null ? "Edit Interest" : "Add Interest"}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-2 items-end">
                <div className="space-y-2 flex-1">
                  <Label>Interest</Label>
                  <Input value={interestInput} onChange={e => setInterestInput(e.target.value)} placeholder="Programming" />
                </div>
                <Button onClick={() => {
                  const newInterests = [...siteData.interests];
                  if (editingInterest !== null) {
                    newInterests[editingInterest] = interestInput;
                  } else {
                    newInterests.push(interestInput);
                  }
                  saveSiteData({ ...siteData, interests: newInterests });
                  setInterestInput(""); setEditingInterest(null);
                }}>{editingInterest !== null ? "Update" : "Add"}</Button>
                {editingInterest !== null && <Button variant="outline" onClick={() => { setEditingInterest(null); setInterestInput(""); }}>Cancel</Button>}
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 flex flex-wrap gap-2">
            {siteData.interests.map((interest, i) => (
              <div key={i} className="flex items-center gap-1">
                <Badge className="cursor-default">{interest}</Badge>
                <button className="text-xs text-muted-foreground hover:text-destructive" onClick={() => saveSiteData({ ...siteData, interests: siteData.interests.filter((_, j) => j !== i) })}>✕</button>
                <button className="text-xs text-muted-foreground hover:text-primary" onClick={() => { setEditingInterest(i); setInterestInput(interest); }}>✎</button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===== PROJECTS TAB ===== */}
      {tab === "projects" && (
        <>
          <Section>
            <Card>
              <CardHeader><CardTitle>{editingProject ? "Edit Project" : "Add New Project"}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <textarea value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Tech Stack (comma separated)</Label>
                    <Input value={projectForm.techStack} onChange={e => setProjectForm({ ...projectForm, techStack: e.target.value })} placeholder="React, TypeScript, Node.js" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Link Label</Label>
                      <Input value={projectForm.linkLabel} onChange={e => setProjectForm({ ...projectForm, linkLabel: e.target.value })} placeholder="GitHub" />
                    </div>
                <div className="space-y-2">
                  <Label>Link URL</Label>
                  <Input value={projectForm.linkHref} onChange={e => setProjectForm({ ...projectForm, linkHref: e.target.value })} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label>Deploy URL (optional)</Label>
                  <Input value={projectForm.deployLink} onChange={e => setProjectForm({ ...projectForm, deployLink: e.target.value })} placeholder="https://..." />
                </div>
              </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="completed">Completed</option>
                      <option value="under-development">Under Development</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => {
                      const newProjects = [...siteData.projects];
                      const entry = {
                        id: editingProject || Date.now().toString(),
                        title: projectForm.title,
                        description: projectForm.description,
                        techStack: projectForm.techStack.split(",").map(s => s.trim()).filter(Boolean),
                        link: projectForm.linkHref ? { label: projectForm.linkLabel || "Link", href: projectForm.linkHref } : undefined,
                        deployLink: projectForm.deployLink || undefined,
                        status: projectForm.status,
                      };
                      if (editingProject) {
                        const idx = newProjects.findIndex(p => p.id === editingProject);
                        if (idx >= 0) newProjects[idx] = { ...newProjects[idx], ...entry };
                      } else {
                        newProjects.push(entry);
                      }
                      saveSiteData({ ...siteData, projects: newProjects });
                      setProjectForm({ title: "", description: "", techStack: "", linkLabel: "", linkHref: "", deployLink: "", status: "completed" });
                      setEditingProject(null);
                    }}>{editingProject ? "Update" : "Add"}</Button>
                    {editingProject && <Button variant="outline" onClick={() => { setEditingProject(null); setProjectForm({ title: "", description: "", techStack: "", linkLabel: "", linkHref: "", deployLink: "", status: "completed" }); }}>Cancel</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section>
            <h2 className="text-xl font-bold mb-4">All Projects (drag to reorder)</h2>
            {loading ? (
              <p>Loading...</p>
            ) : siteData.projects.length === 0 ? (
              <p className="text-muted-foreground">No projects yet.</p>
            ) : (
              <div className="space-y-2">
                {siteData.projects.map((project, i) => (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={e => { e.dataTransfer.setData("text/plain", i.toString()); (e.currentTarget as HTMLElement).classList.add("opacity-50"); }}
                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("border-blue-500"); }}
                    onDragLeave={e => { e.currentTarget.classList.remove("border-blue-500"); }}
                    onDrop={e => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("border-blue-500");
                      const fromIdx = parseInt(e.dataTransfer.getData("text/plain"));
                      const toIdx = i;
                      if (fromIdx === toIdx) return;
                      const updated = [...siteData.projects];
                      const [moved] = updated.splice(fromIdx, 1);
                      updated.splice(toIdx, 0, moved);
                      saveSiteData({ ...siteData, projects: updated });
                    }}
                    className="flex items-center justify-between p-3 border rounded-md cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground cursor-grab">⠿</span>
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className={`text-xs ${project.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`}>
                            {project.status === "completed" ? "Completed" : "Under Dev"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select value={project.status} onChange={e => {
                        const updated = siteData.projects.map(p => p.id === project.id ? { ...p, status: e.target.value } : p);
                        saveSiteData({ ...siteData, projects: updated });
                      }} className="h-8 rounded border border-input bg-background px-2 text-xs">
                        <option value="completed">Completed</option>
                        <option value="under-development">Under Dev</option>
                      </select>
                      <Button size="sm" variant="outline" onClick={() => { setEditingProject(project.id!); setProjectForm({ title: project.title, description: project.description, techStack: project.techStack.join(", "), linkLabel: project.link?.label || "", linkHref: project.link?.href || "", deployLink: project.deployLink || "", status: project.status }); }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => saveSiteData({ ...siteData, projects: siteData.projects.filter(p => p.id !== project.id) })}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </>
      )}

      {/* ===== PUBLICATIONS TAB ===== */}
      {tab === "publications" && (
        <Section>
          <Card>
            <CardHeader><CardTitle>{editingPub !== null ? "Edit Publication" : "Add Publication"}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={pubForm.title} onChange={e => setPubForm({ ...pubForm, title: e.target.value })} placeholder="Paper title" />
                </div>
                <div className="space-y-2">
                  <Label>Authors</Label>
                  <Input value={pubForm.authors} onChange={e => setPubForm({ ...pubForm, authors: e.target.value })} placeholder="Author names" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={pubForm.date} onChange={e => setPubForm({ ...pubForm, date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input value={pubForm.linkUrl} onChange={e => setPubForm({ ...pubForm, linkUrl: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <textarea value={pubForm.description} onChange={e => setPubForm({ ...pubForm, description: e.target.value })}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={2} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => {
                    if (!pubForm.title) { setPubMsg("Title required"); return; }
                    if (!pubForm.authors) { setPubMsg("Authors required"); return; }
                    if (!pubForm.date) { setPubMsg("Date required"); return; }
                    setPubMsg("");
                    const newPubs = [...siteData.publications];
                    const entry = { title: pubForm.title, authors: pubForm.authors, date: pubForm.date, description: pubForm.description || undefined, ...(pubForm.linkUrl ? { link: { label: "Link", href: pubForm.linkUrl } } : {}) };
                    if (editingPub !== null) {
                      newPubs[editingPub] = entry;
                    } else {
                      newPubs.push(entry);
                    }
                    setSiteData(prev => ({ ...prev, publications: newPubs }));
                    saveSiteData({ ...siteData, publications: newPubs });
                    setPubForm({ title: "", authors: "", date: "", linkUrl: "", description: "" });
                    setEditingPub(null);
                  }}>{editingPub !== null ? "Update" : "Add"}</Button>
                  {editingPub !== null && <Button variant="outline" onClick={() => { setEditingPub(null); setPubForm({ title: "", authors: "", date: "", linkUrl: "", description: "" }); }}>Cancel</Button>}
                </div>
                {pubMsg && <p className="text-sm text-destructive">{pubMsg}</p>}
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground mb-2">Drag to reorder</p>
            {siteData.publications.map((pub, i) => (
              <div key={i} draggable
                onDragStart={e => { e.dataTransfer.setData("text/plain", i.toString()); (e.currentTarget as HTMLElement).classList.add("opacity-50"); }}
                onDragOver={e => { e.preventDefault(); }}
                onDragLeave={e => { (e.currentTarget as HTMLElement).classList.remove("opacity-50"); }}
                onDrop={e => { e.preventDefault(); const from = parseInt(e.dataTransfer.getData("text/plain")); if (from === i) return; const u = [...siteData.publications]; const [m] = u.splice(from, 1); u.splice(i, 0, m); saveSiteData({ ...siteData, publications: u }); }}
                className="flex items-center justify-between p-3 border rounded-md cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground cursor-grab">⠿</span>
                  <div>
                    <p className="font-medium">{pub.title}</p>
                    <p className="text-xs text-muted-foreground">{pub.authors} — {pub.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingPub(i); setPubForm({ title: pub.title, authors: pub.authors, date: pub.date, linkUrl: pub.link?.href || "", description: pub.description || "" }); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => saveSiteData({ ...siteData, publications: siteData.publications.filter((_, j) => j !== i) })}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===== ACHIEVEMENTS TAB ===== */}
      {tab === "achievements" && (
        <Section>
          <Card>
            <CardHeader><CardTitle>{editingAchievement !== null ? "Edit Achievement" : "Add Achievement"}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input value={achievementForm.heading} onChange={e => setAchievementForm({ ...achievementForm, heading: e.target.value })} placeholder="Achievement title" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea value={achievementForm.description} onChange={e => setAchievementForm({ ...achievementForm, description: e.target.value })}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Link Label (optional)</Label>
                    <Input value={achievementForm.linkLabel} onChange={e => setAchievementForm({ ...achievementForm, linkLabel: e.target.value })} placeholder="Certificate" />
                  </div>
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input value={achievementForm.linkUrl} onChange={e => setAchievementForm({ ...achievementForm, linkUrl: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => {
                    const newAchievements = [...siteData.achievements];
                    const entry = { heading: achievementForm.heading, description: achievementForm.description, ...(achievementForm.linkUrl ? { link: { label: achievementForm.linkLabel || "Link", href: achievementForm.linkUrl } } : {}) } as Achievement;
                    if (editingAchievement !== null) {
                      newAchievements[editingAchievement] = entry;
                    } else {
                      newAchievements.push(entry);
                    }
                    saveSiteData({ ...siteData, achievements: newAchievements });
                    setAchievementForm({ heading: "", description: "", linkLabel: "", linkUrl: "" });
                    setEditingAchievement(null);
                  }}>{editingAchievement !== null ? "Update" : "Add"}</Button>
                  {editingAchievement !== null && <Button variant="outline" onClick={() => { setEditingAchievement(null); setAchievementForm({ heading: "", description: "", linkLabel: "", linkUrl: "" }); }}>Cancel</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground mb-2">Drag to reorder</p>
            {siteData.achievements.map((a, i) => (
              <div key={i} draggable
                onDragStart={e => { e.dataTransfer.setData("text/plain", i.toString()); (e.currentTarget as HTMLElement).classList.add("opacity-50"); }}
                onDragOver={e => { e.preventDefault(); }}
                onDragLeave={e => { (e.currentTarget as HTMLElement).classList.remove("opacity-50"); }}
                onDrop={e => { e.preventDefault(); const from = parseInt(e.dataTransfer.getData("text/plain")); if (from === i) return; const u = [...siteData.achievements]; const [m] = u.splice(from, 1); u.splice(i, 0, m); saveSiteData({ ...siteData, achievements: u }); }}
                className="flex items-center justify-between p-3 border rounded-md cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground cursor-grab">⠿</span>
                  <div>
                    <p className="font-medium">{a.heading}</p>
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingAchievement(i); setAchievementForm({ heading: a.heading, description: a.description, linkLabel: a.link?.label || "", linkUrl: a.link?.href || "" }); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => saveSiteData({ ...siteData, achievements: siteData.achievements.filter((_, j) => j !== i) })}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===== EDUCATION TAB ===== */}
      {tab === "education" && (
        <Section>
          <Card>
            <CardHeader><CardTitle>{editingEducation !== null ? "Edit Education" : "Add Education"}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>School Name</Label>
                    <Input value={educationForm.school} onChange={e => setEducationForm({ ...educationForm, school: e.target.value })} placeholder="University" />
                  </div>
                  <div className="space-y-2">
                    <Label>Course Name</Label>
                    <Input value={educationForm.course} onChange={e => setEducationForm({ ...educationForm, course: e.target.value })} placeholder="BSc Computer Science" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Coursework (optional)</Label>
                  <Input value={educationForm.coursework} onChange={e => setEducationForm({ ...educationForm, coursework: e.target.value })} placeholder="Algorithms, Data Structures, OS" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input value={educationForm.duration} onChange={e => setEducationForm({ ...educationForm, duration: e.target.value })} placeholder="2020 - 2024" />
                  </div>
                  <div className="space-y-2">
                    <Label>GPA (optional)</Label>
                    <Input value={educationForm.gpa} onChange={e => setEducationForm({ ...educationForm, gpa: e.target.value })} placeholder="3.8 / 4.0" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => {
                    const newEducation = [...siteData.education];
                    const entry = { school: educationForm.school, course: educationForm.course, duration: educationForm.duration, coursework: educationForm.coursework || undefined, gpa: educationForm.gpa || undefined } as Education;
                    if (editingEducation !== null) {
                      newEducation[editingEducation] = entry;
                    } else {
                      newEducation.push(entry);
                    }
                    saveSiteData({ ...siteData, education: newEducation });
                    setEducationForm({ school: "", course: "", coursework: "", duration: "", gpa: "" });
                    setEditingEducation(null);
                  }}>{editingEducation !== null ? "Update" : "Add"}</Button>
                  {editingEducation !== null && <Button variant="outline" onClick={() => { setEditingEducation(null); setEducationForm({ school: "", course: "", coursework: "", duration: "", gpa: "" }); }}>Cancel</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground mb-2">Drag to reorder</p>
            {siteData.education.map((e, i) => (
              <div key={i} draggable
                onDragStart={e => { e.dataTransfer.setData("text/plain", i.toString()); (e.currentTarget as HTMLElement).classList.add("opacity-50"); }}
                onDragOver={e => { e.preventDefault(); }}
                onDragLeave={e => { (e.currentTarget as HTMLElement).classList.remove("opacity-50"); }}
                onDrop={e => { e.preventDefault(); const from = parseInt(e.dataTransfer.getData("text/plain")); if (from === i) return; const u = [...siteData.education]; const [m] = u.splice(from, 1); u.splice(i, 0, m); saveSiteData({ ...siteData, education: u }); }}
                className="flex items-center justify-between p-3 border rounded-md cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground cursor-grab">⠿</span>
                  <div>
                    <p className="font-medium">{e.course}</p>
                    <p className="text-xs text-muted-foreground">{e.school} — {e.duration}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingEducation(i); setEducationForm({ school: e.school, course: e.course, coursework: e.coursework || "", duration: e.duration, gpa: e.gpa || "" }); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => saveSiteData({ ...siteData, education: siteData.education.filter((_, j) => j !== i) })}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===== CERTIFICATES TAB ===== */}
      {tab === "certificates" && (
        <Section>
          <Card>
            <CardHeader><CardTitle>{editingCertificate !== null ? "Edit Certificate" : "Add Certificate"}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Certificate Name</Label>
                  <Input value={certificateForm.name} onChange={e => setCertificateForm({ ...certificateForm, name: e.target.value })} placeholder="AWS Certified Developer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Link Label (optional)</Label>
                    <Input value={certificateForm.linkLabel} onChange={e => setCertificateForm({ ...certificateForm, linkLabel: e.target.value })} placeholder="Credential" />
                  </div>
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input value={certificateForm.linkUrl} onChange={e => setCertificateForm({ ...certificateForm, linkUrl: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => {
                    const newCerts = [...siteData.certificates];
                    const entry = { name: certificateForm.name, ...(certificateForm.linkUrl ? { link: { label: certificateForm.linkLabel || "Link", href: certificateForm.linkUrl } } : {}) } as Certificate;
                    if (editingCertificate !== null) {
                      newCerts[editingCertificate] = entry;
                    } else {
                      newCerts.push(entry);
                    }
                    saveSiteData({ ...siteData, certificates: newCerts });
                    setCertificateForm({ name: "", linkLabel: "", linkUrl: "" });
                    setEditingCertificate(null);
                  }}>{editingCertificate !== null ? "Update" : "Add"}</Button>
                  {editingCertificate !== null && <Button variant="outline" onClick={() => { setEditingCertificate(null); setCertificateForm({ name: "", linkLabel: "", linkUrl: "" }); }}>Cancel</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground mb-2">Drag to reorder</p>
            {siteData.certificates.map((c, i) => (
              <div key={i} draggable
                onDragStart={e => { e.dataTransfer.setData("text/plain", i.toString()); (e.currentTarget as HTMLElement).classList.add("opacity-50"); }}
                onDragOver={e => { e.preventDefault(); }}
                onDragLeave={e => { (e.currentTarget as HTMLElement).classList.remove("opacity-50"); }}
                onDrop={e => { e.preventDefault(); const from = parseInt(e.dataTransfer.getData("text/plain")); if (from === i) return; const u = [...siteData.certificates]; const [m] = u.splice(from, 1); u.splice(i, 0, m); saveSiteData({ ...siteData, certificates: u }); }}
                className="flex items-center justify-between p-3 border rounded-md cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground cursor-grab">⠿</span>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    {c.link && <p className="text-xs text-muted-foreground">{c.link.href}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingCertificate(i); setCertificateForm({ name: c.name, linkLabel: c.link?.label || "", linkUrl: c.link?.href || "" }); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => saveSiteData({ ...siteData, certificates: siteData.certificates.filter((_, j) => j !== i) })}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===== COLORS TAB ===== */}
      {tab === "colors" && (
        <Section>
          <Card>
            <CardHeader><CardTitle>Theme Colors</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Pick colors for light and dark modes. Press Save to apply.</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Light Mode</h3>
                  <div className="space-y-3">
                    {(["bg", "text", "border", "cardBg", "cardText"] as const).map(field => (
                      <div key={field} className="space-y-1">
                        <Label>{field === "bg" ? "Background" : field === "text" ? "Text" : field === "border" ? "Border" : field === "cardBg" ? "Card Background" : "Card Text"}</Label>
                        <input type="color" className="w-full h-10 rounded cursor-pointer"
                          value={previewColors?.light?.[field] || "#ffffff"}
                          onChange={e => setPreviewColors(prev => prev ? { ...prev, light: { ...prev.light, [field]: e.target.value } } : prev)} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Dark Mode</h3>
                  <div className="space-y-3">
                    {(["bg", "text", "border", "cardBg", "cardText"] as const).map(field => (
                      <div key={field} className="space-y-1">
                        <Label>{field === "bg" ? "Background" : field === "text" ? "Text" : field === "border" ? "Border" : field === "cardBg" ? "Card Background" : "Card Text"}</Label>
                        <input type="color" className="w-full h-10 rounded cursor-pointer"
                          value={previewColors?.dark?.[field] || "#000000"}
                          onChange={e => setPreviewColors(prev => prev ? { ...prev, dark: { ...prev.dark, [field]: e.target.value } } : prev)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => { saveSiteData({ ...siteData, themeColors: previewColors!, fallingPatternColor: previewPattern!.color, fallingPatternBlur: previewPattern!.blur, fallingPatternDensity: previewPattern!.density, fallingPatternDuration: previewPattern!.duration }); }}>Save Colors</Button>
                <Button variant="outline" onClick={() => { setPreviewColors(siteData.themeColors || { light: { bg: "#ffffff", text: "#000000", border: "#e5e7eb", cardBg: "#f9fafb", cardText: "#000000" }, dark: { bg: "#000000", text: "#f9fafb", border: "#1f2937", cardBg: "#111111", cardText: "#f9fafb" } }); setPreviewPattern({ color: siteData.fallingPatternColor || { light: "#e5e7eb", dark: "#1f2937" }, blur: siteData.fallingPatternBlur || "0.5rem", density: siteData.fallingPatternDensity || 2, duration: siteData.fallingPatternDuration || 80 }); }}>Cancel</Button>
                <Button variant="ghost" size="sm" onClick={() => { setPreviewColors({ light: { bg: "#ffffff", text: "#000000", border: "#e5e7eb", cardBg: "#f9fafb", cardText: "#000000" }, dark: { bg: "#000000", text: "#f9fafb", border: "#1f2937", cardBg: "#111111", cardText: "#f9fafb" } }); setPreviewPattern({ color: { light: "#e5e7eb", dark: "#1f2937" }, blur: "0.5rem", density: 2, duration: 80 }); }}>Reset</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader><CardTitle>Icon Size</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Set the size of social media icons on the portfolio page.</p>
              <div className="flex items-center gap-4">
                <select value={siteData.iconSize || 4}
                  onChange={e => saveSiteData({ ...siteData, iconSize: parseInt(e.target.value) })}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value={3}>Small (12px)</option>
                  <option value={4}>Medium (16px)</option>
                  <option value={5}>Large (20px)</option>
                  <option value={6}>X-Large (24px)</option>
                  <option value={8}>2X-Large (32px)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader><CardTitle>Background Pattern</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Customize the animated falling pattern background.</p>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                  <Label>Light Mode Color</Label>
                  <input type="color" className="w-full h-10 rounded cursor-pointer"
                    value={previewPattern?.color?.light || "#e5e7eb"}
                    onChange={e => setPreviewPattern(prev => prev ? { ...prev, color: { ...prev.color, light: e.target.value } } : prev)} />
                </div>
                <div className="space-y-1">
                  <Label>Dark Mode Color</Label>
                  <input type="color" className="w-full h-10 rounded cursor-pointer"
                    value={previewPattern?.color?.dark || "#1f2937"}
                    onChange={e => setPreviewPattern(prev => prev ? { ...prev, color: { ...prev.color, dark: e.target.value } } : prev)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Effect Strength</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={previewPattern?.blur || "0.5rem"}
                    onChange={e => setPreviewPattern(prev => prev ? { ...prev, blur: e.target.value } : prev)}>
                    <option value="0.25rem">Very Strong</option>
                    <option value="0.5rem">Strong</option>
                    <option value="1rem">Medium</option>
                    <option value="1.5rem">Soft</option>
                    <option value="2rem">Very Soft</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Pattern Density</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={previewPattern?.density || 2}
                    onChange={e => setPreviewPattern(prev => prev ? { ...prev, density: parseInt(e.target.value) } : prev)}>
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                    <option value={4}>Very High</option>
                    <option value={5}>Max</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Animation Speed</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={previewPattern?.duration || 80}
                    onChange={e => setPreviewPattern(prev => prev ? { ...prev, duration: parseInt(e.target.value) } : prev)}>
                    <option value={30}>Very Fast</option>
                    <option value={50}>Fast</option>
                    <option value={80}>Normal</option>
                    <option value={120}>Slow</option>
                    <option value={200}>Very Slow</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* ===== SECTIONS TAB ===== */}
      {tab === "sections" && (
        <Section>
          <Card>
            <CardHeader><CardTitle>Section Visibility</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Toggle sections on/off. Hidden sections won&apos;t appear on the portfolio.</p>
              <div className="space-y-3">
                {[
                  { key: "about", label: "About" },
                  { key: "skills", label: "Skills" },
                  { key: "interests", label: "Interests" },
                  { key: "achievements", label: "Achievements" },
                  { key: "education", label: "Education" },
                  { key: "certificates", label: "Certificates" },
                  { key: "publications", label: "Publications" },
                  { key: "projects", label: "Projects" },
                  { key: "underDevelopment", label: "Under Development Projects" },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between p-3 border rounded-md">
                    <span className="font-medium">{s.label}</span>
                    <Button
                      size="sm"
                      variant={siteData.hiddenSections?.includes(s.key) ? "outline" : "default"}
                      onClick={() => {
                        const hidden = siteData.hiddenSections || [];
                        const isHidden = hidden.includes(s.key);
                        const updated = isHidden
                          ? hidden.filter(h => h !== s.key)
                          : [...hidden, s.key];
                        saveSiteData({ ...siteData, hiddenSections: updated });
                      }}
                    >
                      {siteData.hiddenSections?.includes(s.key) ? "Hidden" : "Visible"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>
      )}

      {/* ===== MESSAGES TAB ===== */}
      {tab === "messages" && (
        <Section>
          <h2 className="text-xl font-bold mb-4">Contact Messages</h2>
          {messages.length === 0 ? (
            <p className="text-muted-foreground">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <Card key={msg.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{msg.firstName} {msg.lastName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{msg.email}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </CardHeader>
                  <CardContent><p className="whitespace-pre-wrap">{msg.message}</p></CardContent>
                </Card>
              ))}
            </div>
          )}
        </Section>
      )}
    </main>
  );
}
