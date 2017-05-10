import React from 'react'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import { fromJS } from 'immutable'

import editorStyles from './styles.css'
import mentionsStyles from './mentionsStyles.css'

const mentionPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  theme: mentionsStyles,
  mentionPrefix: '@',
})

const suggestionsFilter = (searchValue, suggestions) => {
  const value = searchValue.toLowerCase()
  const filteredSuggestions = suggestions.filter((suggestion) => (
    !value || suggestion.get('name').toLowerCase().indexOf(value) > -1
  ))

  if (filteredSuggestions.size < 5) {
    return filteredSuggestions
  }
  return filteredSuggestions.setSize(5)
}

const { MentionSuggestions } = mentionPlugin
const plugins = [mentionPlugin]

export default class CommentBox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty(),
      suggestions: fromJS(props.suggestions),
    }
  }

  onChange = (editorState) => {
    const { onContentChange } = this.props
    onContentChange(
      editorState
      .getCurrentContent()
      .getPlainText()
    )

    this.setState({
      editorState,
    })
  };

  onSearchChange = ({ value }) => {
    const { suggestions } = this.props
    const mentions = fromJS(suggestions)
    this.setState({
      suggestions: suggestionsFilter(value, mentions),
    })
  };

  onAddMention = (e) => {
    this.props.onAddMention(e.get('_id'))
  }

  focus = () => {
    this.editor.focus()
  };

  render() {
    const { suggestions } = this.state
    return (
      <div className={ editorStyles.editor } onClick={ this.focus }>
        <Editor
          editorState={ this.state.editorState }
          onChange={ this.onChange }
          plugins={ plugins }
          ref={ (element) => { this.editor = element } }
        />
        <MentionSuggestions
          onSearchChange={ this.onSearchChange }
          suggestions={ fromJS(suggestions) }
          onAddMention={ this.onAddMention }
        />
      </div>
    )
  }
}

CommentBox.propTypes = {
  suggestions: React.PropTypes.array,
  onAddMention: React.PropTypes.func,
  onContentChange: React.PropTypes.func,
}
