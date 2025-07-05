import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Stack } from "@mui/material";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const settings = ["Profile", "Pricing", "Account", "Logout"];

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar elevation={0} position="static" sx={{ background: "none" }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            color: "black",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Stack alignItems="center" display="flex" direction="row" gap={1}>
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
              <Typography
                variant="h1"
                sx={{ fontSize: "20px", fontWeight: "bold", color: "#636363" }}
              >
                CVScreener
              </Typography>
            </Stack>
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Paul H" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
