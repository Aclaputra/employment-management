import React, { Component } from 'react'

export default class TableRow extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <th scope="row">{this.props.data.id}</th>
                <td>{this.props.data.employee_name}</td>
                <td>{this.props.data.salary}</td>
                <td>@mdo</td>
            </tr>
        )
    }
}
