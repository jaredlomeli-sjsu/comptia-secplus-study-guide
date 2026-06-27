# Claude Code Prompt #2: Apply Photorealistic Imaging to the Inspiron 15 5000 Diagram

Run this **after** the first prompt has produced a working schematic `index.html`. This pass replaces the flat schematic with realistic-looking component renders while preserving every interactive behavior.

---

You previously generated `index.html` — an interactive schematic of the internal layout of the Dell Inspiron 15 (Service Tag **5Y6XDP2**, 2018) with the bottom panel removed. The schematic is functional but cartoony: flat colored rectangles for components, simple polylines for cables.

Your job now is to **upgrade the visuals to look like a real photograph of the opened laptop**, while keeping every interaction, ID, and data structure from the previous build intact. Do not break the click-to-reveal panel, the toolbar, the keyboard nav, or the print stylesheet.

## Step 0 — Read what you already built

Open `index.html` and load the `COMPONENTS` and `CABLES` arrays into memory. Every existing `id`, `geometry`, `category`, and detail-panel field must survive this pass unchanged. You are only altering **how each component is rendered**, not what it is.

## Step 1 — Sourcing realistic imagery (pick ONE strategy, in this order of preference)

**Strategy A — Reference photos from the official Dell Service Manual (preferred).**
Re-fetch the service manual you used in the first pass. The component-removal sections contain real top-down photographs of each part on the chassis. For each component:

1. Extract the photo of that part from the relevant manual page.
2. Save it to `./assets/components/<id>.png` (e.g. `battery.png`, `motherboard.png`).
3. Crop tight to the component outline, transparent background.

**Strategy B — iFixit teardown imagery as fallback.**
If a manual photo is missing or unusable, search `https://www.ifixit.com` for a teardown of the same sub-model. Use the highest-resolution component photo available. Cite the source URL in `README.md`.

**Strategy C — Procedural realism in pure SVG (fallback if no images are usable).**
For any component still without a photo, build it from layered SVG with realistic materials:

- **PCB (motherboard, daughterboards):** dark green base `#0a3d1f`, slightly noisy with a subtle SVG `<filter>` turbulence, copper traces as thin gold lines, silver solder pads, black square ICs with tiny printed text, gold edge connectors.
- **Battery cells:** matte black `#1a1a1a` with subtle rounded highlight, "Li-ion" text in light grey, copper tabs at the connector end.
- **Heatsink + heatpipe:** brushed copper gradient (`#b87333` → `#d49a5c`), thin parallel fin lines, dull silver thermal-paste blob at the CPU contact point.
- **Cooling fan:** dark grey housing, visible curved blades through a circular cutout, faint motion blur.
- **RAM sticks:** green PCB strip with eight black chip rectangles per side and a gold edge connector along the bottom.
- **M.2 SSD:** small green PCB with two or four NAND chips and a controller IC, gold M-key connector.
- **WLAN card:** tiny green PCB with two gold antenna contact points (U.FL connectors).
- **Speakers:** matte black rectangular module with a copper voice-coil circle visible behind a fine mesh pattern.
- **Coin-cell battery:** brushed silver circle with `+` etched on top.
- **Ribbon cables:** semi-translucent amber/tan flat strip with thin parallel conductor lines, a stiffer blue or white stiffener at each connector end.
- **Coaxial WLAN antenna cables:** thin black or grey wire with a small gold U.FL connector circle at each end.

All procedural components must use SVG `<defs>` with reusable gradients, patterns, and filters — no rasterization.

## Step 2 — Chassis backdrop

The chassis itself should also feel real:

- Replace the neutral grey rectangle with a **magnesium-alloy palmrest texture**: light grey base `#cfd2d6` with a faint horizontal brushed-metal pattern via `<filter feTurbulence>` + `feColorMatrix`.
- Add subtle drop shadows around the chassis edge (`feGaussianBlur` filter) so it looks like it's sitting on a desk.
- Add a soft top-left lighting gradient overlay across the whole chassis so components have consistent virtual lighting (highlights top-left, shadows bottom-right). All component renders should respect this lighting direction.
- Show the bottom-cover screw holes as small dark circles around the perimeter (use the service manual screw map).

## Step 3 — Cables, rendered for real

Replace the simple polylines with cables that look like the real thing:

- **Ribbon cables:** render as a `<path>` with a wide stroke for the cable body (amber `#e6c46a`), a thinner darker stroke on top for the conductor lines, and a small rectangular stiffener at each endpoint.
- **Wire bundles** (speaker, battery, fan power): render as a single wire with a slight curved bezier path, color matched to function (red+black twisted for power, grey for signal), drop a small connector block at each endpoint.
- **WLAN antenna coax:** thin charcoal lines with a tiny gold dot at each U.FL connection point.
- Cables cast a faint shadow on the components beneath them.

## Step 4 — Keep every interaction intact (regression check)

After re-rendering, confirm:

1. Clicking any photographic/procedural component still opens the same detail panel with the same data.
2. The "Show cables" toggle still hides/shows the new realistic cables.
3. The "Show screw map" overlay still works on top of the new chassis backdrop.
4. Category filter chips still dim non-matching components to 25% opacity (apply this via a top-level `<g>` `opacity` attribute, not by re-coloring).
5. Keyboard nav (`Tab`/`Enter`/`Esc`) and `aria-label`s still work.
6. The print stylesheet still produces a one-page landscape layout — but now with the realistic visuals, not the flat schematic.

## Step 5 — Add a "Schematic ↔ Realistic" toggle

Add a new toolbar toggle at the top: **"Realistic view / Schematic view"**.

- Default: Realistic view (this new render).
- Toggling switches to the original flat-color schematic (keep the old render available in a sibling `<g id="schematic-layer">` hidden by default).
- Persist the choice in `localStorage` so it survives reloads.

This matters because the schematic is easier to read at a glance, and the realistic view is better for matching what I'm actually looking at on my desk.

## Step 6 — Quality bar

The realistic view should pass this test: **if I hold my phone camera over my actually-disassembled laptop, the diagram on screen should resemble it closely enough that I can identify each part by sight alone, without needing to read the labels.**

- Component shapes must match real silhouettes (not just rectangles for everything).
- Component sizes must be proportional to each other and to the chassis.
- Colors and materials must match real life (PCB green, copper heatpipe, black battery, silver fan housing).
- Cables must route through real paths (around components, not through them).

## Step 7 — Deliverables

- Updated `index.html` with both layers (realistic + schematic).
- `./assets/components/*.png` — any photo assets sourced from the service manual or iFixit, each with a source URL in a sibling `*.json` file.
- Updated `README.md` adding:
  - A "Realistic view sources" section listing every image's origin URL.
  - A short note on which components are photo-based and which are procedural SVG.
  - A note confirming the regression checks in Step 4 all passed.

Begin by loading the existing `index.html`, summarizing the current `COMPONENTS` array, and stating which sourcing strategy you'll use for each component before generating code.
