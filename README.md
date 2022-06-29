
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
in the migration file : 
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
employee factory :
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

<!-- referenaces: (45:23/2:28:56) https://www.youtube.com/watch?v=svziC8BblM0&t=1255s&ab_channel=ZarxBiz-->