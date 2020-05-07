import React from 'react';
import Confetti from "./Confetti";
import CreatePollBubble from "./CreatePollBubble";
import CreatePollSidebar from "./CreatePollSidebar";

export default class CreatePollPage extends React.Component {
    static get PageStateValues() {
        return Object.freeze({
            GATHER_INFO: "gatherInfo",
            URL_EXIST_VERIFY_FAILURE: "urlExistVerifyFailure",
            URL_FORMAT_VERIFY_FAILURE: "urlFormatVerifyFailure",
            NAME_VERIFY_FAILURE: "nameVerifyFailure",
            LOADING: "loading",
            DISPLAY_URL: "displayUrl"
        });
    }

    constructor(props) {
        super(props);
        this.onBubbleStateChange = this.onBubbleStateChange.bind(this);
        this.onSidebarStateChange = this.onSidebarStateChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.goBackButton= this.goBackButton.bind(this);
        this.state = {pageState: CreatePollPage.PageStateValues.GATHER_INFO, requireLogin: true, pollUrl: '', pollName: '', pollItems: [{checked: true, value: ''}]};
    }

    onSubmit() {
        const pollUrl = this.state.pollUrl.trim();
        const regexp = /\\[nbfrtv0]|[\s{}%/'"?#:\\]/g;
        if(pollUrl.match(regexp) !== null) { //url format is bad
            this.setState({pageState: CreatePollPage.PageStateValues.URL_FORMAT_VERIFY_FAILURE});
            return;
        }

        if(this.state.pollName.trim().length === 0) {
            this.setState({pageState: CreatePollPage.PageStateValues.NAME_VERIFY_FAILURE});
            return;
        }

        this.setState({pageState: CreatePollPage.PageStateValues.LOADING}, ()=>{
            fetch(`/api/get/${pollUrl}/exists`).then((response) => {
                return response.json();
            }).then((result) => {
                if(result.exists) {
                    this.setState({pageState: CreatePollPage.PageStateValues.URL_EXIST_VERIFY_FAILURE});
                    throw Error('poll already exists');
                }
                return fetch('/api/create', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        url: pollUrl,
                        name: this.state.pollName,
                        questions: this.state.pollItems.map((item) => {return item.value;})
                    })
                });
            }).then((response) => {
                return response.json();
            }).then((result) => {
                this.setState({pageState: CreatePollPage.PageStateValues.DISPLAY_URL, pollId: result.pollid});
            }).catch(()=>{});
        });
    }

    onSidebarStateChange(state) {
        this.setState(state);
    }

    onBubbleStateChange(pollItems) {
        this.setState({pollItems: pollItems});
    }

    goBackButton() {
        return <button onClick={()=>{this.setState({pageState: CreatePollPage.PageStateValues.GATHER_INFO})}}>Go Back</button>;
    }

    render() {
        let bubbleContent, sidebarContent, className = "create-poll-bubble-content";

        switch (this.state.pageState) {
            case (CreatePollPage.PageStateValues.DISPLAY_URL):
                bubbleContent = <h3>Your poll is available <a href={window.location.href+this.state.pollId}>here</a></h3>;
                break;
            case (CreatePollPage.PageStateValues.LOADING):
                bubbleContent = <h3>Loading...</h3>;
                break;
            case (CreatePollPage.PageStateValues.URL_FORMAT_VERIFY_FAILURE):
                bubbleContent = <><h3>Special characters are not allowed in urls</h3>{this.goBackButton()}</>;
                break;
            case (CreatePollPage.PageStateValues.URL_EXIST_VERIFY_FAILURE):
                bubbleContent = <><h3>This url is already taken</h3>{this.goBackButton()}</>;
                break;
            case (CreatePollPage.PageStateValues.NAME_VERIFY_FAILURE):
                bubbleContent = <><h3>Please set a name for your poll</h3>{this.goBackButton()}</>;
                break;
            default:
            case (CreatePollPage.PageStateValues.GATHER_INFO):
                className = '';
                bubbleContent = <CreatePollBubble onSubmit={this.onSubmit} onBubbleStateChange={this.onBubbleStateChange} pollItems={this.state.pollItems}/>;
                sidebarContent = <CreatePollSidebar onSidebarStateChange={this.onSidebarStateChange}
                                                    pollUrl={this.state.pollUrl} pollName={this.state.pollName} requireLogin={this.state.requireLogin}/>;
        }

        return <>
            <div className={"title-container"}><h1 className={"title"}>Create Poll</h1></div>
            <div><Confetti/></div>
            <div className={className} id={"talk-bubble"}>{bubbleContent}</div>
            <div id={"sidebar"}>{sidebarContent}</div>
        </>;
    }
}