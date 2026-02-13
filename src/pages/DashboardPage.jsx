import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Clock,
  Zap,
  AlertCircle,
  DollarSign,
  Inbox,
  CheckCircle,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  kpiData,
  monthlyVolume,
  processingTimeTrend,
  spendByVendor,
  statusDistribution,
  recentActivity,
} from '../data/mockData';
import KPICard from '../components/common/KPICard';
import { formatCurrency, formatNumber, getRelativeTime } from '../utils/formatters';

// Icon and color mapping for activity types
const activityConfig = {
  invoice_received: { icon: Inbox, color: 'text-blue-500', bg: 'bg-blue-50' },
  invoice_posted: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  payment_made: { icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
  error_flagged: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  vendor_submitted: { icon: Upload, color: 'text-purple-500', bg: 'bg-purple-50' },
};

// Custom tooltip for the Invoice Volume chart
function VolumeTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatNumber(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Custom tooltip for the Processing Time chart
function ProcessingTimeTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-blue-600">
          {payload[0].value} hours
        </p>
      </div>
    );
  }
  return null;
}

// Custom tooltip for the Spend by Vendor chart
function SpendTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-blue-600">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

// Custom tooltip for the Status Breakdown pie chart
function StatusTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900 mb-1">{payload[0].name}</p>
        <p className="text-sm" style={{ color: payload[0].payload.color }}>
          {payload[0].value} invoices
        </p>
      </div>
    );
  }
  return null;
}

// Custom legend renderer for the pie chart
function renderCustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center text-xs">
          <div
            className="w-2.5 h-2.5 rounded-full mr-1.5"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title={t('dashboard.totalInvoices')}
          value={formatNumber(kpiData.totalInvoices)}
          icon={FileText}
          trend={12}
          trendUp={true}
          color="blue"
        />
        <KPICard
          title={t('dashboard.avgProcessingTime')}
          value={kpiData.avgProcessingTime}
          icon={Clock}
          suffix={t('dashboard.hours')}
          trend={18}
          trendUp={false}
          color="amber"
        />
        <KPICard
          title={t('dashboard.automationRate')}
          value={kpiData.automationRate}
          icon={Zap}
          suffix="%"
          trend={5}
          trendUp={true}
          color="green"
        />
        <KPICard
          title={t('dashboard.pendingApprovals')}
          value={kpiData.pendingApprovals}
          icon={AlertCircle}
          trend={8}
          trendUp={false}
          color="purple"
        />
        <KPICard
          title={t('dashboard.totalSpend')}
          value={formatCurrency(kpiData.totalSpend)}
          icon={DollarSign}
          trend={15}
          trendUp={true}
          color="emerald"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Invoice Volume by Month */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.invoiceVolume')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyVolume} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <Tooltip content={<VolumeTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="invoices"
                name="Total Invoices"
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="automated"
                name="Automated"
                fill="#22C55E"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Processing Time Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.processingTime')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={processingTimeTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="processingTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                unit=" hrs"
              />
              <Tooltip content={<ProcessingTimeTooltip />} />
              <Area
                type="monotone"
                dataKey="time"
                stroke="#6366F1"
                strokeWidth={2.5}
                fill="url(#processingTimeGradient)"
                dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Spend by Vendor */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.spendByVendor')}
          </h3>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={spendByVendor}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <YAxis
                type="category"
                dataKey="vendor"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                width={150}
              />
              <Tooltip content={<SpendTooltip />} />
              <Bar
                dataKey="spend"
                fill="url(#spendGradient)"
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Invoice Status Breakdown */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.statusBreakdown')}
          </h3>
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<StatusTooltip />} />
              <Legend content={renderCustomLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.recentActivity')}
        </h3>
        <div className="space-y-1">
          {recentActivity.slice(0, 10).map((activity) => {
            const config = activityConfig[activity.type] || activityConfig.invoice_received;
            const ActivityIcon = config.icon;

            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`flex-shrink-0 p-2 rounded-lg ${config.bg}`}>
                  <ActivityIcon className={`w-4 h-4 ${config.color}`} />
                </div>
                <p className="flex-1 text-sm text-gray-700">{activity.message}</p>
                <span className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap">
                  {getRelativeTime(activity.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
