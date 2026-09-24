import { Link } from 'react-router-dom';
import { SEOHead } from '@sudobility/seo_lib';
import { CONSTANTS } from '../config/constants';

const sections = [
  {
    title: 'What Sicorder does',
    paragraphs: [
      'Sicorder is a Chrome extension and website provided by {{company}}. This policy describes information handled when you use either one.',
      'The extension lets you select part of a webpage to capture as an image or record as a video. Recording starts only after you select a page element and choose the capture or record control. If you turn on tab audio or microphone audio, Sicorder captures the selected sound source while recording.',
    ],
  },
  {
    title: 'Recordings and webpage content',
    paragraphs: [
      'Images, video, tab audio, and microphone audio are processed in your browser and saved to your Chrome Downloads folder. Sicorder does not upload these files to us. The webpage content and audio being captured are not sent to our analytics.',
      'The selected page address, host name, page title, element text, and generated file name are used locally by the extension where needed to name files or operate the recorder. They are not included in Sicorder analytics events.',
    ],
  },
  {
    title: 'Information stored in your browser',
    paragraphs: [
      'The extension stores your preferences (such as recording mode, Smart recording, audio switches, and selected microphone device) and references to recent downloads in Chrome extension storage. Temporary recording and tab state is kept in session storage. This information stays in your browser and is not synced to our servers.',
      'The website may store your language and appearance preferences in your browser. You can clear extension data in Chrome or remove the extension to delete its locally stored information.',
    ],
  },
  {
    title: 'Usage analytics',
    paragraphs: [
      'When analytics is enabled in a release, Sicorder sends limited usage events to Google Analytics, a service provided by Google. On the website, events may include page views and interactions such as selecting the extension download link. In the extension, events may include opening the panel, starting or completing a capture, recording duration, output format, approximate output-width range, audio or Smart recording mode, extension version, and a sanitized error description. When you select an element, the event may include its HTML tag name, such as “video” or “button,” but not its text.',
      'The extension creates a random installation identifier and a temporary session identifier for analytics. Analytics requests also expose technical connection information to Google; Google says it uses IP addresses at collection to derive approximate location and then discards the addresses. Analytics is used to understand product usage and reliability. We do not use it to build advertising profiles or sell user data.',
      'Sicorder analytics does not receive the recording, screenshot, microphone or tab audio, page contents, page URL or host name, page title, element text, or downloaded file name. Analytics is optional at the build level and events are dropped if it is not configured or cannot be sent.',
    ],
  },
  {
    title: 'Service providers and retention',
    paragraphs: [
      'Google processes analytics information on our behalf under its applicable terms and privacy practices. See the Google Privacy Policy and Google Analytics privacy information linked below. We do not sell or rent personal information, and we do not share recording files with third parties.',
      'Recordings remain in your Downloads folder until you delete them. Extension preferences and download references remain in Chrome storage until you clear the extension data or uninstall it. Google Analytics retains event data according to the retention settings for our analytics property and Google’s service terms.',
    ],
  },
  {
    title: 'Your choices',
    paragraphs: [
      'Audio recording is off unless you enable tab audio or microphone audio in the extension. You can clear locally stored extension data through Chrome settings, delete downloaded files at any time, or uninstall the extension. To ask a question about this policy or analytics data associated with your use, contact us at {{email}}.',
    ],
  },
  {
    title: 'Children and policy changes',
    paragraphs: [
      'Sicorder is a general-purpose productivity tool and is not designed to collect personal information from children. We may update this policy as the product changes. The latest version will be published on this page with its effective date.',
    ],
  },
];

function renderText(text: string): string {
  return text
    .replace('{{company}}', CONSTANTS.COMPANY_NAME)
    .replace('{{email}}', CONSTANTS.SUPPORT_EMAIL);
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEOHead
        title={`Privacy Policy | ${CONSTANTS.APP_NAME}`}
        description={`Learn how ${CONSTANTS.APP_NAME} handles recordings, browser storage, and usage analytics.`}
      />
      <article className="mx-auto max-w-4xl px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10 border-b border-white/10 pb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-record-soft">
            {CONSTANTS.APP_NAME}
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-white/60">Effective date: September 24, 2026</p>
          <p className="mt-5 max-w-2xl text-white/75">
            This policy explains what information is handled by the Sicorder Chrome extension and
            website, and what stays on your device.
          </p>
        </header>

        <div className="space-y-9">
          {sections.map(section => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
              <div className="space-y-3 leading-7 text-white/75">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{renderText(paragraph)}</p>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="mb-3 text-xl font-semibold">More information</h2>
            <ul className="list-inside list-disc space-y-2 text-white/75">
              <li>
                <a
                  className="text-record-soft underline"
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="text-record-soft underline"
                  href="https://support.google.com/analytics/answer/6004245"
                  target="_blank"
                  rel="noreferrer"
                >
                  How Google Analytics safeguards data
                </a>
              </li>
              <li>
                <a
                  className="text-record-soft underline"
                  href={`mailto:${CONSTANTS.SUPPORT_EMAIL}`}
                >
                  Contact {CONSTANTS.COMPANY_NAME} at {CONSTANTS.SUPPORT_EMAIL}
                </a>
              </li>
            </ul>
          </section>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-sm text-white/60">
          <Link className="text-record-soft underline" to="/en">
            Return to Sicorder
          </Link>
        </p>
      </article>
    </>
  );
}
