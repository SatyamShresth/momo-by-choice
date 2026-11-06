import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { AlertTriangle, Download, Printer } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import * as admin from "../../services/adminService.js";
import Button from "../../components/ui/Button.jsx";
import MomoIcon from "../../components/ui/MomoIcon.jsx";

const parseOrigin = (value) => {
  try {
    const u = new URL(value.trim());
    return ["http:", "https:"].includes(u.protocol) ? u : null;
  } catch {
    return null;
  }
};

const isLocalHost = (host) =>
  host === "localhost" || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host);

function QrCard({ qr, name, url, big }) {
  return (
    <div
      className={`flex break-inside-avoid flex-col items-center justify-between gap-4 rounded-3xl border-4 border-cocoa-900 bg-white p-5 text-center ${
        big ? "print:h-[250mm]" : "print:h-[125mm]"
      }`}
    >
      <div className="w-full rounded-2xl bg-chili px-3 py-3 text-cream">
        <MomoIcon className="mx-auto h-10 w-10 text-spice" />
        <p className="mt-1 font-display text-2xl font-extrabold">{name}</p>
      </div>
      <p className="font-display text-xl font-extrabold text-cocoa-900">Scan karo, menu dekho!</p>
      {qr && <img src={qr} alt={`QR code for ${name} menu`} className={big ? "w-72 print:w-[130mm]" : "w-44 print:w-[65mm]"} />}
      <p className="break-all text-xs text-ink/60">{url}</p>
    </div>
  );
}

export default function AdminQr() {
  const { token, logout } = useAuth();
  const [name, setName] = useState("Momo by Choice");
  const [siteInput, setSiteInput] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [qr, setQr] = useState("");
  const [sheet, setSheet] = useState("1"); // "1" ya "4" per page

  useEffect(() => {
    admin
      .getAdminSettings(token)
      .then((d) => {
        setName(d.settings.name);
        setSavedUrl(d.settings.siteUrl);
        setSiteInput(d.settings.siteUrl || window.location.origin);
      })
      .catch((err) => {
        if (err.status === 401) return logout();
        setSiteInput(window.location.origin);
      })
      .finally(() => setLoaded(true));
  }, [token, logout]);

  const parsed = useMemo(() => parseOrigin(siteInput), [siteInput]);
  const menuUrl = parsed ? `${parsed.origin}/menu` : "";
  const local = parsed ? isLocalHost(parsed.hostname) : false;
  const insecure = parsed ? parsed.protocol !== "https:" && !local : false;

  useEffect(() => {
    if (!menuUrl) {
      setQr("");
      return;
    }
    let off = false;
    QRCode.toDataURL(menuUrl, {
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#34100B", light: "#FFFFFF" },
    })
      .then((u) => !off && setQr(u))
      .catch(() => !off && setQr(""));
    return () => {
      off = true;
    };
  }, [menuUrl]);

  const download = () => {
    const a = document.createElement("a");
    a.href = qr;
    a.download = "momo-by-choice-menu-qr.png";
    a.click();
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-2xl border-2 border-cocoa-900 bg-white p-6 shadow-pop print:hidden" aria-label="QR settings">
        <h2 className="text-xl">Menu QR code</h2>
        <p className="text-sm text-ink/70">
          Ek hi QR sab tables ke liye. Scan karte hi customer ka phone seedha menu kholta hai.
        </p>

        <div>
          <label htmlFor="qr-site" className="mb-1 block text-sm font-bold">Website URL</label>
          <input
            id="qr-site"
            type="url"
            value={siteInput}
            onChange={(e) => setSiteInput(e.target.value)}
            disabled={!loaded}
            className="w-full rounded-xl border-2 border-cocoa-900 bg-white px-4 py-2.5 text-sm outline-none focus:border-chili"
          />
          <p className="mt-1 text-xs text-ink/60">
            {savedUrl
              ? "Settings se aaya hua URL hai."
              : <>Abhi save nahi hai. Permanent karne ke liye <Link to="/admin/settings" className="font-bold text-chili underline">Settings</Link> mein "Website URL" bharein.</>}
          </p>
        </div>

        {!parsed && <p className="text-sm font-bold text-chili" role="alert">Sahi URL likhein (https://...).</p>}

        {parsed && local && (
          <div className="flex gap-2 rounded-xl border-2 border-chili bg-chili/10 p-3 text-sm" role="alert">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chili" aria-hidden="true" />
            <p><span className="font-bold">Ye URL sirf aapke apne network par chalega.</span> Customer ke phone par ye QR nahi khulega. Deploy ke baad asli website URL se QR dobara banayein aur print karein.</p>
          </div>
        )}
        {parsed && insecure && (
          <p className="text-sm font-bold text-chili" role="alert">Is URL par https nahi hai. Asli website https par honi chahiye.</p>
        )}

        {menuUrl && <p className="text-sm">QR ye kholega: <span className="break-all font-bold">{menuUrl}</span></p>}

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={download} disabled={!qr} className="disabled:opacity-50">
            <Download className="h-4 w-4" aria-hidden="true" /> PNG download
          </Button>
          <Button variant="dark" onClick={() => window.print()} disabled={!qr} className="disabled:opacity-50">
            <Printer className="h-4 w-4" aria-hidden="true" /> Print sheet
          </Button>
          <div role="group" aria-label="Page layout" className="flex gap-2 text-sm font-bold">
            {[
              { v: "1", label: "1 per page" },
              { v: "4", label: "4 per page" },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                aria-pressed={sheet === o.v}
                onClick={() => setSheet(o.v)}
                className={`rounded-full border-2 border-cocoa-900 px-3 py-1 ${sheet === o.v ? "bg-cocoa-900 text-cream" : "bg-white hover:bg-spice/40"}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-ink/60">Print dialog mein "Background graphics" on rakhein, taaki laal header chhape.</p>
      </section>

      {qr ? (
        <div
          className={`print-area grid gap-4 ${
            sheet === "4" ? "grid-cols-2" : "mx-auto max-w-md grid-cols-1 print:max-w-none"
          }`}
        >
          {Array.from({ length: sheet === "4" ? 4 : 1 }, (_, i) => (
            <QrCard key={i} qr={qr} name={name} url={menuUrl} big={sheet === "1"} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-ink/60 print:hidden">Sahi URL daalne par QR yahan dikhega.</p>
      )}
    </div>
  );
}