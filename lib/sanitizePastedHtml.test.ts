import assert from 'node:assert/strict';
import test from 'node:test';
import { filesFromClipboard } from './bulkEmailAttachments.ts';
import { autolinkRange, linkifyPlainText, normalizeClipboardHtml, plainTextToHtml } from './sanitizePastedHtml.ts';

test('plain text paste keeps paragraphs and line breaks', () => {
  const html = plainTextToHtml('Hello\nthere\n\n\n\nNext paragraph');
  assert.equal(html, '<p>Hello<br>there</p><p>Next paragraph</p>');
});

test('pasting a url produces a clickable link', () => {
  const html = plainTextToHtml('https://amagopalpur.org/');
  assert.equal(
    html,
    '<p><a href="https://amagopalpur.org/">https://amagopalpur.org/</a></p>'
  );
});

test('www addresses use an https destination and keep their visible text', () => {
  const html = linkifyPlainText('Visit www.example.com.');
  assert.equal(
    html,
    'Visit <a href="https://www.example.com">www.example.com</a>.'
  );
});

test('trailing punctuation stays outside the link', () => {
  const html = linkifyPlainText('See https://amagopalpur.org/, then reply.');
  assert.match(html, /href="https:\/\/amagopalpur.org\/"/);
  assert.equal(html.includes('href="https://amagopalpur.org/,"'), false);
  assert.match(html, /<\/a>,/);
});

test('unsafe schemes are not linkified', () => {
  const html = linkifyPlainText('javascript:alert(1)');
  assert.equal(html.includes('<a'), false);
  assert.equal(html.includes('href='), false);
});

test('a typed url before a space is ready to link', () => {
  const found = autolinkRange('Join https://amagopalpur.org/ ');
  assert.equal(found?.url, 'https://amagopalpur.org/');
  assert.equal(found?.href, 'https://amagopalpur.org/');
  assert.equal(found?.end, 'Join https://amagopalpur.org/'.length);
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
