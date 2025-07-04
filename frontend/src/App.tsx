import { Box, Container, Stack, Typography } from "@mui/material";
import CVScreen from "./components/CVScreen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export default function App() {
  return (
    <Container>
      <Box sx={{ padding: "4em 0" }}>
        <Stack display="flex" direction="row" gap={1}>
          <InsertDriveFileIcon
            sx={{
              backgroundImage:
                "linear-gradient(to bottom, #FF512F 0%, #F09819 51%, #FF512F 100%)",
              color: "white",
              boxShadow: "0 0 20px #eee",
              borderRadius: "10px",
              padding: "10px 15px",
              textTransform: "uppercase",
            }}
          />{" "}
          <Typography variant="h4" gutterBottom>
            CVScreener
          </Typography>
        </Stack>
        <Typography variant="body2" gutterBottom>
          Upload your CV and paste a job description to instantly check skill
          compatibility
        </Typography>
      </Box>
      <CVScreen />
    </Container>
  );
}
