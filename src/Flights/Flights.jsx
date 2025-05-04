import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import FlightCard from "./FlightCard/FlightCard";

const Flights = ({ flights }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      maxWidth="1200px"
      mx="auto"
      px={{ xs: 2, sm: 3, md: 4 }}
      py={{ xs: 3, sm: 5 }}
    >
      <Typography
        variant="h5"
        gutterBottom
        textAlign="center"
        fontSize={{ xs: 20, sm: 24 }}
      >
        Flights
      </Typography>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        width="100%"
      >
        {flights.slice(0, 20).map((flight, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <FlightCard flight={flight} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Flights;
