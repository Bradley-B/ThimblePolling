import React from "react";
import PollQuestionComponent from "./PollQuestionComponent";

export default class PollComponent extends React.Component {
    vote_items = [];
    vote_items_sample = {
        exists: true,
        id: 0,
        name: "test poll",
        total_votes: 0, 
        items: [
            {
                name: "item one",
                id: 1,
                positive_votes: 0,
                negative_votes: 0
            },
            {
                name: "item two",
                id: 2,
                positive_votes: 0,
                negative_votes: 0 
            }
        ] };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        //get poll information here - ajax call or socket connection

        if(!this.vote_items_sample.exists) {
            return;
        }

        for(const [index, value] of this.vote_items_sample.items.entries()) {
            this.vote_items.push(
                <PollQuestionComponent key={value.id} info={value}/>
            );
        }

        this.setState({"vote_items": this.vote_items});
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
                    <div>
                    {this.state.vote_items}
                    </div>
                </div>
            </div>
        );
    }
}