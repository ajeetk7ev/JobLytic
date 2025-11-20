import path from "path";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import os from "os";

export const extractResumePdfText = async (uploadedFile: File): Promise<string> => {
  try {
    // Generate temp file path
    const fileName = `${uuidv4()}.pdf`;
    const tempPath = path.join(os.tmpdir(), fileName);

    // Convert to buffer and save
    const buffer = Buffer.from(await uploadedFile.arrayBuffer());
    await fs.writeFile(tempPath, buffer);

    // Parse with pdf2json
    const extractedText = await parsePdfText(tempPath);

    // Delete temp file
    await fs.unlink(tempPath);

    return extractedText;
  } catch (error) {
    console.error("Resume PDF Extraction failed:", error);
    throw new Error("Failed to extract PDF text");
  }
};


function parsePdfText(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error("[PDF_PARSE_ERROR]", errData.parserError);
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const text = (pdfParser as any).getRawTextContent();
      resolve(text);
    });

    pdfParser.loadPDF(filePath);
  });
}
