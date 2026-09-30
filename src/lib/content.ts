// Single source of truth for all site copy. Edit this file to update any
// text on the site.

export interface NavSection {
  id: string;
  label: string;
  /** Filename shown in the file-tree sidebar, e.g. "education.md" */
  fileName: string;
}

export interface Experience {
  role: string;
  org: string;
  dates: string;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Certification {
  name: string;
}

export interface Education {
  degree: string;
  school: string;
  minor: string;
  dates: string;
}

export interface Profile {
  name: string;
  handle: string;
  role: string;
  email: string;
  linkedin: string;
  linkedinUrl: string;
  phone: string;
  openToWork: boolean;
  openToRelocation: boolean;
}

export const profile: Profile = {
  name: "Rithvik Burri",
  handle: "rithvikburri",
  role: "AI / ML Engineer",
  email: "burririt@msu.edu",
  linkedin: "linkedin.com/in/rithvikburri",
  linkedinUrl: "https://linkedin.com/in/rithvikburri",
  phone: "847-899-6809",
  openToWork: true,
  openToRelocation: true,
};

export const education: Education = {
  degree: "B.S. Data Science",
  school: "Michigan State University",
  minor: "Business",
  dates: "Aug 2022 – May 2026",
};

export const experience: Experience[] = [
  {
    role: "ML Engineer",
    org: "Saudi Red Crescent Authority",
    dates: "Jan 2026 – May 2026",
    bullets: [
      "Built a two-layer anomaly detection system for real-time patient monitoring across pilgrimage sites including Mecca, reaching 87.6% precision and 92.0% recall across 4,353 patients",
      "Shipped an AI voice-agent workflow that autonomously assessed flagged patients and escalated to responders in under 400ms",
      "Drove adoption of a full migration to real-time cloud streaming infrastructure, cutting latency and operational cost",
    ],
  },
  {
    role: "Data Engineer",
    org: "TeliAI",
    dates: "Jan 2026 – May 2026",
    bullets: [
      "Engineered a pipeline that cleaned and validated 83K+ raw SMS messages into 67K+ analysis-ready conversation threads",
      "Delivered an analytics platform turning raw conversations into campaign insights in under 30 seconds",
    ],
  },
  {
    role: "AI Engineer",
    org: "BlackSync AI",
    dates: "May 2025 – Jan 2026",
    bullets: [
      "Cut voice-agent latency 50%+ to under 850ms by re-architecting the speech-to-text/text-to-speech pipeline",
      "Designed a retrieval-augmented generation system that lifted appointment conversion 17% and call duration 32%",
      "Automated CRM-integrated outbound pipelines running 500-call campaigns in under 30 minutes",
    ],
  },
];

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "SQL", "Java", "C++"],
  },
  {
    category: "ML / AI",
    items: ["PyTorch", "LangChain", "LangGraph", "HuggingFace"],
  },
  {
    category: "Data Engineering",
    items: ["Spark", "Airflow", "Kafka", "Databricks", "Snowflake"],
  },
  {
    category: "Cloud",
    items: ["AWS", "GCP", "Azure", "Oracle"],
  },
  {
    category: "Visualization",
    items: ["Power BI", "Tableau"],
  },
];

export const certifications: Certification[] = [
  { name: "Databricks Certified Data Engineer Associate" },
  { name: "Google Professional Machine Learning Engineer" },
  { name: "AWS Certified Machine Learning Engineer Associate" },
];

export const navSections: NavSection[] = [
  { id: "education", label: "Education", fileName: "education.md" },
  { id: "experience", label: "Experience", fileName: "experience.log" },
  { id: "skills", label: "Skills", fileName: "skills.json" },
  { id: "certifications", label: "Certifications", fileName: "certs.yaml" },
  { id: "contact", label: "Contact", fileName: "contact.sh" },
];

export const bootLines: string[] = [
  "booting rithvik-os v2.6...",
  "loading resume modules...",
  "mounting /experience /skills /projects",
  `authenticating as ${profile.handle}...`,
  "status: open_to_work",
];
