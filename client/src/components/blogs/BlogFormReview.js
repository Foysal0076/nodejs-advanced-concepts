// BlogFormReview shows users their form inputs for review
import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import formFields from './formFields'
import { withRouter } from 'react-router-dom'
import * as actions from '../../actions'

class BlogFormReview extends Component {

  constructor(props) {
    super(props)
    this.state = {
      file: null
    }
    this.onFileChange = this.onFileChange.bind(this)
  }

  onFileChange(event) {
    const file = event.target.files[0]
    if (file) {
      this.setState({ file })
    }
  }

  renderFields() {
    const { formValues } = this.props

    return _.map(formFields, ({ name, label }) => {
      return (
        <div key={name}>
          <label>{label}</label>
          <div>{formValues[name]}</div>
        </div>
      )
    })
  }

  renderButtons() {
    const { onCancel } = this.props

    return (
      <div>
        <button
          className="yellow darken-3 white-text btn-flat"
          onClick={onCancel}
        >
          Back
        </button>
        <button className="green btn-flat right white-text">
          Save Blog
          <i className="material-icons right">email</i>
        </button>
      </div>
    )
  }

  onSubmit(event) {
    event.preventDefault()

    const { submitBlog, history, formValues } = this.props
    submitBlog(formValues, this.state.file, history)
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h5>Please confirm your entries</h5>
        {this.renderFields()}
        <div>
          <h5>Add an image</h5>
          <input onChange={this.onFileChange} type="file" accept='image/*' placeholder='Choose an image' />
        </div>
        {this.renderButtons()}
      </form>
    )
  }
}

function mapStateToProps(state) {
  return { formValues: state.form.blogForm.values }
}

export default connect(mapStateToProps, actions)(withRouter(BlogFormReview))
