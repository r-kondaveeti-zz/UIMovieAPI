import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { Box } from '@material-ui/core';

import SideMenu from '../SideMenu/SideMenu'
import FadeMenu from '../FadeMenu/FadeMenu'

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

export default function NavBar({ didSearch, openDownloads, didPressGenreItem }) {
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
        <Paper className={classes.root} >
          <IconButton className={classes.iconButton} aria-label="menu"
            onClick={ toggleSideMenu }
          >
            <SideMenu isActive={ sideMenu } openDownloads={ openDownloads } didPressGenreItem={ didPressGenreItem }/>
            <MenuIcon />
          </IconButton>
          <InputBase
            className={classes.input}
            placeholder="Search English Movies"
            inputProps={{ 'aria-label': 'search google maps' }}
            onChange={ handleQueryChange }
            onKeyDown={ (event) => { 
              if(event.which == 13 || event.keyCode == 13) {
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
            <FadeMenu isActive={ fadeMenu } openDownloads={ openDownloads }/>
          </IconButton>
        </Paper>
      </Box>
  );
}
