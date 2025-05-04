export const formatDateRange = (departure, arrival) => {
  const options = { month: "short", day: "numeric" };
  const start = new Date(departure).toLocaleDateString("en-US", options);
  const end = new Date(arrival).toLocaleDateString("en-US", options);
  return `${start} – ${end}`;
};

export const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} hr${h > 1 ? "s" : ""} ${m} min`;
};

export const getStopText = (count) => {
  if (count === 0) return "Nonstop";
  if (count === 1) return "1 stop";
  return `${count} stops`;
};
