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
import { ErrorSharp } from '@material-ui/icons';
import Pagination from '@material-ui/lab/Pagination';
import pasteTorrentLink from '../PasteTorrentLink/PasteTorrentLink';
import PasteTorrentLink from '../PasteTorrentLink/PasteTorrentLink';

export default function Main() {
  const [ movies, setMovies ] = useState(null)
  const [ sideMenuYear, setSideMenuYear ] = useState(null);
  const [ sideMenuLang, setSideMenuLang ] = useState("English");
  const [ sideMenuGenre, setSideMenuGenre ] = useState(null);
  const [ pagination, setPagination ] = useState(false);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ query, setQuery ] = useState('empty')
  const [ isDialog, setIsDialog ] = useState(false)
  const [ socket, setSocket ] = useState(null)
  const [ pasteTorrentLink, setPasteTorrentLink ] = useState(false);
  const [ downloadingMovies, setDownloadingMovies ] = useState([]) 
  const [ downloadsNumber, setDownloadsNumber ] = useState(0);
  const [ showSnack, setShowSnack ] = useState(false);

  //Toggle Downloads
  const [downloads, setDownloads] = useState(false)

  const handleSubmit = (movieName) => {
    setMovies(null)
    setPagination(false)
    if(movieName === '') { movieName = query}
    Axios.get('http://173.28.18.61:9091/api/movies/'+movieName)
    .then(
        response => {
          if(response.data.length === undefined) { let newMovieArray = [response.data]; console.log(newMovieArray); setMovies(newMovieArray); setPagination(false)}
          else { setMovies(response.data); if(response.data.length < 10){ setPagination(false) } else { setPagination(true) }}
        })
    .catch(err => {
      setMovies(null)
      setPagination(false)
      Axios.get('http://173.28.18.61:9091/api/movies/'+movieName)
        .then(
          response => {
            if(response.data.length === undefined) { let newMovieArray = [response.data]; console.log(newMovieArray); setMovies(newMovieArray); setPagination(false)}
            else { setMovies(response.data); if(response.data.length < 10){ setPagination(false) } else { setPagination(true) }}
          })
        .catch(err => {     
          /*
          Searched movie doesn't exist
          */
          toggleIsDialog(); 
          homeResults();  
        })
    })
  }

  /*
    Requesting for Home page results
  */
  const homeResults = () => {
    /*
      Fetching home-page results 
    */
    Axios.get('http://173.28.18.61:9091/api/movies/action/1')
    .then(
        response => {
          console.log("Over here");
            setMovies(response.data)
            setPagination(true)
            console.log(response)
    })
  }

  /* 
    Loading home page results when the component loads
    Will run only once!
  */
  useEffect(() => {
    homeResults()
  }, [])

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
            return (<MovieCard key={Math.random()} rating={element.rating} onPlex={element.onPlex} genre={element.genres} torrent={element.torrent} language={element.languages[0]} synopsis={element.synopsis} title={element.name} image={element.poster} heading={element.title} year={element.year} isDownloading={isDownloading}
               speed={ speed } eta={ eta } vuzeId={ vuzeId } didPressDownload= { didPressDownload }       
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
    Pressed Download. 
    Runs when user presses download!
  */
 const didPressDownload = (magnet, title) => {
   console.log(btoa(magnet));
   Axios.put('http://173.28.18.61:9091/api/torrent/', { torrentUrlBase64: btoa(magnet) })
    .then(response => {
      console.log("download response --> "+response.data);
      setShowSnack(true)
      setTimeout(() => setShowSnack(false), 3000);
    })
    .catch(err => {     
      /**
       * Show error on the dialog box
       */
      console.log(err)
      toggleIsDialog()
    })
  }

  /*
    Runs when items under English are clicked! -- Genre!
  */
  const didPressGenreItem = (genre, isIndianMovie, language, year, pageNumber) => {
    setCurrentPage(1)
    if(isIndianMovie) {
      setSideMenuLang(language);
      setSideMenuYear(year);
      setMovies(null)
      setPagination(false)
      requestMovies(genre, isIndianMovie, language, year, pageNumber)
    } else {
    setMovies(null)
    setPagination(false)
    setSideMenuLang("English");
    setSideMenuGenre(genre);
    requestMovies(genre, isIndianMovie, language, year, pageNumber)
    }
  }

  const requestMovies = (genre, isIndianMovie, language, year, pageNumber) => {
    if(isIndianMovie) {
      Axios.get(`http://173.28.18.61:9091/api/movies/${language}/${year}/${pageNumber}`)
      .then(response => {
        setMovies(response.data)
        if(response.data.length !== 0 || response.data !== undefined) {
          if(response.data.length < 10) { console.log(response.data.length); setPagination(false); }
          else { setPagination(true) }
        }
      })
      .catch(error => console.log(error))
    } else {
      Axios.get(`http://173.28.18.61:9091/api/movies/${genre}/${pageNumber}`)
      .then(response => {
        setMovies(response.data)
        if(response.data.length !== 0 || response.data !== undefined) {
          if(response.data.length < 10) { console.log(response.data.length); setPagination(false); }
          else { setPagination(true) }
        }
        
      })
      .catch(error => console.log(error))
    }
  }

  const didPressPagination = (event, pageNumber) => {
    setCurrentPage(pageNumber)
    if(sideMenuLang !== "English") {
      setMovies(null);
      setPagination(false);
      requestMovies("action", true, sideMenuLang, sideMenuYear, pageNumber);
    } else { setMovies(null); setPagination(false); requestMovies(movies[0].genres[0], false, "English", 2020, pageNumber); }
  }

    return(
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" style={{display: 'flex', flexDirection: 'column'}} fixed>
            
              {/* <Alert style={{marginBottom: 3, marginTop: 7}} severity="info">As this is a beta release, some of movies doesn't seem to download (no status), but they will download on the server, please open Plex to check after a while.</Alert> */}
                  <NavBar showSnack={ showSnack } didSearch={ handleSubmit } openDownloads={ setDownloads } didPressGenreItem={ didPressGenreItem } openPasteTorrentLink = { setPasteTorrentLink} downloadsNumber={ downloadsNumber }/>
                  <PopoverPopupState />
                  { downloads ? <Downloads setDownloadsNumber={ setDownloadsNumber } openDownloads={ setDownloads }/>: pasteTorrentLink ? <PasteTorrentLink didPressDownload={ didPressDownload }/>: getMoviesOrLoadingBar() }
                  { dialog() }
              { downloads || pasteTorrentLink ? <div></div>:  pagination ? <Pagination count={5} style={{display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 25}} size="large" onChange={ didPressPagination } page={ currentPage }/> : <div></div>}
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