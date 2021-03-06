import React from "react";

export default class CreatePollBubble extends React.Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onTextChange = changedItemId => e => {
        e.preventDefault();
        this.props.onBubbleStateChange(this.props.pollItems.map((item, id) => {
                    if(changedItemId !== id) return item;
                    return this.pollItemObject(item.checked, e.target.value);
        }));
    };

    onCheckChange = changedItemId => e => {
        this.props.onBubbleStateChange(this.props.pollItems.map((item, id) => {
                if(changedItemId !== id) return item;
                return this.pollItemObject(e.target.checked, item.value);
        }));
    };

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(e);
    }

    add(e) {
        e.preventDefault();
        this.props.onBubbleStateChange(this.props.pollItems.concat([this.pollItemObject(true, '')]));
    }

    remove = removedItemId => e => {
        e.preventDefault();
        if(removedItemId < 1) return;
        this.props.onBubbleStateChange(this.props.pollItems.filter((item, id) => removedItemId !== id));
    };

    pollItemObject(checked, value) {
        return {checked: checked, value: value};
    }

    pollItemJsx(pollItemObject, id) {
        return <div key={id} className="create-poll-item">
            <input onChange={this.onCheckChange(id)} defaultChecked={true} type={"checkbox"} value={pollItemObject.checked}/>
            <input onChange={this.onTextChange(id)} required={true} type={"text"} placeholder="enter option here" value={pollItemObject.value}/>
        </div>;
    }

    render() {
        return <form className={"create-poll-form"} onSubmit={this.onSubmit}>
            <div className={"create-poll-items"}>
                {this.props.pollItems.map((item, id) => {
                    return this.pollItemJsx(item, id);
                })}
            </div>
            <div className={"create-poll-buttons"}>
                <button onClick={this.add} id="add">Add Option</button>
                <button onClick={this.remove(this.props.pollItems.length - 1)} id="remove">Remove Option</button>
                <input id="submit" type={"submit"}/>
            </div>
        </form>
    }
}