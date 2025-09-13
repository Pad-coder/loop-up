export const formatDate = (timestamp) => {
  if (!timestamp) return "";

  let date;

  // Handle Firestore Timestamp
  if (timestamp?.toDate) {
    date = timestamp.toDate();
  } else if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }

  // Options for "13 September 2025"
  const options = { day: "2-digit", month: "long", year: "numeric" };

  // Use en-GB locale for DD Month YYYY
  return date.toLocaleDateString("en-GB", options);
};
