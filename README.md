
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

<!-- referenaces: (45:23/2:28:56) https://www.youtube.com/watch?v=svziC8BblM0&t=1255s&ab_channel=ZarxBiz-->