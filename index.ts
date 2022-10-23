import Twitter from './twitter.ts'
import Quotes from './quotes.ts'
import Painters from './painters.ts'
import { hourly } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts"

const twitter = new Twitter({
    consumerApiKey: Deno.env.get('API_KEY') as string,
    consumerApiSecret: Deno.env.get('API_KEY_SECRET') as string,
    accessToken: Deno.env.get('ACCESS_TOKEN') as string,
    accessTokenSecret: Deno.env.get('ACCESS_TOKEN_SECRET') as string,
})

// 语录发送
const tweetQuote = () => {
    let index;
    switch (new Date().getUTCHours()) {
        case 14:
        case 15:
        case 16:
            // 晚安
            index = Math.floor(Math.random() * 3)
            break

        case 23:
            // 早安
            index = 3
            break

        default:
            // 常规
            index = Math.floor(Math.random() * (Quotes.length - 4)) + 4
            break
    }
    const status = Quotes[index]
    twitter.tweet(status)
}

// 转推画作
const retweetPaintings = () => {
    Painters.forEach(async (painter) => {
        const tweets = await twitter.getUserLatestTweet(painter, 5) ?? []
        const paitings = tweets.filter((tweet: { entities: { media: string }, favorite_count: number }) => tweet.entities.media && tweet.favorite_count > 100)
        paitings.forEach((tweet: { id_str: string }) => {
            twitter.retweet(tweet.id_str)
        })
    })
}

// 定时执行发送语录和转推画作
hourly(() => {
    Promise.all([
        tweetQuote(),
        retweetPaintings()
    ]).then(() => {
        fetch(Deno.env.get('HEARTBEAT_URL') as string)
    })
})
