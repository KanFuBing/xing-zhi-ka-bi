import { TwitterApi } from "https://raw.githubusercontent.com/stefanuros/deno_twitter_api/v1.2.1/mod.ts";

// 封装 Twitter Client
class Twitter {

    client: TwitterApi

    constructor(config: {
        consumerApiKey: string,
        consumerApiSecret: string,
        accessToken: string,
        accessTokenSecret: string,
    }) {
        this.client = new TwitterApi(config)
    }

    tweet = async (status: string) => {
        const result = await this.client.post('statuses/update.json', { status })
        return await result.json()
    }

    getUserLatestTweet = async (screen_name: string, count: number) => {
        const result = await this.client.get('statuses/user_timeline.json', { screen_name, count: count.toString(), exclude_replies: 'true' })
        return await result.json()
    }

    retweet = async (id: string) => {
        const result = await this.client.post(`statuses/retweet/${id}.json`)
        return await result.json()
    }

}

export default Twitter
