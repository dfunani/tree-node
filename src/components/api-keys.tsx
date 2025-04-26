import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Key from "@mui/icons-material/Key";
import DeleteIcon from "@mui/icons-material/Delete";
import CopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  AddAPhoto,
  AddIcCallRounded,
  AddLinkRounded,
  AddTaskRounded,
} from "@mui/icons-material";
import Popover from "./popover";
import { Divider } from "@mui/material";
import { v4 as uuid4 } from "uuid";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

type Props = {
  id: string;
};
export default function ApiKeys(props: Props) {
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [viewKeys, setViewKeys] = React.useState<string | null>(null);
  const [activeKeys, setActiveKeys] = React.useState([]);

  async function generate(id: string) {
    const keys = await handleGetAllKeys(id);
    setActiveKeys(() =>
      keys.map((response: any, index: number) => {
        const { user_id, apiKey, active, createdAt, expiresAt } = response;
        const key = `${user_id}-${apiKey}-${expiresAt}-${index}`
        const masked = apiKey
          .split("")
          .map((elem: string, i: number) => (i < apiKey.length - 4 ? "*" : elem));
        const unmasked = apiKey;
        return (
          <ListItem
            key={key}
            secondaryAction={
              <>
                <IconButton>
                  <VisibilityIcon
                    onClick={() =>
                      setViewKeys((prev: string | null) => {
                        if (prev === key) {
                          return null;
                        }
                        return key;
                      })
                    }
                  />
                </IconButton>
                <IconButton edge="end" aria-label="copy" sx={{ mr: 1 }}>
                  <CopyIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <Key sx={{ color: "green" }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={viewKeys === key ? unmasked : masked}
              secondary={expiresAt}
            />
          </ListItem>
        );
      })
    );
  }

  async function handleGetAllKeys(id: string) {
    const response = await fetch(`/api/auth/user/token/key?id=${id}`, {
      method: "GET",
    });
    const data = await response.json();
    if (!response.ok) {
      return [];
    }

    if (!data.message) {
      return [];
    }

    return data.message;
  }

  function handleNewApiKey(id: string) {
    fetch("/api/user/token/key", {
      method: "POST",
      body: JSON.stringify({
        user_id: id,
      }),
    });
  }

  React.useEffect(() => {
    generate(props.id);
  }, [viewKeys]);

  return (
    <Box>
      {props.id}
      <FormGroup row sx={{ ml: 4, mb: 2 }}>
        <FormControlLabel
          control={
            <IconButton
              edge="start"
              aria-label="delete"
              onClick={() => {
                console.log("Add API Key");
              }}
            >
              <AddTaskRounded />
              {/* <Popover /> */}
            </IconButton>
          }
          label="Add New API Key"
        />
      </FormGroup>
      <Divider />
      <Grid>
        <Typography sx={{ mt: 2, mb: 2 }} variant="h6" component="div">
          ACTIVE
        </Typography>
        <Demo>
          <List dense={dense}>{activeKeys}</List>
        </Demo>
      </Grid>
      <Divider />
      {/* <Grid>
        <Typography sx={{ mt: 2, mb: 2 }} variant="h6" component="div">
          INACTIVE
        </Typography>
        <Demo>
          <List dense={dense}>
            {generate(
              <ListItem
                secondaryAction={
                  <>
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="copy" sx={{ mr: 1 }}>
                      <CopyIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <Key sx={{ color: "red" }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={"dca2688b40f596bbfb59f2e8f5cf0ba10f0e43fbf6d342f7d12eb471a0bcfe59"
                    .split("")
                    .map((elem: string, index: number) =>
                      index < 60 ? "*" : elem
                    )}
                  secondary={"6 Days Left"}
                />
              </ListItem>
            )}
          </List>
        </Demo>
      </Grid> */}
    </Box>
  );
}
