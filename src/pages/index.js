import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";

import { getPage } from "../lib/api";
import { J_SITE_TITLE, E_SITE_TITLE } from "../lib/constants";
import markdownToHtml from "../lib/markdownToHtml";
import Layout from "../components/layout";
import Content from "../components/content";

export default function Home({ jbody, ebody }) {
  const { locale } = useRouter();
  const body = locale === "ja-JP" ? jbody : ebody;
  const site_title = locale === "ja-JP" ? J_SITE_TITLE : E_SITE_TITLE;

  return (
    <Layout>
      <Head>
        <title>{site_title}</title>
      </Head>
      <h1 style={{ display: "none" }}>{site_title}</h1>

      <div className="my-2">
        <div className="block sm:hidden flex justify-center">
          <Image
            src="/small_banner.png"
            alt="small banner"
            width={524}
            height={303}
            className="max-w-[524px] w-auto h-auto"
            priority
          />
        </div>
        <div className="hidden sm:block">
          <Image
            src="/banner.png"
            alt="banner"
            width={900}
            height={303}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      <Content body={body} />
    </Layout>
  );
}

export async function getStaticProps() {
  const jitem = await getPage("top-page");
  const eitem = await getPage("top-page-en");
  const jbody = await markdownToHtml(jitem.fields.body);
  const ebody = await markdownToHtml(eitem.fields.body);
  return { props: { jbody: jbody, ebody: ebody } };
}
