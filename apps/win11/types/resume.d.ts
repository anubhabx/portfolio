export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: Skills;
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
  };
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpa?: string;
  stream?: string;
  highlights?: string[];
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  period: string;
  description: string[];
}

export interface Skills {
  frontend: string[];
  backend: string[];
  database: string[];
  devops: string[];
  tools: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  highlights: string[];
  url?: string;
  github?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
}

export interface Language {
  language: string;
  proficiency: string;
}
