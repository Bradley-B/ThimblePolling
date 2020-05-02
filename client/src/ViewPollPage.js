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
    }

    componentDidMount() {
        fetch("/api/get/"+this.props.id).then((response) => {
            return response.json();
        }).then((result)=>{
            console.log(JSON.stringify(result));
            if(result.exists === false) {
                this.setState({pageState: ViewPollPage.PageStateValues.NOT_FOUND_ERROR});
            } else {
                this.setState({pollName: result.name, pollItems: result.questions, pageState: ViewPollPage.PageStateValues.LOG_IN});
            }
        });
    }

    render() {
        let bubbleContent, sidebarContent, title = "Loading...";

        switch (this.state.pageState) {
            case (ViewPollPage.PageStateValues.LOADING):
                bubbleContent = <h3>Loading Poll Information...</h3>;
                break;
            case (ViewPollPage.PageStateValues.LOG_IN):
                bubbleContent = <LogIn />;
                break;
            case (ViewPollPage.PageStateValues.NOT_FOUND_ERROR):
                title = "Not Found";
                bubbleContent = <h3>Oops, we can't seem to find this poll. Please check the url and try again.</h3>;
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

function LogIn() {
    return null;
}