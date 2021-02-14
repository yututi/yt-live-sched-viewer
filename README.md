# yt-live-sched-viewer

Youtubeで登録しているチャンネルのライブ配信予定を見ることができます。

## ローカルでの動かし方

1. [GCP](https://console.cloud.google.com/)に登録し、プロジェクトを作成してください.
1. [API](https://console.cloud.google.com/apis)で[Youtube DATA Api v3](https://developers.google.cn/youtube)を有効にしてください.
1. [認証](https://console.developers.google.com/apis/credentials)でOAuth2.0クライアントIDを有効にしてください.
  - アプリケーション種別: ウェブアプリケーション
  - 承認済みのリダイレクトURI: `http://localhost/login`
1. `.env`のクライアントIDを上記で生成されたIDに書き換えてください.
1. `.env`のリダイレクトURLに上記で設定した値を設定してください.
1. `yarn add`したあと`yarn start`で立ち上がります.

## 使い方

1. Google認証を求められるので認証して下さい。
1. 認証後、登録しているチャンネルから配信予定を取得するものを選択して下さい。(API呼び出し回数削減のため)
1. 選択後、選択したチャンネルに配信予定のライブがあればタイムライン表示されます。

**注意**
わりとすぐAPI呼び出し回数制限に引っかかるので、制限かかったら1日使えません.😫
