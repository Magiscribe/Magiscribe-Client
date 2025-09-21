import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Renders breadcrumb-style back links based on the provided path segments.
 * When possible, it uses localized names for each segment.
 * Localization keys are constructed based on the path hierarchy to allow for specific translations.
 * E.g for path /dashboard/inquiry-builder/settings, it will look for:
 * 1. common.navigation.dashboard.inquiry-builder.settings
 * 2. common.navigation.inquiry-builder.settings
 * 3. common.navigation.settings
 * @param {Object} props
 * @param {string[]} props.pathSegments - Array of path segments representing the current location.
 * @returns 
 */
export default function BackLinks({ pathSegments }: { pathSegments: string[] }) {
  const { t } = useTranslation();
  const isDashboardOnly = pathSegments.length === 1 && pathSegments[0].toLowerCase() === 'dashboard';

  // Function to get localized name for path segment
  const getLocalizedSegment = (segment: string, index: number): string => {
    // Create translation key based on path hierarchy
    const pathKey = pathSegments.slice(0, index + 2).join('.');
    const translationKey = `common.navigation.${pathKey}`;
    
    // Try specific translation first, fall back to generic segment translation, then to formatted string
    const translated = t(translationKey, { defaultValue: '' });
    if (translated) return translated;
    
    // Try just the segment name
    const segmentKey = `common.navigation.${segment}`;
    const segmentTranslated = t(segmentKey, { defaultValue: '' });
    if (segmentTranslated) return segmentTranslated;
    
    // Fall back to formatted segment name
    return segment.replace(/-/g, ' ');
  };

  return (
    <div className="flex items-center text-x;">
      <Link to="/dashboard" className="hover:text-pink-600 capitalize transition-colors duration-300">
        {t('common.navigation.dashboard')}
      </Link>
      {!isDashboardOnly &&
        pathSegments.slice(1, -1).map((segment, index) => (
          <span key={index}>
            <span className="mx-2">/</span>
            <Link
              to={`/${pathSegments.slice(0, index + 2).join('/')}`}
              className="hover:text-pink-600 capitalize transition-colors duration-300"
            >
              {getLocalizedSegment(segment, index)}
            </Link>
          </span>
        ))}
      {!isDashboardOnly && (
        <>
          <span className="mx-2">/</span>
          <span className="font-thin capitalize">
            {getLocalizedSegment(pathSegments[pathSegments.length - 1], pathSegments.length - 1)}
          </span>
        </>
      )}
    </div>
  );
}
