import React, { Component } from 'react'

class Table extends Component {
    render() {
        return (
            <div className="col-md-8 m-4">
                <div className="card">
                    {/* <div className="card-header">EmployeeApp Component</div>
                    <div className="card-body">I'm a EmployeeApp component!</div> */}
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col" width="100px">#</th>
                                <th scope="col" width="100px">Name</th>
                                <th scope="col" width="100px">Salary</th>
                                <th scope="col" width="100px">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                        </tbody>
                    </table>               
                </div>
            </div>
        );
    }
}

export default Table