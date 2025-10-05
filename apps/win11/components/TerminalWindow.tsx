"use client";

import * as React from "react";
import Window, { type WindowProps as BaseWindowProps } from "./Window";
import { TerminalIcon } from "./Icons";
import { useResume } from "@/hooks/use-resume";
import { useGitHubProjects } from "@/hooks/use-github";
import type { ResumeData } from "@/types/resume";

type WindowProps = Omit<BaseWindowProps, "title" | "icon" | "children">;

interface CommandOutput {
  command: string;
  output: React.ReactNode;
  timestamp: Date;
}

export function TerminalWindow(props: WindowProps) {
  const [history, setHistory] = React.useState<CommandOutput[]>([]);
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  const { resume } = useResume();
  const { projects } = useGitHubProjects({ username: "anubhabx" });

  // Auto-scroll to bottom when new output is added
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when window is focused
  React.useEffect(() => {
    if (props.isFocused) {
      inputRef.current?.focus();
    }
  }, [props.isFocused]);

  // Add welcome message on mount
  React.useEffect(() => {
    setHistory([
      {
        command: "",
        output: (
          <div className="space-y-1">
            <div className="text-green-400">Welcome to Portfolio Terminal v1.0</div>
            <div className="text-muted-foreground">Type 'help' to see available commands</div>
          </div>
        ),
        timestamp: new Date()
      }
    ]);
  }, []);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output: React.ReactNode = null;

    switch (trimmedCmd) {
      case "help":
        output = (
          <div className="space-y-2">
            <div className="text-blue-400 font-semibold">Available Commands:</div>
            <div className="pl-4 space-y-1 text-sm">
              <div><span className="text-green-400">help</span> - Show this help message</div>
              <div><span className="text-green-400">about</span> - Display bio and summary</div>
              <div><span className="text-green-400">contact</span> - Show contact information</div>
              <div><span className="text-green-400">resume</span> - Display resume summary</div>
              <div><span className="text-green-400">skills</span> - List technical skills</div>
              <div><span className="text-green-400">projects</span> - Show portfolio projects</div>
              <div><span className="text-green-400">experience</span> - Display work experience</div>
              <div><span className="text-green-400">education</span> - Show education history</div>
              <div><span className="text-green-400">socials</span> - Display social media links</div>
              <div><span className="text-green-400">clear</span> - Clear the terminal</div>
              <div className="pt-2 text-muted-foreground italic">Tip: Commands are case-insensitive</div>
            </div>
          </div>
        );
        break;

      case "about":
        output = resume ? (
          <div className="space-y-2">
            <div className="text-blue-400 font-semibold">{resume.personalInfo.name}</div>
            <div className="text-muted-foreground">{resume.personalInfo.title}</div>
            <div className="pt-2">{resume.summary}</div>
          </div>
        ) : (
          <div className="text-yellow-400">Loading resume data...</div>
        );
        break;

      case "contact":
        output = resume ? (
          <div className="space-y-2">
            <div className="text-blue-400 font-semibold">Contact Information:</div>
            <div className="pl-4 space-y-1">
              <div>📧 Email: <span className="text-green-400">{resume.personalInfo.email}</span></div>
              <div>📱 Phone: <span className="text-green-400">{resume.personalInfo.phone}</span></div>
              <div>📍 Location: <span className="text-green-400">{resume.personalInfo.location}</span></div>
            </div>
          </div>
        ) : (
          <div className="text-yellow-400">Loading contact info...</div>
        );
        break;

      case "socials":
        output = resume ? (
          <div className="space-y-2">
            <div className="text-blue-400 font-semibold">Social Links:</div>
            <div className="pl-4 space-y-1">
              {resume.personalInfo.links.github && (
                <div>GitHub: <a href={resume.personalInfo.links.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{resume.personalInfo.links.github}</a></div>
              )}
              {resume.personalInfo.links.linkedin && (
                <div>LinkedIn: <a href={resume.personalInfo.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{resume.personalInfo.links.linkedin}</a></div>
              )}
              {resume.personalInfo.links.portfolio && (
                <div>Portfolio: <a href={resume.personalInfo.links.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{resume.personalInfo.links.portfolio}</a></div>
              )}
              {resume.personalInfo.links.twitter && (
                <div>Twitter: <a href={resume.personalInfo.links.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{resume.personalInfo.links.twitter}</a></div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-yellow-400">Loading social links...</div>
        );
        break;

      case "skills":
        output = resume ? (
          <div className="space-y-2">
            <div className="text-blue-400 font-semibold">Technical Skills:</div>
            <div className="pl-4">
              <div className="text-green-400">Frontend:</div>
              <div className="pl-4 text-muted-foreground">{resume.skills.frontend.join(", ")}</div>
            </div>
            <div className="pl-4">
              <div className="text-green-400">Backend:</div>
              <div className="pl-4 text-muted-foreground">{resume.skills.backend.join(", ")}</div>
            </div>
            <div className="pl-4">
              <div className="text-green-400">Database:</div>
              <div className="pl-4 text-muted-foreground">{resume.skills.database.join(", ")}</div>
            </div>
            <div className="pl-4">
              <div className="text-green-400">DevOps:</div>
              <div className="pl-4 text-muted-foreground">{resume.skills.devops.join(", ")}</div>
            </div>
            <div className="pl-4">
              <div className="text-green-400">Tools:</div>
              <div className="pl-4 text-muted-foreground">{resume.skills.tools.join(", ")}</div>
            </div>
          </div>
        ) : (
          <div className="text-yellow-400">Loading skills...</div>
        );
        break;

      case "projects":
        output = projects && projects.length > 0 ? (
          <div className="space-y-2">
            <div className="text-blue-400 font-semibold">Portfolio Projects ({projects.length}):</div>
            <div className="space-y-3 pl-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="space-y-1">
                  <div className="text-green-400">{project.title}</div>
                  <div className="text-sm text-muted-foreground pl-4">{project.description || "No description"}</div>
                  <div className="text-xs text-blue-400 pl-4">{project.github}</div>
                  {project.tags && project.tags.length > 0 && (
                    <div className="text-xs pl-4 text-muted-foreground">
                      Tech: {project.tags.join(", ")}
                    </div>
                  )}
                </div>
              ))}
              {projects.length > 5 && (
                <div className="text-muted-foreground italic">... and {projects.length - 5} more</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-yellow-400">Loading projects...</div>
        );
        break;

      case "experience":
        output = resume ? (
          <div className="space-y-2">
            <div className="text-blue-400 font-semibold">Work Experience:</div>
            <div className="space-y-3 pl-4">
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-green-400">{exp.position} @ {exp.company}</div>
                  <div className="text-sm text-muted-foreground pl-4">{exp.period}</div>
                  <div className="text-sm pl-4">{exp.location}</div>
                  <ul className="text-sm list-disc list-inside pl-4 space-y-1">
                    {exp.description.map((item, i) => (
                      <li key={i} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-yellow-400">Loading experience...</div>
        );
        break;

      case "education":
        output = resume ? (
          <div className="space-y-2">
            <div className="text-blue-400 font-semibold">Education:</div>
            <div className="space-y-3 pl-4">
              {resume.education.map((edu, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-green-400">{edu.degree}</div>
                  <div className="text-sm text-muted-foreground pl-4">{edu.institution}</div>
                  <div className="text-sm pl-4">{edu.period}</div>
                  {edu.gpa && <div className="text-sm pl-4">GPA: {edu.gpa}</div>}
                  {edu.stream && <div className="text-sm pl-4">Stream: {edu.stream}</div>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-yellow-400">Loading education...</div>
        );
        break;

      case "resume":
        output = (
          <div className="space-y-1">
            <div className="text-blue-400">Run individual commands for detailed information:</div>
            <div className="pl-4 space-y-1 text-sm text-muted-foreground">
              <div>• <span className="text-green-400">about</span> - Bio and summary</div>
              <div>• <span className="text-green-400">experience</span> - Work history</div>
              <div>• <span className="text-green-400">education</span> - Academic background</div>
              <div>• <span className="text-green-400">skills</span> - Technical skills</div>
            </div>
          </div>
        );
        break;

      case "clear":
      case "cls":
        setHistory([]);
        return;

      case "":
        return;

      default:
        output = (
          <div className="text-red-400">
            Command not found: {trimmedCmd}. Type 'help' for available commands.
          </div>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        command: cmd,
        output,
        timestamp: new Date()
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Future: Add command history navigation with up/down arrows
    if (e.key === "Tab") {
      e.preventDefault();
      // Future: Add autocomplete
    }
  };

  return (
    <Window
      title="Terminal"
      icon={<TerminalIcon className="size-4" />}
      initialWidth={700}
      initialHeight={500}
      {...props}
    >
      <div className="flex flex-col h-full bg-black/95 text-green-400 font-mono text-sm">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry, idx) => (
            <div key={idx} className="space-y-1">
              {entry.command && (
                <div className="flex gap-2">
                  <span className="text-blue-400">$</span>
                  <span className="text-white">{entry.command}</span>
                </div>
              )}
              <div className="pl-4">{entry.output}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t border-green-900/30">
          <span className="text-blue-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white caret-green-400"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </Window>
  );
}

export default TerminalWindow;
