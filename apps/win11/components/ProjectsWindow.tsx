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
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  ExternalLink,
  FolderOpen,
  Grid3X3,
  List,
  Star,
  Calendar,
  Filter,
  RefreshCw,
  GitFork
} from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";
import { cn } from "@workspace/ui/lib/utils";
import Window from "@/components/Window";
import { useGitHubProjects } from "@/hooks/use-github";

export type ProjectsWindowProps = {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  windowId?: string;
  zIndex?: number;
  isFocused?: boolean;
};

// Replace with your GitHub username
const GITHUB_USERNAME = "anubhabx";

export function ProjectsWindow({
  isOpen,
  onClose,
  onMinimize,
  onFocus,
  windowId,
  zIndex,
  isFocused
}: ProjectsWindowProps) {
  const { projects, isLoading, error, refetch, lastUpdated } =
    useGitHubProjects({
      username: GITHUB_USERNAME,
      refreshInterval: 5 * 60 * 1000 // 5 minutes
    });

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [showFilters, setShowFilters] = React.useState(false);

  // Get all unique tags from projects
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [projects]);

  // Filter projects
  const filteredProjects = React.useMemo(() => {
    let filtered = projects;

    // Filter by category
    if (selectedCategory !== "all") {
      if (selectedCategory === "featured") {
        filtered = filtered.filter((p) => p.featured);
      } else {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTags.every((tag) => p.tags.includes(tag))
      );
    }

    return filtered;
  }, [projects, selectedCategory, searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const categories = React.useMemo(
    () => [
      { id: "all", label: "All Projects", count: projects.length },
      {
        id: "featured",
        label: "Featured",
        count: projects.filter((p) => p.featured).length
      },
      {
        id: "web",
        label: "Web Apps",
        count: projects.filter((p) => p.category === "web").length
      },
      {
        id: "mobile",
        label: "Mobile",
        count: projects.filter((p) => p.category === "mobile").length
      },
      {
        id: "tools",
        label: "Tools",
        count: projects.filter((p) => p.category === "tools").length
      }
    ],
    [projects]
  );

  return (
    <Window
      title="Projects"
      icon={<FolderOpen className="size-4" />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      windowId={windowId}
      zIndex={zIndex}
      isFocused={isFocused}
      className="min-w-[900px] min-h-[600px]"
    >
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-background/30 border-b border-white/10">
          <div className="flex items-center gap-2 px-2 py-1 bg-background/50 rounded border border-border/50 flex-1 max-w-md">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none bg-transparent px-0 py-0 h-auto focus-visible:ring-0 text-sm"
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="size-4" />
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {selectedTags.length}
              </Badge>
            )}
          </Button>

          {(selectedTags.length > 0 ||
            searchQuery ||
            selectedCategory !== "all") && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          )}

          <div className="flex-1" />

          {/* Refresh Button */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 gap-2"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="size-4" />
            ) : (
              <Grid3X3 className="size-4" />
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="p-4 bg-background/20 border-b border-white/10">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Filter by Technology
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        selectedTags.includes(tag) ? "default" : "outline"
                      }
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-48 border-r border-white/10 p-2 bg-background/10">
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start h-8 gap-2",
                    selectedCategory === category.id && "bg-accent"
                  )}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.id === "featured" && <Star className="size-4" />}
                  {category.id === "all" && <FolderOpen className="size-4" />}
                  <span className="flex-1 text-left">{category.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {category.count}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <LoadingSkeleton viewMode={viewMode} />
            ) : error ? (
              <ErrorState error={error} onRetry={refetch} />
            ) : filteredProjects.length === 0 ? (
              <EmptyState onClearFilters={clearFilters} />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                {filteredProjects.map((project) => (
                  <ProjectGridCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="p-2">
                {/* List Header */}
                <div className="flex items-center px-4 py-2 text-xs font-medium text-muted-foreground border-b border-white/10 bg-background/20 sticky top-0">
                  <div className="flex-1">Name</div>
                  <div className="w-40">Category</div>
                  <div className="w-32">Year</div>
                  <div className="w-32">Stats</div>
                  <div className="w-32">Actions</div>
                </div>

                {/* List Items */}
                <div className="space-y-0.5 mt-1">
                  {filteredProjects.map((project) => (
                    <ProjectListItem key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-t border-white/10 bg-background/20">
          <span>{filteredProjects.length} items</span>
          {lastUpdated && (
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>
      </div>
    </Window>
  );
}

// ... ProjectGridCard and ProjectListItem components (update to use new project type)

type ProjectGridCardProps = {
  project: ReturnType<typeof useGitHubProjects>["projects"][0];
};

function ProjectGridCard({ project }: ProjectGridCardProps) {
  return (
    <Card className="overflow-hidden transition-colors cursor-pointer group">
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 h-32 flex items-center justify-center relative">
        <FolderOpen className="size-12 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
        {project.featured && (
          <div className="absolute top-2 right-2">
            <Star className="size-4 fill-yellow-500 text-yellow-500" />
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm line-clamp-1">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-1.5 py-0"
            >
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="size-3" />
            {project.stars}
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="size-3" />
            {project.forks}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs"
            asChild
          >
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="size-3 mr-1" />
              Code
            </a>
          </Button>
          {project.demo && (
            <Button size="sm" className="flex-1 h-7 text-xs" asChild>
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3 mr-1" />
                Demo
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type ProjectListItemProps = {
  project: ReturnType<typeof useGitHubProjects>["projects"][0];
};

function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <div className="flex items-center px-4 py-2 rounded transition-colors cursor-pointer group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FolderOpen className="size-5 text-muted-foreground/70 flex-shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">
              {project.title}
            </span>
            {project.featured && (
              <Star className="size-3 fill-yellow-500 text-yellow-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {project.description}
          </p>
        </div>
      </div>
      <div className="w-40 text-sm text-muted-foreground">
        <Badge variant="outline" className="text-xs">
          {project.category}
        </Badge>
      </div>
      <div className="w-32 flex items-center gap-1 text-sm text-muted-foreground">
        <Calendar className="size-3" />
        {project.year}
      </div>
      <div className="w-32 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star className="size-3" />
          {project.stars}
        </div>
        <div className="flex items-center gap-1">
          <GitFork className="size-3" />
          {project.forks}
        </div>
      </div>
      <div className="w-32 flex gap-1">
        <Button size="sm" variant="ghost" className="h-7 px-2" asChild>
          <a href={project.github} target="_blank" rel="noopener noreferrer">
            <Github className="size-3" />
          </a>
        </Button>
        {project.demo && (
          <Button size="sm" variant="ghost" className="h-7 px-2" asChild>
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-32" />
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <p className="text-destructive">{error.message}</p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </div>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-2">
        <FolderOpen className="size-12 mx-auto text-muted-foreground/50" />
        <p className="text-muted-foreground">
          No projects found matching your filters
        </p>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    </div>
  );
}

export default ProjectsWindow;
