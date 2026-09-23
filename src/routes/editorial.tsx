import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/editorial")({
  beforeLoad: () => {
    throw redirect({ to: "/information/editorial-team" });
  },
});
