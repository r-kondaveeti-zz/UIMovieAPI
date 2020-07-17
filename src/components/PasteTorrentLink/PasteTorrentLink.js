import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SendRounded  from '@material-ui/icons/SendRounded';
import FileCopy from '@material-ui/icons/FileCopy';
import Divider from '@material-ui/core/Divider';
import { flexbox } from '@material-ui/system';
import { Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';



const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
    //   marginTop: theme.spacing(1),
    //   marginBottom: theme.spacing(1)
    },
    input: {
      marginLeft: theme.spacing(1),
      borderBottom: 5,
    //   flexGrow: 3
    },
    // oneElement: {
    //     margin: 0,
    //     margin: 'auto',
    //     display: "inlineBlock"
    // },
    button: {
        paddingLeft: 0,
        marginLeft: 0
    }

  }));

export default function PasteTorrentLink({ didPressDownload }) {
    const classes = useStyles();

    //Toggle Side menu
    const [sideMenu, setSideMenu] = useState(false)
    
    //Query value
    const [query, setQuery] = useState('')

    const handleQueryChange = (event) => {
        setQuery(event.target.value)
      }
  
    const toggleSideMenu = () => {
      console.log('Clicked Side Menu')
      setSideMenu(!sideMenu)
    }

    return (
        <div style={{ paddingTop: 35 }}>
            <Box display="flex" alignContent="center" alignItems="center" justifyContent="center">
                {/* <Typography component="h8" variant="h8" >
                    Paste torrent or magnet url below to download. 
                    Please pick the one with better seeds for faster downloads. 
                </Typography> */}
                <Alert severity="info">
                    Paste torrent or magnet url below to download. 
                    Please pick the one with better seeds for faster downloads.
                </Alert>
            </Box>
            <br />
            <Box display="flex" alignContent="center" alignItems="center" justifyContent="center" flexGrow={1}>
                <InputBase
                    className={classes.input, classes.oneElement}
                    placeholder="Paste URL here..."
                    inputProps={{ 'aria-label': 'search google maps' }}
                    onChange={ handleQueryChange }
                    onKeyDown={ (event) => { 
                        if(event.which == 13 || event.keyCode == 13) {
                            event.target.blur();
                            didPressDownload(query)
                        }
                    }}
                />
                <IconButton aria-label="search" className = {classes.button, classes.oneElement} onClick={ () => didPressDownload(query)}>  
                    <SendRounded  className = {classes.button, classes.oneElement}/>
                </IconButton>
            </Box>
            <br/>
            <Divider />
            <br/>
            {/* <Box display="flex" alignContent="center" alignItems="center" justifyContent="center">
                <Typography component="h8" variant="h8">
                    Upload Torrent File
                </Typography>
            </Box>
            <br />
            <Box display="flex" alignContent="center" alignItems="center" justifyContent="center">
                <IconButton aria-label="search" className = {classes.button}>  
                    <FileCopy className = {classes.button}/>
                </IconButton>
            </Box> */}
        </div>
    );
}