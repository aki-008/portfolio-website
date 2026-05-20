"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";

interface Project {
  id?: string;
  title: string;
  techStack: string[];
  description: string;
  logo?: string;
  link?: { label: string; href: string };
  status: string;
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
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"profile" | "social" | "skills" | "interests" | "projects" | "messages">("projects");

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
  const [projectForm, setProjectForm] = useState({ title: "", description: "", techStack: "", linkLabel: "", linkHref: "", status: "completed" });
  const [editingProject, setEditingProject] = useState<string | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/site-data");
    const data = await res.json();
    setSiteData(data);
    setProfile(data.profile);
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

  if (status === "loading") {
    return <main className="container mx-auto p-8 max-w-md"><p className="text-center text-muted-foreground">Loading...</p></main>;
  }

  if (status === "unauthenticated") {
    return (
      <main className="container mx-auto p-8 max-w-md">
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
    { key: "messages", label: `Messages (${messages.length})` },
  ] as const;

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button variant="outline" onClick={() => signOut()}>Logout</Button>
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
            {siteData.social.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-muted-foreground">{s.url}</p>
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
                        status: projectForm.status,
                      };
                      if (editingProject) {
                        const idx = newProjects.findIndex(p => p.id === editingProject);
                        if (idx >= 0) newProjects[idx] = { ...newProjects[idx], ...entry };
                      } else {
                        newProjects.push(entry);
                      }
                      saveSiteData({ ...siteData, projects: newProjects });
                      setProjectForm({ title: "", description: "", techStack: "", linkLabel: "", linkHref: "", status: "completed" });
                      setEditingProject(null);
                    }}>{editingProject ? "Update" : "Add"}</Button>
                    {editingProject && <Button variant="outline" onClick={() => { setEditingProject(null); setProjectForm({ title: "", description: "", techStack: "", linkLabel: "", linkHref: "", status: "completed" }); }}>Cancel</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section>
            <h2 className="text-xl font-bold mb-4">All Projects</h2>
            {loading ? (
              <p>Loading...</p>
            ) : siteData.projects.length === 0 ? (
              <p className="text-muted-foreground">No projects yet.</p>
            ) : (
              <div className="space-y-2">
                {siteData.projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className={`text-xs ${project.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {project.status === "completed" ? "Completed" : "Under Dev"}
                        </Badge>
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
                      <Button size="sm" variant="outline" onClick={() => { setEditingProject(project.id!); setProjectForm({ title: project.title, description: project.description, techStack: project.techStack.join(", "), linkLabel: project.link?.label || "", linkHref: project.link?.href || "", status: project.status }); }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => saveSiteData({ ...siteData, projects: siteData.projects.filter(p => p.id !== project.id) })}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </>
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
