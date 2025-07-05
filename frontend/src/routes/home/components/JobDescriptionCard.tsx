import { useState } from "react";
import { Paper, Typography, Box, TextareaAutosize } from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

interface JobDescriptionCardProps {
  onTextChange: (text: string) => void;
}

export default function JobDescriptionCard({
  onTextChange,
}: JobDescriptionCardProps) {
  const [jobDescription, setJobDescription] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJobDescription(text);
    onTextChange(text); // Pass value to parent
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
      <Box display="flex" alignItems="center" mb={2}>
        <WorkOutlineIcon sx={{ color: "#999", mr: 1 }} />
        <Typography variant="h6">Job Description</Typography>
      </Box>
      <TextareaAutosize
        aria-label="minimum height"
        minRows={14}
        onChange={handleChange}
        placeholder="Paste the job description here..."
        style={{
          width: "100%",
          borderRadius: 4,
          maxWidth: "100%",
          border: "1px solid #ddd",
          padding: 20,
          boxSizing: "border-box",
        }}
        value={jobDescription}
      />
    </Paper>
  );
}
