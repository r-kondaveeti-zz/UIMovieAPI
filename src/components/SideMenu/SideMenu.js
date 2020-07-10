import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/HomeRounded';
import MailIcon from '@material-ui/icons/Mail';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import Collapse from '@material-ui/core/Collapse';
import StarBorder from '@material-ui/icons/StarBorder';
import HdRoundedIcon from '@material-ui/icons/HdRounded';
import TheatersRoundedIcon from '@material-ui/icons/TheatersRounded';
import HighQualityRoundedIcon from '@material-ui/icons/HighQualityRounded';


const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function SideMenu({ isActive, openDownloads, didPressGenreItem }) {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button  onClick={() => openDownloads(false) }>
          <ListItemIcon><InboxIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button >
          <ListItemIcon><TheatersRoundedIcon /></ListItemIcon>
          <ListItemText primary="English" />
        </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested} onClick={() => didPressGenreItem("/genre/action")}>
                <ListItemIcon>
                  <HdRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Action" />
              </ListItem>
            </List>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested} onClick={() => didPressGenreItem("/genre/adventure")}>
                <ListItemIcon>
                  <HdRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Adventure" />
              </ListItem>
            </List>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested} onClick={() => didPressGenreItem("/genre/horror")}>
                <ListItemIcon>
                  <HdRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Horror" />
              </ListItem>
            </List>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested} onClick={() => didPressGenreItem("/genre/mystery")}>
                <ListItemIcon>
                  <HdRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Mystery" />
              </ListItem>
            </List>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <HdRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Romantic" onClick={() => didPressGenreItem("/genre/romantic")}/>
              </ListItem>
            </List>
          </Collapse>
        {/* <ListItem button>
          <ListItemIcon>
            <TheatersRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Telugu" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem> */}
        </List>
        {/* <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested} onClick={() => didPressGenreItem("/telugu/2020")}>
              <ListItemIcon>
                <HighQualityRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Telugu 2020" />
            </ListItem>
          </List>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested} onClick={() => didPressGenreItem("/telugu/2019")}>
              <ListItemIcon>  
                <HdRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Telugu 2019" />
            </ListItem>
          </List>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested} onClick={() => didPressGenreItem("/telugu/2018")}>
              <ListItemIcon>
                <HdRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Telugu 2018" />
            </ListItem>
          </List>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <HdRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Telugu Dubbed" />
            </ListItem>
          </List>
        </Collapse> */}
    </div>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
          <Drawer anchor={anchor} open={isActive} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
