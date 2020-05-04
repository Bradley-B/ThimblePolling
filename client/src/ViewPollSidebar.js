import React from 'react';
import {Pie} from 'react-chartjs-2';

export default class ViewPollSidebar extends React.Component {
    constructor(props) {
        super(props);
        const colors = ["#41b853", "#43bee5", "#f40058", "#efa500", "#9c19cc"];
        this.state = {data: {
            labels: this.props.pollItems.map((item)=>{return item.name}),
            datasets: [{
                data: this.props.pollItems.map((item)=>{return item.positivevotes}),
                backgroundColor: function(context) {
                    return colors[context.dataIndex % colors.length];
                }
            }],
        }, options: {
            title: {
              fontFamily: '"PT Sans", sans-serif',
              fontColor: "#efa500",
              fontSize: 35,
              text: "Poll Results",
              display: true
            },
            layout: {
                padding: {
                    left: 25,
                    right: 25,
                    bottom: 0,
                    top: 10
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: "top",
                align: "start",
                onClick: () => {},
                labels: {
                    fontColor: "white"
                }
            }
        }};

    }

    render() {
        return <div className={"view-poll-sidebar"}>
            <Pie data={this.state.data} options={this.state.options} />
        </div>
    }
}