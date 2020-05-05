import React from 'react';

export default class CreatePollSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.onRequireLoginChange = this.onRequireLoginChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
    }

    onRequireLoginChange(e) {
        let name = e.target.name;
        this.props.onSidebarStateChange({[name]: true});
    }

    onNameChange(e) {
        e.preventDefault();
        let {name, value} = e.target;
        this.props.onSidebarStateChange({[name]: value});
    }

    render() {
        return <div className={"sidebar-content"}>
            <h2>Poll Preferences</h2>
            <form className={"create-poll-sidebar-form"}>
                <label htmlFor="name">Name</label>
                <input onChange={this.onNameChange} value={this.props.pollName} required
                       name="pollName" id="pollName" type="text" placeholder="enter poll name here"/>

                <label htmlFor="requireLogin">Require Login</label>
                <input onChange={this.onRequireLoginChange} checked={this.props.requireLogin}
                       name="requireLogin" id="requireLogin" type="checkbox"/>
            </form>
        </div>;
    }
}