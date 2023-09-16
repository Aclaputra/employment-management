import React, { Component } from 'react'
import TableRow from './TableRow';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateModal from '../modals/CreateModal';

class Table extends Component {
    state: { employees: never[]; };

    constructor(props) {
        super(props);

        this.state = {
            employees: []
        }
    }

    // Life cycle method
    componentDidMount() {
        // getEmployeeList require DOM nodes
        this.getEmployeeList();
    }

    // Get Employee List.
    getEmployeeList = () => {
        let self = this;
        axios.get('/get/employee/list').then(function(response) {
            // console.log(response.data);
            self.setState({
                employees: response.data
            });
        });
    }

    render() {
        return (
            <div className="container">
                <ToastContainer/>
                <CreateModal/>
                <div className="row justify-content-center">
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
                                    {this.state.employees.map(function(x, i) {
                                        return <TableRow key={i} data={x} />
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Table
