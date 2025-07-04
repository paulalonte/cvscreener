import { useCallback, useState } from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface CVUploaderProps {
  onTextExtracted: (text: string) => void;
}

export default function CVUploader({ onTextExtracted }: CVUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCvText(text);
    onTextExtracted(text); // send to parent
  };

  const handleSubmit = () => {
    if (file) {
      console.log("Uploading file:", file);
      alert("File uploads not yet implemented.");
      // Future: parse file, extract text, call onTextExtracted(text)
    } else if (cvText.trim()) {
      console.log("Submitting pasted text:", cvText);
      onTextExtracted(cvText);
    } else {
      alert("Please upload a CV or paste text.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Upload CV
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #ccc",
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          mb: 2,
          bgcolor: isDragActive ? "#f0f8ff" : "inherit",
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon
          sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
        />
        <Typography variant="body2">
          {file
            ? `Selected: ${file.name}`
            : "Drop your CV here or click to browse"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supports PDF, DOC, DOCX files
        </Typography>
      </Box>

      <TextField
        label="Or paste your CV text here..."
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        value={cvText}
        onChange={handleTextChange}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Submit CV
      </Button>
    </Paper>
  );
}
