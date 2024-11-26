import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchBlog } from '../../actions'

class BlogShow extends Component {
  componentDidMount() {
    this.props.fetchBlog(this.props.match.params._id)
  }

  renderImage() {
    if (this.props.blog.imageUrl) {
      const imageSrc = `https://advanced-nodeapp-bucket.s3.ap-south-1.amazonaws.com/${this.props.blog.imageUrl}`
      console.log(imageSrc)
      return <img style={{ width: '100%', height: '400px', objectFit: 'cover' }} src={imageSrc} alt='' />
    }
  }

  render() {
    if (!this.props.blog) {
      return ''
    }

    const { title, content } = this.props.blog

    return (
      <div>
        {this.renderImage()}
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    )
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] }
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow)
