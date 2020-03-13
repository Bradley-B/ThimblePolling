import React from 'react';

export default class PollQuestionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({name: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.callback(event.target.value);
    }

    render() {
        return (
            <div>
                <form className={"login-form"} onSubmit={this.handleSubmit}>
                    <h2>Login</h2>
                    <input type={"text"} placeholder={"Name"} id={"name"} required={true} value={this.state.name} onChange={this.handleChange}/>
                    <br/>
                    <input type={"submit"} value={"Login"}/>
                </form>
            </div>
        );
    }
}