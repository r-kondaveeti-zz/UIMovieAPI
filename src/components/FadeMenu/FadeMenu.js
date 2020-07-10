import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import MoreIcon from '@material-ui/icons/MoreVert';

export default function FadeMenu({ isActive, openDownloads }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    console.log('Open Download '+openDownloads)
    // openDownloads(true);       ---------CHange
  };

  return (
    <div >
      <MoreIcon onClick={ (event) => handleClick(event)}/>
      <Menu 
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={isActive}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorEl={ anchorEl }
      >
        {/* <MenuItem onClick={handleClose}>Downloading</MenuItem> */}
        <MenuItem onClick={handleClose}>Recent Downloads</MenuItem>
      </Menu>
    </div>
   );
}