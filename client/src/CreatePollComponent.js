import React from 'react';

export default class CreatePollComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: '', number_of_questions: 1, questions: [''], buttons_enabled: true};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    addQuestion() {
        let new_questions = this.state.questions;
        new_questions.push('');
        this.setState({number_of_questions: this.state.number_of_questions + 1, questions: new_questions});
    }

    removeQuestion() {
        if(this.state.number_of_questions <= 1) {
            this.setState({number_of_questions: 1});
            return;
        }
        let new_questions = this.state.questions;
        new_questions.pop();
        this.setState({number_of_questions: this.state.number_of_questions - 1, questions: new_questions});
    }

    handleKeyPress(event) {
        if(event.which === 13) { //enter key pressed
            event.preventDefault();
            if(String(event.target.id) === String(this.state.number_of_questions - 1)) {
                this.addQuestion();
            }
        }
    }

    handleChange(event) {
        const event_id = event.target.id;
        const event_value = event.target.value;

        if(!this.state.buttons_enabled) {
            return;
        }

        if(event.target.id === "name") {
            this.setState({name: event.target.value});
        } else {
            let questions = this.state.questions;
            questions[event_id] = event_value;
            this.setState({questions: questions});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({buttons_enabled: false});

        fetch('/api/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.name,
                questions: this.state.questions
            })
        }).then((response) => {
            response.json().then((result) => {
                this.setState({poll_id: result.pollid})
            });
        });

    }

    render() {
        let jsx = [];
        for(let index = 0; index < this.state.number_of_questions ; index++) {
            jsx.push(<input key={index} type={"text"} id={index} value={this.state.questions[index]} required={true} onKeyPress={this.handleKeyPress}
                            placeholder={"Option " + (index+1) + " Name"} onChange={this.handleChange}/>);
            jsx.push(<br key={index+"br"}/>);
        }

        let url = '';
        if(this.state.poll_id !== undefined) {
            url = window.location.href+this.state.poll_id;
        }

        return <div>
            <form className={"create-form"} onSubmit={this.handleSubmit}>
                <h2>Create Poll</h2>
                <input type={"text"} placeholder={"Poll Name"} id={"name"} required={true} value={this.state.name} onChange={this.handleChange}
                       onKeyPress={this.handleKeyPress} />
                <br/>
                {jsx}
                <button type={"button"} onClick={this.addQuestion} disabled={!this.state.buttons_enabled}>Add Question</button>
                <button type={"button"} onClick={this.removeQuestion} disabled={!this.state.buttons_enabled}>Remove Question</button>
                <br/>
                <input type={"submit"} value={"Create Poll"} onSubmit={this.handleSubmit} disabled={!this.state.buttons_enabled}/>
            </form>
            <br/><a href={url}>{url}</a>
        </div>;
    }
}