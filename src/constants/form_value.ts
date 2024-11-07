export const monthValue = () => {
  const data = [];
  for (let i = 1; i <= 31; i++) {
    data.push({
      value: i,
      label: i.toString(),
    });
  }
  return data;
};

export const weekValue = [
  { value: 0, label: "Monday" },
  { value: 1, label: "Tuesday" },
  { value: 2, label: "Wednesday" },
  { value: 3, label: "Thursday" },
  { value: 4, label: "Friday" },
  { value: 5, label: "Saturday" },
  { value: 6, label: "Sunday" },
];

export const timeOptions = (
  startTime: string,
  endTime: string,
  interval: number
) => {
  const timeSlots = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMinute = startMinute;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const formattedHour = currentHour.toString().padStart(2, "0");
    const formattedMinute = currentMinute.toString().padStart(2, "0");
    const timeSlot = `${formattedHour}:${formattedMinute}`;
    timeSlots.push({ value: timeSlot, label: timeSlot });

    // Increase time by interval
    currentMinute += interval;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute %= 60;
    }
  }

  return timeSlots;
};
