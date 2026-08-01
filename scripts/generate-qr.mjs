import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';

const URL_TO_ENCODE = 'https://goodnoiseproject.com.au';
const OUT_DIR = path.resolve(import.meta.dirname, '../public/qr-code');
const FOREGROUND = '#1F3D2EFF';
const BACKGROUND = '#00000000'; // fully transparent

const options = {
  errorCorrectionLevel: 'Q',
  margin: 2,
  color: {
    dark: FOREGROUND,
    light: BACKGROUND,
  },
};

await mkdir(OUT_DIR, { recursive: true });

await QRCode.toFile(path.join(OUT_DIR, 'good-noise-qr.svg'), URL_TO_ENCODE, {
  ...options,
  type: 'svg',
});

await QRCode.toFile(path.join(OUT_DIR, 'good-noise-qr.png'), URL_TO_ENCODE, {
  ...options,
  type: 'png',
  width: 1200,
});

console.log('QR codes written to', OUT_DIR);
