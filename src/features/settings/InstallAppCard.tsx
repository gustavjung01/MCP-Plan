"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function InstallAppCard() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [message, setMessage] = useState("San sang cai nhu app tren dien thoai khi trinh duyet ho tro.");

  const platformHint = useMemo(() => {
    if (typeof navigator === "undefined") return "";
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      return "iPhone/iPad: bam Share, chon Add to Home Screen.";
    }
    return "Android/Chrome: bam Tai app neu nut kha dung, hoac menu trinh duyet -> Add to Home screen.";
  }, []);

  useEffect(() => {
    setIsStandalone(isStandaloneMode());

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setMessage("Co the cai MCP-Plan nhu app PWA tren thiet bi nay.");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function handleInstall() {
    if (isStandalone) {
      setMessage("App dang chay o che do standalone.");
      return;
    }

    if (!installPrompt) {
      setMessage(platformHint || "Trinh duyet chua mo prompt cai dat. Thu menu Add to Home screen.");
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    setMessage(choice.outcome === "accepted" ? "Da gui yeu cau cai app." : "Da huy cai app.");
  }

  async function handleRefreshApp() {
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    }

    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.update()));
    }

    window.location.reload();
  }

  return (
    <div className="card settings-card">
      <div>
        <span className="badge">PWA</span>
        <h2 className="panel-title">Tai app va cap nhat</h2>
        <p className="page-subtitle">{message}</p>
        <p className="settings-hint">{platformHint}</p>
      </div>

      <div className="settings-actions">
        <button className="button primary" onClick={handleInstall} type="button">
          Tai app
        </button>
        <button className="button" onClick={handleRefreshApp} type="button">
          Cap nhat ban moi
        </button>
      </div>
    </div>
  );
}
