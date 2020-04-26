import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import './App.css';
import './dev.css';
import PollComponent from "./PollComponent";
import LoginComponent from "./LoginComponent";
import CreatePollComponent from "./CreatePollComponent";
import DevComponent from "./DevComponent";

const routes = [
    {
        path: "/",
        exact: true,
        main: () => <DevComponent />
    },
    {
        path: "/about",
        exact: true,
        main: () => <About />
    },
    {
        path: "/:id",
        exact: true,
        main: () => <GetParams />
    }
];

function App() {
    return (
        <div className="App">
            <Router>

                <Switch>
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            children={<route.main/>}
                        />
                    ))}
                </Switch>

            </Router>
        </div>
    );
}

function About() {
    return <div>
        <h2>About</h2>
        <p>This website is an easy way to create polls. The yes/no format encourages approval voting, where people vote for all things they like, not just their favorite.</p>
        <br/>
        <p>Inspired by</p><a href={"https://www.youtube.com/watch?v=orybDrUj4vA"}>this CGP Grey video</a>
    </div>;
}

function GetParams() {
    let {id} = useParams();
    return <Poll id={id} />
}

class Poll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {logged_in: false};
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(name) {
        this.setState({logged_in: true, name: name});
    }

    render() {
        if(this.state.logged_in) {
            return <PollComponent id={this.props.id} authorname={this.state.name}/>
        } else {
            return <LoginComponent callback={this.handleLogin}/>
        }
    }
}

export default App;
