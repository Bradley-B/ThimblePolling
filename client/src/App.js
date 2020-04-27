import React from 'react';
import logo from './icon.png';
import './App.css';
import CreatePoll from './CreatePoll.js';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
} from "react-router-dom";

function App() {
    return (
        <div className="App">
            <img className="logo" src={logo} alt="logo"/>
            <MainPage/>
        </div>
    );
}

class MainPage extends React.Component {
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
        let bubble = <svg id="talk-bubble-bubble" width="100" height="200" viewBox="0 0 100 100">
            <polygon points="100,0 0,50 100,100" fill="black" />
            <polygon points="100,2 3,50 100,98" fill="#5c6199" />
        </svg>;

        return <Router className={"App"}>
            <Switch>
                <Route path={"/"} exact={true}>
                    <div className={"title-container"}><h1 className={"title"}>Create Poll</h1></div>
                    <div>{this.state.confetti}</div>
                    <div id={"talk-bubble"}><CreatePoll/></div>
                    {/*{bubble}*/}
                    <div id={"sidebar"} />
                </Route>

                <Route path={"/:id"} exact={true}>
                    <div className={"title-container"}><h1 className={"title"}>Test</h1></div>
                    <div>{this.state.confetti}</div>
                    <div id={"talk-bubble"} />
                    {bubble}
                    <div id={"sidebar"} />
                </Route>

            </Switch>
        </Router>;
    }
}

function GetParams() {
    let {id} = useParams();
    // return <Poll id={id} />
}

export default App;
