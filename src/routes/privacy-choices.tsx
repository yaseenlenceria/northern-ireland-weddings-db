import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-choices")({
  beforeLoad: () => {
    throw redirect({ to: "/information/your-privacy-choices" });
  },
});
