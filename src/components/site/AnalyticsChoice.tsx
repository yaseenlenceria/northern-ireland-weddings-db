import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const KEY = "wedhq-analytics-consent";

export function AnalyticsChoice() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const choice = localStorage.getItem(KEY);
      setVisible(choice !== "granted" && choice !== "denied");
    } catch {
      setVisible(true);
    }
    setReady(true);
  }, []);

  const choose = (allowed: boolean) => {
    let previouslyGranted = false;
    try {
      previouslyGranted = localStorage.getItem(KEY) === "granted";
      localStorage.setItem(KEY, allowed ? "granted" : "denied");
    } catch {
      // A visitor can make a choice for this page even if storage is blocked.
    }
    window.dispatchEvent(new CustomEvent("wedhq-analytics-consent", { detail: allowed }));
    setVisible(false);
    if (!allowed && previouslyGranted) window.location.reload();
  };

  if (!ready) return null;
  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        className="fixed bottom-3 left-3 z-50 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-soft"
      >
        Cookie settings
      </button>
    );
  }
  return (
    <section
      aria-label="Analytics preferences"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-xl border border-border bg-card p-5 shadow-lift"
    >
      <h2 className="text-lg font-semibold">Help us improve WedHQ</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        May we use Microsoft Clarity for heatmaps and session recordings to understand how the site
        is used? Optional analytics stays off unless you accept.{" "}
        <Link to="/information/cookies" className="underline">
          Cookie notice
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => choose(false)}>
          Reject analytics
        </Button>
        <Button onClick={() => choose(true)}>Accept analytics</Button>
      </div>
    </section>
  );
}
