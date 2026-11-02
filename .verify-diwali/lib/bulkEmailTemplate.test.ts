import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BULK_EMAIL_TEMPLATE_FILENAME,
  buildBulkEmailTemplateCsv,
  escapeTemplateCell,
} from './bulkEmailTemplate.ts';

test('csv template downloads with the email header and a sample row', () => {
  const csv = buildBulkEmailTemplateCsv();
  assert.equal(csv, '\uFEFFemail\r\nstudent@example.com\r\n');
  assert.equal(BULK_EMAIL_TEMPLATE_FILENAME, 'shortlisted_bulk_email_template.csv');
});

test('template cells escape formulas, commas, and quotes', () => {
  assert.equal(escapeTemplateCell('=HYPERLINK("http://example.test")'), `"'=HYPERLINK(""http://example.test"")"`);
  assert.equal(escapeTemplateCell('Ada, Lovelace'), '"Ada, Lovelace"');
});
