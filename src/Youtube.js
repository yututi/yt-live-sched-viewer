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
    let allResult = []
    let result = await this._fetch('subscriptions', {
      part: 'snippet',
      mine: true,
      maxResults: 50
    })

    if (result.error) return result

    // nextPageTokenでとってくる場合、もう取得した奴も混ざってる？ぽいので重複排除する。
    const added = {}
    result.items.forEach(item => {
      const id = item.snippet.resourceId.channelId
      if (!added[id]) {
        added[id] = true
      }
    })
    allResult = result.items
    while (result.nextPageToken) {
      result = await this._fetch('subscriptions', {
        part: 'snippet',
        mine: true,
        maxResults: 50,
        pageToken: result.nextPageToken
      })

      if (result.error) return result
      const distinctItems = result.items.filter(item => {
        return !added[item.snippet.resourceId.channelId]
      })
      distinctItems.forEach(item => {
        const id = item.snippet.resourceId.channelId
        added[id] = true
      })

      allResult = [...allResult, ...distinctItems]
    }
    return allResult
  }

  async fetchUpcomingLivesByChannelId (channelId) {
    return this._fetch('search', {
      part: 'id',
      type: 'video',
      eventType: 'upcoming',
      channelId: channelId
    })
  }

  async fetchActiveLivesByChannelId (channelId) {
    return this._fetch('search', {
      part: 'id',
      type: 'video',
      eventType: 'live',
      channelId: channelId
    })
  }

  async fetchLiveDetailsByVideoIds (videoIds) {
    return this._fetch('videos', {
      part: 'liveStreamingDetails,snippet',
      id: videoIds.join(','),
      maxResults: 50
    })
  }

  async _fetch (url, params) {
    const response = await this.auth.proxyFetch(`${BASE}${url}?${new URLSearchParams(params).toString()}`)
    return await response.json()
  }
}
