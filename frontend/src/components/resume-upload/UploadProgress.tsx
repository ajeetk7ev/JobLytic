import { motion } from "framer-motion";

export default function UploadProgress() {
  return (
    <div className="flex flex-col items-center mt-6">
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      />

      <p className="mt-3 font-medium text-gray-700">Extracting Resume...</p>
      <p className="text-sm text-gray-500">Please wait, this will take 3–5 seconds.</p>
    </div>
  );
}
