import type { RowT } from "../redux/api/gameApi";

function easeInOutPower(t: number, power = 2.5) {
  return t < 0.5
    ? 0.5 * Math.pow(2 * t, power)
    : 1 - 0.5 * Math.pow(2 * (1 - t), power);
}

export function lerpColor(color1: string, color2: string, t: number) {
  t = Math.max(0, Math.min(1, t));
  t = easeInOutPower(t, 5);

  const hexToRgb = (hex: string) => {
    hex = hex.replace('#', '');
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    '#' +
    [r, g, b]
      .map(v => Math.round(v).toString(16).padStart(2, '0'))
      .join('');

  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  return rgbToHex(
    c1.r + (c2.r - c1.r) * t,
    c1.g + (c2.g - c1.g) * t,
    c1.b + (c2.b - c1.b) * t
  );
}

export const CalcScore = (row: RowT) => {
  return (Math.round(((row.n_incl_seen / row.n_incl) / (row.n_seen / row.n_total)) * 100) )
}