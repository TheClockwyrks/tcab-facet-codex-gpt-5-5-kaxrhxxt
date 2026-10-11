# Facet

Facet is a browser puzzle game about matching cut gems under pressure. Swap
neighboring stones to make lines of three or more, then use the strain left on
nearby gems to set up larger chain reactions. Flawed gems break when a clear
touches them and score double, while four-gem, five-gem, and crossing clears
create brilliant, prism, and star cuts with stronger effects.

## Install

```sh
npm ci
```

## Run In Development

```sh
npm run dev
```

Vite serves the game locally and reloads when the source changes.

## Build

```sh
npm run build
```

The production build is written to `dist/` and can be served as a static site.
All art, particle system JSON, and audio are committed under `public/assets/`
and are copied into the build; the build does not run any asset-generation
tools.

## Checks

```sh
npm run typecheck
npm run lint
npm run format
npm test
```

## Controls

Use the mouse, pen, or touch to play the board: press a gem, drag or press onto
an orthogonal neighbor, and release to request the swap. Carrying the gem back
to its original cell cancels the offer.

Menus also support the keyboard: `ArrowUp` and `ArrowDown` move the highlight,
`Enter` or `Space` confirms, `Escape` or `P` pauses, `Escape` backs out of
screens that support back, and `M` toggles mute.
