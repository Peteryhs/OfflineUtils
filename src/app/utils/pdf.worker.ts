import { GlobalWorkerOptions } from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}