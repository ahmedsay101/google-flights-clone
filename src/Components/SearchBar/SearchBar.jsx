import {
  Box,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Button,
  Paper,
  InputAdornment,
  List,
  ListItem,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";

import RoomIcon from "@mui/icons-material/Room";
import React, { useState, useRef, useEffect } from "react";

const FlightSearchBar = ({
  setOrigin,
  setOriginEntityId,
  setDestination,
  setDestinationEntityId,
  searchFlights,
  date,
  setDate,
  returnDate,
  setReturnDate,
  cabinClass,
  setCabinClass,
  adults,
  setAdults,
  tripType,
  setTripType
}) => {
  const [originDisplay, setOriginDisplay] = useState("");
  const [destinationDisplay, setDestinationDisplay] = useState("");

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query) return setSuggestions([]);
    try {
      const response = await axios.get(
        "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport",
        {
          params: { query },
          headers: {
            "X-RapidAPI-Key": import.meta.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
          },
        }
      );
      setSuggestions(response.data.data || []);
    } catch (error) {
      console.error("Suggestion error:", error.response?.data || error.message);
      setSuggestions([]);
    }
  };

  const departureRef = useRef();
  const returnRef = useRef();

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (originRef.current && !originRef.current.contains(event.target)) {
        setShowOriginDropdown(false);
      }
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target)
      ) {
        setShowDestinationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSwap = () => {
    const temp = originDisplay;
    setOriginDisplay(destinationDisplay);
    setDestinationDisplay(temp);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        backgroundColor: "#2d2d2d",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        color: "#babec1",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <FormControl variant="standard" sx={{ minWidth: 140 }}>
          <Select
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            disableUnderline
            startAdornment={
              <SwapHorizIcon sx={{ color: "#babec1", mr: 1 }} />
            }
            sx={{
              color: "#babec1",
              ".MuiSelect-icon": { color: "#babec1" },
              height: 40,
            }}
          >
            <MenuItem value={"round"}>Round trip</MenuItem>
            <MenuItem value={"oneway"}>One way</MenuItem>
            <MenuItem value={"multi"}>Multi-city</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <Select
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            disableUnderline
            startAdornment={<PersonIcon sx={{ color: "#babec1", mr: 1 }} />}
            sx={{
              color: "#babec1",
              ".MuiSelect-icon": { color: "#babec1" },
              height: 40,
            }}
          >
            {[1, 2, 3, 4].map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ minWidth: 140 }}>
          <Select
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value)}
            disableUnderline
            sx={{
              color: "#babec1",
              ".MuiSelect-icon": { color: "#babec1" },
              height: 40,
            }}
          >
            <MenuItem value={"economy"}>Economy</MenuItem>
            <MenuItem value={"business"}>Business</MenuItem>
            <MenuItem value={"first"}>First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative" }} ref={originRef}>
          <TextField
            variant="filled"
            value={originDisplay}
            onChange={(e) => {
              setOriginDisplay(e.target.value);
              fetchSuggestions(e.target.value, setOriginSuggestions);
              setShowOriginDropdown(true);
            }}
            onFocus={() => {
              if (originDisplay)
                fetchSuggestions(originDisplay, setOriginSuggestions);
              setShowOriginDropdown(true);
            }}
            placeholder="From"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightTakeoffIcon sx={{ color: "#babec1" }} />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
            sx={{
              input: {
                color: "#babec1",
                height: "30px",
              },
              "& .MuiInputBase-input::placeholder": { color: "#bbb" },
              backgroundColor: "transparent",
              borderRadius: 1,
              width: 180,
              border: "1px solid #babec1",
            }}
            autoComplete="off"
          />

          {showOriginDropdown && originSuggestions?.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: 360,
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: 1,
                zIndex: 10,
                mt: 1,
                p: 1,
              }}
            >
              <List dense>
                {originSuggestions.map((item, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                      p: 1,
                      cursor: "pointer",
                      color: "#babec1",
                      borderBottom: "1px solid #444",
                      "&:hover": { backgroundColor: "#3a3a3a" },
                    }}
                    onClick={() => {
                      const skyId =
                        item.navigation?.relevantFlightParams?.skyId;
                      const entityId =
                        item.navigation?.relevantFlightParams?.entityId;
                      setOrigin(skyId);
                      setOriginEntityId(entityId);
                      setOriginDisplay(item.presentation.suggestionTitle);
                      setOriginSuggestions([]);
                      setShowOriginDropdown(false);
                    }}
                  >
                    <RoomIcon fontSize="small" sx={{ mt: "2px" }} />
                    <Box>
                      <Box sx={{ fontWeight: 500 }}>
                        {item.presentation.suggestionTitle}
                      </Box>
                      <Box sx={{ fontSize: "12px", color: "#888" }}>
                        {item.presentation.subtitle}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
        <IconButton
          onClick={handleSwap}
          sx={{ alignSelf: "center", mt: "3px" }}
        >
          <SwapHorizIcon sx={{ color: "#babec1" }} />
        </IconButton>

        <Box sx={{ position: "relative" }} ref={destinationRef}>
          <TextField
            variant="filled"
            value={destinationDisplay}
            onChange={(e) => {
              setDestinationDisplay(e.target.value);
              fetchSuggestions(e.target.value, setDestinationSuggestions);
              setShowDestinationDropdown(true);
            }}
            onFocus={() => {
              if (destinationDisplay)
                fetchSuggestions(destinationDisplay, setDestinationSuggestions);
              setShowDestinationDropdown(true);
            }}
            placeholder="Where to?"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PlaceIcon sx={{ color: "#babec1" }} />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
            sx={{
              input: {
                color: "#babec1",
                height: "30px",
              },
              "& .MuiInputBase-input::placeholder": { color: "#bbb" },
              backgroundColor: "transparent",
              borderRadius: 1,
              width: 180,
              border: "1px solid #babec1",
            }}
            autoComplete="off"
          />

          {showDestinationDropdown && destinationSuggestions?.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: 360,
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: 1,
                zIndex: 10,
                mt: 1,
                p: 1,
              }}
            >
              <List dense>
                {destinationSuggestions.map((item, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                      p: 1,
                      cursor: "pointer",
                      color: "#babec1",
                      borderBottom: "1px solid #444",
                      "&:hover": { backgroundColor: "#3a3a3a" },
                    }}
                    onClick={() => {
                      const skyId =
                        item.navigation?.relevantFlightParams?.skyId;
                      const entityId =
                        item.navigation?.relevantFlightParams?.entityId;
                      setDestination(skyId);
                      setDestinationEntityId(entityId);
                      setDestinationDisplay(item.presentation.suggestionTitle);
                      setDestinationSuggestions([]);
                      setShowDestinationDropdown(false);
                    }}
                  >
                    <RoomIcon fontSize="small" sx={{ mt: "2px" }} />
                    <Box>
                      <Box sx={{ fontWeight: 500 }}>
                        {item.presentation.suggestionTitle}
                      </Box>
                      <Box sx={{ fontSize: "12px", color: "#888" }}>
                        {item.presentation.subtitle}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
        <Box sx={{ position: "relative" }}>
          <TextField
            type="date"
            inputRef={departureRef}
            variant="filled"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onClick={() => departureRef.current?.showPicker?.()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon sx={{ color: "#babec1" }} />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
            sx={{
              input: {
                color: "#babec1",
                height: "30px",
                cursor: "pointer",
                userSelect: "none",
              },
              backgroundColor: "transparent",
              borderRadius: 1,
              width: 180,
              border: "1px solid #babec1",
              userSelect: "none",
            }}
          />
        </Box>
        <Box sx={{ position: "relative" }}>
          <TextField
            type="date"
            inputRef={returnRef}
            variant="filled"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            onClick={() => returnRef.current?.showPicker?.()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon sx={{ color: "#babec1" }} />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
            sx={{
              input: {
                color: "#babec1",
                height: "30px",
                cursor: "pointer",
                userSelect: "none",
              },
              backgroundColor: "transparent",
              borderRadius: 1,
              width: 180,
              border: "1px solid #babec1",
              userSelect: "none",
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#8ab4f8",
            color: "#000",
            fontWeight: "bold",
            borderRadius: 5,
            px: 4,
            textTransform: "none",
          }}
          startIcon={<SearchIcon />}
          onClick={() => {
            searchFlights();
          }}
        >
          Explore
        </Button>
      </Box>
    </Paper>
  );
};

export default FlightSearchBar;
