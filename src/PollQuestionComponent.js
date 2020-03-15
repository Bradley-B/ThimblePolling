import React from 'react';

export default class PollQuestionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleOptionChange = changeEvent => {
      this.setState({
          selectedOption: changeEvent.target.value
      });
      fetch('/api/update', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              authorname: this.props.authorname,
              questionid: this.props.info.questionid,
              value: changeEvent.target.value
          })
      });
    };

    render() {
        return (
            <ul className={"poll-question"}>
                <li id={"label"}>{this.props.info.name}</li>
                <li>
                    <input value={"YES"} type={"radio"} id={this.props.info.questionid+"yes"} checked={this.state.selectedOption === "YES"} onChange={this.handleOptionChange}/>
                    <label htmlFor={this.props.info.questionid+"yes"} id={"yes"}>YES</label>
                </li>
                <li>
                    <input value={"NO"} type={"radio"} id={this.props.info.questionid+"no"} checked={this.state.selectedOption === "NO"} onChange={this.handleOptionChange}/>
                    <label htmlFor={this.props.info.questionid+"no"} id={"no"}>NO</label>
                </li>
                <br/>
            </ul>
        );
    }

}