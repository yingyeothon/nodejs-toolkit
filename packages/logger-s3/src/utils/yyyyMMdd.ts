export default function yyyyMMdd(): string {
  const now = new Date();
  return (
    now.getFullYear() + zeroPad(now.getMonth() + 1) + zeroPad(now.getDate())
  );
}

function zeroPad(value: number): string {
  return `0${value}`.slice(-2);
}
