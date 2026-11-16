import jsPDF from 'jspdf';
import { ClimateSummary } from './climate';
import { ConsumptionSummary } from './appliances';
import { Report } from './home';
import { Lang, formatNumber, monthName, translate } from './i18n';

// The built-in PDF fonts only cover Latin-1. Replace the few common characters
// outside it and drop anything else that cannot be drawn.
function safe(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/→/g, '->')
    .replace(/€/g, 'EUR')
    .replace(/[^\n\t -ÿ]/g, '');
}

export interface PdfInput {
  lang: Lang;
  title: string;
  subtitle: string;
  report: Report;
  climate: ClimateSummary;
  consumption: ConsumptionSummary;
  costLine: string | null;
}

export function exportReportPdf(input: PdfInput): void {
  const { lang, report, climate, consumption } = input;
  const t = (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const width = pageWidth - margin * 2;
  let y = 20;

  const ensure = (space: number) => {
    if (y + space > pageHeight - 18) {
      doc.addPage();
      y = 20;
    }
  };

  const paragraph = (text: string, size = 10.5, style: 'normal' | 'bold' | 'italic' = 'normal', indent = 0, gap = 3) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    const lineHeight = size * 0.48;
    const lines = doc.splitTextToSize(safe(text), width - indent) as string[];
    lines.forEach((line) => {
      ensure(lineHeight);
      doc.text(line, margin + indent, y);
      y += lineHeight;
    });
    y += gap;
  };

  const heading = (text: string) => {
    y += 3;
    ensure(16);
    doc.setTextColor(5, 110, 80);
    paragraph(text, 13, 'bold', 0, 2);
    doc.setTextColor(20, 20, 20);
  };

  doc.setTextColor(20, 20, 20);
  paragraph(`${t('app.name')} · ${input.title}`, 18, 'bold', 0, 2);
  paragraph(input.subtitle, 11, 'normal', 0, 1);
  doc.setTextColor(110, 110, 110);
  paragraph(
    `${t('res.generated', { date: new Date().toLocaleDateString(lang) })} · ${t(report.source === 'ai' ? 'res.ai' : 'res.rules')}`,
    9,
  );
  doc.setTextColor(20, 20, 20);

  heading(t('res.summary'));
  paragraph(report.summary);

  heading(t('res.climate'));
  paragraph(report.climateReading);
  paragraph(
    [
      `${t('climate.annualMean')}: ${formatNumber(lang, climate.annualMean, 1)} °C`,
      `${t('climate.hottest')}: ${monthName(lang, climate.hottestMonth)}`,
      `${t('climate.coldest')}: ${monthName(lang, climate.coldestMonth)}`,
      `${t('climate.hotDays')}: ${climate.hotDays}`,
      `${t('climate.coldDays')}: ${climate.coldDays}`,
      `${t('climate.rain')}: ${formatNumber(lang, climate.annualPrecip)} mm`,
      `${t('climate.sun')}: ${formatNumber(lang, climate.solarAnnual)} kWh/m²`,
    ].join('  |  '),
    9,
  );

  heading(t('res.priorities'));
  report.priorities.forEach((p, i) => {
    ensure(22);
    paragraph(`${i + 1}. ${p.title}  (${t('res.cost')}: ${t(`cost.${p.cost}`)})`, 11, 'bold', 0, 1.5);
    paragraph(`${t('res.why')}: ${p.why}`, 10.5, 'normal', 5, 1.5);
    paragraph(`${t('res.how')}: ${p.how}`, 10.5, 'normal', 5, 4);
  });

  if (consumption.rows.length) {
    heading(t('res.consumption'));
    let totals = `${t('res.totalYear')}: ${formatNumber(lang, consumption.totalKwh)} kWh`;
    if (consumption.kwhPerM2 != null) totals += `  |  ${t('res.perM2')}: ${formatNumber(lang, consumption.kwhPerM2)} kWh/m²`;
    if (input.costLine) totals += `  |  ${t('res.costYear')}: ${input.costLine}`;
    paragraph(totals, 10.5, 'bold');
    consumption.rows.forEach((r) => {
      const qty = r.quantity > 1 ? ` (x${r.quantity})` : '';
      paragraph(
        `${t(`a.${r.typeId}`)}${qty}: ${formatNumber(lang, r.kwh)} kWh · ${Math.round(r.share * 100)}%`,
        10,
        'normal',
        5,
        1,
      );
    });
    y += 2;
  }

  heading(t('res.appliances'));
  report.appliances.forEach((line) => paragraph(`- ${line}`, 10.5, 'normal', 0, 1.5));

  heading(t('res.quick'));
  report.quickWins.forEach((line) => paragraph(`- ${line}`, 10.5, 'normal', 0, 1.5));

  y += 4;
  doc.setTextColor(110, 110, 110);
  paragraph(t('res.assumptions'), 8.5, 'italic', 0, 2);
  paragraph(t('footer.text'), 8.5, 'italic');

  doc.save('sustain-guide.pdf');
}
