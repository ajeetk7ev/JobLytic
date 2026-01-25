
import { type ResumeData } from '../types';

export const MinimalTemplate = ({ data }: { data: ResumeData }) => {
  return (
    <div className="w-full h-full bg-white text-gray-800 p-12 shadow-2xl overflow-y-auto font-sans" id="resume-preview">
      <div className="flex gap-8">
        {/* Sidebar Left */}
        <div className="w-1/3 border-r border-gray-200 pr-6">
            <h1 className="text-2xl font-black text-primary uppercase tracking-tight mb-2 leading-none">{data.personalInfo.fullName.split(' ')[0]}<br/>{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</h1>
            <p className="text-sm font-bold text-gray-500 mb-8 uppercase tracking-wider">{data.personalInfo.role}</p>
            
            <div className="space-y-6 text-xs font-medium text-gray-600">
                <section>
                    <h3 className="font-bold text-black uppercase mb-2">Contact</h3>
                    <div className="space-y-1">
                        {data.personalInfo.email && <div className="break-all">{data.personalInfo.email}</div>}
                        {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
                        {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
                        {data.personalInfo.linkedin && <div className="break-all">{data.personalInfo.linkedin}</div>}
                    </div>
                </section>

                {data.education.length > 0 && (
                    <section>
                        <h3 className="font-bold text-black uppercase mb-2">Education</h3>
                        <div className="space-y-3">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <div className="font-bold text-gray-800">{edu.school}</div>
                                    <div className="mb-0.5">{edu.degree}</div>
                                    <div className="text-gray-400">{edu.startDate} - {edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                 {data.skills.length > 0 && (
                    <section>
                        <h3 className="font-bold text-black uppercase mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-1">
                            {data.skills.map(s => (
                                <span key={s} className="block w-full border-b border-gray-100 py-1">{s}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>

        {/* Main Content Right */}
        <div className="w-2/3">
             {data.personalInfo.summary && (
                <section className="mb-8">
                    <p className="text-sm leading-relaxed text-gray-600 border-l-2 border-primary pl-4 italic">
                        {data.personalInfo.summary}
                    </p>
                </section>
            )}

            {data.experience.length > 0 && (
                <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                        Experience 
                        <span className="h-px flex-1 bg-gray-100"></span>
                    </h3>
                    <div className="space-y-8">
                         {data.experience.map(exp => (
                            <div key={exp.id} className="relative pl-6 border-l border-gray-200">
                                <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary"></span>
                                <div className="flex justify-between items-baseline mb-2">
                                    <h4 className="font-bold text-gray-900">{exp.position}</h4>
                                    <span className="text-xs font-bold text-gray-400">{exp.startDate} – {exp.endDate}</span>
                                </div>
                                <div className="text-xs font-bold text-primary mb-3 uppercase tracking-wide">{exp.company}, {exp.location}</div>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Custom Sections */}
            {data.customSections?.map((section) => (
                <section key={section.id} className="mt-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                        {section.title}
                        <span className="h-px flex-1 bg-gray-100"></span>
                    </h3>
                    <div className="space-y-8">
                         {section.items.map(item => (
                            <div key={item.id} className="relative pl-6 border-l border-gray-200">
                                <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary"></span>
                                <div className="flex justify-between items-baseline mb-2">
                                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                                    {item.subtitle && <span className="text-xs font-bold text-gray-400">{item.subtitle}</span>}
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
      </div>
    </div>
  );
};
