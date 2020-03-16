import React from "react";
import PollQuestionComponent from "./PollQuestionComponent";

export default class PollComponent extends React.Component {

    constructor(props) {
        super(props);
        let loading_jsx = <div key={"loading"}><h3>Loading...</h3></div>;
        this.state = {isloading: true, poll_jsx: loading_jsx};
    }

    processQuestionToResultJsx(question) {
        let positive_votes = question.positivevotes;
        let negative_votes = question.negativevotes;
        let vote_percent = positive_votes/(positive_votes+negative_votes);
        if(isNaN(vote_percent)) {
            vote_percent = 0;
        }
        return  <p key={question.questionid}>{question.name + ": " + (vote_percent*100).toFixed(2) + "%"}</p>;
    }

    updateVotes() {
        fetch("/api/get/"+this.props.id).then((response) => {
            response.json().then((result) => {
                if(result.exists === false) {
                    return;
                }

                let result_jsx = [];
                for(const [index, value] of result.questions.entries()) {
                    result_jsx.push(
                        this.processQuestionToResultJsx(value)
                    );
                }
                this.setState({result_jsx: result_jsx});
            });
        });
    }

    componentDidMount() {
        //get poll information here - ajax call or socket connection

        this.interval = setInterval(()=>{this.updateVotes()}, 5000);

        fetch("/api/get/"+this.props.id).then((response) => {
            response.json().then((result) => {
                if(result.exists === false) {
                    let poll_jsx = <div key={"sad"}><h3>Poll does not exist. Boo hoo.</h3></div>;
                    this.setState({isloading: false, exists: false, poll_jsx: poll_jsx});
                    return;
                }

                let poll_jsx = [];
                let result_jsx = [];
                for(const [index, value] of result.questions.entries()) {
                    poll_jsx.push(
                        <PollQuestionComponent key={value.questionid} info={value} authorname={this.props.authorname}/>
                    );
                    result_jsx.push(
                        this.processQuestionToResultJsx(value)
                    );
                }
                this.setState({isloading: false, exists: true, poll_jsx: poll_jsx, pollname: result.name, result_jsx: result_jsx});
            });
        });

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        //const vote_items = [];
        //for(const [index, value] of this.vote_items_sample.items.entries()) {
        //    this.vote_items.push(<div key={index}>{value}</div>);
        //}

        return (
            <div>
                <h2>Poll (name = {"'" + this.state.pollname + "'"})</h2>
                <div className={"poll"}>
                    <div className={"poll-questions"}>
                        {this.state.poll_jsx}
                    </div>
                    <span/>
                    <div className={"poll-results"}>
                        {this.state.result_jsx}
                    </div>
                </div>
            </div>
        );
    }
}