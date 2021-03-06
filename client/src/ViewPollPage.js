import React from "react";
import Confetti from "./Confetti";
import ViewPollSidebar from "./ViewPollSidebar";

export default class ViewPollPage extends React.Component {
    static get PollResponseValues() {
        return Object.freeze({
            YES: "YES",
            NO: "NO"
        });
    }
    static get PageStateValues() {
        return Object.freeze({
            LOADING: "loading", //page loading
            LOG_IN: "logIn",
            LOG_IN_LOADING: "logInLoading", //loading after the user logs in
            NETWORK_ERROR: "networkError",
            NOT_FOUND_ERROR: "notFoundError",
            DISPLAY_POLL: "displayPoll"
        });
    }

    constructor(props) {
        super(props);
        this.state = {pageState: ViewPollPage.PageStateValues.LOADING};
        this.onLogin = this.onLogin.bind(this);
        this.onLoginStateChange = this.onLoginStateChange.bind(this);
        this.onPollResponse = this.onPollResponse.bind(this);
        this.sendPollItemRequest = this.sendPollItemRequest.bind(this);
        this.fetchPoll = this.fetchPoll.bind(this);
    }

    componentDidMount() {
        this.fetchPoll().then((result)=>{
            if(result.exists === false) {
                this.setState({pageState: ViewPollPage.PageStateValues.NOT_FOUND_ERROR});
            } else {
                this.setState({username: '', pollName: result.name, pageState: ViewPollPage.PageStateValues.LOG_IN});
                // this.setState({username: "Bradley", pollName: result.name, pageState: ViewPollPage.PageStateValues.DISPLAY_POLL});
            }
        });
    }

    sendPollItemRequest(questionId, value) {
        fetch('/api/update', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                authorname: this.state.username,
                questionid: questionId,
                value: value
            })
        });
    }

    fetchPoll() {
        return fetch("/api/get/"+this.props.id).then((response) => {
            return response.json();
        }).then((result)=>{
            if(result.exists) {
                this.setState({pollItems: result.questions});
            }
            return result;
        });
    }

    onPollResponse(e) {
        let value = e.target.checked ? ViewPollPage.PollResponseValues.YES : ViewPollPage.PollResponseValues.NO;
        this.sendPollItemRequest(e.target.id, value);

        let responseMap = this.state.pollItemResponses;
        responseMap.set(e.target.id, e.target.checked);
        this.setState({pollItemResponses: responseMap});
    }

    onLoginStateChange(e) {
        this.setState({username: e.target.value});
    }

    onLogin(e) {
        e.preventDefault();
        this.setState({pageState: ViewPollPage.PageStateValues.LOG_IN_LOADING});

        fetch(`/api/get/${this.props.id}/responses/${this.state.username}`).then((response)=>{ //repopulate the user's choices
            return response.json();
        }).then(result => {
            let responseMap = new Map();
            if(Object.keys(result).length === 0) { //true if author does not exist already in the database
                this.state.pollItems.forEach((item)=>{
                    this.sendPollItemRequest(item.questionid, ViewPollPage.PollResponseValues.NO);
                    responseMap.set(item.questionid, false);
                });
            }

            for (const key of Object.keys(result)) {
                responseMap.set(key, result[key]);
            }
            this.setState({pageState: ViewPollPage.PageStateValues.DISPLAY_POLL, pollItemResponses: responseMap});
        });
    }

    render() {
        let bubbleContent, sidebarContent, title;

        switch (this.state.pageState) {
            default:
            case (ViewPollPage.PageStateValues.LOADING):
            case (ViewPollPage.PageStateValues.LOG_IN_LOADING):
                title = "Loading...";
                bubbleContent = <h3>Loading Poll Information...</h3>;
                break;
            case (ViewPollPage.PageStateValues.LOG_IN):
                title = "Log In";
                bubbleContent = <LogIn onLoginStateChange={this.onLoginStateChange} username={this.state.username} onLogin={this.onLogin}/>;
                break;
            case (ViewPollPage.PageStateValues.NOT_FOUND_ERROR):
                title = "Not Found";
                bubbleContent = <h3>Oops, we can't seem to find this poll. Please check the url and try again.</h3>;
                break;
            case (ViewPollPage.PageStateValues.DISPLAY_POLL):
                title = this.state.pollName;
                bubbleContent = <ViewPoll onPollResponse={this.onPollResponse} pollItems={this.state.pollItems} pollItemResponses={this.state.pollItemResponses}/>;
                sidebarContent = <ViewPollSidebar fetchPoll={this.fetchPoll} id={this.props.id} pollItems={this.state.pollItems}/>;
                break;
        }

        return <>
            <div className={"title-container"}><h1 className={"title"}>{title}</h1></div>
            <div><Confetti/></div>
            <div className="view-poll-bubble-content" id={"talk-bubble"}>{bubbleContent}</div>
            <div id={"sidebar"}>{sidebarContent}</div>
        </>
    }
}

function ViewPoll({pollItems, onPollResponse, pollItemResponses}) {
    return <div className={"view-poll-bubble-content-form"}>
        <div className={"view-poll-bubble-content-form-inner"}>
            {pollItems.map((item, index) => {
                return <div className="view-poll-bubble-content-form-item" key={index}>
                    <input checked={pollItemResponses.get(item.questionid)} onChange={onPollResponse} id={item.questionid} type="checkbox"/>
                    <label>{item.name}</label>
                </div>;
            })}
        </div>
        <h3>Your choices are saved automatically.</h3>
    </div>;
}

function LogIn({username, onLogin, onLoginStateChange}) {
    return <>
        <h3>Enter your name</h3>
        <form className={"login-form"} onSubmit={onLogin}>
            <input onChange={onLoginStateChange} required value={username} placeholder="enter name here" id="username" name="username" type={"text"} />
            <input type={"submit"} />
        </form>
    </>;
}