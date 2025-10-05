"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Badge } from "@workspace/ui/components/badge";
import {
  Download,
  FileText,
  RefreshCw,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Code,
  Mail,
  Phone,
  MapPin,
  Calendar,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import Window from "@/components/Window";
import { useResume } from "@/hooks/use-resume";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export type ResumeWindowProps = {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  windowId?: string;
  zIndex?: number;
  isFocused?: boolean;
  isMinimized?: boolean;
};

export function ResumeWindow({
  isOpen,
  onClose,
  onMinimize,
  onFocus,
  windowId,
  zIndex,
  isFocused,
  isMinimized
}: ResumeWindowProps) {
  const { resume, isLoading, error, refetch } = useResume();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = `${resume?.personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Window
      title="Resume / CV"
      icon={<FileText className="size-4" />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      windowId={windowId}
      zIndex={zIndex}
      isFocused={isFocused}
      isMinimized={isMinimized}
      className="min-w-[700px] min-h-[600px]"
    >
      <div className="p-6 space-y-6 overflow-auto h-full">
        {/* Header with Download Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {resume?.personalInfo.name || "Resume"}
            </h1>
            {resume?.personalInfo.title && (
              <p className="text-muted-foreground">
                {resume.personalInfo.title}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {error && (
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="size-4" />
                Retry
              </Button>
            )}
            <Button onClick={handleDownload} className="gap-2">
              <Download className="size-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <Separator />

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load resume. {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Resume Content */}
        {!isLoading && !error && resume && (
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="size-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <Link
                    href={`mailto:${resume.personalInfo.email}`}
                    className="hover:underline"
                  >
                    {resume.personalInfo.email}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{resume.personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{resume.personalInfo.location}</span>
                </div>
                {resume.personalInfo.links.github && (
                  <div className="flex items-center gap-2">
                    <FaGithub className="size-4 text-muted-foreground" />
                    <Link
                      href={resume.personalInfo.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      GitHub
                    </Link>
                  </div>
                )}
                {resume.personalInfo.links.linkedin && (
                  <div className="flex items-center gap-2">
                    <FaLinkedin className="size-4 text-muted-foreground" />
                    <Link
                      href={resume.personalInfo.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      LinkedIn
                    </Link>
                  </div>
                )}
                {resume.personalInfo.links.portfolio && (
                  <div className="flex items-center gap-2">
                    <SquareArrowOutUpRightIcon className="size-4 text-muted-foreground" />
                    <Link
                      href={resume.personalInfo.links.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Portfolio
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary */}
            {resume.summary && (
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {resume.summary}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {resume.experience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="size-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resume.experience.map((job, index) => (
                    <div key={index} className="relative">
                      {index !== resume.experience.length - 1 && (
                        <div className="absolute left-0 top-8 bottom-0 w-px bg-border" />
                      )}
                      <div className="flex gap-4">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-semibold">{job.position}</h3>
                            <p className="text-muted-foreground font-medium">
                              {job.company}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {job.period}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                {job.location}
                              </div>
                            </div>
                          </div>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {job.description.map((item, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="size-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resume.education.map((edu, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-muted-foreground font-medium">
                        {edu.institution}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {edu.period}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {edu.location}
                        </div>
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                        {edu.stream && <span>{edu.stream}</span>}
                      </div>
                      {edu.highlights && edu.highlights.length > 0 && (
                        <ul className="space-y-1 text-sm text-muted-foreground mt-2">
                          {edu.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="size-5" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.skills.frontend.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Frontend</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.frontend.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {resume.skills.backend.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Backend</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.backend.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {resume.skills.database.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Database</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.database.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {resume.skills.devops.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">DevOps/Cloud</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.devops.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {resume.skills.tools.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.tools.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Languages */}
            {resume.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {resume.languages.map((lang, index) => (
                      <div key={index}>
                        <span className="font-medium">{lang.language}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          - {lang.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Projects */}
            {resume.projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="size-5" />
                    Featured Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>

                          <p className="text-sm text-muted-foreground mt-1">
                            {project.description}
                          </p>
                        </div>
                        {(project.url || project.github) && (
                          <div className="flex gap-2 flex-shrink-0">
                            {project.github && (
                              <Link
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <FaGithub className="size-4" />
                              </Link>
                            )}
                            {project.url && (
                              <Link
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <SquareArrowOutUpRightIcon className="size-4" />
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      {project.highlights.length > 0 && (
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {project.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Fallback for empty resume */}
        {!isLoading && !error && !resume && (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              No resume data available. Please add resume data to the data
              folder.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Window>
  );
}

export default ResumeWindow;
