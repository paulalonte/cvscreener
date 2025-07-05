import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Header from "./header/Header";
import Home from "./routes/home/Home";
import Login from "./routes/login/Login";

export default function App() {
  return (
    <Container>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </Container>
  );
}
