export const formatTimeCompleteFromMS = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((total % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export const getDefaultDate = () => {
  const d = new Date();
  d.setHours(d.getHours() + 24);
  return d;
};
