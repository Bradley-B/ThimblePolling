import React from 'react';

export default class CreatePollSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.onRequireLoginChange = this.onRequireLoginChange.bind(this);
        this.onTextFieldChange = this.onTextFieldChange.bind(this);
    }

    onRequireLoginChange(e) {
        let name = e.target.name;
        this.props.onSidebarStateChange({[name]: true});
    }

    onTextFieldChange(e) {
        e.preventDefault();
        let {name, value} = e.target;
        this.props.onSidebarStateChange({[name]: value});
    }

    render() {
        return <div className={"sidebar-content"}>
            <h2>Poll Preferences</h2>
            <form className={"create-poll-sidebar-form"}>
                <label htmlFor="name">Name</label>
                <input onChange={this.onTextFieldChange} value={this.props.pollName} required
                       name="pollName" id="pollName" type="text" placeholder="enter poll name here"/>

                <label htmlFor="name">URL Extension</label>
                <input onChange={this.onTextFieldChange} value={this.props.pollUrl}
                       name="pollUrl" id="pollName" type="text" placeholder="leave blank for random"/>

                <label htmlFor="requireLogin">Require Login</label>
                <input onChange={this.onRequireLoginChange} checked={this.props.requireLogin}
                       name="requireLogin" id="requireLogin" type="checkbox"/>
            </form>
        </div>;
    }
}