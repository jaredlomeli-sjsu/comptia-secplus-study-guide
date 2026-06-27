# Claude Code Prompt: Interactive Dell Inspiron 15 5000 Internal Layout Diagram

Copy everything below the `---` line into Claude Code. Replace the bracketed values in **Step 0** before you run it.

---

You are building an **interactive, click-to-reveal HTML/SVG diagram** of the internal component layout of a specific Dell Inspiron 15 5000 series laptop, viewed from above with the bottom (back) panel removed. The output is a single self-contained `index.html` file I can open in a browser as a hands-on reassembly reference.

## Step 0 — Identify the exact sub-model from the Service Tag

The user does not know the model number. You must look it up.

- **Service Tag (S/N):** `5Y6XDP2`
- **Year:** `2018`
- **Series:** Dell Inspiron 15 5000

**Your first action** is to resolve this Service Tag to an exact model number (likely a 2018-era variant such as 5570, 5575, or 5580 — do not assume, verify). Do this by either:

1. Fetching `https://www.dell.com/support/home/en-us/product-support/servicetag/5Y6XDP2/overview` and reading the resolved product page, OR
2. Fetching `https://www.dell.com/support/home/en-us/product-support/servicetag/5Y6XDP2/drivers` and reading the model name from the page header.

Once the exact sub-model is confirmed, **state it back to me explicitly** ("Service Tag 5Y6XDP2 resolves to Inspiron 15 XXXX") and then **fetch and read the official Dell Service Manual** for that exact sub-model from `https://www.dell.com/support/manuals`. Use the "Removing the base cover" and subsequent component-removal sections as your ground truth for:

1. Component positions relative to the chassis (top-left, mid-bottom, etc.)
2. Component shapes and approximate proportions
3. Cable routing and connector locations
4. Component names as Dell labels them

If either the Service Tag lookup OR the service manual is not retrievable, **stop and tell me** — do not guess the sub-model and do not invent a layout.

## Step 1 — Components to include

Render and make clickable each of the following. Use the exact set Dell documents for this sub-model; omit any that don't apply and note the omission.

**Major components**
- Battery (3-cell or 4-cell — match the sub-model)
- Motherboard (system board)
- RAM modules (SO-DIMM slots — show both even if one is empty)
- M.2 SSD (and 2.5" HDD bay if present)
- WLAN / WiFi card (M.2)
- CPU/GPU heatsink + heatpipe assembly
- Cooling fan
- Left and right speakers
- Coin-cell (CMOS) battery
- I/O daughterboard (if separate from main board)
- Power button board (if separate)
- Touchpad (visible from underside)

**Connectors & cables — render as colored lines with labeled endpoints**
- Battery connector (to motherboard)
- Display / eDP cable (to motherboard)
- Keyboard ribbon cable
- Touchpad ribbon cable
- Speaker cable
- I/O board ribbon cable
- WLAN antenna cables (typically black + white/grey, labeled MAIN/AUX)
- Fan power connector
- Power button cable

## Step 2 — Visual & layout requirements

- **Single file:** one `index.html` with inline `<style>` and `<script>`. No external JS frameworks. No build step. Use vanilla JS + inline SVG.
- **Top-down chassis view.** SVG `viewBox` proportioned to the actual chassis aspect ratio of the sub-model (roughly 380mm × 260mm for 15.6"). Front of laptop (touchpad/palmrest side) at the bottom of the SVG, hinge side at top.
- **Coordinate-accurate placement.** Position each component to match the service manual's exploded-view diagram. Don't just dump rectangles in a row — get the relative positions right (e.g. battery occupies the front, motherboard sits across the hinge edge, fan sits top-right or top-left depending on sub-model).
- **Color code by function:**
  - Power (battery, power button, coin cell) → amber
  - Compute (motherboard, RAM, CPU heatsink) → blue
  - Storage (SSD, HDD) → green
  - Wireless (WLAN, antennas) → purple
  - Thermal (fan, heatpipe) → red
  - Audio (speakers) → teal
  - Cables/connectors → thin orange lines with small circles at connector endpoints
- **Hover state:** component lifts (subtle drop shadow) and shows its short name as a tooltip.
- **Click state:** opens a right-side detail panel (slide-in) that stays open until dismissed or another component is clicked.

## Step 3 — Data model

Define an array `COMPONENTS` at the top of the script. Each entry:

```js
{
  id: "battery",
  label: "3-cell 42 Wh battery",
  category: "power",
  shape: "rect",            // or "polygon" for non-rectangular
  geometry: { x, y, w, h }, // or { points: "x1,y1 x2,y2 ..." }
  function: "Primary power source when unplugged. Powers the system board via the battery connector.",
  removalNotes: [
    "Disconnect the battery cable from the system board FIRST, before any other component work.",
    "Remove the 4× M2x3 screws securing the battery to the palmrest assembly.",
    "Lift from the front edge; do not pry near the cells."
  ],
  screws: [
    { type: "M2x3", count: 4 }
  ],
  warnings: [
    "Puncturing a Li-ion cell can cause thermal runaway. Use plastic spudgers only."
  ],
  manualSection: "Removing the battery (p. XX)"
}
```

Define a parallel `CABLES` array for connectors:

```js
{
  id: "edp",
  label: "Display (eDP) cable",
  from: { component: "motherboard", x, y },
  to: { component: "display-hinge", x, y },
  routing: [[x1,y1],[x2,y2],...], // polyline points
  notes: "Lift the small black retention flap on the ZIF connector before pulling. Do not yank."
}
```

## Step 4 — Interaction & UI

- **Layout:** SVG on the left (responsive, max 70% width), detail panel on the right (30%, scrollable).
- **Detail panel** shows, in this order: large label, category badge, "Function", "Removal notes" (numbered list), "Screws" (table), "Warnings" (red callout if present), "Manual section" reference.
- **Top toolbar:**
  - Toggle: "Show cables" (on by default)
  - Toggle: "Show screw map" (off by default — when on, overlay small dots colored by screw type with a legend)
  - Filter chips by category (Power / Compute / Storage / Wireless / Thermal / Audio) — clicking dims others to 25% opacity
  - "Reset" button
- **Keyboard:** `Esc` closes the panel. `Tab` cycles components. `Enter` opens the focused component.
- **Accessibility:** every interactive SVG element has `role="button"`, `tabindex="0"`, `aria-label`, and visible focus ring.
- **Print stylesheet:** when printed, render all labels inline next to components (no hidden tooltips), hide the detail panel, fit to one landscape page.

## Step 5 — Style

- Clean, technical, schematic feel. Think iFixit teardown crossed with a circuit diagram.
- Neutral grey chassis outline with a 2px stroke and rounded corners.
- Sans-serif system font stack.
- Subtle grid background (10mm spacing) at 10% opacity so I can gauge sizes.
- Dark mode toggle in the top-right that swaps to a dark chassis with desaturated component colors.

## Step 6 — Verification step (do not skip)

After generating the file, **open it in a headless check** (or describe step-by-step what a user would see) and verify:

1. Every component in the manual's exploded view is present in `COMPONENTS`.
2. No two components overlap unless the manual shows them stacked (e.g. heatsink over CPU).
3. Every cable's `from` and `to` reference real component IDs.
4. The keyboard and screen-reader flows work (announce the first three components as a sanity check).
5. The print layout fits on one landscape page.

If any check fails, fix it before declaring done.

## Step 7 — Deliverables

- `index.html` — the diagram.
- `README.md` — lists the source service manual URL, the sub-model confirmed, and a one-line note for each component explaining where on the chassis it sits ("front-left", "under heatsink", etc.) so I can cross-check against my actual disassembled laptop.
- A short **"Reassembly quick-reference"** block at the bottom of the README listing the recommended reattachment order (cables-then-screws, battery cable LAST).

Begin with Step 0. Resolve Service Tag **5Y6XDP2** to a concrete model number, quote the service manual URL you'll use, and wait for nothing — proceed straight to generating the code once both are confirmed.
