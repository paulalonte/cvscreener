import { Box, Container, Typography } from "@mui/material";
import CVScreen from "./components/CVScreen";

export default function App() {
  return (
    <Container>
      <Box sx={{ padding: "4em 0" }}>
        <Typography variant="h6" gutterBottom>
          Upload your CV and paste a job description to instantly check skill
          compatibility
        </Typography>
      </Box>
      <CVScreen />
    </Container>
  );
}
