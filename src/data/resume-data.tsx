import siteData from "./site-data.json";
import { getIcon } from "@/lib/icon-map";

const raw = siteData;

export const RESUME_DATA = {
  name: raw.profile.name,
  initials: raw.profile.initials,
  location: "",
  locationLink: "",
  about: raw.profile.about,
  summary: raw.profile.summary,
  avatarUrl: raw.profile.avatarUrl,
  personalWebsiteUrl: raw.profile.personalWebsiteUrl,
  contact: {
    email: raw.profile.email,
    tel: raw.profile.tel,
    social: raw.social.map((s) => ({
      name: s.name,
      url: s.url,
      icon: getIcon(s.icon),
    })),
  },
  skills: raw.skills,
  projects: raw.projects.filter((p) => p.status === "completed"),
  underDevelopment: raw.projects.filter((p) => p.status === "under-development"),
  interests: raw.interests,
};
