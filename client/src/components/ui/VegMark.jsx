export default function VegMark({ veg }) {
  const color = veg ? "border-green-600 text-green-600" : "border-red-700 text-red-700";
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center border-2 bg-white ${color}`}
      title={veg ? "Vegetarian" : "Non-vegetarian"}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      <span className="sr-only">{veg ? "Vegetarian" : "Non-vegetarian"}</span>
    </span>
  );
}