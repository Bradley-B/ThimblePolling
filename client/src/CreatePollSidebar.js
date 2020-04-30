import React from 'react';

export default class CreatePollSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: ''};
    }

    render() {
        return <div className={"sidebar-content"}>
            <h2>Poll Preferences</h2>
            <form className={"create-poll-sidebar-form"}>
                <label htmlFor="name">Name</label><input required id="name" type="text" placeholder="enter poll name here"/>
                <label>Require Login</label><input type="checkbox"/>
            </form>
        </div>;
    }
}