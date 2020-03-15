export default function yyyyMMdd() {
  const now = new Date();
  return (
    now.getFullYear() + zeroPad(now.getMonth() + 1) + zeroPad(now.getDate())
  );
}

function zeroPad(value: number) {
  return `0${value}`.slice(-2);
}
