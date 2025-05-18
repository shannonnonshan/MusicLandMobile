export const formatTime = (seconds: number | null | undefined): string => {
  if (isNaN(seconds as number) || seconds === null || seconds === undefined) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
