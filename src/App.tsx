import { Link, Outlet } from 'react-router-dom';
import './App.css';


function App()
{
  return (
    <>
      <div id="sidebar">
        <h1>Title</h1>
        <nav>
          <ul>
            <li>
              <Link to={`nodes/01-arithmetic/01-five`}>Five</Link>
            </li>
            <li>
              <Link to={`nodes/01-arithmetic/02-double`}>Double</Link>
            </li>
            <li>
              <Link to={`nodes/booleans`}>Booleans</Link>
            </li>
            <li>
              <Link to={`nodes/conditionals`}>Conditionals</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div id="main-view">
        <Outlet />
      </div>
    </>
  );
}

export default App;
