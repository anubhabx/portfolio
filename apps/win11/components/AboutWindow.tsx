"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  User,
  MapPin,
  Mail,
  Globe,
  SquareArrowOutUpRightIcon
} from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import Window from "@/components/Window";
import Link from "next/link";

export type AboutWindowProps = {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  windowId?: string;
  zIndex?: number;
  isFocused?: boolean;
};

export function AboutWindow({
  isOpen,
  onClose,
  onMinimize,
  onFocus,
  windowId,
  zIndex,
  isFocused
}: AboutWindowProps) {
  return (
    <Window
      title="About Me"
      icon={<User className="size-4" />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      windowId={windowId}
      zIndex={zIndex}
      isFocused={isFocused}
      className="min-w-[600px] min-h-[500px]"
    >
      <div className="p-6 space-y-6 overflow-auto h-full">
        {/* Header Section */}
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">Anubhab Debnath</h1>
            <p className="text-muted-foreground mb-3">
              UI Designer and Full Stack Developer
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bio Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Passionate full-stack developer with expertise in modern web
              technologies. I love creating intuitive user experiences and
              robust backend systems. When I'm not coding, you can find me
              exploring new technologies, contributing to open source projects,
              or playing games.
            </p>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "TypeScript",
                    "Next.js",
                    "Tailwind CSS",
                    "Framer Motion"
                  ].map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  {["Node.js", "Python", "PostgreSQL", "MongoDB", "Docker"].map(
                    (skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {["Git", "VSCode", "Figma", "AWS", "Vercel"].map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Link
                  href={"mailto:anubhabxdev@gmail.com"}
                  target="_blank"
                  className="flex items-center gap-3 group"
                >
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="text-sm">anubhabxdev@gmail.com</span>
                  <SquareArrowOutUpRightIcon className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={"https://www.github.com/anubhabx"}
                  target="_blank"
                  className="flex items-center gap-3 group"
                >
                  <Github className="size-4 text-muted-foreground" />
                  <span className="text-sm">github.com/anubhabx</span>

                  <SquareArrowOutUpRightIcon className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={"https://www.linkedin.com/in/anubhabx"}
                  target="_blank"
                  className="flex items-center gap-3 group"
                >
                  <Linkedin className="size-4 text-muted-foreground" />
                  <span className="text-sm">linkedin.com/in/anubhabx</span>

                  <SquareArrowOutUpRightIcon className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={"https://anubhabx.me"}
                  target="_blank"
                  className="flex items-center gap-3 group"
                >
                  <Globe className="size-4 text-muted-foreground" />
                  <span className="text-sm">anubhabx.me</span>

                  <SquareArrowOutUpRightIcon className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Window>
  );
}

export default AboutWindow;
