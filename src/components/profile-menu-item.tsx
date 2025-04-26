import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import CloudCircleIcon from "@mui/icons-material/CloudCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import {
  DashboardLayout,
  ThemeSwitcher,
  type SidebarFooterProps,
} from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import ApiKeys from "./api-keys";
import { ExitToApp } from "@mui/icons-material";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";

import { CLEAR as clearUser } from "@/lib/reducers/user";
import { CLEAR as clearProfile } from "@/lib/reducers/profile";
import { CLEAR as clearEditor } from "@/lib/reducers/editor";

import CallIcon from "@mui/icons-material/Call";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import Security from "@mui/icons-material/Security";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ToggleOnIcon from "@mui/icons-material/DownloadDone";
import ToggleOffIcon from "@mui/icons-material/RemoveDone";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function PageContent({ pathname, id }: { pathname: string; id: string }) {
  let content;
  switch (pathname) {
    case "/api-keys":
      content = <ApiKeys id={id} />;
      break;
    default:
      // content = <ApiKeys />;
      break;
  }
  return (
    <Box
      sx={{
        py: 4,
        px: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {content}
    </Box>
  );
}
function closer(handleClose) {
  return (
    <Button onClick={() => handleClose()}>
      <CloseIcon />
    </Button>
  );
}

function ToolbarActionsSearch() {
  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              display: { xs: "inline", md: "none" },
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: "none", md: "inline-block" }, mr: 1 }}
      />
      <ThemeSwitcher />
    </Stack>
  );
}

function SidebarFooter({ mini }: SidebarFooterProps) {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: "nowrap", overflow: "hidden" }}
    >
      {mini ? "© MUI" : `© ${new Date().getFullYear()} Made with love by MUI`}
    </Typography>
  );
}

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <CloudCircleIcon fontSize="large" color="primary" />
      <Typography variant="h6">Tree Node</Typography>
      {/* <Chip size="small" label="ADMIN" color="info" /> */}
      <Tooltip title="Connected to production">
        <CheckCircleIcon color="success" fontSize="small" />
      </Tooltip>
    </Stack>
  );
}

interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
  handleClose?: () => void;
  id: string;
}

export default function DashboardLayoutSlots(props: DemoProps) {
  const [popoverAnchorEl, setPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const isPopoverOpen = Boolean(popoverAnchorEl);
  const popoverId = isPopoverOpen ? "simple-popover" : undefined;

  const handlePopoverButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setPopoverAnchorEl(null);
  };

  // Remove this const when copying and pasting into your project.
  //   const demoWindow = window !== undefined ? window() : undefined;

  const popoverMenuAction = (
    <React.Fragment>
      <IconButton
        aria-describedby={popoverId}
        onClick={handlePopoverButtonClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id={popoverId}
        open={isPopoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        disableAutoFocus
        disableAutoFocusItem
      >
        <MenuItem onClick={handlePopoverClose}>New Key</MenuItem>
        <MenuItem onClick={handlePopoverClose}>Delete All</MenuItem>
      </Menu>
    </React.Fragment>
  );
  const { window } = props;
  const dispatch = useDispatch();
  const CALLS_NAVIGATION: Navigation = [
    {
      segment: "Active",
      title: "Active",
      icon: <CallMadeIcon />,
      action: <ToggleOnIcon color="success" />,
    },
    {
      segment: "Expired",
      title: "Expired",
      icon: <CallReceivedIcon />,
      action: <ToggleOffIcon color="error" />,
    },
  ];

  const NAVIGATION: Navigation = [
    {
      kind: "header",
      title: "Profile Menu",
    },
    {
      segment: "api-keys",
      title: "API Keys",
      icon: <Security />,
      action: <Chip label={7} color="primary" size="small" />,
    },
    {
      segment: "calls",
      title: "Calls",
      icon: <CallIcon />,
      action: popoverMenuAction,
      children: CALLS_NAVIGATION,
    },
  ];

  const router = useDemoRouter("/dashboard");
  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;
  // router.navigate('/signout');

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
          toolbarActions: ToolbarActionsSearch,
          toolbarAccount: () => closer(props.handleClose),
          sidebarFooter: SidebarFooter,
        }}
      >
        {" "}
        <PageContent id={props.id} pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}
