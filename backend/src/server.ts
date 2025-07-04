// === BACKEND: src/server.ts ===
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import multer from "multer";
import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const jobSkills = [
  "JavaScript",
  "Node.js",
  "React",
  "TypeScript",
  "Cypress",
  "AWS",
];

app.post(
  "/multi-analyze",
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("resume")(req, res, (err: any) => {
      if (err) {
        console.error("❌ Multer error:", err);
        return res.status(400).json({ error: "File upload failed" });
      }
      next();
    });
  },
  async (req: Request, res: Response): Promise<void> => {
    console.log("✅ POST /multi-analyze hit");

    const jobDescription = (req.body as any).jobDescription;
    const file = req.file as Express.Multer.File | undefined;

    console.log("📦 File:", file);
    console.log("📝 Job Description:", jobDescription);

    if (!file || !jobDescription) {
      console.log("❌ Missing file or job description");
      res.status(400).json({ error: "Missing resume file or job description" });
      return;
    }

    try {
      const buffer = fs.readFileSync(path.resolve(file.path));
      const data = await pdfParse(buffer);
      const resumeText = data.text;

      console.log("📄 Extracted resume text:", resumeText);

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
      console.error("❌ Error analyzing resume:", error);
      res.status(500).json({ error: "Failed to analyze resume" });
    } finally {
      if (file) fs.unlinkSync(file.path);
    }
  }
);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
