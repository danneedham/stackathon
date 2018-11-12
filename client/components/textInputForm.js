import React from 'react'
import axios from 'axios'
import { Button, Panel } from 'react-bootstrap'
/**
 * COMPONENT
 */

export default class TextForm extends React.Component {
  constructor(){
    super()
    this.state = {
      text: '',
      tweetsArr: [],
      analyzedTweetsArr: [],
      results: {},
      idx: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.analyzeIndividualTweet = this.analyzeIndividualTweet.bind(this)
    this.reset = this.reset.bind(this)
  }

  componentDidMount () {
    if (this.props.location.name) {
      this.setState({
        text: this.props.location.name
      })
    }
  }
  handleChange (event) {
    this.setState({
      [event.target.name] : event.target.value
    }) 
  }

  async handleSubmit (event) {
    event.preventDefault()
    const tweets = []
    const tweetsObj = await axios.post('/api/textForm/tweets', {content: this.state.text})
    tweetsObj.data.statuses.forEach(tweet => tweets.push(tweet.text))
    this.setState({ tweetsArr: tweets})
    const analysisObj = await axios.post('/api/textForm/sentiment', {tweets})
    this.setState({ results: analysisObj.data.sentiment.document})
    this.analyzeIndividualTweet()
  }

  reset() {
    this.setState({
      text: '',
      tweetsArr: [],
      analyzedTweetsArr: [],
      results: {}
    })
  }

  async analyzeIndividualTweet() {
    for (let i = this.state.idx; i<this.state.idx+5; i++) {
      const resultObj = await axios.post('/api/textForm/sentiment', {tweets: [this.state.tweetsArr[i]]})
      if (resultObj.data.sentiment) {
        this.setState({ analyzedTweetsArr: [
          ...this.state.analyzedTweetsArr, {
            text: this.state.tweetsArr[i],
            label: resultObj.data.sentiment.document.label,
            score: resultObj.data.sentiment.document.score,
          }
        ]})
      }
    }
    this.setState({
      idx: this.state.idx+5
    })
    console.log(this.state.analyzedTweetsArr)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <span>Search Twitter: </span>
            <input name="text" value={this.state.text} onChange={this.handleChange} />
          </div>
          <div>
            <Button type="submit" disabled={this.state.text === ''} bsStyle='primary'>Submit</Button>
          </div>
        </form> 
        {/* show sentiment value */}
        {this.state.results.label ? 
        <div>
          <Button onClick={this.reset} bsStyle='danger'>Clear</Button>
          <h3>{`twitter is saying 
            ${this.state.results.score > .4 || this.state.results.score < -.4 ? 'mostly' : 
              this.state.results.score > .1 || this.state.results.score <-.1 ? 'fairly' : 'slightly'}
            ${this.state.results.label} things about ${this.state.text}`}
          </h3>
          {this.state.analyzedTweetsArr.map(tweet => 
            <Panel 
              bsStyle={
                tweet.score > 0 ?
                'success' :
                  tweet.score < 0 ? 
                  'danger' :
                  'info'
              } 
              key={this.state.analyzedTweetsArr.indexOf(tweet)}
            >
              <Panel.Heading>
                <Panel.Title componentClass='h3'>{tweet.label}</Panel.Title> 
              </Panel.Heading>
              <Panel.Body>{tweet.text}</Panel.Body>
            </Panel>
          )}
          <Button onClick={this.analyzeIndividualTweet} bsStyle='info'>More Tweets</Button>
        </div>
        : null}
      </div>
    )
  }
}