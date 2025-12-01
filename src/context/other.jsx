function formatTime(time24) {
  if (!time24) return "";
  const [hour, minute] = time24.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
export { formatTime };
