import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faEye, faPlus, faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Table.css';
import Paginator from './Paginator'; // Importa el componente del paginador

function Table() {
  const { tasks, deleteTask } = useTasks();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const handleDelete = (id) => {
    deleteTask(id);
  };

  const searcher = (e) => {
    setSearch(e.target.value)
  }

  const filteredTasks = !search ? tasks : tasks.filter((task) => {
    const apellidoresp1 = task.apellidoresp1 ? task.apellidoresp1.toLowerCase() : '';
    const nombreresp1 = task.nombreresp1 ? task.nombreresp1.toLowerCase() : '';
    const dniresp1 = task.dni ? task.dniresp1.toLowerCase() : '';
    const municipio = task.municipio ? task.municipio.toLowerCase() : '';
    const direccion = task.direccion ? task.direccion.toLowerCase() : '';
    const searchLowerCase = search.toLowerCase();

    return (
      apellidoresp1.includes(searchLowerCase) ||
      nombreresp1.includes(searchLowerCase) ||
      dniresp1.includes(searchLowerCase) ||
      municipio.includes(searchLowerCase) ||
      direccion.includes(searchLowerCase)
    );
  });

  // Paginación
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='container-fluid bg-primary vh-100 vw-100 d-flex align-items-center justify-content-center'>
      <div className="row">
        <div className="col-md-12">
          <div className="table-container">
            <div className="table-title">Buscador</div>
            <div className="input-group mb-3">
              <input
                value={search}
                onChange={searcher}
                type="text"
                placeholder="Buscar"
                className="form-control border border-gray-300 focus:outline-none"
                aria-describedby="search-icon"
              />
              <span className="input-group-text bg-white border-none" id="search-icon">
                <FontAwesomeIcon icon={faSearch} className="ml-2" />
              </span>
            </div>
            <ul className='button-container'>
              <li>
                <Link to="/add-task" className='btn btn-success'>
                  <FontAwesomeIcon icon={faPlus} />
                </Link>
              </li>
            </ul>
            <br />
            <div className="table-scroll">
              <table className='table' style={{ textTransform: 'uppercase' }}>
                <thead>
                  <tr>
                    <th colSpan="10" className="table-title">Listado de Inscriptos</th>
                  </tr>
                  <tr>
                    <th>Apellido</th>
                    <th>Nombre</th>
                    <th>DNI</th>
                    <th>Municipio</th>
                    <th>Género</th>
                    <th>Superficie Total</th>
                    <th>Vende lo que produce</th>
                    <th>Pueblo Originarios</th>
                    <th>Ver</th>
                    {/* <th>Editar</th>
                    <th>Borrar</th> */}
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.apellidoresp1 ? task.apellidoresp1.toUpperCase() : ''}</td>
                      <td>{task.nombreresp1 ? task.nombreresp1.toUpperCase() : ''}</td>
                      <td>{task.dniresp1 ? task.dniresp1.toUpperCase() : ''}</td>
                      <td>{task.municipio ? task.municipio.toUpperCase() : ''}</td>
                      <td>{task.direccion ? task.direccion.toUpperCase() : ''}</td>
                      <td>{task.direccion ? task.direccion.toUpperCase() : ''}</td>
                      <td>{task.direccion ? task.direccion.toUpperCase() : ''}</td>
                      <td>{task.direccion ? task.direccion.toUpperCase() : ''}</td>
                      
                      {/* <td>
                        {Array.isArray(task.roldirecto) ? task.roldirecto.map(roldirecto => {
                          if (typeof roldirecto === 'string') {
                            return roldirecto.toLowerCase();
                          } else {
                            return 'No tiene';
                          }
                        }).join(', ') : 'No tiene'}
                      </td>
                      <td>
                        {Array.isArray(task.disciplinadirecta) ? task.disciplinadirecta.map(disciplinadirecta => {
                          if (typeof disciplinadirecta === 'string') {
                            return disciplinadirecta.toLowerCase();
                          } else {
                            return 'No tiene';
                          }
                        }).join(', ') : 'No tiene'}
                      </td>
                      <td>
                        {Array.isArray(task.rolindirecto) ? task.rolindirecto.map(rolindirecto => {
                          if (typeof rolindirecto === 'string') {
                            return rolindirecto.toLowerCase();
                          } else {
                            return 'No tiene';
                          }
                        }).join(', ') : 'No tiene'}
                      </td>
                      <td>
                        {Array.isArray(task.disciplinaindirecta) ? task.disciplinaindirecta.map(disciplinaindirecta => {
                          if (typeof disciplinaindirecta === 'string') {
                            return disciplinaindirecta.toLowerCase();
                          } else {
                            return 'No tiene';
                          }
                        }).join(', ') : 'No tiene'}
                      </td> */}
                      <td>
                        <div className='button-container'>
                          <Link className='btn btn-success' to={`/view/task/${task._id}`}>
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                        </div>
                      </td>
                      {/* <td>
                        <div className='button-container'>
                          <Link className='btn btn-primary' to={`/edit-task/${task._id}`}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div className='button-container'>
                          <button className='btn btn-danger' onClick={() => handleDelete(task._id)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Paginator currentPage={currentPage} totalPages={Math.ceil(filteredTasks.length / tasksPerPage)} onPageChange={onPageChange} />
        </div>
      </div>
    </div>
  );
}

export default Table;
