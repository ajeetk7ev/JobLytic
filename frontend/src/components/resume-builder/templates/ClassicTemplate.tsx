import { type ResumeData } from '../types';

export const ClassicTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="w-full h-full bg-white text-black p-10 font-serif shadow-2xl overflow-y-auto" id="resume-preview">
      {/* Header Centered */}
      <header className="text-center border-b border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{data.personalInfo.fullName}</h1>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
        </div>
      </header>

      {/* Experience */}
      {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Professional Experience</h2>
            <div className="space-y-4">
                {data.experience.map(exp => (
                    <div key={exp.id}>
                        <div className="flex justify-between font-bold">
                            <span>{exp.company}, {exp.location}</span>
                            <span>{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <div className="italic mb-1">{exp.position}</div>
                        <p className="text-sm leading-relaxed whitespace-pre-line text-justify">
                            {exp.description}
                        </p>
                    </div>
                ))}
            </div>
          </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Education</h2>
            <div className="space-y-2">
                {data.education.map(edu => (
                    <div key={edu.id} className="flex justify-between">
                         <div>
                            <span className="font-bold">{edu.school}</span>, {edu.location}
                            <div className="italic">{edu.degree} in {edu.field}</div>
                        </div>
                        <span className="font-bold">{edu.startDate} – {edu.endDate}</span>
                    </div>
                ))}
            </div>
          </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Skills</h2>
            <p className="text-sm leading-relaxed">
                {data.skills.join(", ")}
            </p>
          </section>
      )}

      {/* Custom Sections */}
      {data.customSections?.map((section) => (
          <section key={section.id} className="mt-6">
            <h2 className="text-lg font-bold uppercase border-b border-black mb-3">{section.title}</h2>
            <div className="space-y-4">
                {section.items.map(item => (
                    <div key={item.id}>
                        <div className="flex justify-between font-bold">
                            <span>{item.title}</span>
                            {item.subtitle && <span>{item.subtitle}</span>}
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-line text-justify mt-1">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
          </section>
      ))}
    </div>
  );
};
