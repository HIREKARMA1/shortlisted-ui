import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_ATTACHMENT_POLICY,
  addAttachmentFiles,
  removeSelectedAttachment,
} from './bulkEmailAttachments.ts';

function file(name: string, bytes: Uint8Array, lastModified = 1): File {
  return new File([bytes], name, { type: 'application/octet-stream', lastModified });
}

test('adds one file and then more without dropping the first', () => {
  const first = addAttachmentFiles([], [file('agenda.pdf', new Uint8Array([1, 2, 3]))], DEFAULT_ATTACHMENT_POLICY);
  assert.equal(first.errors.length, 0);
  assert.equal(first.attachments.length, 1);
  const second = addAttachmentFiles(
    first.attachments,
    [file('notes.txt', new Uint8Array([4, 5]), 2)],
    DEFAULT_ATTACHMENT_POLICY
  );
  assert.deepEqual(
    second.attachments.map((item) => item.name),
    ['agenda.pdf', 'notes.txt']
  );
});

test('removing a selected attachment keeps the others', () => {
  const added = addAttachmentFiles(
    [],
    [file('agenda.pdf', new Uint8Array([1]), 1), file('notes.txt', new Uint8Array([2]), 2)],
    DEFAULT_ATTACHMENT_POLICY
  );
  const removed = removeSelectedAttachment(added.attachments, added.attachments[0].id);
  assert.deepEqual(
    removed.map((item) => item.name),
    ['notes.txt']
  );
});

test('rejects invalid, empty, and oversized files without dropping valid ones', () => {
  const valid = file('agenda.pdf', new Uint8Array([1, 2, 3]), 1);
  const result = addAttachmentFiles(
    [],
    [
      valid,
      file('script.exe', new Uint8Array([1]), 2),
      file('empty.pdf', new Uint8Array([]), 3),
      file('huge.pdf', new Uint8Array(5), 4),
    ],
    { ...DEFAULT_ATTACHMENT_POLICY, max_file_bytes: 4 }
  );
  assert.deepEqual(
    result.attachments.map((item) => item.name),
    ['agenda.pdf']
  );
  assert.equal(result.errors.length, 3);
});
