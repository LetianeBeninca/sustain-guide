# Sustain Guide

A free home comfort and energy check-up for people who are not building professionals.

You enter the city, a few facts about the home and the appliances you use. The app combines the real local climate with your estimated consumption and explains, in plain language, what is worth improving first, with passive design measures ahead of equipment.

Available in Portuguese, Spanish and English.

## How it works

1. **Climate by city.** City search and five years of daily weather data come from [Open-Meteo](https://open-meteo.com/) (no API key). The app computes monthly averages, heating degree days (base 18 °C), cooling degree days (base 22 °C), hot and cold days, rain and solar radiation.
2. **Home and appliances.** A short form about the home, plus an appliance list with editable typical values. Yearly consumption is `power × hours × months` or `kWh per use × uses per week`.
3. **Report.** A serverless function sends the summary to Claude (Anthropic API), which writes the report in the user's language. If the AI is not available (no key, no credits, rate limit), the app shows a rule-based report instead, so it always returns a result.
4. **PDF.** The report can be downloaded as a PDF.

The numbers are indicative estimates. They do not replace an energy certificate or a professional visit.

## Run locally

```sh
npm install
npm run dev
```

The app opens at http://localhost:8080. With `npm run dev` only the front end runs, so the report is the rule-based one. To test the AI report locally, use the Vercel CLI:

```sh
npm i -g vercel
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY
vercel dev
```

## Deploy (Vercel)

1. Import this repository at https://vercel.com/new. The settings in `vercel.json` are picked up automatically.
2. In **Settings > Environment Variables**, add `ANTHROPIC_API_KEY`. Optionally add `ANTHROPIC_MODEL` (default: `claude-sonnet-5-5`).
3. Redeploy. Every push to `main` publishes a new version.

The API key stays on the server and is never sent to the browser. The function limits request size and requests per IP on a best-effort basis; set a spend limit in the Anthropic Console as the real ceiling.

## Project structure

```
api/diagnose.js           serverless function that calls Claude
src/lib/climate.ts        Open-Meteo search and climate summary
src/lib/appliances.ts     appliance catalogue and kWh calculation
src/lib/report.ts         AI request and rule-based fallback report
src/lib/pdf.ts            PDF export
src/locales/              pt, es, en texts
src/components/           form steps, climate card, results
```

## Stack

Vite, React, TypeScript, Tailwind CSS, shadcn/ui, Recharts, jsPDF, Vercel Functions, Anthropic API.

## Author

Letiane Benincá, architect and researcher in building energy performance. The first prototype was created in Lovable and then rebuilt with Claude Code.
