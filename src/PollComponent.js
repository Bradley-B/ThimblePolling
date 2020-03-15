import React from "react";
import PollQuestionComponent from "./PollQuestionComponent";

export default class PollComponent extends React.Component {

    constructor(props) {
        super(props);
        let loading_jsx = <div key={"loading"}><h3>Loading...</h3></div>;
        this.state = {isloading: true, jsx: loading_jsx};
    }

    componentDidMount() {
        //get poll information here - ajax call or socket connection

        fetch("/api/get/"+this.props.id).then((response) => {
            response.json().then((result) => {
                if(result.exists === false) {
                    let jsx = <div key={"sad"}><h3>Poll does not exist. Boo hoo.</h3></div>;
                    this.setState({isloading: false, exists: false, jsx: jsx});
                    return;
                }

                let jsx = [];
                for(const [index, value] of result.questions.entries()) {
                    jsx.push(
                        <PollQuestionComponent key={value.questionid} info={value}/>
                    );
                }
                this.setState({isloading: false, exists: true, jsx: jsx});
            });
        });

    }

    render() {
        //const vote_items = [];
        //for(const [index, value] of this.vote_items_sample.items.entries()) {
        //    this.vote_items.push(<div key={index}>{value}</div>);
        //}

        return (
            <div>
                <h2>Poll (id = {this.props.id})</h2>
                <div className={"poll"}>
                    {this.state.jsx}
                </div>
            </div>
        );
    }
}