#!/usr/bin/env python3
"""Sync M4 consolidated sidebar from tela30 to tela01..tela29."""
import re
from pathlib import Path

ROOT = Path("/Users/dia1dms/Downloads/dms-mockups")
SOURCE = ROOT / "tela30-empresas-list.html"

# Extract the M4 sidebar block from tela30: from start marker through </script> just before </body>.
src = SOURCE.read_text(encoding="utf-8")
m = re.search(
    r"(<!-- ===== DMS CONSOLIDATED SIDEBAR \(M4\) ===== -->.*?</script>)\s*</body>",
    src,
    flags=re.DOTALL,
)
if not m:
    raise SystemExit("M4 block not found in tela30")
M4_BLOCK = m.group(1)

# Pattern that matches any legacy sidebar comment marker (CONSOLIDATED or COLLAPSIBLE).
LEGACY_RE = re.compile(
    r"<!-- ===== DMS (CONSOLIDATED|COLLAPSIBLE) SIDEBAR[^>]*===== -->.*?</script>"
    r"(?:\s*<!-- ===== END DMS[^>]*===== -->)?\s*(?=</body>)",
    flags=re.DOTALL,
)

targets = sorted(ROOT.glob("tela[0-2][0-9]-*.html"))
targets = [p for p in targets if not p.name.startswith("tela30") and int(p.name[4:6]) < 30]

changed = []
skipped = []
for p in targets:
    txt = p.read_text(encoding="utf-8")
    new_txt, n = LEGACY_RE.subn(M4_BLOCK + "\n", txt, count=1)
    if n == 0:
        skipped.append(p.name)
        continue
    p.write_text(new_txt, encoding="utf-8")
    changed.append(p.name)

print(f"Changed: {len(changed)}")
for n in changed:
    print(f"  {n}")
if skipped:
    print(f"Skipped (no legacy marker): {len(skipped)}")
    for n in skipped:
        print(f"  {n}")
