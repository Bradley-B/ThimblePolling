import React from "react";

export default class DevComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return <div>
            <h1 className={"title"}>Create Poll</h1>
            <div className={"fleck"}/>
            <div id={"talk-bubble"}/>
            <div id={"sidebar"}/>
        </div>;
    }
}