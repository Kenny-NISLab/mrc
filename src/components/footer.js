import { useRouter } from "next/dist/client/router";

import Container from "../components/container";
import ScrollUp from "../components/scrollUp";

const en = {
  contact: (
    <p className="leading-5">
      <div className="font-semibold underline text-lg">Contact</div>
      <div className="my-2">
        Doshisha University Mobility Research Center
        <br />
        1-3 Tatara-Miyakodani, Kyotanabe, Kyoto 610-0321 Japan
      </div>
      <div className="my-2">
        TEL:{" "}
        <a
          href="tel:+81774656297"
          className="hover:underline"
        >
          +81-774-65-6297
        </a>
        <br />
        E-mail:{" "}
        <a
          href="mailto:rc-mblty@mail.doshisha.ac.jp"
          className="hover:underline"
        >
          rc-mblty@mail.doshisha.ac.jp
        </a>
      </div>
    </p>
  ),
};

const ja = {
  contact: (
    <p className="leading-5">
      <div className="font-semibold underline text-lg">お問い合わせ</div>
      <div className="my-2">
        〒610-0321
        <br />
        京都府京田辺市多々羅都谷1-3 同志社大学モビリティ研究センター
      </div>
      <div className="my-2">
        TEL: <a href="tel:0774656297" className="hover:underline">0774-65-6297</a>
        <br />
        E-mail: <a href="mailto:rc-mblty@mail.doshisha.ac.jp" className="hover:underline">rc-mblty@mail.doshisha.ac.jp</a>
      </div>
    </p>
  ),
};

function Footer() {
  const t = useRouter().locale === "ja-JP" ? ja : en;

  return (
    <footer className="mt-8 pt-8 pb-8 bg-headerbg text-white text-sm">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-y-0 items-center">
          <div className="md:col-span-2 mx-2">{t.contact}</div>
          <div className="mx-2 flex flex-col items-center md:items-end text-center md:text-right">
            <ScrollUp />
            <small className="mt-2">
              &copy; Doshisha University All Rights Reserved.
            </small>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
