const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  fractionalSecondDigits: 3,
};

export async function postLog(msg: string) {
  const date = new Date();
  const response = await fetch("http://localhost:3000/api/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      msg,
      date: date.toLocaleString("en-US", options),
    }),
  });
  await response.json();
}
