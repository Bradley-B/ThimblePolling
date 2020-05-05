import React from 'react';
import logo from './icon.png';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
} from "react-router-dom";
import CreatePollPage from "./CreatePollPage";
import ViewPollPage from "./ViewPollPage";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    randomAnimation() {
        let number = Math.floor(Math.random() * 50);
        this.setState({animate: number === 1});
    }

    componentDidMount() {
        let intervalId = setInterval(()=>this.randomAnimation(), 5000);
        this.setState({interval: intervalId});
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    render() {
        let className = "logo ";
        if(this.state.animate) {
            className = className + "logo-animation";
        }

        return <div className="App">
            <img className={className} src={logo} alt="logo"/>
            <MainPage/>
        </div>
    };
}

class MainPage extends React.Component {

    render() {
        // let bubble = <svg id="talk-bubble-bubble" width="100" height="200" viewBox="0 0 100 100">
        //     <polygon points="100,0 0,50 100,100" fill="black" />
        //     <polygon points="100,2 3,50 100,98" fill="#5c6199" />
        // </svg>;

        return <Router className={"App"}>
            <Switch>
                <Route path={"/"} exact={true}>
                    <CreatePollPage />
                </Route>

                <Route path={"/:id"} exact={true}>
                    <GetParams />
                </Route>

            </Switch>
        </Router>;
    }
}

function GetParams() {
    let {id} = useParams();
    return <ViewPollPage id={id} />
}

export default App;
