import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { XIcon } from "@/components/icons/XIcon";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { GlobeIcon } from "lucide-react";
import type { ComponentType } from "react";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  GitHub: GitHubIcon,
  X: XIcon,
  Discord: DiscordIcon,
};

export function getIcon(name: string) {
  return iconMap[name] || GlobeIcon;
}
