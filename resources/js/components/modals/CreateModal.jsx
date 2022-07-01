import axios from 'axios';
import React, { Component } from 'react'
import { toast } from 'react-toastify';

export default class CreateModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            employeeName: null,
            employeeSalary: null
        }
    }

    // Create employee name state.

    inputEmployeeName = (event) => {
        this.setState({
            employeeName: event.target.value,
        });
    }

    // Create employee salary state.

    inputEmployeeSalary = (event) => {
        this.setState({
            employeeSalary: event.target.value,
        });
    }

    // Storing employee data.

    storeEmployeeData = () => {
        axios.post('/store/employee/data', {
            employeeName: this.state.employeeName,
            employeeSalary: this.state.employeeSalary,
        }).then(() => {
            toast.success("Employee Saved Successfully");

            setTimeout(() => {
                location.reload();
            },2500)
        })
    }

    render() {
        return (
            <>
                <div className="row text-right mb-3 pb-3">
                    <button className='btn btn-info text-right col-3 offset-md-9'
                        data-bs-toggle="modal"
                        data-bs-target="#modalCreate"
                    >
                        Add New Employee
                    </button>
                </div>
                <div className="modal fade" id={"modalCreate"} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Employee Details</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form className='form'>
                                        <div className="form-group">
                                            <input type="text" 
                                                id="employeeName" 
                                                className='form-control mb-3'
                                                placeholder='Name here'
                                                onChange={this.inputEmployeeName}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input type="text" 
                                                id="employeeSalary" 
                                                className='form-control mb-3'
                                                placeholder='Salary here'
                                                onChange={this.inputEmployeeSalary}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                <input type="button" 
                                    className='btn btn-primary'
                                    value='Save'
                                    onClick={this.storeEmployeeData}
                                />
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
