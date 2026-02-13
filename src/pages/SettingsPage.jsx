import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  Brain,
  Mail,
  Building2,
  BarChart3,
  Link,
  Globe,
  FileText,
  Sparkles,
  CheckCircle2,
  Database,
  ArrowRight,
} from 'lucide-react';
import LanguageToggle from '../components/common/LanguageToggle';

const features = [
  { icon: Brain, titleKey: 'settings.feature1', descKey: 'settings.feature1Desc' },
  { icon: Mail, titleKey: 'settings.feature2', descKey: 'settings.feature2Desc' },
  { icon: Building2, titleKey: 'settings.feature3', descKey: 'settings.feature3Desc' },
  { icon: BarChart3, titleKey: 'settings.feature4', descKey: 'settings.feature4Desc' },
  { icon: Link, titleKey: 'settings.feature5', descKey: 'settings.feature5Desc' },
];

const architectureSteps = [
  { icon: FileText, labelKey: 'emailBot.ingestion', sublabel: 'Invoice Sources' },
  { icon: Sparkles, labelKey: 'emailBot.extraction', sublabel: 'AI Processing' },
  { icon: CheckCircle2, labelKey: 'emailBot.validation', sublabel: 'Validation' },
  { icon: Database, labelKey: 'emailBot.posting', sublabel: 'ERP System' },
];

export default function SettingsPage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
      </div>

      {/* Language Settings Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-primary-50 rounded-lg">
            <Globe className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{t('settings.language')}</h2>
            <p className="text-sm text-gray-500">{t('settings.languageDesc')}</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            {i18n.language === 'en' ? 'English' : 'Thai'} ({i18n.language.toUpperCase()})
          </div>
          <LanguageToggle />
        </div>
      </div>

      {/* About This Demo Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-50 rounded-lg">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{t('settings.about')}</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{t('settings.aboutDesc')}</p>
      </div>

      {/* Key Features Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.features')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={feature.titleKey}
                className="flex items-start gap-4 bg-gray-50 rounded-lg p-4 border border-gray-100"
              >
                <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                  <FeatureIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{t(feature.titleKey)}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Solution Architecture Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('settings.architecture')}</h2>
        <div className="flex items-center justify-center overflow-x-auto py-4">
          {architectureSteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <React.Fragment key={step.labelKey}>
                <div className="flex flex-col items-center gap-2 min-w-[120px]">
                  <div className="w-14 h-14 rounded-xl bg-primary-50 border-2 border-primary-200 flex items-center justify-center">
                    <StepIcon className="w-7 h-7 text-primary-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 text-center">
                    {step.sublabel}
                  </span>
                  <span className="text-xs text-gray-500 text-center">{t(step.labelKey)}</span>
                </div>
                {idx < architectureSteps.length - 1 && (
                  <div className="flex-shrink-0 mx-3 mb-8">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <span>{t('settings.version')} 1.0</span>
          <span className="text-gray-300">|</span>
          <span>{t('settings.builtWith')}</span>
        </div>
      </div>
    </div>
  );
}
