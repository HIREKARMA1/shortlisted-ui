'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Download,
  Eye,
  GraduationCap,
  Loader2,
  Mail,
  Plus,
  Search,
  Send,
  Trash2,
  Paperclip,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { RichTextEditor } from '@/components/dashboard/admin/bulk-email/RichTextEditor';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import {
  DEFAULT_ATTACHMENT_POLICY,
  acceptAttribute,
  addAttachmentFiles,
  filesFromClipboard,
  formatFileSize,
  removeSelectedAttachment,
  type AttachmentPolicy,
  type SelectedAttachment,
} from '@/lib/bulkEmailAttachments';
import { downloadBulkEmailTemplate } from '@/lib/bulkEmailTemplate';
import { bulkEmailErrorMessage, bulkEmailService } from '@/services/bulkEmailService';
import type {
  BulkEmailCategory,
  BulkEmailCohort,
  BulkEmailLog,
  BulkEmailRecipient,
  ManagedRecipient,
} from '@/types/bulkEmail';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email.trim());
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function hasMessageContent(html: string) {
  return Boolean(stripHtml(html) || /<img\b/i.test(html));
}

function cohortFilterLabel(cohorts: BulkEmailCohort[], selectedIds: string[], studentIds: string[]) {
  if (!selectedIds.length) return 'All cohorts';
  const names = cohorts.filter((c) => selectedIds.includes(c.id)).map((c) => c.name);
  const base = names.join(', ');
  if (studentIds.length) return `${base} · ${studentIds.length} student(s)`;
  return base;
}

export function BulkEmailManagement() {
  const [category, setCategory] = useState<BulkEmailCategory>('all');
  const [cohorts, setCohorts] = useState<BulkEmailCohort[]>([]);
  const [cohortsLoading, setCohortsLoading] = useState(true);
  const [selectedCohortIds, setSelectedCohortIds] = useState<string[]>([]);
  const [cohortStudents, setCohortStudents] = useState<BulkEmailRecipient[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const [recipients, setRecipients] = useState<ManagedRecipient[]>([]);
  const [manualEmail, setManualEmail] = useState('');
  const [manualEmailError, setManualEmailError] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState(0);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [importFile, setImportFile] = useState<{ name: string; size: number } | null>(null);
  const [importProgress, setImportProgress] = useState<number | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recentLogs, setRecentLogs] = useState<BulkEmailLog[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<SelectedAttachment[]>([]);
  const [attachmentErrors, setAttachmentErrors] = useState<string[]>([]);
  const [attachmentPolicy, setAttachmentPolicy] = useState<AttachmentPolicy>(DEFAULT_ATTACHMENT_POLICY);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BulkEmailRecipient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchRequestRef = useRef(0);
  const recipientsRequestRef = useRef(0);

  const isNoneCategory = category === 'none';
  const cohortAllSelected = selectedCohortIds.length === 0;
  const studentAllSelected = selectedStudentIds.length === 0;

  const filterRecipientCount = useMemo(
    () => recipients.filter((r) => r.source === 'filter').length,
    [recipients]
  );
  const importedRecipientCount = useMemo(
    () => recipients.filter((r) => r.source === 'csv').length,
    [recipients]
  );
  const searchRecipientCount = useMemo(
    () => recipients.filter((r) => r.source === 'search').length,
    [recipients]
  );
  const totalRecipients = recipients.length;

  const selectedEmailSet = useMemo(
    () => new Set(recipients.map((r) => normalizeEmail(r.email))),
    [recipients]
  );

  const mergeRecipients = useCallback((incoming: ManagedRecipient[], replaceFilter: boolean) => {
    setRecipients((current) => {
      const map = new Map<string, ManagedRecipient>();
      if (!replaceFilter) {
        current.forEach((r) => map.set(normalizeEmail(r.email), r));
      } else {
        current
          .filter((r) => r.source !== 'filter')
          .forEach((r) => map.set(normalizeEmail(r.email), r));
      }
      incoming.forEach((r) => {
        const key = normalizeEmail(r.email);
        if (!map.has(key)) map.set(key, r);
      });
      return Array.from(map.values());
    });
  }, []);

  const loadCohorts = useCallback(async () => {
    setCohortsLoading(true);
    try {
      const list = await bulkEmailService.getCohorts();
      setCohorts(list);
    } catch (error) {
      toast.error(bulkEmailErrorMessage(error));
    } finally {
      setCohortsLoading(false);
    }
  }, []);

  const loadCohortStudents = useCallback(async () => {
    if (isNoneCategory || cohortAllSelected) {
      setCohortStudents([]);
      return;
    }
    setStudentsLoading(true);
    try {
      const result = await bulkEmailService.getRecipients({
        category: 'all',
        batchIds: selectedCohortIds,
      });
      setCohortStudents(result.users);
    } catch (error) {
      toast.error(bulkEmailErrorMessage(error));
      setCohortStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  }, [cohortAllSelected, isNoneCategory, selectedCohortIds]);

  const fetchFilterRecipients = useCallback(async () => {
    const requestId = ++recipientsRequestRef.current;
    if (isNoneCategory) {
      setRecipients((current) => current.filter((r) => r.source !== 'filter'));
      setIsLoadingRecipients(false);
      return;
    }

    setIsLoadingRecipients(true);
    try {
      const result = await bulkEmailService.getRecipients({
        category: 'all',
        batchIds: cohortAllSelected ? undefined : selectedCohortIds,
        studentIds: studentAllSelected ? undefined : selectedStudentIds,
      });
      if (requestId !== recipientsRequestRef.current) return;
      const mapped: ManagedRecipient[] = result.users.map((user) => ({
        ...user,
        role: user.role || 'Student',
        source: 'filter' as const,
      }));
      mergeRecipients(mapped, true);
    } catch (error) {
      if (requestId !== recipientsRequestRef.current) return;
      toast.error(bulkEmailErrorMessage(error));
    } finally {
      if (requestId === recipientsRequestRef.current) {
        setIsLoadingRecipients(false);
      }
    }
  }, [
    cohortAllSelected,
    isNoneCategory,
    mergeRecipients,
    selectedCohortIds,
    selectedStudentIds,
    studentAllSelected,
  ]);

  const fetchLogs = useCallback(async () => {
    try {
      const result = await bulkEmailService.getLogs(8);
      setRecentLogs(result.logs);
    } catch {
      /* non-blocking */
    }
  }, []);

  useEffect(() => {
    loadCohorts();
  }, [loadCohorts]);

  useEffect(() => {
    let active = true;
    bulkEmailService
      .getAttachmentPolicy()
      .then((policy) => {
        if (active) setAttachmentPolicy(policy);
      })
      .catch(() => {
        /* server defaults still apply on send */
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    loadCohortStudents();
  }, [loadCohortStudents]);

  useEffect(() => {
    fetchFilterRecipients();
  }, [fetchFilterRecipients]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2 || isNoneCategory) {
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const requestId = ++searchRequestRef.current;
    setIsSearching(true);
    setSearchError(null);

    const timer = window.setTimeout(async () => {
      try {
        const result = await bulkEmailService.searchUsers(
          q,
          cohortAllSelected ? undefined : selectedCohortIds
        );
        if (requestId !== searchRequestRef.current) return;
        setSearchResults(result.users);
      } catch (error) {
        if (requestId !== searchRequestRef.current) return;
        setSearchResults([]);
        setSearchError(bulkEmailErrorMessage(error));
      } finally {
        if (requestId === searchRequestRef.current) setIsSearching(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [cohortAllSelected, isNoneCategory, searchQuery, selectedCohortIds]);

  const toggleCohort = (cohortId: string) => {
    setSelectedCohortIds((current) => {
      if (current.includes(cohortId)) {
        return current.filter((id) => id !== cohortId);
      }
      return [...current, cohortId];
    });
  };

  useEffect(() => {
    if (studentAllSelected || cohortStudents.length === 0) return;
    const valid = new Set(cohortStudents.map((s) => s.id).filter(Boolean) as string[]);
    setSelectedStudentIds((current) => {
      const pruned = current.filter((id) => valid.has(id));
      return pruned.length === current.length ? current : pruned;
    });
  }, [cohortStudents, studentAllSelected]);

  const clearCohorts = () => {
    setSelectedCohortIds([]);
    setSelectedStudentIds([]);
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((current) => {
      if (current.includes(studentId)) {
        return current.filter((id) => id !== studentId);
      }
      return [...current, studentId];
    });
  };

  const handleAddFromSearch = (user: BulkEmailRecipient) => {
    const normalized = normalizeEmail(user.email);
    if (selectedEmailSet.has(normalized)) {
      toast.error('Already added');
      return;
    }
    mergeRecipients([{ ...user, role: user.role || 'Student', source: 'search' }], false);
    toast.success(`${user.name || user.email} added`);
  };

  const handleAddEmail = () => {
    const trimmed = manualEmail.trim();
    if (!trimmed) {
      const message = 'Please enter an email address';
      setManualEmailError(message);
      toast.error(message);
      return;
    }
    if (!isValidEmail(trimmed)) {
      const message = 'Please enter a valid email address';
      setManualEmailError(message);
      toast.error(message);
      return;
    }
    if (selectedEmailSet.has(normalizeEmail(trimmed))) {
      const message = 'This email is already in the recipient list';
      setManualEmailError(message);
      toast.error(message);
      return;
    }
    mergeRecipients(
      [
        {
          email: trimmed,
          name: trimmed,
          role: 'External',
          status: 'Manual',
          source: 'manual',
        },
      ],
      false
    );
    setManualEmail('');
    setManualEmailError(null);
    toast.success('Email added');
  };

  const handleRemoveRecipient = (email: string) => {
    const normalized = normalizeEmail(email);
    setRecipients((current) => current.filter((r) => normalizeEmail(r.email) !== normalized));
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'csv' && extension !== 'xlsx') {
      toast.error('Unsupported file. Supported formats: CSV, XLSX.');
      event.target.value = '';
      return;
    }

    setImportFile({ name: file.name, size: file.size });
    setImportErrors([]);
    setImportProgress(0);
    setIsUploading(true);
    const toastId = toast.loading('Importing recipients...');
    try {
      const result = await bulkEmailService.uploadCsv(file, setImportProgress);
      const mapped: ManagedRecipient[] = result.emails.map((email) => ({
        email,
        name: email,
        role: 'Imported',
        status: 'Imported',
        source: 'csv' as const,
      }));
      mergeRecipients(mapped, false);
      setImportedCount((count) => count + result.imported);
      setImportErrors(result.errors ?? []);
      const importedLabel = `Imported ${result.imported} email${result.imported === 1 ? '' : 's'}`;
      if (result.errors?.length) {
        toast.success(`${importedLabel}. ${result.errors.length} row${result.errors.length === 1 ? '' : 's'} need attention.`, {
          id: toastId,
        });
      } else {
        toast.success(importedLabel, { id: toastId });
      }
    } catch (error) {
      const message = bulkEmailErrorMessage(error);
      setImportErrors(message.split('\n').filter((line) => line.trim()));
      toast.error(message, { id: toastId });
    } finally {
      setIsUploading(false);
      setImportProgress(null);
      event.target.value = '';
    }
  };

  const attachFiles = (selected: File[]) => {
    if (!selected.length) return;
    const result = addAttachmentFiles(attachments, selected, attachmentPolicy);
    setAttachments(result.attachments);
    setAttachmentErrors(result.errors);
  };

  const handleAttachmentSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = '';
    attachFiles(selected);
  };

  const handleComposerPaste = (event: React.ClipboardEvent<HTMLElement>) => {
    const files = filesFromClipboard(event.clipboardData);
    if (!files.length) return;
    event.preventDefault();
    attachFiles(files);
  };

  const emptyRecipientsMessage = isNoneCategory
    ? 'Please add at least one email address.'
    : 'No recipients selected.';

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error('Subject is required');
      return;
    }
    if (!hasMessageContent(body)) {
      toast.error('Email body is required');
      return;
    }
    if (totalRecipients === 0) {
      toast.error(emptyRecipientsMessage);
      return;
    }

    const audience = isNoneCategory
      ? recipients.filter((r) => r.source !== 'filter')
      : recipients;
    const studentIds: string[] = [];
    const externalEmails: string[] = [];
    const seenStudentIds = new Set<string>();
    const seenEmails = new Set<string>();
    for (const recipient of audience) {
      if (recipient.id) {
        if (!seenStudentIds.has(recipient.id)) {
          seenStudentIds.add(recipient.id);
          studentIds.push(recipient.id);
        }
        continue;
      }
      const email = recipient.email.trim();
      const key = normalizeEmail(email);
      if (!email || seenEmails.has(key)) continue;
      seenEmails.add(key);
      externalEmails.push(email);
    }

    if (!studentIds.length && !externalEmails.length) {
      toast.error(emptyRecipientsMessage);
      return;
    }

    const checked = addAttachmentFiles([], attachments.map((item) => item.file), attachmentPolicy);
    if (checked.errors.length || checked.attachments.length !== attachments.length) {
      setAttachmentErrors(checked.errors);
      toast.error(checked.errors[0] || 'Check the selected attachments.');
      return;
    }

    const audienceCount = studentIds.length + externalEmails.length;
    setIsSending(true);
    setUploadProgress(attachments.length ? 0 : null);
    const toastId = toast.loading(
      `Sending bulk email to ${audienceCount} recipient${audienceCount === 1 ? '' : 's'}...`
    );
    try {
      const result = await bulkEmailService.sendBulkEmail(
        {
          category,
          subject: subject.trim(),
          body,
          emails: externalEmails,
          student_ids: studentIds,
          cohort_filter: cohortFilterLabel(cohorts, selectedCohortIds, selectedStudentIds),
        },
        attachments.map((item) => item.file),
        (percent) => setUploadProgress(percent)
      );

      if (result.queued) {
        toast(result.message, { id: toastId });
      } else if (!result.success) {
        toast.error(result.error || result.message || 'Bulk email sending failed.', { id: toastId });
        fetchLogs();
        return;
      } else {
        toast.success(result.message, { id: toastId });
      }
      setSubject('');
      setBody('');
      setAttachments([]);
      setAttachmentErrors([]);
      setRecipients([]);
      setImportedCount(0);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedCohortIds([]);
      setSelectedStudentIds([]);
      setShowConfirm(false);
      fetchLogs();
      fetchFilterRecipients();
    } catch (error) {
      toast.error(bulkEmailErrorMessage(error), { id: toastId });
      fetchLogs();
    } finally {
      setIsSending(false);
      setUploadProgress(null);
    }
  };

  const categoryOptions = useMemo(() => {
    const base = [
      { value: 'all', label: 'All' },
      { value: 'none', label: 'None (manual only)' },
    ];
    return base;
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Bulk Email Management"
        subtitle="Filter shortlisted students by cohort, search by name or email, import CSV or Excel, or add addresses manually — then send a branded message."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Filter Recipients" value={filterRecipientCount} hint="From cohort & student filters" accent="blue" icon={Users} />
        <StatCard label="Search Added" value={searchRecipientCount} hint="Added from user search" accent="sky" icon={Search} />
        <StatCard label="Imported Emails" value={importedRecipientCount} hint={`Session imports: ${importedCount}`} accent="orange" icon={Upload} />
        <StatCard label="Total To Send" value={totalRecipients} hint="Unique recipients selected" accent="green" icon={Mail} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-ink-primary">
            <Users className="h-5 w-5" />
            Recipient Filters
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            {isNoneCategory
              ? 'No students are selected automatically. Add emails manually or via CSV.'
              : 'Choose eligible shortlisted students by category and cohort. Filter results update Selected Recipients.'}
          </p>

          <div className="mt-4 space-y-4">
            <Select
              label="Recipient Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as BulkEmailCategory)}
              options={categoryOptions}
            />

            {!isNoneCategory && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-ink-secondary">Cohort</span>
                    {!cohortAllSelected && (
                      <button type="button" className="text-xs text-brand-blue hover:underline" onClick={clearCohorts}>
                        Clear cohorts
                      </button>
                    )}
                  </div>
                  {cohortsLoading ? (
                    <p className="text-sm text-ink-muted">Loading cohorts...</p>
                  ) : cohorts.length === 0 ? (
                    <p className="text-sm text-ink-muted">No cohorts available.</p>
                  ) : (
                    <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-line-default p-3">
                      <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={cohortAllSelected}
                          onChange={() => clearCohorts()}
                        />
                        All cohorts
                      </label>
                      {cohorts.map((cohort) => (
                        <label key={cohort.id} className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedCohortIds.includes(cohort.id)}
                            onChange={() => toggleCohort(cohort.id)}
                          />
                          {cohort.name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {!cohortAllSelected && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-medium text-ink-muted">Selected cohorts:</span>
                    {selectedCohortIds.map((id) => {
                      const cohort = cohorts.find((c) => c.id === id);
                      if (!cohort) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 rounded-full bg-secondary-100 px-2 py-0.5 text-xs text-brand-blue"
                        >
                          {cohort.name}
                          <button type="button" aria-label={`Remove ${cohort.name}`} onClick={() => toggleCohort(id)}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {!cohortAllSelected && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-ink-secondary">Students in selected cohorts</span>
                    {studentsLoading ? (
                      <p className="text-sm text-ink-muted">Loading students...</p>
                    ) : cohortStudents.length === 0 ? (
                      <p className="text-sm text-ink-muted">No eligible students in these cohorts.</p>
                    ) : (
                      <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-line-default p-3">
                        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                          <input
                            type="checkbox"
                            checked={studentAllSelected}
                            onChange={() => setSelectedStudentIds([])}
                          />
                          All students
                        </label>
                        {cohortStudents.map((student) => (
                          <label key={student.id || student.email} className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={student.id ? selectedStudentIds.includes(student.id) : false}
                              onChange={() => student.id && toggleStudent(student.id)}
                            />
                            <span>{student.name}</span>
                            <span className="text-ink-muted">({student.cohort || '—'})</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {!studentAllSelected && selectedStudentIds.length > 0 && (
                      <p className="text-xs text-ink-muted">
                        Individual selection: only checked students are included from the filter.
                      </p>
                    )}
                  </div>
                )}

                {isLoadingRecipients && (
                  <p className="flex items-center gap-2 text-sm text-ink-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating filter recipients...
                  </p>
                )}
              </>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-ink-primary">
            <Mail className="h-5 w-5" />
            Add Recipients
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            Manually add emails or import a spreadsheet with an email column. Replace the sample row in the template
            before importing.
          </p>

          <div className="mt-4 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="Email address"
                value={manualEmail}
                onChange={(e) => {
                  setManualEmail(e.target.value);
                  if (manualEmailError) setManualEmailError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEmail();
                  }
                }}
              />
              <Button type="button" onClick={handleAddEmail} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Email
              </Button>
            </div>
            {manualEmailError && <p className="text-sm text-brand-red">{manualEmailError}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
                onChange={handleCsvUpload}
              />
              <Button type="button" variant="secondary" onClick={downloadBulkEmailTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV Template
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV or Excel (.xlsx)
              </Button>
              <span className="text-sm text-ink-muted">Imported emails: {importedRecipientCount}</span>
            </div>
            <p className="text-xs text-ink-muted">Supported formats: CSV, XLSX</p>
            {importFile && (
              <p className="text-sm text-ink-primary">
                {importFile.name} · {formatFileSize(importFile.size)}
              </p>
            )}
            {isUploading && (
              <div>
                <div className="h-2 overflow-hidden rounded bg-surface-muted">
                  <div className="h-2 bg-brand-green" style={{ width: `${importProgress ?? 0}%` }} />
                </div>
                <p className="mt-1 text-xs text-ink-muted">Importing recipients… {importProgress ?? 0}%</p>
              </div>
            )}
            {importErrors.length > 0 && (
              <ul className="space-y-1 text-sm text-brand-red">
                {importErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      {!isNoneCategory && (
        <Card>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-ink-primary">
            <Search className="h-5 w-5" />
            Search Users
          </h3>
          <p className="mt-1 text-sm text-ink-muted">Search eligible students by name or email. Click Add to include them.</p>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <Input
              className="pl-9"
              placeholder="Search by name / email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
            <p className="mt-2 text-sm text-ink-muted">Type at least 2 characters to search.</p>
          )}
          {isSearching && (
            <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </p>
          )}
          {searchError && <p className="mt-2 text-sm text-brand-red">{searchError}</p>}

          {!isSearching && searchQuery.trim().length >= 2 && searchResults.length === 0 && !searchError && (
            <p className="py-6 text-center text-sm text-ink-muted">No students found.</p>
          )}

          {searchResults.length > 0 && (
            <div className="mt-4 max-h-80 overflow-x-auto overflow-y-auto rounded-lg border border-line-default">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-surface-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">User</th>
                    <th className="px-4 py-3 text-left font-medium">Cohort</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-default">
                  {searchResults.map((user) => {
                    const alreadyAdded = selectedEmailSet.has(normalizeEmail(user.email));
                    return (
                      <tr key={`${user.id}-${user.email}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-brand-blue" />
                            <div>
                              <p className="font-medium">{user.name || '—'}</p>
                              <p className="text-ink-muted">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{user.cohort || '—'}</td>
                        <td className="px-4 py-3">{user.status || '—'}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            type="button"
                            className="px-3 py-1.5 text-xs"
                            variant={alreadyAdded ? 'secondary' : 'primary'}
                            disabled={alreadyAdded}
                            onClick={() => handleAddFromSearch(user)}
                          >
                            {alreadyAdded ? 'Added' : 'Add'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-ink-primary">Selected Recipients</h3>
        <p className="mt-1 text-sm text-ink-muted">
          {totalRecipients} recipient{totalRecipients === 1 ? '' : 's'} ready to receive this email.
        </p>

        {totalRecipients === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">No recipients selected yet.</p>
        ) : (
          <div className="mt-4 max-h-72 overflow-x-auto overflow-y-auto rounded-lg border border-line-default">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-surface-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                  <th className="px-4 py-3 text-left font-medium">Cohort</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Source</th>
                  <th className="px-4 py-3 text-right font-medium">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-default">
                {recipients.map((recipient) => (
                  <tr key={`${recipient.source}-${recipient.email}`}>
                    <td className="px-4 py-3">
                      <span className="mr-1 text-brand-green">✓</span>
                      {recipient.name || '—'}
                    </td>
                    <td className="px-4 py-3">{recipient.email}</td>
                    <td className="px-4 py-3">{recipient.role || 'Student'}</td>
                    <td className="px-4 py-3">{recipient.cohort || '—'}</td>
                    <td className="px-4 py-3">{recipient.status || '—'}</td>
                    <td className="px-4 py-3 capitalize">{recipient.source}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-2"
                        onClick={() => handleRemoveRecipient(recipient.email)}
                        aria-label={`Remove ${recipient.email}`}
                      >
                        <Trash2 className="h-4 w-4 text-brand-red" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <div onPaste={handleComposerPaste}>
        <h3 className="text-lg font-semibold text-ink-primary">Email Composer</h3>
        <p className="mt-1 text-sm text-ink-muted">Compose your bulk email with rich formatting. Paste a copied file to attach it.</p>

        <div className="mt-4 space-y-4">
          <Input
            label="Subject"
            placeholder="Upcoming Shortlisted Job Fair"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink-secondary">Email description / body</p>
            <RichTextEditor
              value={body}
              onChange={setBody}
              onPasteFiles={attachFiles}
              maxImageBytes={attachmentPolicy.max_file_bytes}
            />
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink-secondary">Attachments</p>
            <p className="mb-3 text-xs text-ink-muted">
              Up to {attachmentPolicy.max_files} files, {formatFileSize(attachmentPolicy.max_file_bytes)} each,{' '}
              {formatFileSize(attachmentPolicy.max_total_bytes)} total. Allowed:{' '}
              {attachmentPolicy.allowed_extensions.join(', ')}.
            </p>
            <input
              ref={attachmentInputRef}
              type="file"
              multiple
              accept={acceptAttribute(attachmentPolicy)}
              className="hidden"
              onChange={handleAttachmentSelection}
            />
            <Button type="button" variant="secondary" onClick={() => attachmentInputRef.current?.click()}>
              <Paperclip className="mr-2 h-4 w-4" />
              Add files
            </Button>
            {attachmentErrors.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-brand-red">
                {attachmentErrors.map((error, index) => (
                  <li key={`${error}-${index}`}>{error}</li>
                ))}
              </ul>
            )}
            {attachments.length > 0 && (
              <ul className="mt-3 divide-y divide-line-default rounded-lg border border-line-default">
                {attachments.map((attachment) => (
                  <li key={attachment.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink-primary">{attachment.name}</span>
                      <span className="text-ink-muted">
                        {attachment.typeLabel}
                        {attachment.file.type ? ` · ${attachment.file.type}` : ''} · {formatFileSize(attachment.size)}
                      </span>
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-2"
                      onClick={() => {
                        setAttachments((current) => removeSelectedAttachment(current, attachment.id));
                        setAttachmentErrors([]);
                      }}
                      aria-label={`Remove ${attachment.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {uploadProgress !== null && (
              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded bg-surface-muted">
                  <div className="h-2 bg-brand-green" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="mt-1 text-xs text-ink-muted">Uploading attachments… {uploadProgress}%</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPreviewHtml('');
                setShowPreview(true);
                setPreviewLoading(true);
                void bulkEmailService
                  .previewEmail({ subject: subject.trim(), body })
                  .then((html) => setPreviewHtml(html))
                  .catch((error) => {
                    toast.error(bulkEmailErrorMessage(error));
                    setShowPreview(false);
                  })
                  .finally(() => setPreviewLoading(false));
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              type="button"
              disabled={isSending}
              onClick={() => {
                if (!subject.trim()) {
                  toast.error('Subject is required');
                  return;
                }
                if (!hasMessageContent(body)) {
                  toast.error('Email body is required');
                  return;
                }
                if (totalRecipients === 0) {
                  toast.error(emptyRecipientsMessage);
                  return;
                }
                setShowConfirm(true);
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Sending...' : 'Send Bulk Email'}
            </Button>
          </div>
        </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-ink-primary">Recent Email Logs</h3>
        <p className="mt-1 text-sm text-ink-muted">History of bulk sends. Refresh after send for updated counts.</p>

        {recentLogs.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-muted">No bulk emails sent yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-line-default">
                  <th className="px-3 py-2 text-left">Subject</th>
                  <th className="px-3 py-2 text-left">Recipients</th>
                  <th className="px-3 py-2 text-left">Success</th>
                  <th className="px-3 py-2 text-left">Failed</th>
                  <th className="px-3 py-2 text-left">Sent at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-default">
                {recentLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-3 py-3">{log.subject}</td>
                    <td className="px-3 py-3">{log.recipient_count}</td>
                    <td className="px-3 py-3 text-brand-green">{log.success_count}</td>
                    <td className="px-3 py-3 text-brand-red">{log.failure_count}</td>
                    <td className="px-3 py-3">{new Date(log.sent_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Email Preview" maxWidth="2xl">
        <div className="space-y-3 text-sm">
          <p className="text-ink-muted">
            To / Cc: configured mail recipients. Bcc: {totalRecipients} selected recipient
            {totalRecipients === 1 ? '' : 's'}, each in a separate email.
          </p>
          {attachments.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">Attachments</p>
              <ul className="mt-1 list-disc pl-5 text-ink-primary">
                {attachments.map((attachment) => (
                  <li key={attachment.id}>
                    {attachment.name} · {attachment.typeLabel} · {formatFileSize(attachment.size)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {previewLoading ? (
            <div className="flex items-center justify-center py-16 text-ink-muted">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Building preview…
            </div>
          ) : (
            <iframe
              title="Email preview"
              sandbox=""
              srcDoc={previewHtml}
              className="h-[640px] w-full rounded-lg border border-line-default bg-white"
            />
          )}
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSend}
        title="Send Bulk Email"
        message={`Send this email with ${totalRecipients} selected recipient${totalRecipients === 1 ? '' : 's'} on BCC?`}
        confirmText="Send"
        cancelText="Cancel"
        variant="info"
        isLoading={isSending}
      />
    </div>
  );
}
