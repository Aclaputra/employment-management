first steps :
```
composer require laravel/ui

php artisan ui react

npm install && npm run dev

php artisan ui:auth

composer require barryvdh/laravel-debugbar
```
make Employee model, factory, migrate, & seed :
```
php artisan make:model Employee -mfs
```
in the Migration file : 
```
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_name');
            $table->integer('salary');
            $table->timestamps();
        });
    }
```
```
php artisan migrate
```
Employee Factory :
```
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'employee_name' => $this->faker->name(),
            'salary'        => $this->faker->numberBetween(10000, 500000),
        ];
    }
}
```
employee seeder :
```
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Employee::factory(100)->create();
    }
}
```
Employee model :
```
class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_name',
        'salary'
    ];
}
```
DatabaseSeeder.pho :
```
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(EmployeeSeeder::class);
    }
}
```
migrate the seeder :
```
php artisan migrate --seed
```
make Employee Controller :
```
php artisan make:controller EmployeesController
```
web.php :
```
Route::get('/get/employee/list', 
    [EmployeesController::class, 'getEmployeeList']
)->name('employee.list');
```
EmployeesController :
```
use Illuminate\Http\Request;
use Log;
use Exception;
use App\Models\Employee;

class EmployeesController extends Controller
{
    // Get Employee List from database.

    public function getEmployeeList() {
        try {
            $employees = Employee::all();
            return response()->json($employees);
        }
        catch(Exception $e) {
            Log::error($e);
        }
    }
}
```
Check if the axios api working :

![](./img/api1.png)

Change to order by id descending :
```
    public function getEmployeeList() {
        try {
            $employees = Employee::orderBy('id', 'DESC')->get();
            return response()->json($employees);
        }
        catch(Exception $e) {
            Log::error($e);
        }
    }
}
```

now API Descended by Id :

![](./img/api2.png)

create TableRow.jsx :
```
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

```
in Table.jsx :
```
import TableRow from './TableRow';

class Table extends Component {

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
        );
    }
}
```
create TableActionsButtons.jsx :
```
import React, { Component } from 'react'
import ViewModal from '../modals/ViewModal'

export default class TableActionButtons extends Component {

  constructor(props) {
    super(props);
  }

  // Getting Individual employee data.

  getEmployeeDetails = (id) => {
    axios.post('/get/individual/employee/details', {
      employeeId: id
    }).then((response) => {
      console.log(response.data);
    })
  } 

  render() {
    return (
      <div className="btn-group" role="group">
        <button 
          className="btn btn-primary" 
          type="button"
          data-bs-toggle="modal" 
          data-bs-target="#exampleModal"
          onClick={ () => {this.getEmployeeDetails(this.props.eachRowId)}}
        >
          View
        </button>
        <ViewModal modalId={ this.props.eachRowId }/>

      </div>
    )
  }
}

```
add new function in EmployeesController.php for details:
```
    /**
     * Get Individual employee details.
     */
    public function getEmployeeDetails(Request $request) {
        try {
            $employeeData = Employee::findOrFail($request->get('employeeId'));
            return response()->json($employeeData);
        }
        catch(Exception $e) {
            Log::error($e);
        }
    }
```
api output after clicking view button it will get by id:

![](./img/api3.png)

in TableActionButtons.jsx :

```
import ViewModal from '../modals/ViewModal'

export default class TableActionButtons extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentEmployeeName: null,
      currentEmployeeSalary: null
    }
  }

  // Getting Individual employee data.

  getEmployeeDetails = (id) => {
    axios.post('/get/individual/employee/details', {
      employeeId: id
    }).then((response) => {
      this.setState({
        currentEmployeeName: response.data.employee_name,
        currentEmployeeSalary: response.data.salary
      })
      console.log(response.data);
    })
  } 

  render() {
    return (
      <div className="btn-group" role="group">
        <button 
          className="btn btn-primary" 
          type="button"
          data-bs-toggle="modal" 
          data-bs-target={"#viewModal" + this.props.eachRowId}
          onClick={ () => {this.getEmployeeDetails(this.props.eachRowId)} }
        >
          View
        </button>
        <ViewModal modalId={ this.props.eachRowId } employeeData={ this.state }/>

        <button 
          className="btn btn-info" 
          type="button"
          data-bs-toggle="modal" 
          data-bs-target="#updateModal"
        >
          Update
        </button>

        <button 
          className="btn btn-danger" 
          type="button"
          data-bs-toggle="modal" 
          data-bs-target="#deleteModal"
        >
          Delete
        </button>

      </div>
    )
  }
}
```
ViewModel.jsx :
```
export default class ViewModal extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="modal fade" id={"viewModal" + this.props.modalId} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Name: <strong>{this.props.employeeData.currentEmployeeName}</strong>
                                <hr />
                                Salary: <strong>{this.props.employeeData.currentEmployeeSalary}</strong>
                            </div>
                            <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
```

output after fetch the data :

![](./img/api4.png)

create New Button for Update modal :
```
import UpdateModal from '../modals/UpdateModal';

export default class TableActionButtons extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentEmployeeName: null,
      currentEmployeeSalary: null
    }
  }

  // Getting Individual employee data.

  getEmployeeDetails = (id) => {
    axios.post('/get/individual/employee/details', {
      employeeId: id
    }).then((response) => {
      this.setState({
        currentEmployeeName: response.data.employee_name,
        currentEmployeeSalary: response.data.salary
      })
      console.log(response.data);
    })
  } 

  render() {
    return (
      <div className="btn-group" role="group">
        <button 
          className="btn btn-primary" 
          type="button"
          data-bs-toggle="modal" 
          data-bs-target={"#viewModal" + this.props.eachRowId}
          onClick={ () => {this.getEmployeeDetails(this.props.eachRowId)} }
        >
          View
        </button>
        <ViewModal modalId={ this.props.eachRowId } employeeData={ this.state }/>

        <button 
          className="btn btn-info" 
          type="button"
          data-bs-toggle="modal" 
          data-bs-target={"#updateModal" + this.props.eachRowId}
          onClick={ () => {this.getEmployeeDetails(this.props.eachRowId)} }
        >
          Update
        </button>
        <UpdateModal modalId={ this.props.eachRowId } employeeData={ this.state }/>
```
create New UpdateModal.jsx file :
```
import React, { Component } from 'react'

export default class UpdateModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            employeeName: null,
            employeeSalary: null
        }
    }

    // Updating employee name state
    inputEmployeeName = (event) => {
        this.setState({
            employeeName: event.target.value,
        });
    }
    // Updating employee salary state.
    inputEmployeeSalary = (event) => {
        this.setState({
            employeeSalary: event.target.value,
        });
    }

    // update submit handler
    updateEmployeeData = () => {

    }

    render() {
        return (
            <div className="modal fade" id={"updateModal" + this.props.modalId} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                            value={this.state.employeeName ?? ""}
                                            onChange={this.inputEmployeeName}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" 
                                            id="employeeSalary" 
                                            value={this.state.employeeSalary ?? ""}
                                            onChange={this.inputEmployeeSalary}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                            <input type="submit" 
                                value="Update"
                                onClick={this.updateEmployeeData}
                            />
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

```

output modal after clicked the update button:

![](./img/api5.png)

```
export default class UpdateModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            employeeName: null,
            employeeSalary: null
        }
    }

    // Updating employee name state
    inputEmployeeName = (event) => {
        this.setState({
            employeeName: event.target.value,
        });
    }
    // Updating employee salary state.
    inputEmployeeSalary = (event) => {
        this.setState({
            employeeSalary: event.target.value,
        });
    }

    static getDerivedStateFromProps(props, current_state) {
        let employeeUpdate = {
            employeeName: null,
            employeeSalary: null,
        }

        if(current_state.employeeName !== props.employeeData.currentEmployeeName) {
            employeeUpdate.employeeName = props.employeeData.currentEmployeeName;
        }

        if(current_state.employeeSalary !== props.employeeData.currentEmployeeSalary) {
            employeeUpdate.employeeSalary = props.employeeData.currentEmployeeSalary;
        }

        return employeeUpdate;
    }
```
display update data :

![](./img/api6.png)

modified getDerivedStateFromProps in UpdateModal.jsx :
```
    static getDerivedStateFromProps(props, current_state) {
        let employeeUpdate = {
            employeeName: null,
            employeeSalary: null,
        }

        // Updating data from input.
        if(current_state.employeeName && (current_state.employeeName !== props.employeeData.currentEmployeeName)) {
            return null;
        }

        // Updating data from props Below.
        if(current_state.employeeName !== props.employeeData.currentEmployeeName) {
            employeeUpdate.employeeName = props.employeeData.currentEmployeeName;
        }

        if(current_state.employeeSalary !== props.employeeData.currentEmployeeSalary) {
            employeeUpdate.employeeSalary = props.employeeData.currentEmployeeSalary;
        }

        return employeeUpdate;
    }
```
fix bug after double clicking the update button :
```
        // Updating data from props Below.
        if(current_state.employeeName !== props.employeeData.currentEmployeeName || 
            current_state.employeeName === props.employeeData.currentEmployeeName) {
            employeeUpdate.employeeName = props.employeeData.currentEmployeeName;
        }

        if(current_state.employeeSalary !== props.employeeData.currentEmployeeSalary || 
            current_state.employeeSalary === props.employeeData.currentEmployeeSalary) {
            employeeUpdate.employeeSalary = props.employeeData.currentEmployeeSalary;
        }

        return employeeUpdate;
```

now we can edit the input.

add dd($request->all()); to EmployeeController.php :
```
    /**
     * Update Individual employee data.
     */
    public function updateEmployeeData(Request $request) {
        try {
            dd($request->all());
            $employeeData = Employee::findOrFail($request->get('employeeId'));
            return response()->json($employeeData);
        }
        catch(Exception $e) {
            Log::error($e);
        }
    }
```
output after clicking the save changes button (it will get the updated input data):

![](./img/api7.png)

modify updateEmployeeData function in EmployeeController.php :
```
    /**
     * Update Individual employee data.
     */
    public function updateEmployeeData(Request $request) {
        try {
            // dd($request->all());
            // $employeeData = Employee::findOrFail($request->get('employeeId'));
            // return response()->json($employeeData);
            $employeeId     = $request->get('employeeId');
            $employeeName   = $request->get('employeeName');
            $employeeSalary = $request->get('employeeSalary');

            Employee::where('id', $employeeId)->update([
                'employee_name'   => $employeeName,
                'employee_salary' => $employeeSalary
            ]);

            return response()->json([
                'employee_name'   => $employeeName,
                'employee_salary' => $employeeSalary
            ]);
        }
        catch(Exception $e) {
            Log::error($e);
        }
    }
```
output :

![](./img/api8.png)


modified updateEmployeeData function in UpdateModal.jsx :
```
    // updating employee data
    updateEmployeeData = () => {
        axios.post('/update/employee/data', {
            employeeId: this.props.modalId,
            employeeName: this.state.employeeName,
            employeeSalary: this.state.employeeSalary
        }).then((response) => {
            console.log(response);
            // location.reload();
        })
    }
```
source : https://www.npmjs.com/package/react-toastify

install react-toastify :
```
npm install --save react-toastify
```
add ToastContainer to Table.jsx :
```
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Table extends Component {

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
```
add delete button in TableActionButtons.jsx :
```
        <button 
          className="btn btn-danger" 
          type="button"
          data-bs-toggle="modal" 
          data-bs-target={"#deleteModal" + this.props.eachRowId}
          onClick={ () => {this.getEmployeeDetails(this.props.eachRowId)} }
        >
          Delete
        </button>
        <DeleteModal modalId={ this.props.eachRowId } employeeData={ this.state }/>
```
source : https://axios-http.com/docs/api_intro

create DeleteModal.jsx :
```
import axios from 'axios';
import React, { Component } from 'react'
import { toast } from 'react-toastify';

export default class DeleteModal extends Component {

    constructor(props) {
        super(props);
    }

    // Delete function for employee data.
    deleteEmployeeData = (employee) => {
        axios.delete('/delete/employee/data/' + employee).then(() => {
            toast.error('Employee Deleted successfully');

            setTimeout(() => {
                location.reload();
            }, 2500)
        })
    }

    render() {
        return (
            <div className="modal fade" id={"deleteModal" + this.props.modalId} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Employee Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure, You want to delete this Employee data
                        </div>
                        <div className="modal-footer">
                            <button type="button" 
                                className="btn btn-danger" 
                                data-bs-dismiss="modal"
                                onClick={ () => {this.deleteEmployeeData(this.props.modalId)}}
                                >
                                    Yes
                            </button>
                            <button type="button" 
                                className="btn btn-secondary" 
                                data-bs-dismiss="modal">
                                    Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

```

add new route for delete in web.php :
```
Route::delete('/delete/employee/data/{employee}',
    [EmployeesController::class, 'destroy']
);
```

now delete by id button works :

![](./img/api9.png)

after yes button clicked it will be showing react toast then automaticaly reload the page with deleted data :

![](./img/api10.png)

add store route for creating new data:
```
Route::post('/store/employee/data', 
    [EmployeesController::class, 'store']
);
```
create CreateModal.jsx :
```
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
```
create new store function in EmployeesController.php :
```
    /**
     * Storing new employee.
     */
    public function store(Request $request) {
        try {

            $employeeId     = $request->get('employeeId');
            $employeeName   = $request->get('employeeName');
            $employeeSalary = $request->get('employeeSalary');
            
            Employee::create([
                'employee_name' => $employeeName,
                'salary'        => $employeeSalary
            ]);

            return response()->json([
                'employee_name' => $employeeName,
                'salary'        => $employeeSalary
            ]);
        }
        catch(Exception $e) {
            Log::error($e);
        }
    }
```
add className='form-control mb-3' in CreateModal.jsx & UpdateModal.jsx :
```
<div className="form-group">
    <input type="text" 
        id="employeeName" 
        className='form-control mb-3'
        value={this.state.employeeName ?? ""}
        onChange={this.inputEmployeeName}
    />
</div>
<div className="form-group">
    <input type="text" 
        id="employeeSalary" 
        className='form-control mb-3'
        value={this.state.employeeSalary ?? ""}
        onChange={this.inputEmployeeSalary}
    />
</div>
```
add link js cdn to the bottom of app.blade.php body section (so the modal works):
```
    <!-- jquery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <!-- bootstrap js -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.min.js" integrity="sha384-kjU+l4N0Yf4ZOJErLsIcvOU2qSb74wXpOhqTvwVx3OElZRweTnQ6d31fXEoRD1Jy" crossorigin="anonymous"></script>

</body>
</html>
```
add CreateModal in table.jsx :
```
    render() {
        return (
            <div className="container">
                <ToastContainer/>
                <CreateModal/>
                <div className="row justify-content-center">
```

output after clicking create button (it will be added to database) :

![](./img/api11.png)

<!-- referenaces: (45:23/2:28:56) https://www.youtube.com/watch?v=svziC8BblM0&t=1255s&ab_channel=ZarxBiz-->
