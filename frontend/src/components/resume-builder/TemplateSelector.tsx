
import { Layout } from "lucide-react";

const templates = [
    { id: 'modern', name: 'Modern', color: 'bg-white' },
    { id: 'classic', name: 'Classic', color: 'bg-orange-50' },
    { id: 'minimal', name: 'Minimal', color: 'bg-gray-50' }
];

interface Props {
    selectedId: string;
    onSelect: (id: string) => void;
}

export const TemplateSelector = ({ selectedId, onSelect }: Props) => {
    return (
        <div className="flex gap-2">
            {templates.map(t => (
                <button
                    key={t.id}
                    onClick={() => onSelect(t.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                        selectedId === t.id 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-secondary/30 text-muted-foreground border-transparent hover:bg-secondary'
                    }`}
                >
                    <Layout size={14} /> {t.name}
                </button>
            ))}
        </div>
    );
};
