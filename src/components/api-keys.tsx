import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddAPhoto, AddIcCallRounded, AddLinkRounded, AddTaskRounded } from '@mui/icons-material';
import Popover from './popover';

function generate(element: React.ReactElement<unknown>) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function ApiKeys() {
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  function handleNewApiKey(){
    fetch("/api/user/token/key", {
      method: "POST",
      body: JSON.stringify({
        user_id: userState.id,
      }),
    });
  }

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <FormGroup row sx={{ ml: 4 }}>
        <FormControlLabel
          control={
            <IconButton edge="start" aria-label="delete" onClick={() => {console.log("Add API Key")}}>
              <AddTaskRounded />
              {/* <Popover /> */}
            </IconButton>
          }
          label="Add New API Key"
        />
      </FormGroup>
      <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2, ml: 2 }} variant="h6" component="div">
            APIKeys
          </Typography>
          <Demo>
            <List dense={dense}>
              {generate(
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon sx={{color: "green"}} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Single-line item"
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>,
              )}
            </List>
          </Demo>
        </Grid>
    </Box>
  );
}
