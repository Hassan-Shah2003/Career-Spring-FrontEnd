export function formatReadableDate(dateString) {
  try {
    if (!dateString) return "Invalid date";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    //   hour: "2-digit",
    //   minute: "2-digit",
      hour12: true
    });
  } catch (err) {
    console.error("Date parse error:", err);
    return "Invalid date";
  }
}
