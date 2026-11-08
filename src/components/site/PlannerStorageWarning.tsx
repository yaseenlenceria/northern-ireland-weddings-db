export function PlannerStorageWarning({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <p role="status" className="mb-4 rounded-lg border border-border bg-muted p-3 text-sm">
      Your browser could not save these changes. Keep this page open and copy your plan before
      leaving.
    </p>
  );
}
