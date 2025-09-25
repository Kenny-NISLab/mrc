import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import Container from "../components/container";

const en = {
  globalNav: { univ: "Doshisha University", privacy: "Privacy policy", sitemap: "Sitemap", home: "Home" },
  logo: "/header/en/logo.png",
  headerMenu: {
    about: "/header/en/about.png",
    issues: "/header/en/issues.png",
    activities: "/header/en/activities.png",
    publications: "/header/en/publications.png",
    misc: "/header/en/misc.png",
  },
};
const ja = {
  globalNav: { univ: "同志社大学", privacy: "個人情報保護について", sitemap: "サイトマップ", home: "トップページ" },
  logo: "/header/ja/logo.png",
  headerMenu: {
    about: "/header/ja/about.png",
    issues: "/header/ja/issues.png",
    activities: "/header/ja/activities.png",
    publications: "/header/ja/publications.png",
    misc: "/header/ja/misc.png",
  },
};

export default function Header() {
  const router = useRouter();
  const localeKey = router.locale === "ja-JP" ? "ja" : "en";
  const t = localeKey === "ja" ? ja : en;
  const [menuOpen, setMenuOpen] = useState(false);

  const mobileLabels =
    localeKey === "ja"
      ? ["センター概要", "研究課題", "研究活動", "研究発表", "その他"]
      : ["Organization", "Issues", "Activities", "Publications", "MISC"];
  const mobilePaths = ["/about", "/issues", "/activities", "/publications", "/misc"];

  return (
    <header>
      {/* Global Nav */}
      <div className="bg-headerbg text-white">
        <Container>
          <div className="flex flex-row-reverse items-center gap-x-3 py-3 text-sm mb-4 overflow-x-auto whitespace-nowrap">
            {localeKey === "ja" ? (
              <Link href={router.asPath} locale="en">
                <a className="hover:underline shrink-0">English</a>
              </Link>
            ) : (
              <Link href={router.asPath} locale="ja-JP">
                <a className="hover:underline shrink-0">日本語</a>
              </Link>
            )}

            <span className="text-white">|</span>

            <a
              href="https://www.doshisha.ac.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline shrink-0 inline-flex items-center gap-1"
            >
              {t.globalNav.univ}
              <Image
                src="/icons/external-link-alt-solid.svg"
                alt=""
                width={12}
                height={12}
              />
            </a>
            <Link href="/privacy">
              <a className="hover:underline shrink-0">{t.globalNav.privacy}</a>
            </Link>
            <Link href="/sitemap">
              <a className="hover:underline shrink-0">{t.globalNav.sitemap}</a>
            </Link>
            <Link href="/">
              <a className="hover:underline shrink-0">{t.globalNav.home}</a>
            </Link>
          </div>
        </Container>
      </div>
      {/* Header Menu */}
      <Container>
        <div className="flex items-center w-full">
          <Link href="/">
            <a>
              <Image src={t.logo} className="mx-2" alt="logo" width={337} height={26} />
            </a>
          </Link>

          <div className="flex-1" />

          <div className="hidden md:flex items-center space-x-2">
            <Link href="/about">
              <a className="hover:opacity-50">
                <Image src={t.headerMenu.about} alt="about" width={110} height={52} />
              </a>
            </Link>
            <Link href="/issues">
              <a className="hover:opacity-50">
                <Image src={t.headerMenu.issues} alt="issues" width={110} height={52} />
              </a>
            </Link>
            <Link href="/activities">
              <a className="hover:opacity-50">
                <Image src={t.headerMenu.activities} alt="activities" width={110} height={52} />
              </a>
            </Link>
            <Link href="/publications">
              <a className="hover:opacity-50">
                <Image src={t.headerMenu.publications} alt="publications" width={110} height={52} />
              </a>
            </Link>
            <Link href="/misc">
              <a className="hover:opacity-50">
                <Image src={t.headerMenu.misc} alt="misc" width={110} height={52} />
              </a>
            </Link>
          </div>

          <button type="button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((s) => !s)} className="md:hidden p-2 rounded hover:bg-gray-100">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </Container>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md pl-5 pr-5">
          <Container>
            <nav className="flex flex-col py-2">
              {mobilePaths.map((p, i) => (
                <Link href={p} key={p}>
                  <a onClick={() => setMenuOpen(false)} className="py-3 border-b last:border-b-0 text-base">
                    {mobileLabels[i]}
                  </a>
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
