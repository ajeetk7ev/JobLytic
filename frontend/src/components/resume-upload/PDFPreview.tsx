import { Document, Page } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();


interface Props {
  file: File | string; // Accept local file or URL
}

export default function PDFViewer({ file }: Props) {
  const [numPages, setNumPages] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);



  if (error) {
    return (
      <p className="text-center text-red-400">
        {error}
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={() => setError("Failed to load PDF file.")}
        loading={<p className="text-center mt-4">Loading PDF...</p>}
        scale={1}
      >
        {Array.from(new Array(numPages), (_, i) => (
          <div key={i} className="my-4 shadow-md rounded-lg overflow-hidden">
            <Page
              pageNumber={i + 1}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              width={500} // change as needed
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
