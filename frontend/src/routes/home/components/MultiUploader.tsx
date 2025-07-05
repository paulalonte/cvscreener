import { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  LinearProgress,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface MatchResult {
  fileName: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  passed: boolean;
}

interface MultiCVUploaderProps {
  jobDescription: string;
}

export default function MultiCVUploader({
  jobDescription,
}: MultiCVUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || files.length === 0) {
      alert("Please upload CVs and provide a job description.");
      return;
    }

    setLoading(true);
    setResults([]);

    const errors: Record<string, string> = {};
    const resultsList: MatchResult[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);
      formData.append("filename", file.name); // for server fallback

      try {
        const res = await fetch("http://localhost:5001/multi-analyze", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          errors[file.name] =
            errorData.error || `Upload failed for ${file.name}`;
        } else {
          const data = await res.json();
          resultsList.push({
            fileName: file.name,
            matchScore: data.matchScore,
            matchedSkills: data.matchedSkills,
            missingSkills: data.missingSkills,
            passed: data.matchScore >= 50,
          });
        }
      } catch (err) {
        errors[file.name] = `Error analyzing ${file.name}`;
      }
    }

    setUploadErrors(errors);
    setResults(resultsList);
    setLoading(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 4,
        p: 3,
        mx: "auto",
        mt: 4,
        minHeight: 400,
      }}
    >
      <Stack
        display="flex"
        direction="column"
        justifyContent="space-between"
        sx={{ minHeight: 400 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" gap={1}>
            <InsertDriveFileIcon sx={{ color: "#999" }} />
            <Typography variant="h6">Upload Multiple CVs</Typography>
          </Stack>
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #ccc",
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: isDragActive ? "#f0f8ff" : "inherit",
              marginTop: 2,
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon
              sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
            />
            <Typography variant="body2">
              Drop CVs here or click to select multiple files
            </Typography>
          </Box>

          <List>
            {files.map((file, idx) => (
              <ListItem key={idx}>
                <Typography variant="body1" gutterBottom>
                  📄 {file.name}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
        {Object.entries(uploadErrors).map(([filename, message]) => (
          <Alert key={filename} severity="error" sx={{ mt: 2 }}>
            <strong>{filename}:</strong> {message}
          </Alert>
        ))}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAnalyze}
          disabled={loading}
          sx={{
            backgroundImage:
              "linear-gradient(to right, #FF512F 0%, #F09819 51%, #FF512F 100%)",
            backgroundSize: "200% auto",
            color: "white",
            boxShadow: "0 0 20px #eee",
            borderRadius: "10px",
            padding: "15px 45px",
            textTransform: "uppercase",
            transition: "0.5s",
            display: "block",
            margin: "10px auto",
            "&:hover": {
              backgroundPosition: "right center",
              color: "#fff",
              textDecoration: "none",
            },
          }}
        >
          Analyze All
        </Button>
      </Stack>

      {loading && <LinearProgress sx={{ mt: 2 }} />}

      {results.length > 0 && (
        <>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <Box mt={4}>
            <Typography variant="h6">Analysis Results</Typography>
            {results.map((result) => (
              <Alert
                key={result.fileName}
                severity={result.passed ? "success" : "warning"}
                sx={{ mt: 2 }}
              >
                <strong>{result.fileName}</strong> — Match Score:{" "}
                {result.matchScore}%<br />
                {result.passed ? "✅ Passed" : "❌ Not a good fit"}
                <br />
                <em>Missing:</em> {result.missingSkills.join(", ") || "None"}
              </Alert>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
}
