import React from 'react';

export default class Confetti extends React.Component {
    colors = ["#f40058", "#43bee5", "#9c19cc", "#efa500" ,"#41b853"];

    constructor(props) {
        super(props);
        this.state = {confetti: []};
    }

    componentDidMount() {
        this.updateConfetti();
        let intervalId = setInterval(()=>this.updateConfetti(), 20000);
        this.setState({intervalId: intervalId});
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    updateConfetti() {
        let confetti = [];
        for(let i=0;i<100;i+=2) {
            let style = {
                backgroundColor: this.colors[Math.floor(Math.random() * this.colors.length)],
                top: i + "vh",
                left: Math.floor(Math.random()*100) + "vw",
                transform: `rotate(${Math.floor(Math.random()*60)-30}deg)`
            };
            confetti.push(<div key={i} className="confetti" style={style}/>)
        }
        this.setState({confetti: confetti});
    }

    render() {
        return this.state.confetti;
    }
}