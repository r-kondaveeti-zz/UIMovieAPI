import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { Box } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import SideMenu from '../SideMenu/SideMenu'
import FadeMenu from '../FadeMenu/FadeMenu'
import PasteTorrentLink from '../PasteTorrentLink/PasteTorrentLink';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

export default function NavBar({ didSearch, openDownloads, didPressGenreItem, openPasteTorrentLink, downloadsNumber, showSnack }) {
  const classes = useStyles();


  //Toggle Side menu
  const [sideMenu, setSideMenu] = useState(false)
  
  //Query value
  const [query, setQuery] = useState('')

  const toggleSideMenu = () => {
    console.log('Clicked Side Menu')
    setSideMenu(!sideMenu)
  }

  const [fadeMenu, setFadeMenu] = useState(false)

  const toggleFadeMenu = (event) => {
    console.log('Clicked Fade Menu')
    setFadeMenu(!fadeMenu)
  }

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  const handleSubmit = (event) => {
    console.log('Pressed')
  }

  return (
      <Box  style={{position: 'sticky', top: 5,}}>
        { showSnack ? <Alert severity="success" color="info" anchorOrigin={'bottom', 'center'}> Added to downloads</Alert>: <div></div> }
        <Paper className={classes.root} >
          <IconButton className={classes.iconButton} aria-label="menu"
            onClick={ toggleSideMenu }
          >
            <SideMenu isActive={ sideMenu } openDownloads={ openDownloads } didPressGenreItem={ didPressGenreItem } openPasteTorrentLink = { openPasteTorrentLink }/>
            <MenuIcon />
          </IconButton>
          <InputBase
            className={classes.input}
            placeholder="Search Movies"
            inputProps={{ 'aria-label': 'search google maps' }}
            onChange={ handleQueryChange }
            onKeyDown={ (event) => { 
              if(event.which == 13 || event.keyCode == 13) {
                event.target.blur();
                didSearch(query)
              }
            }}
          />
          <IconButton  className={classes.iconButton} aria-label="search" >
            <SearchIcon onClick={ () => {didSearch(query)} }/>
          </IconButton>
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton color="primary" className={classes.iconButton} aria-label="directions"
            onClick={ toggleFadeMenu }
          >
          <Badge badgeContent={ downloadsNumber } color="primary">
            <FadeMenu isActive={ fadeMenu } openDownloads={ openDownloads } openPasteTorrentLink = { openPasteTorrentLink }/>
          </Badge>
          </IconButton>
        </Paper>
      </Box>
  );
}
