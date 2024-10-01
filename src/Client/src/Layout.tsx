import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  styled,
  Container,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  useTheme,
} from "@mui/material";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, Link } from "react-router-dom";
import Home from "@mui/icons-material/Home";
import TableView from "@mui/icons-material/TableView";
import Drinks from "@mui/icons-material/LocalBar";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import { Login as LoginLogoutArea } from "./LoginLogoutArea";
import { AuthGuard } from "./auth/AuthGuard";
import { LanguageSelector } from "./LanguageSelector";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const drawerOpenLocalstorageKey = "Layout_DrawerOpen";

export const Layout = () => {
  let drawerOpenLocalstorageValue = false;
  try {
    drawerOpenLocalstorageValue = JSON.parse(
      localStorage.getItem(drawerOpenLocalstorageKey) ?? "false"
    ) as boolean;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
  }
  const [open, setOpen] = useState(drawerOpenLocalstorageValue);
  const [drawerWidth, setDrawerWidth] = useState(0);
  const toggleDrawer = () => {
    setOpen(!open);
    localStorage.setItem(drawerOpenLocalstorageKey, String(!open));
  };
  const drawerWidthRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    // storing the drawer width in state instead of using the ref directly
    // allows us to load the page with an open drawer, since the width will
    // be set through the effect after the first render
    setDrawerWidth(drawerWidthRef.current?.clientWidth ?? 0);
  }, []);

  const theme = useTheme();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar
          sx={{
            marginLeft: open ? `${drawerWidth}px` : "0px",
            transition: `${theme.transitions.create("margin", {
              easing: theme.transitions.easing.easeOut,
            })}`,
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: 2,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            isolutions React Template
          </Typography>
          <LanguageSelector />
          <LoginLogoutArea />
        </Toolbar>
      </AppBar>
      <Offset />
      <Drawer
        variant="persistent"
        open={open}
        PaperProps={{ ref: drawerWidthRef, sx: { minWidth: "300px" } }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/test">
              <ListItemText>Test</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/drinks">
              <ListItemIcon>
                <Drinks />
              </ListItemIcon>
              <ListItemText>Drinks</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/scrollTableDemo">
              <ListItemIcon>
                <TableView />
              </ListItemIcon>
              <ListItemText>Scroll Table Demo</ListItemText>
            </ListItemButton>
          </ListItem>
          <AuthGuard requiredRole="Admin">
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin">
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText>Admin</ListItemText>
              </ListItemButton>
            </ListItem>
          </AuthGuard>
        </List>
      </Drawer>
      <Box
        sx={{
          marginLeft: open ? `${drawerWidth}px` : "0px",
          transition: `${theme.transitions.create("margin")}`,
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Box p={2}>
            <Outlet />
          </Box>
        </Container>
      </Box>
    </>
  );
};
