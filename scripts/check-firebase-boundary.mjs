import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const cwd = process.cwd();
const roots = [join(cwd, "src", "presentation"), join(cwd, "src", "hooks")];

const walk = (dir) => {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!/\.(ts|tsx)$/.test(entry)) {
      continue;
    }

    const content = readFileSync(fullPath, "utf8");
    const relPath = relative(cwd, fullPath);

    // Check 1: Any import, require, or dynamic import from firebase/database.
    // Covers: named, default, namespace, type-only, side-effect, import(), require().
    // The string "firebase/database" inside quotes is sufficient to catch all shapes.
    if (/["']firebase\/database(?:\/[^"']*)?["']/.test(content)) {
      throw new Error(
        `Firebase boundary violation in ${relPath}: ` +
          `presentation/hooks must not import from firebase/database directly. ` +
          `Use src/firebase/realtimeRepository.ts instead.`
      );
    }

    // Check 2: Import of the `database` export from firebaseConfig.
    // Covers: import { database } from ".../firebaseConfig"
    //         import { database as rtdb } from ".../firebaseConfig"
    if (
      /import\s+(?:type\s+)?\{[^}]*\bdatabase\b[^}]*\}\s+from\s+["'][^"']*\/?firebaseConfig[^"']*["']/.test(
        content
      )
    ) {
      throw new Error(
        `Firebase boundary violation in ${relPath}: ` +
          `presentation/hooks must not import 'database' from firebaseConfig. ` +
          `Use src/firebase/realtimeRepository.ts instead.`
      );
    }
  }
};

for (const root of roots) {
  walk(root);
}

console.log("Firebase boundary guard passed.");
