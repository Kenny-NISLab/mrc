import Head from "next/head";
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
      <img src="/banner.png" alt="banner" width="900px" height="303px" className="mb-6" />

      <Content body={body} />
    </Layout>
  );
}

export async function getStaticProps() {
  const jitem = await getPage("research");
  const eitem = await getPage("research-en");
  const jbody = await markdownToHtml(jitem.fields.body);
  const ebody = await markdownToHtml(eitem.fields.body);
  return { props: { jbody: jbody, ebody: ebody } };
}
