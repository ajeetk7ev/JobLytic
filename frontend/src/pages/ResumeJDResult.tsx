import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ListChecks,
} from "lucide-react";

type MatchSectionScore = {
  label: string;
  score: number;
  max: number;
};

type SkillCategory = {
  name: string;
  resumeCount: number;
  jdCount: number;
  matchPercent: number;
};

type JDComparison = {
  requirement: string;
  status: "matched" | "missing" | "partial";
};

const overallMatch = 78;

const sectionScores: MatchSectionScore[] = [
  { label: "Format & ATS", score: 22, max: 30 },
  { label: "Keywords", score: 20, max: 30 },
  { label: "Skills", score: 18, max: 25 },
  { label: "Experience Fit", score: 18, max: 25 },
];

const matchedKeywords = [
  "React",
  "TypeScript",
  "REST APIs",
  "MongoDB",
  "Git",
  "Agile",
];

const missingKeywords = [
  "GraphQL",
  "CI/CD",
  "Microservices",
  "AWS",
  "System Design",
];

const skillCategories: SkillCategory[] = [
  { name: "Frontend", resumeCount: 5, jdCount: 7, matchPercent: 71 },
  { name: "Backend", resumeCount: 3, jdCount: 5, matchPercent: 60 },
  { name: "DevOps / Cloud", resumeCount: 1, jdCount: 4, matchPercent: 25 },
  { name: "Soft Skills", resumeCount: 4, jdCount: 5, matchPercent: 80 },
];

const aiSummary =
  "Your resume is a strong match for this role, especially on core frontend skills like React, TypeScript, and REST APIs. To further increase your match score, highlight experience with GraphQL, CI/CD pipelines, and cloud deployment (AWS). Adding 1–2 bullet points around ownership and system design will better align with the seniority expectations of this job.";

const improvementSuggestions = [
  "Add GraphQL and CI/CD under your Technical Skills section.",
  "Mention any production deployments using AWS / Vercel / Docker.",
  "Rewrite 2–3 bullet points to focus on measurable impact (e.g., performance, revenue, users).",
  "Add a short 'Summary' section tailored to this JD with role + years + key stack.",
];

const jdComparisons: JDComparison[] = [
  {
    requirement: "2+ years of experience with React and TypeScript.",
    status: "matched",
  },
  {
    requirement: "Hands-on experience with GraphQL APIs.",
    status: "missing",
  },
  {
    requirement: "Exposure to CI/CD and DevOps tooling.",
    status: "partial",
  },
  {
    requirement: "Experience with cloud platforms (AWS / GCP / Azure).",
    status: "missing",
  },
  {
    requirement: "Strong communication and collaboration skills.",
    status: "matched",
  },
];

// ---------------- Components ----------------

const ScoreRing = ({ score }: { score: number }) => {
  const strokeDasharray = 283; // circle circumference (approx)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100;

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r="45"
          stroke="#1f2937"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          stroke={score >= 75 ? "#22c55e" : score >= 50 ? "#eab308" : "#f97373"}
          strokeWidth="12"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="rotate-0">
        <p className="text-sm text-gray-400 mb-1">Overall Match</p>
        <p className="text-4xl font-bold text-white">{score}</p>
        <p className="text-sm text-gray-400 mt-1">out of 100</p>
      </div>
    </div>
  );
};

const SectionScoreBar = ({ section }: { section: MatchSectionScore }) => {
  const percent = Math.round((section.score / section.max) * 100);
  const barColor =
    percent >= 75 ? "bg-green-500" : percent >= 50 ? "bg-yellow-400" : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{section.label}</span>
        <span>
          {section.score}/{section.max}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const KeywordChip = ({
  keyword,
  type,
}: {
  keyword: string;
  type: "matched" | "missing";
}) => {
  const base =
    "px-3 py-1 rounded-full text-xs flex items-center gap-2 border";
  if (type === "matched") {
    return (
      <span className={`${base} border-green-500/40 bg-green-500/10 text-green-300`}>
        <CheckCircle2 size={14} /> {keyword}
      </span>
    );
  }
  return (
    <span className={`${base} border-red-500/40 bg-red-500/10 text-red-300`}>
      <XCircle size={14} /> {keyword}
    </span>
  );
};

const SkillCategoryRow = ({ cat }: { cat: SkillCategory }) => {
  const barColor =
    cat.matchPercent >= 75
      ? "bg-green-500"
      : cat.matchPercent >= 50
      ? "bg-yellow-400"
      : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{cat.name}</span>
        <span>{cat.matchPercent}% match</span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${cat.matchPercent}%` }}
        />
      </div>
      <p className="text-[11px] text-gray-500">
        Resume: {cat.resumeCount} · JD: {cat.jdCount}
      </p>
    </div>
  );
};

const JDComparisonRow = ({ row }: { row: JDComparison }) => {
  let icon;
  let color;
  if (row.status === "matched") {
    icon = <CheckCircle2 className="text-green-400 w-4 h-4" />;
    color = "text-green-300";
  } else if (row.status === "missing") {
    icon = <XCircle className="text-red-400 w-4 h-4" />;
    color = "text-red-300";
  } else {
    icon = <AlertTriangle className="text-yellow-400 w-4 h-4" />;
    color = "text-yellow-300";
  }

  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-800 last:border-0">
      {icon}
      <p className={`text-sm ${row.status === "missing" ? "text-gray-300" : "text-gray-200"}`}>
        {row.requirement}
      </p>
    </div>
  );
};

// ---------------- Page ----------------

export default function JDMatchResultPage() {
  return (
    <div className="ml-20 w-[calc(100%-5rem)] sm:ml-0 min-h-screen sm:w-full bg-gray-900 text-white p-6 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-2">Match Result</h1>
      <p className="text-sm text-gray-400 mb-8">
        Based on your resume and the job description, here’s your detailed fit analysis.
      </p>

      {/* Top: Overall Score + Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1.8fr] gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <ScoreRing score={overallMatch} />
          <div className="space-y-3 w-full md:w-auto">
            <p className="text-sm text-gray-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>
                This role is a <span className="font-semibold">good match</span> for your skills.
              </span>
            </p>
            <p className="text-xs text-gray-500">
              Improve your score by adding missing keywords and aligning your experience with the job responsibilities.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <ListChecks className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold">Section Breakdown</h2>
          </div>
          {sectionScores.map((s) => (
            <SectionScoreBar key={s.label} section={s} />
          ))}
        </div>
      </div>

      {/* Keywords & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Keywords */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-3">Keywords</h2>
          <p className="text-xs text-gray-500 mb-4">
            These are the important terms extracted from the job description compared to your resume.
          </p>

          <h3 className="text-xs font-semibold text-green-400 mb-2">
            Matched Keywords
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {matchedKeywords.map((k) => (
              <KeywordChip key={k} keyword={k} type="matched" />
            ))}
          </div>

          <h3 className="text-xs font-semibold text-red-400 mb-2">
            Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((k) => (
              <KeywordChip key={k} keyword={k} type="missing" />
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-3">Skills Match</h2>
          <p className="text-xs text-gray-500 mb-4">
            Comparison of skill categories between your resume and the job description.
          </p>

          <div className="space-y-3">
            {skillCategories.map((cat) => (
              <SkillCategoryRow key={cat.name} cat={cat} />
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary & Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* AI Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Summary
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">{aiSummary}</p>
        </div>

        {/* Improvements */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            Recommended Improvements
          </h2>
          <ul className="space-y-2 text-sm text-gray-300">
            {improvementSuggestions.map((s, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-[3px] text-blue-400">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* JD vs Resume Comparison */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-16">
        <h2 className="text-sm font-semibold mb-3">JD Requirements Coverage</h2>
        <p className="text-xs text-gray-500 mb-4">
          Line-by-line view of how well your resume addresses the job requirements.
        </p>

        <div className="divide-y divide-gray-800">
          {jdComparisons.map((row, idx) => (
            <JDComparisonRow key={idx} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
}
