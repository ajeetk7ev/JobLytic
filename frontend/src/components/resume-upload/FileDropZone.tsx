import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onFileSelect: (file: File) => void;
}

export default function FileDropZone({ onFileSelect }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    maxFiles: 1,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full"
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-4xl p-12 cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' : 'border-border hover:border-primary/50 hover:bg-secondary/30'}`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center text-center">
          <div className={`w-20 h-20 rounded-4xl flex items-center justify-center mb-6 transition-all duration-500
            ${isDragActive ? 'bg-primary text-primary-foreground rotate-12' : 'bg-primary/10 text-primary'}`}>
            <UploadCloud className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight">
            {isDragActive ? "Drop it like it's hot!" : "Upload your Masterpiece"}
          </h3>

          <p className="text-muted-foreground font-medium max-w-[240px]">
            Drag and drop your PDF resume or <span className="text-primary font-bold">browse</span> your files
          </p>
          
          <div className="mt-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> PDF Only</div>
            <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
            <div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Max 5MB</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
