
import { type ResumeData } from "./types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: ResumeData;
  updateData: (data: ResumeData) => void;
}

export const EditorSection = ({ data, updateData }: Props) => {
  const handleChange = (section: keyof ResumeData, value: any) => {
    updateData({ ...data, [section]: value });
  };

  const handleInfoChange = (field: string, value: string) => {
    handleChange("personalInfo", { ...data.personalInfo, [field]: value });
  };

  // Generic helper for arrays (exp, edu, projects)
  const updateItem = (section: "experience" | "education" | "projects",  id: string, field: string, value: any) => {
      const newItems = (data[section] as any[]).map((item: any) => 
          item.id === id ? { ...item, [field]: value } : item
      );
      handleChange(section, newItems);
  };

  const deleteItem = (section: "experience" | "education" | "projects", id: string) => {
    const newItems = (data[section] as any[]).filter((item: any) => item.id !== id);
    handleChange(section, newItems);
  };

  const addItem = (section: "experience" | "education" | "projects") => {
    const newId = Math.random().toString(36).substr(2, 9);
    let newItem: any = { id: newId };
    
    if (section === "experience") {
        newItem = { ...newItem, company: "New Company", position: "Role", startDate: "", endDate: "", current: false, description: "" };
    } else if (section === "education") {
        newItem = { ...newItem, school: "University", degree: "Degree", startDate: "", endDate: "", description: "" };
    } else if (section === "projects") {
        newItem = { ...newItem, name: "Project Name", link: "", description: "" };
    }
    
    handleChange(section, [...data[section], newItem]);
  };
  
  const handleSkillsChange = (val: string) => {
      const skills = val.split(",").map(s => s.trim());
      handleChange("skills", skills);
  };

  // Custom Sections Handlers
  const addCustomSection = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newSection = { id: newId, title: "Custom Section", items: [] };
    handleChange("customSections", [...(data.customSections || []), newSection]);
  };

  const deleteCustomSection = (id: string) => {
    const newSections = (data.customSections || []).filter(s => s.id !== id);
    handleChange("customSections", newSections);
  };

  const updateCustomSection = (id: string, field: string, value: any) => {
    const newSections = (data.customSections || []).map(s => 
        s.id === id ? { ...s, [field]: value } : s
    );
    handleChange("customSections", newSections);
  };

  const addCustomItem = (sectionId: string) => {
      const newId = Math.random().toString(36).substr(2, 9);
      const newItem = { id: newId, title: "", subtitle: "", description: "" };
      
      const newSections = (data.customSections || []).map(s => {
          if (s.id === sectionId) {
              return { ...s, items: [...s.items, newItem] };
          }
          return s;
      });
      handleChange("customSections", newSections);
  };

  const deleteCustomItem = (sectionId: string, itemId: string) => {
      const newSections = (data.customSections || []).map(s => {
          if (s.id === sectionId) {
              return { ...s, items: s.items.filter(i => i.id !== itemId) };
          }
          return s;
      });
      handleChange("customSections", newSections);
  };

  const updateCustomItem = (sectionId: string, itemId: string, field: string, value: any) => {
      const newSections = (data.customSections || []).map(s => {
          if (s.id === sectionId) {
              const newItems = s.items.map(i => 
                  i.id === itemId ? { ...i, [field]: value } : i
              );
              return { ...s, items: newItems };
          }
          return s;
      });
      handleChange("customSections", newSections);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Personal Info */}
      <section className="space-y-4">
        <h3 className="text-lg font-black uppercase tracking-wider text-primary">Personal Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={data.personalInfo.fullName} onChange={v => handleInfoChange("fullName", v)} />
          <Input label="Job Title" value={data.personalInfo.role} onChange={v => handleInfoChange("role", v)} />
          <Input label="Email" value={data.personalInfo.email} onChange={v => handleInfoChange("email", v)} />
          <Input label="Phone" value={data.personalInfo.phone} onChange={v => handleInfoChange("phone", v)} />
          <Input label="Location" value={data.personalInfo.location} onChange={v => handleInfoChange("location", v)} />
          <Input label="LinkedIn / Website" value={data.personalInfo.linkedin} onChange={v => handleInfoChange("linkedin", v)} />
        </div>
        <TextArea label="Professional Summary" value={data.personalInfo.summary} onChange={v => handleInfoChange("summary", v)} />
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-black uppercase tracking-wider text-primary">Experience</h3>
            <button onClick={() => addItem("experience")} className="text-xs bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                <Plus size={14} /> Add
            </button>
        </div>
        {data.experience.map((exp) => (
            <div key={exp.id} className="p-4 bg-secondary/10 border border-white/5 rounded-2xl space-y-3 relative group">
                <button 
                    onClick={() => deleteItem("experience", exp.id)}
                    className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <Input label="Company" value={exp.company} onChange={v => updateItem("experience", exp.id, "company", v)} />
                    <Input label="Position" value={exp.position} onChange={v => updateItem("experience", exp.id, "position", v)} />
                    <Input label="Start Date" value={exp.startDate} placeholder="YYYY-MM" onChange={v => updateItem("experience", exp.id, "startDate", v)} />
                    <Input label="End Date" value={exp.endDate} placeholder="YYYY-MM or Present" onChange={v => updateItem("experience", exp.id, "endDate", v)} />
                </div>
                <TextArea label="Description (Bulleted)" value={exp.description} onChange={v => updateItem("experience", exp.id, "description", v)} />
            </div>
        ))}
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-black uppercase tracking-wider text-primary">Education</h3>
            <button onClick={() => addItem("education")} className="text-xs bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                <Plus size={14} /> Add
            </button>
        </div>
        {data.education.map((edu) => (
            <div key={edu.id} className="p-4 bg-secondary/10 border border-white/5 rounded-2xl space-y-3 relative group">
                 <button 
                    onClick={() => deleteItem("education", edu.id)}
                    className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <Input label="School" value={edu.school} onChange={v => updateItem("education", edu.id, "school", v)} />
                    <Input label="Degree" value={edu.degree} onChange={v => updateItem("education", edu.id, "degree", v)} />
                    <Input label="Start Date" value={edu.startDate} placeholder="YYYY-MM" onChange={v => updateItem("education", edu.id, "startDate", v)} />
                    <Input label="End Date" value={edu.endDate} placeholder="YYYY-MM" onChange={v => updateItem("education", edu.id, "endDate", v)} />
                </div>
            </div>
        ))}
      </section>
      
      {/* Skills */}
      <section className="space-y-4">
        <h3 className="text-lg font-black uppercase tracking-wider text-primary">Skills</h3>
        <TextArea 
            label="Skills (comma separated)" 
            value={data.skills.join(", ")} 
            onChange={handleSkillsChange} 
            placeholder="React, Node.js, Design..."
        />
      </section>

      {/* Custom Sections */}
      {data.customSections?.map((section) => (
         <section key={section.id} className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center bg-secondary/20 p-2 rounded-xl">
                 <input 
                    className="bg-transparent border-none text-lg font-black uppercase tracking-wider text-primary focus:outline-none w-full"
                    value={section.title}
                    onChange={(e) => updateCustomSection(section.id, "title", e.target.value)}
                 />
                 <div className="flex gap-2">
                    <button onClick={() => addCustomItem(section.id)} className="text-xs bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                        <Plus size={14} /> Add Item
                    </button>
                    <button onClick={() => deleteCustomSection(section.id)} className="text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                        <Trash2 size={14} />
                    </button>
                 </div>
            </div>
            
            {section.items.map((item) => (
                <div key={item.id} className="p-4 bg-secondary/10 border border-white/5 rounded-2xl space-y-3 relative group">
                    <button 
                        onClick={() => deleteCustomItem(section.id, item.id)}
                        className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Title" value={item.title} onChange={v => updateCustomItem(section.id, item.id, "title", v)} placeholder="Project Name / Award..." />
                        <Input label="Subtitle" value={item.subtitle || ""} onChange={v => updateCustomItem(section.id, item.id, "subtitle", v)} placeholder="Role / Year..." />
                    </div>
                    <TextArea label="Description" value={item.description} onChange={v => updateCustomItem(section.id, item.id, "description", v)} />
                </div>
            ))}
         </section>
      ))}

      <button 
        onClick={addCustomSection}
        className="w-full py-4 border-2 border-dashed border-white/10 hover:border-primary/50 text-muted-foreground hover:text-primary rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
      >
        <Plus size={18} /> Add Custom Section (Projects, Awards...)
      </button>

    </div>
  );
};

const Input = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase">{label}</label>
        <input 
            className="w-full bg-secondary/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </div>
);

const TextArea = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase">{label}</label>
        <textarea 
            rows={4}
            className="w-full bg-secondary/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 custom-scrollbar resize-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </div>
);
