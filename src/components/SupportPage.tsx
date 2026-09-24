import { Link } from 'react-router-dom';
import { SEOHead } from '@sudobility/seo_lib';
import { CONSTANTS } from '../config/constants';

export default function SupportPage() {
  return (
    <>
      <SEOHead
        title={`Support | ${CONSTANTS.APP_NAME}`}
        description={`Contact ${CONSTANTS.APP_NAME} support by email.`}
      />
      <article className="mx-auto w-full max-w-3xl px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-record-soft">
          {CONSTANTS.APP_NAME}
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">Support</h1>
        <p className="mt-5 text-white/75">Need help? Send us an email.</p>
        <a
          className="mt-4 inline-block text-lg font-medium text-record-soft underline underline-offset-4"
          href={`mailto:${CONSTANTS.SUPPORT_EMAIL}`}
        >
          {CONSTANTS.SUPPORT_EMAIL}
        </a>
        <p className="mt-12 border-t border-white/10 pt-6 text-sm text-white/60">
          <Link className="text-record-soft underline" to="/en">
            Return to Sicorder
          </Link>
        </p>
      </article>
    </>
  );
}
