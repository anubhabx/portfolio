"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@workspace/ui/components/tabs";
import { ExternalLink, FolderOpen } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";

import Window from "@/components/Window";

export type ProjectsWindowProps = {
  isOpen: boolean;
  onClose: () => void;
};

const projects = [
  {
    id: "ecommerce",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with React, Node.js, and Stripe integration.",
    image: "/api/placeholder/300/200",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    category: "web",
    github: "https://github.com/johndoe/ecommerce",
    demo: "https://ecommerce-demo.com",
    featured: true
  },
  {
    id: "mobile-app",
    title: "Fitness Tracker App",
    description: "React Native mobile app for tracking workouts and nutrition.",
    image: "/api/placeholder/300/200",
    tags: ["React Native", "TypeScript", "Firebase"],
    category: "mobile",
    github: "https://github.com/johndoe/fitness-tracker",
    demo: "https://apps.apple.com/fitness-tracker",
    featured: true
  },
  {
    id: "dashboard",
    title: "Analytics Dashboard",
    description:
      "Real-time analytics dashboard with interactive charts and data visualization.",
    image: "/api/placeholder/300/200",
    tags: ["Next.js", "D3.js", "Tailwind CSS"],
    category: "web",
    github: "https://github.com/johndoe/analytics-dashboard",
    demo: "https://analytics-demo.com",
    featured: false
  },
  {
    id: "cli-tool",
    title: "Developer CLI Tool",
    description: "Command-line tool for automating development workflows.",
    image: "/api/placeholder/300/200",
    tags: ["Node.js", "TypeScript", "Commander.js"],
    category: "tools",
    github: "https://github.com/johndoe/dev-cli",
    demo: "https://npmjs.com/package/dev-cli",
    featured: false
  }
];

export function ProjectsWindow({ isOpen, onClose }: ProjectsWindowProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <Window
      title="My Projects"
      icon={<FolderOpen className="size-4" />}
      isOpen={isOpen}
      onClose={onClose}
      className="min-w-[800px] min-h-[600px]"
    >
      <div className="p-6 h-full overflow-auto">
        <Tabs defaultValue="featured" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="web">Web Apps</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="flex-1 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="flex-1 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} compact />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="web" className="flex-1 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects
                .filter((p) => p.category === "web")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="flex-1 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects
                .filter((p) => p.category === "mobile")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Window>
  );
}

type ProjectCardProps = {
  project: (typeof projects)[0];
  compact?: boolean;
};

function ProjectCard({ project, compact = false }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className={`bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 ${compact ? "h-32" : "h-48"} flex items-center justify-center`}
      >
        <FolderOpen
          className={`${compact ? "size-8" : "size-12"} text-muted-foreground`}
        />
      </div>
      <CardHeader className={compact ? "pb-2" : ""}>
        <CardTitle
          className={`${compact ? "text-base" : "text-lg"} line-clamp-1`}
        >
          {project.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p
          className={`text-muted-foreground text-sm ${compact ? "line-clamp-2" : "line-clamp-3"}`}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, compact ? 2 : 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > (compact ? 2 : 4) && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - (compact ? 2 : 4)}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="size-3 mr-1" />
              Code
            </a>
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3 mr-1" />
              Demo
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectsWindow;
