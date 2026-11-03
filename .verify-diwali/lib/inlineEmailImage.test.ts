import assert from 'node:assert/strict';
import test from 'node:test';
import { clipboardFileKind, imagePasteError, inlineImageMarkup, isSafeInlineImageSource } from './inlineEmailImage.ts';

function imageFile(name: string, type: string, bytes = [1, 2, 3]): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

test('clipboard image files are inserted instead of attached', () => {
  assert.equal(clipboardFileKind(imageFile('shot.png', 'image/png')), 'inline');
  assert.equal(clipboardFileKind(imageFile('photo.jpg', 'image/jpeg')), 'inline');
  assert.equal(clipboardFileKind(imageFile('anim.gif', 'image/gif')), 'inline');
  assert.equal(clipboardFileKind(imageFile('agenda.pdf', 'application/pdf')), 'other');
});

test('unsupported clipboard images are reported', () => {
  const file = imageFile('icon.webp', 'image/webp');
  assert.equal(clipboardFileKind(file), 'unsupported');
  assert.match(imagePasteError(file, 1024) || '', /PNG, JPEG, or GIF/);
});

test('oversized clipboard images are reported', () => {
  const file = imageFile('shot.png', 'image/png', [1, 2, 3, 4]);
  assert.match(imagePasteError(file, 3) || '', /maximum image size/);
});

test('inline image markup keeps the data url and responsive size', () => {
  const src = 'data:image/png;base64,AAAA';
  const html = inlineImageMarkup(src, 800);
  assert.equal(isSafeInlineImageSource(src), true);
  assert.match(html, /src="data:image\/png;base64,AAAA"/);
  assert.match(html, /width="560"/);
  assert.match(html, /max-width:100%/);
  assert.match(html, /height:auto/);
  assert.equal(inlineImageMarkup('blob:http://localhost/abc'), '');
  assert.equal(inlineImageMarkup('file:///tmp/a.png'), '');
});
