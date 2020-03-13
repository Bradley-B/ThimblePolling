import React from 'react';

export default class PollQuestionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //selectedOption: "no"
        };
    }

    handleOptionChange = changeEvent => {
      this.setState({
          selectedOption: changeEvent.target.value
      });
      console.log(changeEvent.target.value);
    };

    render() {
        return (
            <ul className={"poll-question"}>
                <li>{this.props.info.name}</li>
                <li>
                    <input value={"yes"} type={"radio"} id={this.props.info.id+"yes"} checked={this.state.selectedOption === "yes"} onChange={this.handleOptionChange}/>
                    <label htmlFor={this.props.info.id+"yes"} id={"yes"}>YES</label>
                </li>
                <li>
                    <input value={"no"} type={"radio"} id={this.props.info.id+"no"} checked={this.state.selectedOption === "no"} onChange={this.handleOptionChange}/>
                    <label htmlFor={this.props.info.id+"no"} id={"no"}>NO</label>
                </li>
                <br/>
            </ul>
        );
    }

}