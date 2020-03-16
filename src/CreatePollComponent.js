import React from 'react';

export default class CreatePollComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: '', number_of_questions: 1, questions: ['']};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
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

    handleChange(event) {
        const event_id = event.target.id;
        const event_value = event.target.value;

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

        //todo perform post request here
    }

    render() {
        let jsx = [];
        for(let index = 0; index < this.state.number_of_questions ; index++) {
            jsx.push(<input key={index} type={"text"} id={index} value={this.state.questions[index]} required={true}
                            placeholder={"Question " + (index+1) + " Name"} onChange={this.handleChange}/>);
            jsx.push(<br key={index+"br"}/>);
        }

        return <div>
                <form className={"create-form"} onSubmit={this.handleSubmit}>
                    <h2>Create Poll</h2>
                    <input type={"text"} placeholder={"Poll Name"} id={"name"} required={true} value={this.state.name} onChange={this.handleChange}/>
                    <br/>
                    {jsx}
                    <button type={"button"} onClick={this.addQuestion}>Add Question</button>
                    <button type={"button"} onClick={this.removeQuestion}>Remove Question</button>
                    <br/>
                    <input type={"submit"} value={"Create Poll"} onSubmit={this.handleSubmit}/>
                </form>
            </div>;
    }
}