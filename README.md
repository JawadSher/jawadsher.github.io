# Jawad Sher Portfolio

A personal portfolio built with Next.js 16, TypeScript, Tailwind CSS, shadcn/ui-style components, and lucide-react icons. The app is configured for static export so it can be deployed directly to GitHub Pages.

## Tech Stack

- Next.js App Router with static export
- TypeScript
- Tailwind CSS
- shadcn/ui component conventions
- lucide-react icons
- GitHub Pages deployment through GitHub Actions

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

The production export is written to `out/`.

## Project Structure

- `src/app` - Next.js routes, layout, metadata, and global styles.
- `src/components` - Portfolio sections and reusable UI components.
- `src/config/portfolio.ts` - Personal profile, skills, experience, certifications, education, and social links.
- `src/lib/utils.ts` - Shared utility helpers used by shadcn-style components.

## GitHub Pages

The repository includes a GitHub Actions workflow that builds the app and uploads the `out/` directory to GitHub Pages.

For a user or organization site such as `https://username.github.io`, no base path is needed.

For a project site such as `https://username.github.io/repository-name`, set this repository variable or workflow environment variable before building:

```bash
NEXT_PUBLIC_BASE_PATH=/repository-name
```

## Customization

Update `src/config/portfolio.ts` to change profile details, links, skills, projects, education, certifications, and resume URL. The visual design is intentionally compact for now so the next pass can focus fully on a custom UI direction.
