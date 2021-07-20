import Head from "next/head";
import { useRouter } from "next/dist/client/router";

import { getAllPublications, getPublication } from "../../lib/api";
import { J_SITE_TITLE, E_SITE_TITLE } from "../../lib/constants";
import markdownToHtml from "../../lib/markdownToHtml";
import Layout from "../../components/layout";
import Content from "../../components/content";
import PageTitle from "../../components/pageTitle";
import Sidebar from "../../components/sidebar";

export default function Publication({ items, title, etitle, body }) {
  const { locale } = useRouter();
  const site_title = locale === "ja" ? J_SITE_TITLE : E_SITE_TITLE;
  const page_title = locale === "ja" ? title : etitle;
  const sidebar_title = locale === "ja" ? "研究発表" : "Publications";

  return (
    <Layout>
      <Head>
        <title>
          {page_title} | {site_title}
        </title>
      </Head>
      <PageTitle title={page_title} />
      <div className="grid grid-cols-5">
        <div className="col-span-4">
          <Content body={body} />
        </div>
        <div className="border-l">
          <Sidebar items={items} title={sidebar_title} />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const items = await getAllPublications();
  const paths = [];
  items.map((item) => {
    paths.push({
      params: { year: item.fields.year.toString() },
      locale: "ja",
    });
    paths.push({
      params: { year: item.fields.year.toString() },
      locale: "en",
    });
  });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const items = await getAllPublications();
  const item = await getPublication(params.year);
  const body = await markdownToHtml(item.fields.body);
  return { props: { items: items, title: item.fields.title, etitle: item.fields.etitle, body: body } };
}
