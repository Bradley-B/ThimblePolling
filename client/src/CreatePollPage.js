import React from 'react';
import Confetti from "./Confetti";
import CreatePollBubble from "./CreatePollBubble";

export default class CreatePollPage extends React.Component {
    constructor(props) {
        super(props);
        this.onBubbleStateChange = this.onBubbleStateChange.bind(this);
        this.state = {pollItems: [{checked: true, value: ''}]};
    }

    onSubmit(e) {
        alert("submitted");
    }

    onBubbleStateChange(pollItems) {
        this.setState({pollItems: pollItems});
    }

    render() {
        return <>
            <div className={"title-container"}><h1 className={"title"}>Create Poll</h1></div>
            <div><Confetti/></div>
            <div id={"talk-bubble"}><CreatePollBubble onSubmit={this.onSubmit} onBubbleStateChange={this.onBubbleStateChange} pollItems={this.state.pollItems}/></div>
            <div id={"sidebar"} />
        </>;
    }
}