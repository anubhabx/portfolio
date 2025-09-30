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
import { Download, FileText, Calendar, MapPin, Building } from "lucide-react";
import Window from "@/components/Window";

export type ResumeWindowProps = {
  isOpen: boolean;
  onClose: () => void;
};

const experience = [
  {
    company: "Tech Startup Inc.",
    position: "Senior Full Stack Developer",
    location: "San Francisco, CA",
    period: "2022 - Present",
    description: [
      "Led development of core platform features serving 100k+ users",
      "Improved application performance by 40% through optimization",
      "Mentored junior developers and established coding standards"
    ]
  },
  {
    company: "Digital Agency Co.",
    position: "Full Stack Developer",
    location: "Remote",
    period: "2020 - 2022",
    description: [
      "Built responsive web applications for diverse client portfolio",
      "Collaborated with design teams to implement pixel-perfect UIs",
      "Integrated third-party APIs and payment processing systems"
    ]
  },
  {
    company: "Software Solutions Ltd.",
    position: "Frontend Developer",
    location: "New York, NY",
    period: "2019 - 2020",
    description: [
      "Developed user interfaces using React and modern CSS frameworks",
      "Implemented automated testing strategies with Jest and Cypress",
      "Participated in agile development processes and code reviews"
    ]
  }
];

const education = [
  {
    institution: "University of California",
    degree: "Bachelor of Science in Computer Science",
    location: "Berkeley, CA",
    period: "2015 - 2019",
    gpa: "3.8/4.0"
  }
];

export function ResumeWindow({ isOpen, onClose }: ResumeWindowProps) {
  const handleDownload = () => {
    // Simulate PDF download
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "John_Doe_Resume.pdf";
    link.click();
  };

  return (
    <Window
      title="Resume / CV"
      icon={<FileText className="size-4" />}
      isOpen={isOpen}
      onClose={onClose}
      className="min-w-[700px] min-h-[600px]"
    >
      <div className="p-6 space-y-6 overflow-auto h-full">
        {/* Header with Download Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">Full Stack Developer</p>
          </div>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="size-4" />
            Download PDF
          </Button>
        </div>

        <Separator />

        {/* Experience Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="size-5" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {experience.map((job, index) => (
              <div key={index} className="relative">
                {index !== experience.length - 1 && (
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

        {/* Education Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            {education.map((edu, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-muted-foreground font-medium">
                  {edu.institution}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {edu.period}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {edu.location}
                  </div>
                  <span>GPA: {edu.gpa}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Core Competencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Technical Skills</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• JavaScript, TypeScript, Python</li>
                  <li>• React, Next.js, Node.js</li>
                  <li>• PostgreSQL, MongoDB</li>
                  <li>• AWS, Docker, Git</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Soft Skills</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Team Leadership</li>
                  <li>• Problem Solving</li>
                  <li>• Agile Methodologies</li>
                  <li>• Client Communication</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Window>
  );
}

export default ResumeWindow;
