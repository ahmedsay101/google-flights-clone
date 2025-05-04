import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

export default function FlightCard({ flight }) {
  return (
    <Card
      sx={{
        width: "100%",          
        minWidth: 0,            
        bgcolor: "#1c1c1c",
        color: "#fff",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",         
      }}
    >
      <CardMedia
        component="img"
        height="120"
        image={flight?.destinationImage}
        alt={flight?.destinationCity}
        sx={{
          objectFit: "cover",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />
      <CardContent sx={{ p: 1.5, flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600} fontSize={{ xs: 14, sm: 16 }}>
            {flight?.destinationCity}
          </Typography>
          <Typography fontWeight={600} fontSize={{ xs: 14, sm: 16 }}>
            {flight?.price}
          </Typography>
        </Box>
        <Typography fontSize={{ xs: 12, sm: 13 }} mt={0.5}>
          {flight?.dateRange}
        </Typography>
        <Typography fontSize={{ xs: 12, sm: 13 }} color="gray">
          {flight?.stops} · {flight?.duration}
        </Typography>
      </CardContent>
    </Card>
  );
}