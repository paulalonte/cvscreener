import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
  // limits: { fileSize: 10 * 1024 }, // 10 KB
});

app.post(
  "/multi-analyze",
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("resume")(req, res, (err: any) => {
      if (err) {
        console.error("Multer error:", err);
        const isSizeError = err.code === "LIMIT_FILE_SIZE";
        const attemptedFile =
          req.file?.originalname || req.body?.filename || "Unknown file";

        return res.status(400).json({
          error: isSizeError
            ? `File "${attemptedFile}" is too large. Max size: 10 KB.`
            : `Upload failed for "${attemptedFile}".`,
        });
      }

      next();
    });
  },
  async (req: Request, res: Response): Promise<void> => {
    const jobDescription = (req.body as any).jobDescription;
    const file = req.file as Express.Multer.File | undefined;

    if (!file || !jobDescription) {
      res.status(400).json({ error: "Missing resume file or job description" });
      return;
    }

    try {
      const fileExt = path.extname(file.originalname).toLowerCase();
      let resumeText = "";

      if (fileExt === ".pdf") {
        const buffer = fs.readFileSync(path.resolve(file.path));
        const data = await pdfParse(buffer);
        resumeText = data.text;
      } else if (fileExt === ".docx") {
        const buffer = fs.readFileSync(path.resolve(file.path));
        const result = await mammoth.extractRawText({ buffer });
        resumeText = result.value;
      } else {
        res
          .status(400)
          .json({ error: "Unsupported file format. Use PDF or DOCX." });
        return;
      }

      if (!resumeText || resumeText.trim().length < 30) {
        res.status(400).json({ error: "Unable to extract text from resume." });
        return;
      }

      const jobKeywords = jobDescription
        .split(/[ ,\\n]+/)
        .map((word: string) => word.trim().toLowerCase())
        .filter(Boolean);

      const matchedSkills = jobKeywords.filter((skill: string) =>
        resumeText.toLowerCase().includes(skill)
      );

      const missingSkills = jobKeywords.filter(
        (skill: string) => !matchedSkills.includes(skill)
      );
      const matchScore = Math.round(
        (matchedSkills.length / jobKeywords.length) * 100
      );

      res.json({
        matchScore,
        matchedSkills,
        missingSkills,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze resume" });
    } finally {
      if (file) fs.unlinkSync(file.path);
    }
  }
);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
