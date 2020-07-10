import React from 'react';
import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import ProcessStepper from '../ProcessStepper/ProcessStepper'

export default function PopoverPopupState() {
const classes = useStyles();
  return (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <div>
          <Button className={classes.root} size="small" variant="contained" color="primary" {...bindTrigger(popupState)}>
            How does this work?
          </Button>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box p={2}>
              <Typography><ProcessStepper /></Typography>
            </Box>
          </Popover>
        </div>
      )}
    </PopupState>
  );
}

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
        color: 'white',
        float: 'right'
    },
  }));