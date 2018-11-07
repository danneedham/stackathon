import React from 'react'
import axios from 'axios'
import {config} from '../../secrets'
/**
 * COMPONENT
 */

export class TextForm extends React.Component {
  constructor(){
    super()
    this.state = {
      text: ''
    }
    this.handlesSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    this.setState({
      [event.target.name] : event.target.value
    }) 
  }

  //lets figure out how to make this request with our api key.
  handleSubmit () {
    axios.post('http://api.intellexer.com/analyzeSentiments', {id: 'snt1', text: this.state.text})
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <span>Input Text Here</span>
            <input name="text" value={this.state.text} onChange={this.handleChange} />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form> 
      </div>
    )
  }
}