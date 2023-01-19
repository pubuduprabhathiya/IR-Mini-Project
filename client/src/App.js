//in client/src/App.js
import axios from "axios";
import { useState, useEffect } from "react";
import "./App.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import LeftPanel from "./leftPanel";
import SongCard from "./songCard";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";

const App = () => {
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [matchAll, setmatchAll] = useState(true);
  const [Artists, setArtists] = useState(true);
  const [Title, setTitle] = useState(true);
  const [Lyricists, setLyricists] = useState(true);
  const [Lyrics, setLyrics] = useState(true);
  const [metaphors, setmetaphor] = useState(true);
  const [meaning, setmeaning] = useState(true);
  const [Genre, setGenre] = useState(true);
  const [MusicComposers, setMusicComposers] = useState(true);
  
  const [disableMatchingFields, setDisableMatchingFields] = useState(true);
  const [filter, setfilters] = useState([]);
  const [isFiltersLoaded, setIsFiltersLoaded] = useState(false);
  const [filterChecked, setFiltersChecked] = useState([]);
  const [filtersSet, setFiltersSet] = useState(false);

  function changeFilterChecked(filtersArray) {
    var newFilterArray = [];
    //console.log("fun",filtersArray,filtersArray.length)
    for (var fil = 0; fil < filtersArray.length; fil++) {
      //console.log("fill")
      const keys = Object.keys(filtersArray[fil]);

      const values = filtersArray[fil][keys[0]];
      //console.log(values)
      const arr = [];
      for (var val = 0; val < values.length; val++) {
        arr.push(false);
      }
      const obj = {};
      obj[keys[0]] = arr;
      newFilterArray.push(obj);
    }
    setFiltersChecked(newFilterArray);
  }
  useEffect(() => {
    getFilterData();
  }, []);

  useEffect(() => {
    if (isFiltersLoaded && filter.length > 0 && filterChecked.length > 0) {
      sendSearchSongRequest();
    }
  }, [filter, filterChecked]);

  useEffect(() => {
    if (isFiltersLoaded) {
      changeFilterChecked(filter);
      setFiltersSet(true);
    }
  }, [isFiltersLoaded]);

  const changeMatchAll = (allVal) => {
    if (allVal == true) {
      setDisableMatchingFields(false);
      setmatchAll(false);
      setArtists(false);
      setTitle(false);
      setLyricists(false);
      setLyrics(false);
      setGenre(false);
      setMusicComposers(false);
      setmetaphor(false);
      setmeaning(false);
    } else {
      setDisableMatchingFields(true);
      setmatchAll(true);
      setArtists(true);
      setTitle(true);
      setLyricists(true);
      setLyrics(true);
      setGenre(true);
      setMusicComposers(true);
      setmetaphor(true);
      setmeaning(true);
    }
  };

  const getMatchResults = () => {
    var mResults = [];
    if (Artists) {
      mResults.push("Artists");
    }
    if (Title) {
      mResults.push("Title");
    }

    if (Lyricists) {
      mResults.push("Lyricists");
    }
    if (Lyrics) {
      mResults.push("Lyrics");
    }
    if (metaphors) {
      mResults.push("metaphors");
    }
    if (meaning) {
      mResults.push("meaning");
    }
    if (Genre) {
      mResults.push("Genre");
    }
    if (MusicComposers) {
      mResults.push("Music Composers");
    }
    return mResults;
  };

  const getFinalFilters = () => {
    var filtersObj = {};
    console.log(filterChecked);
    for (var t = 0; t < filter.length; t++) {
      const key = Object.keys(filter[t]);
      var checkedVal = filterChecked[t][key[0]];
      var filtVal = filter[t][key[0]];
      var array = [];
      for (var v = 0; v < checkedVal.length; v++) {
        if (checkedVal[v] == true) {
          array.push(filtVal[v]["key"]);
        }
      }
      filtersObj[key[0] + ".keyword"] = array;
    }
    return filtersObj;
  };

  const getFilterData = () => {
    const results = {
      method: "GET",
      url: "http://localhost:3001/filters",
    };
    axios
      .request(results)
      .then((response) => {
        const keys = Object.keys(response.data);

        const newArrayF = [];
        for (var c = 0; c < keys.length; c++) {
          var newObj = {};
          newObj[keys[c].slice(0, keys[c].length - 8)] = response.data[keys[c]];
          newArrayF.push(newObj);
        }

        setfilters(newArrayF);

        setIsFiltersLoaded(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const sendSearchSongRequest = () => {
    var queryObject = {};
    const search = query;
    const matchResults = getMatchResults();
    const finalFilters = getFinalFilters();
    queryObject["search"] = search;
    queryObject["matchResults"] = matchResults;

    queryObject["filters"] = finalFilters;

    const newObj = JSON.stringify(queryObject);
    console.log("searching ", newObj);

    const results = {
      method: "GET",
      url: "http://localhost:3001/results",
      params: {
        searchQuery: newObj,
      },
    };
    axios
      .request(results)
      .then((response) => {
        console.log("data", response.data);
        setDocuments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function setQueryVal(e) {
    setQuery(e.target.value);
  }

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
    },
  });
  return (
    <div className="ap">
      <div>
        <div>
          
            <AppBar color="primary" position="static">
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
              >
                <Toolbar sx={{ fontSize: "25px" }}>Sinhala Songs</Toolbar>
                <Paper
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 600,
                  }}
                >
                  <InputBase
                    onChange={setQueryVal}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Songs"
                    inputProps={{ "aria-label": "Search Songs" }}
                  />
                  <IconButton
                    onClick={sendSearchSongRequest}
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                </Paper>
              </Grid>
            </AppBar>

          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ marginTop: "20px" }}
          >
            <Grid item>Matching Fields:</Grid>
            <Grid item>
              <FormGroup>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={matchAll}
                          onChange={() => changeMatchAll(matchAll)}
                        />
                      }
                      label="All Fields"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Artists}
                          disabled={disableMatchingFields}
                          onChange={() => setArtists(!Artists)}
                        />
                      }
                      label="Artists"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Title}
                          disabled={disableMatchingFields}
                          onChange={() => setTitle(!Title)}
                        />
                      }
                      label="Title"
                    />
                  </Grid>
                  <Grid item></Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Lyricists}
                          disabled={disableMatchingFields}
                          onChange={() => setLyricists(!Lyricists)}
                        />
                      }
                      label="Lyricists"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Lyrics}
                          disabled={disableMatchingFields}
                          onChange={() => setLyrics(!Lyrics)}
                        />
                      }
                      label="Lyrics"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Genre}
                          disabled={disableMatchingFields}
                          onChange={() => setGenre(!Genre)}
                        />
                      }
                      label="Genre"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={MusicComposers}
                          disabled={disableMatchingFields}
                          onChange={() => setMusicComposers(!MusicComposers)}
                        />
                      }
                      label="Music Composers"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={metaphors}
                          disabled={disableMatchingFields}
                          onChange={() => setmetaphor(!metaphors)}
                        />
                      }
                      label="metaphors"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={meaning}
                          disabled={disableMatchingFields}
                          onChange={() => setmeaning(!meaning)}
                        />
                      }
                      label="meaning"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            sx={{ marginTop: "80px" }}
          >
            <Grid item xs={3}>
              {filtersSet == true && filterChecked.length > 0 ? (
                <LeftPanel
                  filters={filter}
                  checkedFilters={filterChecked}
                  setFiltersChecked={setFiltersChecked}
                />
              ) : null}
            </Grid>

            <Grid item xs={9} sx={{ paddingLeft: "10%", paddingRight: "10%" }}>
              <div>Number of Hits: {documents.length}</div>
              <div >
                {documents.map(function (document, i) {
                  return (
                    <div style={{margin:50}}>
                      <SongCard document={document} />
                    </div>
                  );
                })}
              </div>
            </Grid>
          </Grid>
        </div>
        <br></br>
      </div>
    </div>
  );
};

export default App;
