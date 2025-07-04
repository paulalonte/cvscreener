import { useState } from "react";
import { Paper, Typography, TextField, Box } from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

interface JobDescriptionCardProps {
  onTextChange: (text: string) => void;
}

export default function JobDescriptionCard({
  onTextChange,
}: JobDescriptionCardProps) {
  const [jobDescription, setJobDescription] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <WorkOutlineIcon color="success" sx={{ mr: 1 }} />
        <Typography variant="h6">Job Description</Typography>
      </Box>

      <TextField
        label="Paste the job description here..."
        multiline
        rows={12}
        fullWidth
        variant="outlined"
        value={jobDescription}
        onChange={handleChange}
      />
    </Paper>
  );
}
