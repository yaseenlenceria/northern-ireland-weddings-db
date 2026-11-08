import { spawnSync } from "node:child_process";

function run(command, args, capture = false) {
  const result = spawnSync(command, args, {
    stdio: capture ? "pipe" : "inherit",
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(capture ? result.stderr : `${command} failed (${result.status}).`);
  }
  return result.stdout?.trim() ?? "";
}

try {
  const [action, message, ...files] = process.argv.slice(2);
  if (action === "sync") {
    if (run("git", ["status", "--porcelain"], true)) {
      throw new Error("Commit or stash your local changes before syncing.");
    }
    run("git", ["pull", "--ff-only"]);
  } else if (action === "ship" && message && files.length) {
    if (run("git", ["diff", "--cached", "--name-only"], true)) {
      throw new Error("Review or unstage existing staged changes before shipping.");
    }
    run("git", ["fetch", "origin"]);
    const behind = run("git", ["rev-list", "--count", "HEAD..@{upstream}"], true);
    if (behind !== "0") throw new Error("Remote changes exist. Sync before shipping.");
    // Run the same production build before committing or pushing any files.
    run(process.execPath, [process.env.npm_execpath, "run", "build"]);
    run("git", ["add", "--", ...files]);
    run("git", ["diff", "--cached", "--check"]);
    run("git", ["commit", "-m", message]);
    run("git", ["push"]);
  } else {
    throw new Error('Use npm run sync or npm run ship -- "Commit message" path/to/file ...');
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
