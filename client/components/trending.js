import React, { Component } from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom'

export default class Trending extends Component {
  constructor(){
    super()
    this.state = {
      trends: []
    }
  }
  async componentDidMount() {
    const trendsObj = await axios.get('/api/textForm/trending')
    this.setState({
      trends: trendsObj.data[0].trends
    })
    console.log(this.state.trends)
  }
  render() {
    return (
      <div>
        {this.state.trends.length ?
          this.state.trends.map(trend => 
            <div>
              <Link to={{pathname:"/sentiment", name: trend.name}}>{trend.name}</Link>
            </div>)
          : null
        }
      </div>
    )
  }
}
