import * as React from "react";
import Navbar from "@/components/Navbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { useRouter } from "next/router";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import PersonIcon from "@mui/icons-material/Person";

const drawerWidth = 240;

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const routes = [
    {
      name: "Leaderborad",
      link: "/leaderboard",
      icon: <LeaderboardIcon />,
    },
    {
      name: "User",
      link: "/user",
      icon: <PersonIcon />,
      subItems: [
        {
          name: "Boards",
          link: "/",
          icon: <DashboardIcon />,
        },
        {
          name: "Sets",
          link: "/user/sets",
          icon: <DashboardCustomizeIcon />,
        },
        {
          name: "Chat",
          link: "/chat",
          icon: <MailIcon />,
        },
      ],
    },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ p: "0px !important" }}>
        <Navbar />
      </Toolbar>
      <Divider />
      <List>
        {routes.map((route, index) => (
          <div key={index}>
            <ListItem
              key={index + 123544}
              disablePadding
              onClick={() => router.push(route.link)}
              className={router.asPath === route.link ? "bg-gray-100" : ""}
            >
              <ListItemButton>
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButton>
            </ListItem>
            {route.subItems?.map((subRoute, i) => (
              <ListItem
                key={i}
                disablePadding
                onClick={() => router.push(route.link)}
                className={`pl-5 ${
                  router.asPath === subRoute.link ? "bg-gray-100" : ""
                }`}
              >
                <ListItemButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(subRoute.link);
                  }}
                >
                  <ListItemIcon>{subRoute.icon}</ListItemIcon>
                  <ListItemText primary={subRoute.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </div>
        ))}
      </List>
    </div>
  );

  const container =
    typeof window !== "undefined" ? () => window.document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" noWrap component="div">
            Firebase Chat App
          </Typography> */}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
