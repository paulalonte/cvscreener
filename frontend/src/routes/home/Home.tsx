import { Box, Container, Typography } from "@mui/material";
import CVScreen from "./components/CVScreen";

export default function App() {
  return (
    <Container>
      <Box sx={{ paddingTop: "4em", marginBottom: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          textAlign="center"
          fontWeight={100}
        >
          Upload your CV and paste a job description to instantly check skill
          compatibility
        </Typography>
      </Box>
      <CVScreen />
    </Container>
  );
}
