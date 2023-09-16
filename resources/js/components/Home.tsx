
function Card() {
    return (
        <div className="card">
            <div className="card-header">EmployeeApp Component</div>
            <div className="card-body">I'm a EmployeeApp component!</div>
        </div>
    );
}

function Home() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <Card/>
                </div>
            </div>
        </div>
    );
}

export default Home;

if (document.getElementById('employeeapp')) {
    ReactDOM.render(<Home />, document.getElementById('employeeapp'));
}
