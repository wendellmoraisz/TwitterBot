import {} from 'dotenv/config';
import Twit from 'twit';

const twit = new Twit({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token: process.env.ACESS_TOKEN,
    access_token_secret: process.env.ACESS_SECRET_TOKEN,
    timeout_ms: 5000,
});

const searchTerm = "eu%22amo%22javascript";
const url = `https://api.twitter.com/2/tweets/search/recent?query=%22${searchTerm}%22&tweet.fields=text`;

function getTweet() {
    return new Promise((resolve, reject) => {
        twit.get(url, (err, data) => {
            if (err) {
                return reject(err);
            };
            return resolve(data);
        });
    });
};

function retweet(id) {
    return new Promise((resolve, reject) => {
        let params = {
            id,
        };
        twit.post("statuses/retweet/:id", params, (err, data) => {
            if (err) {
                return reject(err);
            };
            return resolve(data.data);
        });
    });
};

async function main() {
    try {
        const data = await getTweet();
        const tweets = data.data;
        for await (let tweet of tweets) {
            try {
                await retweet(tweet.id);
                console.log(`Tweet ${tweet.id} retweetado com sucesso!`);
            } catch(err) {
                console.log(err.message);
            };
        };
    } catch(e) {
        console.error(e);
    };
};

console.log('Iniciando o Wendiu bot....');
setTimeout(main, 3000);