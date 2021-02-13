const BASE = 'https://www.googleapis.com/youtube/v3/'
export default class YoutubeApi {
  /**
     *
     * @param {import("oauth2-implicitgrant").default} auth
     */
  constructor (auth) {
    this.auth = auth
  }

  async fetchMySubscriptionChannelIds () {
    return [
      {
        snippet: {
          resourceId: {
            channelId: 'hoge'
          },
          channelTitle: 'sample channel',
          description: 'this is sample channel',
          thumbnails: {
            medium: {
              url: 'https://yt3.ggpht.com/ytc/AAUvwniAjGmotDDxZK7psIMoRbqhY7Ici621OQrO7fB9Wg=s48-c-k-c0x00ffffff-no-rj'
            }
          }
        }
      }
    ]
  }

  async fetchUpcomingLivesByChannelId (channelId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            snippet: {
              publishedAt: '2021-03-01T19:00:00',
              title: 'sample video',
              description: 'this is sample video',
              thumbnails: {
                medium: {
                  url: 'https://yt3.ggpht.com/ytc/AAUvwniAjGmotDDxZK7psIMoRbqhY7Ici621OQrO7fB9Wg=s48-c-k-c0x00ffffff-no-rj'
                }
              }
            }
          },
          {
            snippet: {
              publishedAt: '2021-03-01T19:00:00',
              title: 'sample video',
              description: 'this is sample video',
              thumbnails: {
                medium: {
                  url: 'https://yt3.ggpht.com/ytc/AAUvwniAjGmotDDxZK7psIMoRbqhY7Ici621OQrO7fB9Wg=s48-c-k-c0x00ffffff-no-rj'
                }
              }
            }
          },
          {
            snippet: {
              publishedAt: '2021-03-02T19:00:00',
              title: 'sample video',
              description: 'this is sample video',
              thumbnails: {
                medium: {
                  url: 'https://yt3.ggpht.com/ytc/AAUvwniAjGmotDDxZK7psIMoRbqhY7Ici621OQrO7fB9Wg=s48-c-k-c0x00ffffff-no-rj'
                }
              }
            }
          }
        ])
      }, 3000)
    })
  }

  async fetchActiveLivesByChannelId (channelId) {
    return this.fetchUpcomingLivesByChannelId()
  }

  async _fetch (url, params) {
    const response = await this.auth.proxyFetch(`${BASE}${url}?${new URLSearchParams(params).toString()}`)
    return await response.json()
  }
}
