import React from 'react'
import previousDisabled from '../../images/previousDisabled.png'
import nextDisabled from '../../images/nextDisabled.png'
import previous from '../../images/previous.png'
import next from '../../images/next.png'
import './BookCollectionNavigation.css'

/**
 * React component for rendering the library navigation controller for
 * advancing to the next page or returning to the previous.
 */
export default class BookColectionNavigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showMobileVersion: window.matchMedia('(max-width: 42.6875rem)').matches }
  }

  /**
   * I made use of resize listener at window to allow component changes in rendering
   * as the screen shrinks or grows. 
   */
  componentDidMount() {
    this.windowResizeListener = window.addEventListener('resize', this._changeNavigationConfiguration.bind(this))
  }

  /**
   * Here the resize listener at window is removed to avoid unexpected calls to its
   * callback when this component is not being rendered.
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResizeListener)
  }

  render() {
    return (this.state.showMobileVersion ? this._getMobileVersion() : this._getDesktopVersion())
  }

  _getDesktopVersion() {
    return (
      <div className="BookColectionNavigation">
        <div>
          Página
          <span className="App__text--bold"> {this.props.currentPage}</span> de
          <span className="App__text--bold"> {this.props.totalPages}</span>
        </div>
        <div className="BookColectionNavigation__buttons">
          <button onClick={this._goToPreviousPage.bind(this)}>
            <img src={this._previousButton()} alt="Previous page button."></img>
          </button>
          <button onClick={this._goToNextPage.bind(this)}>
            <img src={this._nextButton()} alt="Next page button."></img>
          </button>
        </div>
      </div>
    )
  }

  _getMobileVersion() {
    return (
      <div className="BookColectionNavigation">
        <button onClick={this._goToPreviousPage.bind(this)}>
          <img src={this._previousButton()} alt="Previous page button."></img>
        </button>
        <div>
          Página
          <span className="App__text--bold"> {this.props.currentPage}</span> de
          <span className="App__text--bold"> {this.props.totalPages}</span>
        </div>
        <button onClick={this._goToNextPage.bind(this)}>
          <img src={this._nextButton()} alt="Next page button."></img>
        </button>
      </div>
    )
  }

  _previousButton() {
    return this.props.currentPage === 1 ? previousDisabled : previous
  }

  _nextButton() {
    return this.props.currentPage === this.props.totalPages ? nextDisabled : next
  }

  _changeNavigationConfiguration() {
    if (window.matchMedia('(max-width: 42.6875rem)').matches && !this.state.showMobileVersion) this.setState({ showMobileVersion: true })
    else if (!window.matchMedia('(max-width: 42.6875rem)').matches && this.state.showMobileVersion) this.setState({ showMobileVersion: false })
  }

  _goToPreviousPage() {
    if (typeof this.props.goToPreviousPage === 'function' && this.props.currentPage !== 1) this.props.goToPreviousPage()
  }

  _goToNextPage() {
    if (typeof this.props.goToNextPage === 'function' && this.props.currentPage !== this.props.totalPages) this.props.goToNextPage()
  }
}