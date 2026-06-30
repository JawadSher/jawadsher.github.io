# Contributing

This is a personal portfolio project, so changes should stay focused on the portfolio's content, build setup, accessibility, and deployment reliability.

## Local Workflow

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Before opening a pull request, run:

```bash
npm run lint
npm run prettier
npm run build
```

## Guidelines

- Keep portfolio data in `src/config/portfolio.ts`.
- Keep UI primitives compatible with shadcn/ui conventions.
- Preserve GitHub Pages static export support.
- Avoid adding dependencies unless they clearly improve maintainability or user experience.
- Keep visual changes responsive across mobile and desktop.
