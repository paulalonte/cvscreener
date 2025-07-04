import { useState, ChangeEvent } from 'react';
import { Button, Typography, LinearProgress, List, ListItem, Paper, Box } from '@mui/material';

interface Result {
  extractedSkills: string[];
  matchScore: number;
  aiMatchSummary: string;
}

export default function ResumeScreening() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/screen`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('Error uploading resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Upload Resume
        <input hidden type="file" onChange={handleFileChange} />
      </Button>
      {file && (
        <Typography variant="body2" gutterBottom>
          Selected file: {file.name}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!file || loading}
        sx={{ mt: 1 }}
      >
        {loading ? 'Processing...' : 'Screen Resume'}
      </Button>

      {loading && <LinearProgress sx={{ mt: 2 }} />}

      {result && (
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6">Match Score: {result.matchScore}%</Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Extracted Skills:
          </Typography>
          <List>
            {result.extractedSkills.map((skill) => (
              <ListItem key={skill} disablePadding>
                • {skill}
              </ListItem>
            ))}
          </List>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            AI Summary:
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
            {result.aiMatchSummary}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
