import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { J_SITE_TITLE, E_SITE_TITLE } from "../lib/constants";
import Layout from "../components/layout";
import PageTitle from "../components/pageTitle";

export default function Custom404() {
    const { locale } = useRouter();
    const site_title = locale === "ja-JP" ? J_SITE_TITLE : E_SITE_TITLE;

    const page_title = locale === "ja-JP" ? "ページが見つかりません" : "Page Not Found";
    const message =
        locale === "ja-JP"
            ? "お探しのページは存在しません。トップページに戻ってください。"
            : "The page you are looking for does not exist. Please go back to the home page.";

    return (
        <Layout>
            <Head>
                <title>
                    {page_title} | {site_title}
                </title>
            </Head>
            <PageTitle title={`404 - ${page_title}`} />

            <div className="flex flex-col items-center justify-center text-center py-5">
                <p className="text-lg text-gray-600 mb-4">{message}</p>
                <Link href="/">
                    <a className="text-blue-600 hover:underline">
                        {locale === "ja-JP" ? "トップページへ" : "Go to Home"}
                    </a>
                </Link>
            </div>
        </Layout>
    );
}
