const BASE = "https://www.googleapis.com/youtube/v3/"
export default class YoutubeApi {

    /**
     * 
     * @param {import("oauth2-implicitgrant").default} auth 
     */
    constructor(auth) {
        this.auth = auth
    }

    async fetchMySubscriptionChannelIds() {
        let allResult = []
        let result = await this._fetch("subscriptions", {
            part: "snippet",
            mine: true,
            maxResults: 50
        })
        allResult = result.items
        while(result.nextPageToken) {
            result = await this._fetch("subscriptions", {
                part: "snippet",
                mine: true,
                maxResults: 50,
                pageToken: result.nextPageToken
            })
            allResult = [...allResult, ...result.items]
        }
        return allResult
    }

    async fetchUpcomingLivesByChannelId(channelId) {
        return this._fetch("search", {
            part: "snippet",
            type: "video",
            eventType: "upcoming",
            channelId: channelId
        })
    }

    async fetchActiveLivesByChannelId(channelId) {
        return this._fetch("search", {
            part: "snippet",
            type: "video",
            eventType: "live",
            channelId: channelId
        })
    }

    async _fetch(url, params) {
        const response = await this.auth.proxyFetch(`${BASE}${url}?${new URLSearchParams(params).toString()}`)
        return await response.json()
    }
}