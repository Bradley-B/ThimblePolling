import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import './App.css';
import PollComponent from "./PollComponent";

const routes = [
    {
        path: "/",
        exact: true,
        main: () => <Home />
    },
    {
        path: "/about",
        exact: true,
        main: () => <About />
    },
    {
        path: "/:id",
        exact: true,
        main: () => <Poll />
    }
];

function App() {
    return (
        <div className="App">
            <Router>
                <div className="body">

                <header className="App-header">
                    <p>Better Voting</p>
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/about">About</Link>
                    </nav>
                </header>

                <Switch>
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            children={<route.main />}
                        />
                    ))}
                </Switch>


                </div>

            </Router>
        </div>
    );
}

function Home() {
    return <h2>Home</h2>;
}

function About() {
    return <h2>About</h2>;
}

function Poll() {
    let { id } = useParams();
    return <PollComponent id={id}/>
}

export default App;
