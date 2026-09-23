import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-of-purchase")({
  beforeLoad: () => {
    throw redirect({ to: "/information/terms-of-purchase" });
  },
});
