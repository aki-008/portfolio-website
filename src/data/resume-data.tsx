import { GitHubIcon } from "../components/icons/GitHubIcon";
import { LinkedInIcon } from "../components/icons/LinkedInIcon";
import { XIcon } from "../components/icons/XIcon";
import { DiscordIcon } from "../components/icons/DiscordIcon";
import { InstagramIcon } from "lucide-react";

import projectData from "./data/projects.json";
import underDevelopmentData from "./data/underdev.json";

export const RESUME_DATA = {
  name: "あき [Aki]",
  initials: "Ak",
  location: "",
  locationLink: "",
  about:
    "I'm a Shaswat Singh. Love me some art  q(≧▽≦q) and SWE . Currently learning  日本語, Eager to learn new things !",
  summary: "I like to make stuff that I want or like . Mostly code that miraculously runs (on a good day). Occasionally I draw. Frequently distracted by knowledge. Ping me! Let's colab or just chat.",
  avatarUrl: "https://i.pinimg.com/736x/66/4b/a3/664ba329af75c48378048d0831dd9859.jpg",
  personalWebsiteUrl: "https://portfolio-website-nu-pearl.vercel.app/",
  contact: {
    email: "shaswatsingh910@gmail.com",
    tel: "",
    social: [
      // {
      //   name: "Email",
      //   url: "shaswatsingh910@gmail.com",
      //   // icon: GitHubIcon,
      // },
      {
        name: "GitHub",
        url: "https://github.com/aki-008",
        icon: GitHubIcon,
      },
      {
        name: "X",
        url: "https://x.com/shaswatsingh910",
        icon: XIcon,
      },
      {
        name: "Discord",
        url: "https://discord.gg/VbEpfqaX",
        icon: DiscordIcon,
      },
    ],
  },
  skills: [
    {
      category: "Languages",
     items: ["Python"]
    },
    {
      category: "Frameworks & Libraries",
      items:[
    "vLLM",
    "jupyterlab",       
    "ngrok-client",    
    "kaggle",           
    "groq",             
    "llama-index",    
    "chromadb",         
    "langchain",        
    "python-telegram-bot", 
    "fastapi",          
    "uvicorn",          
    "ultralytics",      
    "opencv-python",    
    "scikit-learn",     
    "pandas",           
    "numpy",            
    "matplotlib",       
    "seaborn",          
    "torch",           
    "transformers",     
    "accelerate",       
    "peft",             
    "trl" ,
    "Unsloth"
]
    },
    {
      category: "Databases",
      items: ["Chromadb", "Qdrant", "Sqlite"]
    },
    {
      category: "Tools & Platforms",
      items: ["Git", "GitHub", "Blender", "Wezterm", "Ollama", "Postman"]
    },
    {
      category: "Other",
      items: ["Drawing", "Manga", "Gaming", "Japanese"]
    }
  ],
  projects: projectData,
  underDevelopment: underDevelopmentData,
  interests: [
    "Programming",
    "Japanese",
    "Music",
    "Drawing",
    "Anime",
    "Manga",
    "Gaming",
  ],
} as const;
