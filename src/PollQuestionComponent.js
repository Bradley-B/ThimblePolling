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
    };

    render() {
        return (
            <ul className={"poll-question"}>
                <li>{this.props.info.name}</li>
                <li>
                    <input value={"yes"} type={"radio"} id={this.props.info.questionid+"yes"} checked={this.state.selectedOption === "yes"} onChange={this.handleOptionChange}/>
                    <label htmlFor={this.props.info.questionid+"yes"} id={"yes"}>YES</label>
                </li>
                <li>
                    <input value={"no"} type={"radio"} id={this.props.info.questionid+"no"} checked={this.state.selectedOption === "no"} onChange={this.handleOptionChange}/>
                    <label htmlFor={this.props.info.questionid+"no"} id={"no"}>NO</label>
                </li>
                <br/>
            </ul>
        );
    }

}