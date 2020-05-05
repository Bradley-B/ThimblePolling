import React from 'react';
import Confetti from "./Confetti";
import CreatePollBubble from "./CreatePollBubble";
import CreatePollSidebar from "./CreatePollSidebar";

export default class CreatePollPage extends React.Component {
    static get PageStateValues() {
        return Object.freeze({
            GATHER_INFO: "gatherInfo",
            VERIFY_FAILURE: "verifyFailure",
            LOADING: "loading",
            DISPLAY_URL: "displayUrl"
        });
    }

    constructor(props) {
        super(props);
        this.onBubbleStateChange = this.onBubbleStateChange.bind(this);
        this.onSidebarStateChange = this.onSidebarStateChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.render = this.render.bind(this);
        this.state = {pageState: CreatePollPage.PageStateValues.GATHER_INFO, requireLogin: true, pollName: '', pollItems: [{checked: true, value: ''}]};
    }

    onSubmit() {
        if(this.state.pollName.trim().length === 0) {
            this.setState({pageState: CreatePollPage.PageStateValues.VERIFY_FAILURE});
            return;
        }

        this.setState({pageState: CreatePollPage.PageStateValues.LOADING}, ()=>{
            fetch('/api/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: this.state.pollName,
                    questions: this.state.pollItems.map((item) => {return item.value;})
                })
            }).then((response) => {
                return response.json();
            }).then((result) => {
                this.setState({pageState: CreatePollPage.PageStateValues.DISPLAY_URL, pollId: result.pollid});
            });
        });
    }

    onSidebarStateChange(state) {
        this.setState(state);
    }

    onBubbleStateChange(pollItems) {
        this.setState({pollItems: pollItems});
    }

    render() {
        let bubbleContent, sidebarContent, className = "create-poll-bubble-content";

        switch (this.state.pageState) {
            case (CreatePollPage.PageStateValues.DISPLAY_URL):
                bubbleContent = <h3>Your poll is available <a href={window.location.href+this.state.pollId}>here</a></h3>;
                break;
            case (CreatePollPage.PageStateValues.LOADING):
                bubbleContent = <h3>Generating poll...</h3>;
                break;
            case (CreatePollPage.PageStateValues.VERIFY_FAILURE):
                bubbleContent = <><h3>Please set a name for your poll</h3><button
                        onClick={()=>{this.setState({pageState: CreatePollPage.PageStateValues.GATHER_INFO})}}>Go Back</button></>;
                break;
            default:
            case (CreatePollPage.PageStateValues.GATHER_INFO):
                className = '';
                bubbleContent = <CreatePollBubble onSubmit={this.onSubmit} onBubbleStateChange={this.onBubbleStateChange} pollItems={this.state.pollItems}/>;
                sidebarContent = <CreatePollSidebar onSidebarStateChange={this.onSidebarStateChange}
                    pollName={this.state.pollName} requireLogin={this.state.requireLogin}/>;
        }

        return <>
            <div className={"title-container"}><h1 className={"title"}>Create Poll</h1></div>
            <div><Confetti/></div>
            <div className={className} id={"talk-bubble"}>{bubbleContent}</div>
            <div id={"sidebar"}>{sidebarContent}</div>
        </>;
    }
}