const router = require('express').Router()
const request = require('request')
// const ToneAnalyzer = require('watson-developer-cloud/tone-analyzer/v3')
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')
const Twit = require('twit')
module.exports = router

router.post('/sentiment', async (req, res, next) => {
  try {

    const languageProcessor = new NaturalLanguageUnderstandingV1({
      version: '2018-03-19',
      iam_apikey: process.env.IBM_API_KEY,
      url:
        'https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2018-03-19'
    })

    const parameters = {
      text: req.body.tweets.join(''),
      features: {
        sentiment: {}
      }
    }

    languageProcessor.analyze(parameters, (err, response) => {
      console.log(JSON.stringify(response, null, 2))
      res.send(response)
    })
  } catch(err){
    next(err)
  }
});

router.post('/tweets', async (req, res, next) => {
  try {
    const twitterApiInstance = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET_KEY,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_SECRET_ACCESS_TOKEN
    })
    twitterApiInstance.get('search/tweets', { q: req.body.content, count: 100 }, (err, data, response) => {
      res.send(data)
    })
} catch(err) {
  next(err)
}
})

router.get('/trending', async (req, res, next) => {
  try {
    const twitterApiInstance = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET_KEY,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_SECRET_ACCESS_TOKEN
    })
    const params = {
      id: '1'
    }
    twitterApiInstance.get('trends/place', params, (err, data, response) => {
      res.send(data)
    })
  } catch(err) {
    next(err)
  }
})

/**
 * INTEXTELLAR ROUTE NOT BEING USED
 */

// router.post('/', async (req, res, next) => {
//   try{
//     console.log(process.env.INTEXTELLAR_API_KEY)
//     const options = {
//       method: 'POST',
//       url: 'http://api.intellexer.com/analyzeSentiments',
//       qs: {
//         apikey: process.env.INTEXTELLAR_API_KEY
//       },
//       body: {
//         id: 'snt',
//         text: req.body.text
//       },
//       json: true,
//     }
//     request(options, (response, body) => console.log(body))
//     next()
//   } catch(error) {
//     next(error)
//   }
// })

/**
 * TWITTER API REQUEST MODULE ATTEMPT NOT BEING USED
 */
// router.get('/tweets', async (req, res, next) => {
//   const options = {
//     method: 'GET',
//     url: 'https://api.twitter.com/1.1/search/tweets.json?q=nasa&result_type=popular',
//     oauth: {
//       "consumer_key" : `"${process.env.TWITTER_API_KEY}"`,
//       "token" : `${process.env.TWITTER_ACCESS_TOKEN}"`
//       // "consumer_key" : 'JoecJKjBP483NoyBjTnJhIapL',
//       // "token": '434643421-43lsk5Rt5T6DKe9TfIP1IT3UhQp4QqCg6Glmztu2'
//     }
//   }
//   request(options, (err, response) => {
//     if (err) {
//       console.log('error:', err)
//     }
//     else {
//       console.log(JSON.stringify(response, null, 2))
//     }
//   })
// })




