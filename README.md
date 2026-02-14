# Portfolio | Kevin Bermudez

Web Developer & Designer portfolio built with Next.js, TypeScript, and Tailwind CSS. Clean, minimal design inspired by [Osmo](https://www.osmo.supply/).

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Deploy on Vercel

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Portfolio ready"
   git remote add origin https://github.com/esqukev/portfolio.git
   git push -u origin master
   ```
2. [Vercel](https://vercel.com) → Add New → Project → Import `esqukev/portfolio`
3. Deploy (auto-detects Next.js)

## Structure

```
├── app/
│   ├── page.tsx      # Main page
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Styles
└── public/           # Static assets
```
