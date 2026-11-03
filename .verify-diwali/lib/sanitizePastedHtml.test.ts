import assert from 'node:assert/strict';
import test from 'node:test';
import { filesFromClipboard } from './bulkEmailAttachments.ts';
import { normalizeClipboardHtml, plainTextToHtml } from './sanitizePastedHtml.ts';

test('plain text paste keeps paragraphs and line breaks', () => {
  const html = plainTextToHtml('Hello\nthere\n\n\n\nNext paragraph');
  assert.equal(html, '<p>Hello<br>there</p><p>Next paragraph</p>');
});

test('plain text paste escapes html tags', () => {
  const html = plainTextToHtml('<script>alert(1)</script>');
  assert.equal(html.includes('<script>'), false);
  assert.match(html, /&lt;script&gt;/);
});

test('word clipboard html keeps the copied fragment', () => {
  const raw = 'Version:1.0\nStartHTML:0\n<html><body><!--StartFragment--><p><b>Hello</b></p><!--EndFragment--></body></html>';
  assert.equal(normalizeClipboardHtml(raw), '<p><b>Hello</b></p>');
});

test('copied files are read from the clipboard file list', () => {
  const copied = new File([new Uint8Array([1, 2, 3])], 'agenda.pdf', { type: 'application/pdf' });
  const files = filesFromClipboard({ files: [copied], items: [] } as unknown as DataTransfer);
  assert.deepEqual(files.map((file) => file.name), ['agenda.pdf']);
});

test('a pasted image without a filename gets a usable name', () => {
  const copied = new File([new Uint8Array([1, 2, 3])], '', { type: 'image/png' });
  const files = filesFromClipboard({ files: [copied], items: [] } as unknown as DataTransfer);
  assert.equal(files[0]?.name, 'pasted-file.png');
});
