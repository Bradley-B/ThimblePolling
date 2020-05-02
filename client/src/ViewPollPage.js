import React from "react";
import Confetti from "./Confetti";

export default class ViewPollPage extends React.Component {
    static get PageStateValues() {
        return Object.freeze({
            LOADING: "loading",
            LOG_IN: "logIn",
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
    }

    componentDidMount() {
        fetch("/api/get/"+this.props.id).then((response) => {
            return response.json();
        }).then((result)=>{
            if(result.exists === false) {
                this.setState({pageState: ViewPollPage.PageStateValues.NOT_FOUND_ERROR});
            } else {
                this.setState({pollName: result.name, pollItems: result.questions, pageState: ViewPollPage.PageStateValues.LOG_IN});
            }
        });
    }

    onLoginStateChange(e) {
        this.setState({username: e.target.value});
    }

    onLogin(e) {
        e.preventDefault();
        this.setState({pageState: ViewPollPage.PageStateValues.DISPLAY_POLL})
    }

    render() {
        let bubbleContent, sidebarContent, title;

        switch (this.state.pageState) {
            default:
            case (ViewPollPage.PageStateValues.LOADING):
                title = "Loading...";
                bubbleContent = <h3>Loading Poll Information...</h3>;
                break;
            case (ViewPollPage.PageStateValues.LOG_IN):
                title = "Log In";
                bubbleContent = <LogIn username={this.state.username} onLogin={this.onLogin}/>;
                break;
            case (ViewPollPage.PageStateValues.NOT_FOUND_ERROR):
                title = "Not Found";
                bubbleContent = <h3>Oops, we can't seem to find this poll. Please check the url and try again.</h3>;
                break;
            case (ViewPollPage.PageStateValues.DISPLAY_POLL):
                title = this.state.pollName;
                bubbleContent = <div/>;
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

function LogIn({username, onLogin}) {
    return <>
        <h3>Enter your name</h3>
        <form className={"login-form"} onSubmit={onLogin}>
            <input required value={username} placeholder="enter name here" id="username" name="username" type={"text"} />
            <input type={"submit"} />
        </form>
    </>;
}