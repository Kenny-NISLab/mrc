# Mobility Research Center HP

同志社大学 モビリティ研究センターの HP (<https://mrc.doshisha.ac.jp>) です。

もともとは `PHP/HTML` で動いていた（レイアウト崩れ等が多発していた）ものを、CMS を入れて欲しいという要望（from 佐藤先生）があり、 `Next.js(React.js)` ・ `contentful` にマイグレーションしました。

## 構成（2021 年 7 月時点）

- AWS Lightsail (Static IP を割り当て、大学へ DNS 申請をしています。)
- Node.js
- Apache
- Let's Encrypt
- Next.js (React.js)
- tailwindcss
- contentful

---

## インフラ・サーバ周り（特に更新の必要はないため、ほぼ作業ログ）

Amazon Linux 2 を利用しています。ディストリビューションに応じてコマンドを読み替えてください。

AWS Lightsail（EC2）上で Apache が動いています。

ロケール対応させるため、 Next.js を SSR して Node.js サーバ上でホスティングしています。サーバレスで公開したいところですが、大学側のドメイン（DNS）が A レコードしか登録申請することができないため、泣く泣くウェブサーバを立てて公開しています。

HTTPS 化については、Let's Encrypt を利用しており、Cron で証明書発行を自動化しています。

### 1. Web サーバ構築まで

> <https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ec2-lamp-amazon-linux-2.html>

```sh
sudo yum update -y

sudo yum install -y httpd

sudo systemctl start httpd    # Apache の起動

sudo systemctl enable httpd   # インスタンスを再起動しても Apache が起動するように
```

### 2. git のインストール

```sh
sudo yum install -y git
```

### 3. Node.js / Yarn / Forever のインストール

> <https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html>

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

. ~/.nvm/nvm.sh

nvm install node

npm install -g yarn forever
```

### 4. リポジトリのクローン

```sh
sudo chmod -R 777 /var/www/html/

cd /var/www/html/

git clone https://github.com/Kenny-NISLab/mrc
```

```sh
# /var/www/html/mrc/.env.local
NUXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_CF_SPACE_ID=""
NEXT_PUBLIC_CF_DELIVERY_ACCESS_TOKEN=""
```

### 5. ルートディレクトリの変更

Next.js を SSR する際に、 Apache のリバースプロキシでサーバ上の localhost にアクセスされるように設定します。

> <https://suwaru.tokyo/%E3%80%90%E6%9C%AC%E7%95%AA%E3%83%AA%E3%83%AA%E3%83%BC%E3%82%B9%E3%80%91node-js%E3%82%B5%E3%83%BC%E3%83%90%E6%8E%A5%E7%B6%9A%E6%96%B9%E6%B3%95%E3%80%90%E3%83%AA%E3%83%90%E3%83%BC%E3%82%B9%E3%83%97/>

```sh
# /etc/httpd/conf/httpd.conf

- DocumentRoot "/var/www/html"
+ DocumentRoot "/var/www/html/mrc"

- <Directory "/var/www/html">
+ <Directory "/var/www/html/mrc">

+ ProxyRequests Off
+ <Location />
+   ProxyPass http://localhost:3000/
+   ProxyPassReverse http://localhost:3000/
+ </Location>
```

Apache を再起動します。

```sh
sudo systemctl restart httpd
```

### 6. Node.js サーバ起動

通常の `yarn start` コマンドで Node.js サーバを起動した場合、ログアウトと同時にバックグラウンド処理も終了されてしまうため、 `forever` コマンドで実行する必要があります。必要なコマンドを実行できるシェルスクリプトを実行します。

> <https://www.npmjs.com/package/forever>

```sh
cd /var/www/html/mrc/

bash scripts/rebuild.sh
```

### 7. TLS (HTTPS) 化

> <https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2.html>

調査の結果、 AWS の ACM を利用するのは難しいため、 Let's Encrypt を利用して HTTPS 化を行いました。

基本は AWS のドキュメント通りにやればできます。

```sh
sudo yum update -y

sudo yum install -y mod_ssl

cd /etc/pki/tls/certs
sudo ./make-dummy-cert localhost.crt
```

```sh
# /etc/httpd/conf.d/ssl.conf

# 下記の行をコメントアウトします
SSLCertificateKeyFile /etc/pki/tls/private/localhost.key
```

```sh
sudo systemctl restart httpd
```

```sh
sudo wget -r --no-parent -A 'epel-release-*.rpm' https://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/

sudo rpm -Uvh dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-*.rpm

sudo yum-config-manager --enable epel*

sudo yum repolist all
```

```sh
# /etc/httpd/conf/httpd.conf

# Listen 80 ディレクティブを見つけて、その後ろに下記を追加する
<VirtualHost *:80>
  DocumentRoot "/var/www/html/mrc"
  ServerName "doshisha.ac.jp"
  ServerAlias "mrc.doshisha.ac.jp"
</VirtualHost>
```

```sh
# /etc/httpd/conf/httpd-le-ssl.conf 
<IfModule mod_ssl.c>
<VirtualHost *:443>
  DocumentRoot "/var/www/html/mrc"
  ServerName "doshisha.ac.jp"
  ServerAlias "mrc.doshisha.ac.jp"

  ProxyPreserveHost On
  ProxyPass / http://127.0.0.1:3000/
  ProxyPassReverse / http://127.0.0.1:3000/

  SSLCertificateFile /etc/letsencrypt/live/mrc.doshisha.ac.jp/fullchain.pem
  SSLCertificateKeyFile /etc/letsencrypt/live/mrc.doshisha.ac.jp/privkey.pem
  
  Protocols h2 http/1.1

  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

  Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
</IfModule>
```

```sh
sudo systemctl restart httpd
```

```sh
sudo yum install -y certbot python2-certbot-apache

sudo certbot

# "Enter email address (used for urgent renewal and security notices)" というプロンプトが表示されたら、連絡先住所を入力し、Enter キーを押します。

# プロンプトが表示されたら Let's Encrypt のサービス利用規約に同意します。

# EFF のメーリングリストに登録するための承認で、「Y」または「N」と入力して Enter キーを押します。

# Certbot に、VirtualHost ブロックで入力した共通名およびサブジェクト代替名 (SAN) が表示されますので、「2」を入力して Enter キーを押します。
```

```sh
# /etc/crontab

# 下記のような行を追加する
39      1,13    *       *       *       root    certbot renew --no-self-upgrade
```

```sh
sudo systemctl restart crond
```

---

## CI/CD

GitHub Actions を用いて Lightsail インスタンスにビルドしたファイル群をデプロイしています。

詳しくは、 `.github/workflows/deploy.yml` を読んでください。

簡単に説明すると、

1. Lightsail（EC2）内の `/var/www/html/mrc/` に移動
2. Shell Script を実行（リビルド）

というものです。

トリガーは、 `GitHub の main ブランチに push された時` と、 `Contenful で記事が公開・更新・削除` された時です。

HP の更新が完了すると、 Slack に通知が届くようになっています。

---

## Next.js を編集したい方向け

### Create `.env.local` file

```.env.local
NUXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_CF_SPACE_ID=""
NEXT_PUBLIC_CF_DELIVERY_ACCESS_TOKEN=""
```

---

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
