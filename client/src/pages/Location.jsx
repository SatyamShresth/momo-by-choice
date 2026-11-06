import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { useRestaurant } from "../context/SettingsContext.jsx";
import Button from "../components/ui/Button.jsx";
import MomoIcon from "../components/ui/MomoIcon.jsx";

export default function Location() {
  const restaurant = useRestaurant();
  const { address, hours, phone, email, mapsLink, mapsEmbed } = restaurant;

  const hasPhone = phone && !phone.startsWith("[");
  const telHref = hasPhone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
  // Server pehle se check karta hai, par yahan bhi dobara check (defence in depth).
  const linkOk = /^https:\/\//.test(mapsLink || "");
  const embedOk = (mapsEmbed || "").startsWith("https://www.google.com/maps/embed");

  return (
    <section className="section pt-8 sm:pt-10">
      <div className="container-page">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl">Find Us</h1>
          <p className="mt-2 text-ink/70">Aaiye, garam momos aapka intezaar kar rahe hain.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="rounded-2xl border-2 border-cocoa-900 bg-white p-6 shadow-pop">
              <h2 className="mb-3 flex items-center gap-2 text-xl"><MapPin className="h-5 w-5 text-chili" aria-hidden="true" /> Address</h2>
              <address className="not-italic leading-7 text-ink/80">
                {address.line1}<br />{address.line2}<br />{address.city}, {address.state} {address.pincode}
              </address>
              {linkOk && (
                <Button href={mapsLink} target="_blank" rel="noreferrer" className="mt-4">
                  <Navigation className="h-4 w-4" aria-hidden="true" /> Get Directions
                </Button>
              )}
            </div>

            <div className="rounded-2xl border-2 border-cocoa-900 bg-white p-6 shadow-pop">
              <h2 className="mb-3 flex items-center gap-2 text-xl"><Clock className="h-5 w-5 text-chili" aria-hidden="true" /> Opening hours</h2>
              <dl className="space-y-2 text-sm">
                {hours.map((h, i) => (
                  <div key={`${h.day}-${i}`} className="flex justify-between gap-4 border-b border-cocoa-900/10 pb-2">
                    <dt className="font-bold">{h.day}</dt>
                    <dd className="text-ink/80">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border-2 border-cocoa-900 bg-white p-6 shadow-pop">
              <h2 className="mb-3 text-xl">Contact</h2>
              <ul className="space-y-2 text-sm text-ink/80">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-chili" aria-hidden="true" />
                  {telHref ? <a className="font-bold hover:text-chili" href={telHref}>{phone}</a> : <span>{phone}</span>}
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-chili" aria-hidden="true" /> <span>{email}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border-2 border-cocoa-900 bg-cream-dark shadow-pop">
            {embedOk ? (
              <iframe
                title="Restaurant location map"
                src={mapsEmbed}
                className="h-full min-h-[360px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
                <MomoIcon className="h-16 w-16 text-chili" />
                <p className="font-display text-xl font-extrabold">Map jald hi yahan dikhega</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}