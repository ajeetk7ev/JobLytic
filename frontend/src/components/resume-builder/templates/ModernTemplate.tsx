
import { type ResumeData } from '../types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export const ModernTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="w-full h-full bg-white text-black p-8 md:p-12 shadow-2xl overflow-y-auto" id="resume-preview">
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase mb-2">{data.personalInfo.fullName}</h1>
        <p className="text-xl font-medium text-gray-600 mb-4">{data.personalInfo.role}</p>
        
        <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={14} /> {data.personalInfo.email}
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={14} /> {data.personalInfo.phone}
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} /> {data.personalInfo.location}
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1.5">
              <Globe size={14} /> {data.personalInfo.linkedin}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-2 mb-3">About Me</h2>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {data.personalInfo.summary}
            </p>
          </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-2 mb-4">Experience</h2>
            <div className="space-y-6">
                {data.experience.map(exp => (
                    <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-gray-900">{exp.position}</h3>
                            <span className="text-xs font-bold text-gray-500">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-700 mb-2">{exp.company}, {exp.location}</div>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                            {exp.description}
                        </p>
                    </div>
                ))}
            </div>
          </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-2 mb-4">Education</h2>
            <div className="space-y-4">
                {data.education.map(edu => (
                    <div key={edu.id}>
                         <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-gray-900">{edu.school}</h3>
                            <span className="text-xs font-bold text-gray-500">{edu.startDate} – {edu.endDate}</span>
                        </div>
                        <div className="text-sm text-gray-700">{edu.degree} in {edu.field}</div>
                    </div>
                ))}
            </div>
          </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-2 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">
                        {skill}
                    </span>
                ))}
            </div>
          </section>
      )}

      {/* Custom Sections */}
      {data.customSections?.map((section) => (
          <section key={section.id} className="mt-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-2 mb-4">{section.title}</h2>
            <div className="space-y-6">
                {section.items.map(item => (
                    <div key={item.id}>
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                            {item.subtitle && <span className="text-xs font-bold text-gray-500">{item.subtitle}</span>}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
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
