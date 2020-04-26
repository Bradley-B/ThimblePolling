import React from "react";

export default class DevComponent extends React.Component {
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
//  clip-path: polygon(100% 0, 0 50%, 100% 100%);

        let bubble = <svg id="talk-bubble-bubble" width="100" height="100">
            <polygon points="100,0 0,50 100,100" fill="black" />
            <polygon points="100,2 3,50 100,98" fill="#5c6199" />
        </svg>;

        return <div>
            <div className={"title-container"}>
                <h1 className={"title"}>Create Poll</h1>
            </div>
            {this.state.confetti}
            <div id={"talk-bubble"}/>
            {bubble}
            <div id={"sidebar"}/>
        </div>;
    }
}