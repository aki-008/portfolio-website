import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

interface Props {
  title: string;
  description: string;
  tags: readonly string[];
  link?: string;
  deployLink?: string;
  cardBg?: string;
  cardText?: string;
  cardBorder?: string;
}

export function ProjectCard({ title, description, tags, link, deployLink, cardBg, cardText, cardBorder }: Props) {
  return (
    <Card className="flex flex-col border rounded-lg p-3 transition-all duration-300 ease-in-out min-h-[230px] max-h-[230px] hover:max-h-[800px] overflow-hidden hover:overflow-visible hover:scale-[1.03] hover:z-10 hover:shadow-xl group"
      style={{
        backgroundColor: cardBg,
        color: cardText,
        borderColor: cardBorder,
      }}
    >
      <CardHeader className="">
        <div className="space-y-1">
          <CardTitle className="text-base">
            {link ? (
              <a
                href={link}
                target="_blank"
                className="inline-flex items-center gap-1 hover:underline"
              >
                {title}{" "}
                <span className="h-1 w-1 rounded-full bg-green-500"></span>
              </a>
            ) : (
              title
            )}
            {deployLink && (
              <a
                href={deployLink}
                target="_blank"
                className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Live
              </a>
            )}
          </CardTitle>
          <div className="hidden font-mono text-xs underline print:visible">
            {link?.replace("https://", "").replace("www.", "").replace("/", "")}
          </div>
          <CardDescription className="font-mono text-xs line-clamp-3 group-hover:line-clamp-none">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex">
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge
              className="px-1 py-0 text-[10px] print:border-1 print:border-gray-300 print:bg-gray-100 print:text-gray-800"
              variant="secondary"
              key={tag}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
