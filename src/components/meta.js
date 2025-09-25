import Head from "next/head";
import { useRouter } from "next/dist/client/router";

import { J_SITE_TITLE, E_SITE_TITLE } from "../lib/constants";

function Meta() {
  const { locale } = useRouter();
  const site_title = locale === "ja-JP" ? J_SITE_TITLE : E_SITE_TITLE;
  const description =
    locale === "ja-JP"
      ? "同志社大学 モビリティ研究センターでは、情報システム、制御システム、社会システムが密接に協調・統合し、さらに生体情報を考慮することで、将来に向けたモビリティ変革を実現するための新技術の研究開発および社会への普及検討を行っております。"
      : "The Mobility Research Center at Doshisha University is engaged in research and development of new technologies to realize the future mobility revolution by closely coordinating and integrating information systems, control systems, and social systems, and by taking biometric information into account.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    "name": "同志社大学 モビリティ研究センター",
    "url": "https://mrc.doshisha.ac.jp/",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "多々羅都谷1-3",
      "addressLocality": "京田辺市",
      "addressRegion": "京都府",
      "postalCode": "610-0321",
      "addressCountry": "JP"
    },
    "parentOrganization": {
      "@type": "CollegeOrUniversity",
      "name": "同志社大学",
      "url": "https://doshisha.ac.jp/"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "academic inquiries",
      "telephone": "+81-774-65-6297",
      "email": "rc-mblty@mail.doshisha.ac.jp"
    }
  };

  return (
    <Head>
      {/* <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" /> */}
      {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" /> */}
      {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" /> */}
      {/* <link rel="manifest" href="/favicon/site.webmanifest" /> */}
      {/* <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#550071" /> */}
      {/* <link rel="shortcut icon" href="/favicon/favicon.ico" /> */}
      <meta name="msapplication-TileColor" content="#550071" />
      {/* <meta name="msapplication-config" content="/favicon/browserconfig.xml" /> */}
      <meta name="theme-color" content="#550071" />
      <meta name="description" content={description} />
      {/* <meta property="og:image" content="https://mrc.doshisha.ac.jp/ogp/ogp.png" /> */}

      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="author" content="Doshisha University" />
      <meta property="og:url" content="https://mrc.doshisha.ac.jp/" />
      <meta property="og:locale" content="ja_JP" />
      {/* <meta property="og:image" content="https://mrc.doshisha.ac.jp/ogp/ogp.png" /> */}
      <meta property="og:title" content={site_title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}

export default Meta;
