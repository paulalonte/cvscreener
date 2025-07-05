import Grid from "@mui/material/Grid";
import { useState } from "react";

import JobDescriptionCard from "./JobDescriptionCard";
import MultiCVUploader from "./MultiUploader";

export default function BasicGrid() {
  const [jobDescription, setJobDescription] = useState("");
  return (
    <Grid container spacing={4} paddingBottom={10}>
      <Grid size={{ sm: 12, md: 6 }}>
        <JobDescriptionCard onTextChange={setJobDescription} />
      </Grid>
      <Grid border={0} size={{ sm: 12, md: 6 }}>
        <MultiCVUploader jobDescription={jobDescription} />
      </Grid>
    </Grid>
  );
}
