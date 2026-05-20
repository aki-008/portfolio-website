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
}

interface Message {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"projects" | "messages">("projects");

  const [projects, setProjects] = useState<Project[]>([]);
  const [underDev, setUnderDev] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [type, setType] = useState<"projects" | "underDevelopment">("projects");
  const [messageLoading, setMessageLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    linkLabel: "",
    linkHref: "",
  });

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data.projects || []);
    setUnderDev(data.underDevelopment || []);
    setLoading(false);
  };

  const fetchMessages = async () => {
    setMessageLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects();
      fetchMessages();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <main className="container mx-auto p-8 max-w-md">
        <p className="text-center text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="container mx-auto p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn("credentials", { email, password, redirect: false });
          }}
          className="space-y-4"
        >
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      title: form.title,
      description: form.description,
      techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      logo: "",
      link: form.linkHref ? { label: form.linkLabel || "Link", href: form.linkHref } : undefined,
    };

    const method = editing?.id ? "PUT" : "POST";
    const body = editing?.id ? { type, id: editing.id, data: projectData } : { type, data: projectData };

    await fetch("/api/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setForm({ title: "", description: "", techStack: "", linkLabel: "", linkHref: "" });
    setEditing(null);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects?id=${id}&type=${type}`, { method: "DELETE" });
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(", "),
      linkLabel: project.link?.label || "",
      linkHref: project.link?.href || "",
    });
  };

  const currentList = type === "projects" ? projects : underDev;

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button variant="outline" onClick={() => signOut()}>Logout</Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Button variant={tab === "projects" ? "default" : "outline"} onClick={() => setTab("projects")}>Projects</Button>
        <Button variant={tab === "messages" ? "default" : "outline"} onClick={() => { setTab("messages"); fetchMessages(); }}>
          Messages ({messages.length})
        </Button>
      </div>

      {tab === "projects" && (
        <>
          <Section>
            <div className="flex gap-2 mb-4">
              <Button variant={type === "projects" ? "default" : "outline"} onClick={() => setType("projects")}>Projects</Button>
              <Button variant={type === "underDevelopment" ? "default" : "outline"} onClick={() => setType("underDevelopment")}>Under Dev</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{editing ? "Edit Project" : "Add New Project"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
                    <Input id="techStack" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="React, TypeScript, Node.js" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkLabel">Link Label</Label>
                      <Input id="linkLabel" value={form.linkLabel} onChange={(e) => setForm({ ...form, linkLabel: e.target.value })} placeholder="GitHub" />
                    </div>
                    <div>
                      <Label htmlFor="linkHref">Link URL</Label>
                      <Input id="linkHref" value={form.linkHref} onChange={(e) => setForm({ ...form, linkHref: e.target.value })} placeholder="https://github.com/..." />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">{editing ? "Update" : "Add"}</Button>
                    {editing && (
                      <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ title: "", description: "", techStack: "", linkLabel: "", linkHref: "" }); }}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </Section>

          <Section>
            <h2 className="text-xl font-bold mb-4">Existing {type === "projects" ? "Projects" : "Under Development"}</h2>
            {loading ? (
              <p>Loading...</p>
            ) : currentList.length === 0 ? (
              <p className="text-muted-foreground">No projects yet.</p>
            ) : (
              <div className="space-y-2">
                {currentList.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-md">{project.description}</p>
                      <div className="flex gap-1 mt-1">
                        {project.techStack.slice(0, 3).map((t) => (
                          <Badge key={t} className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id!)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </>
      )}

      {tab === "messages" && (
        <Section>
          <h2 className="text-xl font-bold mb-4">Contact Messages</h2>
          {messageLoading ? (
            <p>Loading...</p>
          ) : messages.length === 0 ? (
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
                      <p className="text-xs text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Section>
      )}
    </main>
  );
}
