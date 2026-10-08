import { MasterDetailLayout, MasterListItem } from '@sudobility/components';
import { SEOHead } from '@sudobility/seo_lib';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { CONSTANTS } from '../config/constants';

export const DOC_TOPICS = [
  {
    slug: 'getting-started',
    title: 'Getting started',
    summary: 'Open sicorder and choose an area.',
  },
  { slug: 'record-video', title: 'Record a video', summary: 'Capture one element as an MP4.' },
  {
    slug: 'audio-and-smart',
    title: 'Audio and Smart recording',
    summary: 'Include sound and skip quiet stretches.',
  },
  { slug: 'capture-still', title: 'Capture a still image', summary: 'Save an element as a PNG.' },
  {
    slug: 'files-and-help',
    title: 'Files and troubleshooting',
    summary: 'Find downloads and resolve common issues.',
  },
] as const;

type Topic = (typeof DOC_TOPICS)[number]['slug'];

function Screenshot({
  src,
  alt,
  caption,
  compact = false,
}: {
  src: string;
  alt: string;
  caption: string;
  compact?: boolean;
}) {
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-white/15 bg-white shadow-xl shadow-black/20">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`block h-auto ${compact ? 'max-w-full' : 'w-full'}`}
      />
      <figcaption className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {caption}
      </figcaption>
    </figure>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal space-y-3 pl-6 leading-7 text-white/80 marker:font-bold marker:text-record-soft">
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  );
}

function TopicContent({ topic }: { topic: Topic }) {
  switch (topic) {
    case 'getting-started':
      return (
        <>
          <p>
            sicorder records one part of a web page. Choose Video for an MP4 or Still for a PNG,
            then select the element you want to capture.
          </p>
          <Steps
            items={[
              'Install sicorder in Chrome and open a regular web page.',
              'Click the sicorder toolbar icon. The side panel opens beside the page.',
              'Choose Video or Still at the top of the panel.',
              'For Video, turn on Pick Region and click an element on the page. A dotted border marks your selection.',
            ]}
          />
          <Screenshot
            src="/docs/pick-region.png"
            alt="Chrome with the sicorder side panel open and Pick Region selected beside a music app"
            caption="Pick Region highlights the area on the page while the side panel stays open."
          />
          <p>
            Pick Region can be turned off with Escape, whether your keyboard focus is on the page or
            in the side panel. Use Select Parent to choose a larger container, or Clear to start
            over.
          </p>
          <p>
            Chrome does not let extensions capture internal pages such as <code>chrome://</code> or
            the Chrome Web Store. Open an ordinary <code>http://</code> or <code>https://</code>{' '}
            page instead.
          </p>
        </>
      );
    case 'record-video':
      return (
        <>
          <p>
            Video mode saves the selected part of the tab as a video. The recording stays framed to
            the chosen element as the page moves or scrolls.
          </p>
          <Steps
            items={[
              'Choose Video, turn on Pick Region, and click the element you want.',
              'Check the dotted border. Use Select Parent if you want to include a larger area.',
              'Press Record and interact with the app as usual. The button changes to Stop.',
              'Press Stop to save the video to Chrome Downloads. It also appears in Recent files.',
            ]}
          />
          <Screenshot
            src="/docs/select.png"
            alt="sicorder recording selection shown inside a Chrome window"
            caption="Choose an area before pressing Record."
          />
          <h2>What happens when the page changes?</h2>
          <p>
            If the chosen element moves out of view, recording pauses until it returns. If you
            select a page-sized app container, sicorder follows screen changes in the same app,
            including a page load on the same host. Removing a smaller selected element stops and
            saves the recording.
          </p>
          <p>
            If Chrome blocks tab capture, click the sicorder toolbar icon on that page, then press
            Record again. This grants capture access to the current tab.
          </p>
        </>
      );
    case 'audio-and-smart':
      return (
        <>
          <p>
            Audio is optional. Turn on Speakers (this tab) for sound played by the current tab,
            Microphone for narration, or both to mix them into the recording.
          </p>
          <Screenshot
            src="/docs/audio-controls.png"
            alt="sicorder Audio controls with Speakers and Microphone enabled"
            caption="Choose tab audio, a microphone, or both before recording."
            compact
          />
          <p>
            The first time you enable Microphone, allow access in the permission tab that opens.
            Then choose the default microphone or a specific device in the side panel. Tab audio
            does not include sound from other tabs or apps.
          </p>
          <h2>Smart recording</h2>
          <p>
            Smart recording stops adding frames after about half a second without a change in the
            picture or sound. It resumes when activity returns. Turn it off when you want the full
            elapsed time in the video, including quiet stretches.
          </p>
          <Screenshot
            src="/docs/smart-control.png"
            alt="sicorder Smart recording switch and its description"
            caption="Smart recording skips stretches with no picture or sound change."
            compact
          />
          <p>
            When audio is enabled and the selected element goes out of view or the tab is in the
            background, sound continues while the picture holds its last frame.
          </p>
        </>
      );
    case 'capture-still':
      return (
        <>
          <p>
            Still mode saves one selected element as a PNG. It is useful for a chart, panel, or
            interface state you want to share without the rest of the browser window.
          </p>
          <Steps
            items={[
              'Switch the side panel to Still.',
              'Turn on Capture, then click the element on the page.',
              'The PNG is saved to Chrome Downloads and listed under Recent files.',
            ]}
          />
          <p>
            If the element is partly out of view, sicorder scrolls it into view for the capture and
            restores the previous scroll position. A very large element may be cut off at the window
            edge.
          </p>
          <p>
            Switch back to Video to return to a previously selected video target. If a video is
            recording, sicorder asks before stopping it to switch modes.
          </p>
          <Screenshot
            src="/docs/pick-region.png"
            alt="sicorder side panel beside a web app, showing the Video and Still mode switch"
            caption="Use the mode switch at the top of the side panel to choose Still."
          />
        </>
      );
    case 'files-and-help':
      return (
        <>
          <p>
            Saved videos and screenshots go to Chrome Downloads. Recent files in the side panel
            provides shortcuts to open a file or show it in its folder.
          </p>
          <Screenshot
            src="/docs/pick-region.png"
            alt="sicorder side panel showing the Recent files list below the recording controls"
            caption="Recent files appears below the controls in the side panel."
          />
          <h2>Common questions</h2>
          <dl className="space-y-5">
            <div>
              <dt className="font-semibold text-white">Why is Record disabled?</dt>
              <dd className="mt-1">
                Choose a target with Pick Region first. The target name appears below the picker.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Why did the recording pause?</dt>
              <dd className="mt-1">
                The selected area may be out of view, the tab may be in the background, or Smart
                recording may have detected no change. The panel shows the active reason.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Why did the recording stop?</dt>
              <dd className="mt-1">
                A smaller selected element may have been removed, the tab may have closed, or tab
                capture may have ended. Select a page-sized parent when you want to record across
                screens in the same app.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Where is my file?</dt>
              <dd className="mt-1">
                Check Chrome Downloads or use the folder button next to the file under Recent files.
              </dd>
            </div>
          </dl>
          <p>
            Need more help? Visit{' '}
            <Link to="../support" className="text-record-soft underline underline-offset-4">
              Support
            </Link>
            .
          </p>
        </>
      );
  }
}

export default function DocsPage() {
  const { lang = 'en', topic } = useParams<{ lang: string; topic?: string }>();
  const navigate = useNavigate();
  const selected = DOC_TOPICS.find(item => item.slug === topic);
  if (topic && !selected) return <Navigate to={`/${lang}/docs`} replace />;
  const active = selected ?? DOC_TOPICS[0];

  return (
    <>
      <SEOHead
        title={`${active.title} | Docs | ${CONSTANTS.APP_NAME}`}
        description={active.summary}
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-record-soft">
            {CONSTANTS.APP_NAME}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Docs</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Learn to capture focused videos and screenshots of web apps.
          </p>
        </header>
        <MasterDetailLayout
          masterTitle="Docs"
          backButtonText="All docs"
          masterContent={
            <nav aria-label="Docs topics" className="space-y-1">
              {DOC_TOPICS.map(item => (
                <MasterListItem
                  key={item.slug}
                  isSelected={item.slug === active.slug}
                  onClick={() => navigate(`/${lang}/docs/${item.slug}`)}
                  label={item.title}
                  description={item.summary}
                />
              ))}
            </nav>
          }
          detailTitle={active.title}
          detailContent={
            <article className="docs-article max-w-3xl space-y-6 pb-12 text-white/80">
              <TopicContent topic={active.slug} />
            </article>
          }
          mobileView={selected ? 'content' : 'navigation'}
          onBackToNavigation={() => navigate(`/${lang}/docs`)}
          detailPadding
          contentKey={active.slug}
        />
      </div>
    </>
  );
}
