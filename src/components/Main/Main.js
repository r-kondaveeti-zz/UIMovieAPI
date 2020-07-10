import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';
import MovieCard from '../MovieCard/MovieCard';
import Container  from '@material-ui/core/Container'
import { ThemeProvider, createMuiTheme, CircularProgress } from '@material-ui/core';
import Axios from 'axios';
import AlertDialogSlide from '../AlertDialogSlide/AlertDialogSlide';
import PopoverPopupState from '../PopoverPopupState/PopoverPopupState';
import Downloads from '../Downloads/Downloads';
import io from 'socket.io-client';
import { Alert } from '@material-ui/lab'

export default function Main() {
  const [ movies, setMovies ] = useState(null)
  const [ query, setQuery ] = useState('empty')
  const [ isDialog, setIsDialog ] = useState(false)
  const [ socket, setSocket ] = useState(null)
  const [ downloadingMovies, setDownloadingMovies ] = useState([]) 

  //Toggle Downloads
  const [downloads, setDownloads] = useState(false)

  const handleSubmit = (movieName) => {
    setMovies(null)
    if(movieName === '') { movieName = query}
    Axios.get('http://173.28.18.61:3000/search/'+movieName)
    .then(
        response => {
            /*
              Searched movie doesn't exist
             */
            if(response.data.name === 'diot') { 
              toggleIsDialog(); 
              homeResults();  
            }
            else { setMovies(response.data) }
        })
  }

  /*
    Requesting for Home page results
  */
  const homeResults = () => {
    /*
      Fetching home-page results 
    */
    Axios.get('http://173.28.18.61:3000/search/'+query)
    .then(
        response => {
            setMovies(response.data)
        })
    /*
        Starting socket connection
    */
    const socket = io('http://173.28.18.61:3000');
    setSocket(socket);
  }

  /* 
    Loading home page results when the component loads
    Will run only once!
  */
  useEffect(() => {
    homeResults()
  }, [])

  useEffect(() => {
    if(socket !== null) {
      setSocket(socket);
      socket.on('allTorrentStaus', response => {
        socket.emit('renameTitle')
        /*
          Comparing movie names in the socket response 
          to the movies displayed
        */ 
        if(movies !== null && response.status !== undefined) {
          /*
            TODO: movies are refreshing whenever there's a response from the
            socket connection, probably caused by the useEffect hook or
            state is setting again and again.  
          */
          if(downloadingMovies !== response.status) {
            setDownloadingMovies(response.status)
          } 
          console.log(response.status)
          movies.forEach(element => {
            response.status.forEach(responseElement => {
              if(responseElement !== undefined) {
                if(responseElement.name.includes(element.title)) {
                  /*
                    Movie name matched!
                  */
                  console.log('Matched!');
                }
              }
            })
          });
        }
      })
    }
  })

  const getMoviesOrLoadingBar = (searchedAgain) => {
    if(movies !== undefined && movies !== null) {
        const moviesArray = movies.map(element => {
            let isDownloading = false;
            let speed = '';
            let eta = '';
            let vuzeId = null;
            downloadingMovies.forEach(singleDownloadingMovie => {
              let lowerCasedElementTitle = '';

              /*
                Converting the element to lower case and removing the non-alphanumerics
              */
              ((movieName) => {
                movieName = movieName.toLowerCase();
                console.log(movieName)
                const something = movieName.search(':');
                const list = movieName.split('')
                lowerCasedElementTitle = movieName.replace(/[\W_]+/g," ")
            })(element.title)

              if(singleDownloadingMovie.name.toLowerCase().includes(lowerCasedElementTitle)){ 
                isDownloading = true;
                speed = singleDownloadingMovie.rateDownload;
                eta = singleDownloadingMovie.eta;
                vuzeId = singleDownloadingMovie.id;
              }
            })
            return (<MovieCard key={Math.random()} rating={element.rating} onPlex={element.onPlex} genre={element.genres} torrent={element.torrents} language={element.language} synopsis={element.synopsis} title={element.title} image={element.large_cover_image} heading={element.title} year={element.year} isDownloading={isDownloading} didPressDownload={ didPressDownload }
               speed={ speed } eta={ eta } vuzeId={ vuzeId } didPressStop={ didPressStop }           
            />)
        });
  
        return moviesArray
    } else {
        return (
          <CircularProgress color="primary" style={{ 
            alignSelf: 'center', 
            justifyContent: 'center',
            justifySelf: 'center',
            position: 'absolute',
            top: '50%' 
          }}/>
        )
    }
  }

  /*
    Open dialog box when the movie is not found!
    Close upon pressing the dialog box keys. 
  */ 
  const dialog = () => {
    return <AlertDialogSlide movieNotFound={ isDialog } onCancel={ toggleIsDialog }/>
  }
  const toggleIsDialog = () => {
    setIsDialog(!isDialog)
  }

  /*
    Downloading process:
      - User presses download
      - useEffect, one of the method, runs all the time check for 
      socket response. It discards if the response is []. 
      - It compares the response, if any, with the movies, 
      if it finds matches then activates stop button by
      setting isDownloading prop --<
      - User stop by pressing the button, the event is then raised to the parent. 
  */

  /*
    Pressed Download. 
    Runs when user presses download!
  */
 const didPressDownload = (magnet, title) => {

   const movieItem = {
    title: title,
    magnet: magnet
}
   socket.emit('startDownload', movieItem)
 }

  /* 
    Runs when the user pressed stop on the
    movie card! 
  */
  const didPressStop = (vuzeId) => {
    console.log('Pressed stop'+ vuzeId)
    socket.emit('stopDownload', vuzeId)
  }

  /*
    Runs when items under English are clicked! -- Genre!
  */
  const didPressGenreItem = (genre) => {
    setMovies(null)
    Axios.get(`http://173.28.18.61:3000${genre}`)
      .then(response => {
        setMovies(response.data)
      })
      .catch(error => console.log(error))
  }

    return(
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" style={{display: 'flex', flexDirection: 'column'}} fixed>
            <Alert style={{marginBottom: 3, marginTop: 7}} severity="info">As this is a beta release, some of movies doesn't seem to download (no status), but they will download on the server, please open Plex to check after a while.</Alert>
                <NavBar didSearch={ handleSubmit } openDownloads={ setDownloads } didPressGenreItem={ didPressGenreItem } />
                <PopoverPopupState />
                { downloads ? <Downloads />: getMoviesOrLoadingBar() }
                { dialog() }
            </Container> 
        </ThemeProvider>
    )
}

const theme = createMuiTheme({
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: '#4db6ac',
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        light: '#0066ff',
        main: '#0044ff',
        // dark: will be calculated from palette.secondary.main,
        contrastText: '#ffcc00',
      },
      // Used by `getContrastText()` to maximize the contrast between
      // the background and the text.
      contrastThreshold: 3,
      // Used by the functions below to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
    },
  });