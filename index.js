import Twitter from './twitter.js'
import Quotes from './quotes.js'
import Painters from './painters.js'
import { hourly } from 'https://deno.land/x/deno_cron/cron.ts'

const twitter = new Twitter({
    consumerApiKey: Deno.env.get('API_KEY'),
    consumerApiSecret: Deno.env.get('API_KEY_SECRET'),
    accessToken: Deno.env.get('ACCESS_TOKEN'),
    accessTokenSecret: Deno.env.get('ACCESS_TOKEN_SECRET'),
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
        const tweets = await twitter.getUserLatestTweet(painter, 5)
        const paitings = tweets.filter(tweet => tweet.entities.media && tweet.favorite_count > 100)
        paitings.forEach(tweet => {
            twitter.retweet(tweet.id_str)
        })
    })
}

// 定时执行发送语录和转推画作
hourly(() => {
    tweetQuote()
    retweetPaintings()
})
