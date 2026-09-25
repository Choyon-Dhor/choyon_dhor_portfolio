import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
export const serverRoot = path.resolve(currentDirectory, '..', '..');
export const uploadsDirectory = path.join(serverRoot, 'uploads');
