import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-page text-center">
        <p className="text-6xl font-display font-bold text-spice">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-ink/70">That page isn't on our menu.</p>
        <Button to="/" className="mt-6">Back to home</Button>
      </div>
    </section>
  );
}