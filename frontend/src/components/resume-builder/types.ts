export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    summary: string;
    role: string;
  };
  experience: {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string; // or "Present"
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: string[];
  projects: {
    id: string;
    name: string;
    link: string;
    description: string;
  }[];
  customSections: {
    id: string;
    title: string;
    items: {
      id: string;
      title: string;
      subtitle?: string;
      description: string;
    }[];
  }[];
}

export const initialResumeState: ResumeData = {
  personalInfo: {
    fullName: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    website: "alexmorgan.dev",
    role: "Senior Full Stack Developer",
    summary:
      "Passionate developer with 5+ years of experience in building scalable web applications. Expert in React, Node.js, and cloud architecture. Dedicated to writing clean, maintainable code and solving complex problems.",
  },
  experience: [
    {
      id: "1",
      company: "TechNova Inc.",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: "Present",
      current: true,
      description:
        "• Led a team of 5 engineers to rebuild the core payment processing system.\n• Improved system performance by 40% through caching strategies and database optimization.\n• Mentored junior developers and conducted code reviews.",
    },
    {
      id: "2",
      company: "Creative Studio",
      position: "Frontend Developer",
      location: "New York, NY",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      description:
        "• Developed interactive UI components using React and Redux.\n• Collaborated with designers to ensure pixel-perfect implementation of UI/UX designs.\n• Reduced load time by 30% by implementing lazy loading and code splitting.",
    },
  ],
  education: [
    {
      id: "1",
      school: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Boston, MA",
      startDate: "2014-09",
      endDate: "2018-05",
      description: "Graduated with Honors. Member of the Coding Club.",
    },
  ],
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "AWS",
    "Docker",
    "Tailwind CSS",
    "Next.js",
  ],
  projects: [
    {
      id: "1",
      name: "E-Commerce Platform",
      link: "github.com/alex/shop",
      description:
        "A full-featured e-commerce platform built with Next.js, Stripe, and PostgreSQL.",
    },
  ],
  customSections: [
    {
      id: "1",
      title: "Achievements",
      items: [
        {
          id: "1",
          title: "Hackathon Winner",
          subtitle: "2023",
          description:
            "Won 1st place in the Global AI Hackathon for building an accessible AI assistant.",
        },
      ],
    },
  ],
};
