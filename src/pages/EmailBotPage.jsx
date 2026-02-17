import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Inbox,
  AlertTriangle,
  Paperclip,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { emailInbox } from '../data/mockData';
import StatusBadge from '../components/common/StatusBadge';
import { formatCurrency, formatDateTime, getRelativeTime } from '../utils/formatters';

// Map email status to pipeline step index (0-based)
function getPipelineProgress(status) {
  switch (status) {
    case 'processed':
      return 4; // all 4 steps complete
    case 'processing':
      return 2; // ingestion done, extraction in progress
    case 'needs-review':
      return 3; // ingestion + extraction done, validation needs review
    case 'error':
      return 1; // ingestion done, error at extraction
    default:
      return 0;
  }
}

const pipelineSteps = [
  { key: 'ingestion', icon: Download },
  { key: 'extraction', icon: Sparkles },
  { key: 'validation', icon: CheckCircle2 },
  { key: 'posting', icon: Send },
];

function getStatusDot(status) {
  switch (status) {
    case 'processed':
      return 'bg-green-500';
    case 'processing':
      return 'bg-amber-500';
    case 'needs-review':
      return 'bg-yellow-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
}

function getConfidenceColor(score) {
  const pct = score * 100;
  if (pct >= 95) return { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-100' };
  if (pct >= 90) return { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-100' };
  return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-100' };
}

export default function EmailBotPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState(emailInbox[0]);

  const totalEmails = emailInbox.length;
  const autoProcessed = emailInbox.filter((e) => e.status === 'processed').length;
  const needsReview = emailInbox.filter(
    (e) => e.status === 'needs-review' || e.status === 'error'
  ).length;

  const pipelineProgress = getPipelineProgress(selectedEmail.status);
  const confidenceColors = getConfidenceColor(selectedEmail.confidence);
  const confidencePct = Math.round(selectedEmail.confidence * 100);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('emailBot.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('emailBot.subtitle')}</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-lg">
            <Inbox className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {t('emailBot.inbox')}
            </p>
            <p className="text-xl font-bold text-gray-900">{totalEmails}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {t('emailBot.autoProcessed')}
            </p>
            <p className="text-xl font-bold text-gray-900">{autoProcessed}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-3">
          <div className="p-2.5 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {t('emailBot.needsReview')}
            </p>
            <p className="text-xl font-bold text-gray-900">{needsReview}</p>
          </div>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Email List */}
        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">{t('emailBot.inbox')}</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {emailInbox.map((email) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`w-full text-left p-4 transition-colors hover:bg-gray-50 ${
                  selectedEmail.id === email.id
                    ? 'bg-primary-50 border-l-4 border-l-primary-500'
                    : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusDot(
                          email.status
                        )}`}
                      />
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {email.fromName}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">{email.subject}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">
                        {getRelativeTime(email.receivedAt)}
                      </span>
                      {email.attachments.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          <Paperclip className="w-3 h-3" />
                          {email.attachments.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Email Detail */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          {/* Email Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedEmail.fromName}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">{selectedEmail.from}</p>
                <p className="text-sm font-medium text-gray-700 mt-2">{selectedEmail.subject}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDateTime(selectedEmail.receivedAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge
                  status={
                    selectedEmail.status === 'needs-review'
                      ? 'needsReview'
                      : selectedEmail.status === 'processed'
                      ? 'posted'
                      : selectedEmail.status === 'processing'
                      ? 'extracting'
                      : selectedEmail.status
                  }
                />
                {selectedEmail.invoiceId && (
                  <button
                    onClick={() => navigate(`/invoices?highlight=${selectedEmail.invoiceId}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t('emailBot.viewInvoice')}
                  </button>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {t('emailBot.attachments')}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedEmail.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">{att.name}</p>
                      <p className="text-xs text-gray-400">{att.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Processing Pipeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-6">
              {t('emailBot.processingPipeline')}
            </h4>
            <div className="flex items-center justify-between">
              {pipelineSteps.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = idx < pipelineProgress;
                const isCurrent = idx === pipelineProgress;
                const isError = selectedEmail.status === 'error' && idx === pipelineProgress;

                let circleClasses = 'bg-gray-100 text-gray-400';
                let lineClasses = 'bg-gray-200';

                if (isCompleted) {
                  circleClasses = 'bg-green-100 text-green-600';
                  lineClasses = 'bg-green-400';
                } else if (isError) {
                  circleClasses = 'bg-red-100 text-red-600';
                } else if (isCurrent) {
                  circleClasses = 'bg-amber-100 text-amber-600 animate-pulse';
                }

                return (
                  <React.Fragment key={step.key}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${circleClasses}`}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {t(`emailBot.${step.key}`)}
                      </span>
                    </div>
                    {idx < pipelineSteps.length - 1 && (
                      <div className="flex-1 mx-2 mb-6">
                        <div className={`h-0.5 w-full rounded ${isCompleted ? lineClasses : 'bg-gray-200'}`} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Extracted Data */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-700">
                {t('emailBot.extractedFields')}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {t('emailBot.confidenceScore')}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${confidenceColors.light} ${confidenceColors.text}`}
                >
                  {confidencePct}%
                </span>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`${confidenceColors.bg} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
            </div>

            {/* Extracted Fields Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t('invoices.invoiceNo')}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {selectedEmail.extractedData.invoiceNumber}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t('invoices.vendor')}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {selectedEmail.extractedData.vendor}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t('invoices.amount')}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatCurrency(selectedEmail.extractedData.amount)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t('invoices.date')}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {selectedEmail.extractedData.date}
                </p>
              </div>
            </div>

            {/* Extracted Line Items */}
            {selectedEmail.extractedData.lineItems && selectedEmail.extractedData.lineItems.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  {t('emailBot.lineItems')}
                </h4>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {t('invoices.description')}
                        </th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {t('invoices.quantity')}
                        </th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {t('invoices.unitPrice')}
                        </th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {t('invoices.total')}
                        </th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {t('invoices.whtRate')}
                        </th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {t('invoices.whtAmount')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedEmail.extractedData.lineItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2.5 text-sm text-gray-700">{item.description}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-700 text-right font-mono">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-700 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-900 text-right font-mono font-medium">{formatCurrency(item.total)}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-700 text-right font-mono">{item.whtRate != null ? `${item.whtRate}%` : '-'}</td>
                          <td className="px-4 py-2.5 text-sm text-red-600 text-right font-mono">{item.whtAmount ? formatCurrency(item.whtAmount) : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 border-t border-gray-200">
                        <td colSpan={3} className="px-4 py-2.5 text-sm font-semibold text-gray-700 text-right">
                          {t('invoices.total')}
                        </td>
                        <td className="px-4 py-2.5 text-sm font-bold text-gray-900 text-right font-mono">
                          {formatCurrency(selectedEmail.extractedData.lineItems.reduce((s, i) => s + i.total, 0))}
                        </td>
                        <td className="px-4 py-2.5 text-sm font-semibold text-gray-700 text-right">
                          {t('invoices.whtTotal')}
                        </td>
                        <td className="px-4 py-2.5 text-sm font-bold text-red-600 text-right font-mono">
                          {formatCurrency(selectedEmail.extractedData.lineItems.reduce((s, i) => s + (i.whtAmount || 0), 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
