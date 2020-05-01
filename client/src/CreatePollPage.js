import React from 'react';
import Confetti from "./Confetti";
import CreatePollBubble from "./CreatePollBubble";
import CreatePollSidebar from "./CreatePollSidebar";

export default class CreatePollPage extends React.Component {
    constructor(props) {
        super(props);
        this.onBubbleStateChange = this.onBubbleStateChange.bind(this);
        this.onSidebarStateChange = this.onSidebarStateChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {requireLogin: true, pollName: '', pollItems: [{checked: true, value: ''}]};
    }

    onSubmit() {
        alert(JSON.stringify(this.state));
    }

    onSidebarStateChange(state) {
        this.setState(state);
    }

    onBubbleStateChange(pollItems) {
        this.setState({pollItems: pollItems});
    }

    render() {
        return <>
            <div className={"title-container"}><h1 className={"title"}>Create Poll</h1></div>
            <div><Confetti/></div>
            <div id={"talk-bubble"}><CreatePollBubble onSubmit={this.onSubmit} onBubbleStateChange={this.onBubbleStateChange} pollItems={this.state.pollItems}/></div>
            <div id={"sidebar"}><CreatePollSidebar onSidebarStateChange={this.onSidebarStateChange} pollName={this.state.pollName} requireLogin={this.state.requireLogin}/></div>
        </>;
    }
}