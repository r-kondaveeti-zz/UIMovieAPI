import React from 'react';
import Menu from '@material-ui/core/Menu';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import MoreIcon from '@material-ui/icons/MoreVert';
import CloudDownloadRoundedIcon from '@material-ui/icons/CloudDownloadRounded';
import LinkIcon from '@material-ui/icons/Link';

const useStyles = makeStyles((theme) => ({
  downloadIcon: {
    paddingLeft: theme.spacing(1)
  },
  linkIcon: {
    paddingLeft: theme.spacing(1)
  }
}));

export default function FadeMenu({ isActive, openDownloads, openPasteTorrentLink }) {
  const classes = useStyles();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // console.log('Open Download '+openDownloads)
    openDownloads(true);      
  };

  const changeToPasteTorrentLink = () => {
    setAnchorEl(null);
    openDownloads(false)
    openPasteTorrentLink(true);   
  }

  return (
    <div >
      <MoreIcon onClick={ (event) => handleClick(event)}/>
      <Menu 
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={isActive}
        onClose={ handleClose }
        TransitionComponent={Fade}
        anchorEl={ anchorEl }
      >
        <MenuItem onClick={ changeToPasteTorrentLink  }>Paste Torrent Link <LinkIcon color="red" className={classes.linkIcon}></LinkIcon></MenuItem>
        <MenuItem onClick={ handleClose } >Recent Downloads<CloudDownloadRoundedIcon color="primary" className={classes.downloadIcon}></CloudDownloadRoundedIcon> </MenuItem>
      </Menu>
    </div>
   );
}