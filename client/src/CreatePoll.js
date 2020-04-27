import React from "react";

export default class CreatePoll extends React.Component {
    constructor(props) {
        super(props);
    }

    onSubmit(e) {
        alert("submitted");
        e.preventDefault();
    }

    add(e) {
        alert("add");
        e.preventDefault();
    }

    remove(e) {
        alert("remove");
        e.preventDefault();
    }

    pollItem() {
        return <div className="create-poll-item">
            <input defaultChecked={true} type={"checkbox"}/>
            <input required={true} type={"text"} placeholder="Option"/>
        </div>;
    }

    render() {
        return <form className={"create-poll-form"} onSubmit={this.onSubmit}>
            <div className={"create-poll-items"}>
                {[this.pollItem(), this.pollItem(), this.pollItem(), this.pollItem(), this.pollItem()]}
            </div>
            <div className={"create-poll-buttons"}>
                <button onClick={this.add} id="add">Add Option</button>
                <button onClick={this.remove} id="remove">Remove Option</button>
                <input id="submit" type={"submit"}/>
            </div>
        </form>
    }
}