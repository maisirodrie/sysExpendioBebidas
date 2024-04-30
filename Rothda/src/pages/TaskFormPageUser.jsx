import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTasks } from '../context/TasksContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Municipios } from '../api/municipios.js';
import { Directos } from '../api/directos.js';
import { Indirectos } from '../api/indirectos.js';
import { Publicas } from '../api/publica.js';
import { Privadas } from '../api/privada.js';
import { Disciplinas } from '../api/disciplina.js';
import { useAuth } from '../context/AuthContext.jsx';

import Select from 'react-select';

function TaskFormPageUser() {
  const { register, handleSubmit, setValue } = useForm();
  const { createTask, getTask, updateTask } = useTasks();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedDisciplina, setSelectedDisciplina] = useState("");
  const [dniError, setDniError] = useState("");
  const [selectedMunicipioValue, setSelectedMunicipioValue] = useState("");
  const [selectedDisciplinaValue, setSelectedDisciplinaValue] = useState("");
  const [selectedDirectosValue, setSelectedDirectosValue] = useState("");
  const [selectedDisciplinaDirectaValue, setSelectedDisciplinaDirectaValue] = useState("");
  const [selectedIndirectosValue, setSelectedIndirectosValue] = useState("");
  const [selectedDisciplinaIndirectaValue, setSelectedDisciplinaIndirectaValue] = useState("");
  const [selectedFormacionPublicaValue, setSelectedFormacionPublicaValue] = useState("");
  const [selectedDisciplinaPublicaValue, setSelectedDisciplinaPublicaValue] = useState("");
  const [selectedFormacionPrivadaValue, setSelectedFormacionPrivadaValue] = useState("");
  const [selectedDisciplinaPrivadaValue, setSelectedDisciplinaPrivadaValue] = useState("");

  useEffect(() => {
    async function loadTask() {
   
      if (params.id) {

        const currentDate = new Date().toISOString().split('T')[0];// Obtenemos la fecha actual en formato ISO (YYYY-MM-DD)
        const task = await getTask(params.id);

        setValue('apellido', task.apellido);
        setValue('nombre', task.nombre);
        setValue('dni', task.dni);
        setValue('fechanacimiento', currentDate);
        setValue('genero', task.genero);
        setValue('nacimiento', task.nacimiento);
        setValue("municipio", task.municipio);
        setValue('postal', task.postal);
        setValue('residencia', task.residencia);
        setValue('nacionalidad', task.nacionalidad);
        setValue('correo', task.correo);
        setValue('telefono', task.telefono);
        setValue('publico', task.publico);
        setValue('privada', task.privada);
        setValue('direccion', task.direccion);
        setValue('observaciones', task.observaciones);

        setSelectedMunicipioValue(task.municipio);
        // Transforma el array de cadenas en un array de objetos para las opciones de disciplina
        const roldirectoOptions = task.roldirecto.map(nombre => ({ value: nombre, label: nombre }));
        setSelectedDirectosValue(roldirectoOptions);

        const disciplinadirectaOptions = task.disciplinadirecta.map(nombre => ({ value: nombre, label: nombre }));
        setSelectedDisciplinaDirectaValue(disciplinadirectaOptions);

        const roldidirectoOptions = task.rolindirecto.map(nombre => ({ value: nombre, label: nombre }));
        setSelectedIndirectosValue(roldidirectoOptions);

        const disciplinaindirectaOptions = task.disciplinaindirecta.map(nombre => ({ value: nombre, label: nombre }));
        setSelectedDisciplinaIndirectaValue(disciplinaindirectaOptions);

        const formacionpublicaOptions = task.formacionpublica.map(nombre => ({ value: nombre, label: nombre }));
        setSelectedFormacionPublicaValue(formacionpublicaOptions);
       
        const disciplinapublicaOptions = task.disciplinapublica.map(nombre => ({ value: nombre, label: nombre }));
        setSelectedDisciplinaPublicaValue(disciplinapublicaOptions);

        const formacionprivadaOptions = task.formacionprivada.map(nombre => ({ value: nombre, label: nombre }));
        setSelectedFormacionPrivadaValue(formacionprivadaOptions);

        const disciplinaprivadaOptions = task.disciplinaprivada.map(nombre => ({ value: nombre, label: nombre }));
        setSelectedDisciplinaPrivadaValue(disciplinaprivadaOptions);

        // const disciplinaOptions = task.disciplina.map(nombre => ({ value: nombre, label: nombre }));
        // setSelectedDisciplinaValue(disciplinaOptions);

        
      }
    }
    loadTask();
  }, []);


  

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Agregar los nombres de disciplina al objeto de datos
      const updatedData = { ...data,
        
        roldirecto: selectedDirectosValue.map(option => option.value),
        disciplinadirecta: selectedDisciplinaDirectaValue.map(option => option.value),
        rolindirecto: selectedIndirectosValue.map(option => option.value),
        disciplinaindirecta: selectedDisciplinaIndirectaValue.map(option => option.value),
        formacionpublica:selectedFormacionPublicaValue.map(option => option.value),
        disciplinapublica:selectedDisciplinaPublicaValue.map(option => option.value),
        formacionprivada:selectedFormacionPrivadaValue.map(option => option.value),
        disciplinaprivada:selectedDisciplinaPrivadaValue.map(option => option.value),
        };
      
      console.log('Datos del formulario a enviar:', updatedData);
      
      if (params.id) {
        await updateTask(params.id, updatedData);
      } else {
        await createTask(updatedData);
      }
      navigate('/profile')
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setDniError(error.response.data.message);
      } else {
        console.error('Error:', error);
      }
    }
  });

  const handleMunicipioChange = (event) => {
    setSelectedMunicipio(event.target.value);
    setSelectedMunicipioValue(event.target.value);
  };


  const handleDirectosChange = (selectedOptions) => {
    setSelectedDirectosValue(selectedOptions);
  };

  const handleDisciplinaDirectaChange = (selectedOptions) => {
    setSelectedDisciplinaDirectaValue(selectedOptions);
  };

  const handleIndirectosChange = (selectedOptions) => {
    setSelectedIndirectosValue(selectedOptions);
  };

  const handleDisciplinaIndirectaChange = (selectedOptions) => {
    setSelectedDisciplinaIndirectaValue(selectedOptions);
  };

  const handleFormacionPublicaChange = (selectedOptions) => {
    setSelectedFormacionPublicaValue(selectedOptions);
  };

  const handleDisciplinaPublicaChange = (selectedOptions) => {
    setSelectedDisciplinaPublicaValue(selectedOptions);
  };

  const handleFormacionPrivadaChange = (selectedOptions) => {
    setSelectedFormacionPrivadaValue(selectedOptions);
  };

  const handleDisciplinaPrivadaChange = (selectedOptions) => {
    setSelectedDisciplinaPrivadaValue(selectedOptions);
  };

  
  

  

  return (
    
    <div className="flex items-center justify-center overflow-y-auto" style={{ marginTop: '20px', marginBottom: '20px' }}>
  {/* Contenido del formulario aquí */}


    <div className="bg-gray-300 max-w-md w-full p-10 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Registro de Persona</h1>
        
      </div>
          <form onSubmit={onSubmit}>
          {/* <label htmlFor="apellido" className="block text-sm font-medium text-black">
              Prueba
            </label> */}
            
            

            <label htmlFor="apellido" className="block text-sm font-medium text-black">
              Apellido
            </label>
            <input type='text' {...register("apellido", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Apellido' />
            <label htmlFor="nombre" className="block text-sm font-medium text-black">
              Nombre
            </label>
            <input type='text' {...register("nombre", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Nombre' />
            <label htmlFor="dni" className="block text-sm font-medium text-black">
              DNI
            </label>
            <input type='text' {...register("dni", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='DNI' />
            
            <label htmlFor="dni" className="block text-sm font-medium text-black">
            Fecha de nacimiento
            </label>
            <input type='date' {...register("fechanacimiento", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Fecha de nacimiento' />

            <label htmlFor="genero" className="block text-sm font-medium text-black">
            Género
            </label>
            <input type='text' {...register("genero", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Género' />
            
            <label htmlFor="municipio" className="block text-sm font-medium text-black">
              Municipio
            </label>

            {dniError && <p className="text-red-500">{dniError}</p>}
            <select {...register("municipio", { required: true })} value={selectedMunicipioValue} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' onChange={handleMunicipioChange}>
              <option value="">Selecciona un municipio</option>
              {Municipios.map(municipio => (
                <option key={municipio.id} value={municipio.nombre}>{municipio.nombre}</option>
              ))}
            </select>

            <label htmlFor="postal" className="block text-sm font-medium text-black">
            Direccion Postal
            </label>
            <input type='text' {...register("postal", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Direccion Postal' />

            <label htmlFor="residencia" className="block text-sm font-medium text-black">
            Años de Residencia
            </label>
            <input type='text' {...register("residencia", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Años de Residencia' />

            <label htmlFor="nacionalidad" className="block text-sm font-medium text-black">
            Nacionalidad
            </label>
            <input type='text' {...register("nacionalidad", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Nacionalidad' />

            <label htmlFor="correo" className="block text-sm font-medium text-black">
            E-mail
            </label>
            <input type='text' {...register("correo", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='E-mail' />
            
            <label htmlFor="nacimiento" className="block text-sm font-medium text-black">
            Lugar de nacimiento
            </label>
            <input type='text' {...register("nacimiento", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Lugar de nacimiento' />
       
            

           
            <label htmlFor="telefono" className="block text-sm font-medium text-black">
            Teléfono
            </label>
            <input type='text' {...register("telefono", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Teléfono' />

            <label htmlFor="roldirecto" className="block text-sm font-medium text-black">
            Rol Directo que desempeña en la danza
          </label>
           <Select
            options={Directos.map(roldirecto => ({ value: roldirecto.nombre, label: roldirecto.nombre }))}
            isMulti
            value={selectedDirectosValue}
            onChange={handleDirectosChange}
          />

           <label htmlFor="disciplinadirecta" className="block text-sm font-medium text-black">
            Disciplina del rol directo en que se desempeña
            </label>
            <Select
            options={Disciplinas.map(disciplinadirecta => ({ value: disciplinadirecta.nombre, label: disciplinadirecta.nombre }))}
            isMulti
            value={selectedDisciplinaDirectaValue}
            onChange={handleDisciplinaDirectaChange}
          />

<label htmlFor="roldirecto" className="block text-sm font-medium text-black">
            Rol Indirecto que desempeña en la danza
          </label>
           <Select
            options={Indirectos.map(roldindirecto => ({ value: roldindirecto.nombre, label: roldindirecto.nombre }))}
            isMulti
            value={selectedIndirectosValue}
            onChange={handleIndirectosChange}
          />

           <label htmlFor="disciplinadirecta" className="block text-sm font-medium text-black">
            Disciplina del rol indirecto en que se desempeña
            </label>
            <Select
            options={Disciplinas.map(disciplinaindirecta => ({ value: disciplinaindirecta.nombre, label: disciplinaindirecta.nombre }))}
            isMulti
            value={selectedDisciplinaIndirectaValue}
            onChange={handleDisciplinaIndirectaChange}
          />




<label htmlFor="formacionpublica" className="block text-sm font-medium text-black">
    Formación académica en instituciones públicas de educación Superior / universitario/ posgrados
  </label>
  <Select
    options={Publicas.map(formacionpublica => ({ value: formacionpublica.nombre, label: formacionpublica.nombre }))}
    isMulti
    value={selectedFormacionPublicaValue}
    onChange={handleFormacionPublicaChange}
    placeholder='Seleccione la formación pública'
  />
            <label htmlFor="disciplinapublica" className="block text-sm font-medium text-black">
            Disciplina en que se formó
            </label>
           <Select
            options={Disciplinas.map(disciplinapublica => ({ value: disciplinapublica.nombre, label: disciplinapublica.nombre }))}
            isMulti
            value={selectedDisciplinaPublicaValue}
            onChange={handleDisciplinaPublicaChange}
            placeholder='Seleccione en que disciplina'
          />

<label htmlFor="publico" className="block text-sm font-medium text-black">
Indique la/las institución/es en la que finalizo sus estudios:
            </label>
            <input type='text' {...register("publico", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Ingrese la/s institución/es' />

<label htmlFor="formacionprivada" className="block text-sm font-medium text-black">
    Formación académica en instituciones privadas de educación Superior / universitario/ posgrados
  </label>
  <Select
    options={Privadas.map(formacionprivada => ({ value: formacionprivada.nombre, label: formacionprivada.nombre }))}
    isMulti
    value={selectedFormacionPrivadaValue}
    onChange={handleFormacionPrivadaChange}
    placeholder='Seleccione la formación privada'
  />
            <label htmlFor="disciplinaprivada" className="block text-sm font-medium text-black">
            Disciplina en que se formó
            </label>
           <Select
            options={Disciplinas.map(disciplinaprivada => ({ value: disciplinaprivada.nombre, label: disciplinaprivada.nombre }))}
            isMulti
            value={selectedDisciplinaPrivadaValue}
            onChange={handleDisciplinaPrivadaChange}
            placeholder='Seleccione en que disciplina'
          />

<label htmlFor="privada" className="block text-sm font-medium text-black">
Indique la/las institución/es en la que finalizo sus estudios:
            </label>
            <input type='text' {...register("privada", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Ingrese la/s institución/es' />

            <label htmlFor="direccion" className="block text-sm font-medium text-black">
            Direccion
            </label>
            <input type='text' {...register("direccion", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Direccion' />
           



            {/* <select {...register("disciplina", { required: true })} value={selectedDisciplinaValue} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' onChange={handleDisciplinaChange}>
              <option value="">Selecciona Disciplina</option>
              {Disciplinas.map(disciplina => (
                <option key={disciplina.id} value={disciplina.nombre}>{disciplina.nombre}</option>
              ))}
            </select> */}
            {/* <input type='text' {...register("disciplina", { required: true })} className='w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2' placeholder='Disciplina' /> */}
            
            
            <label htmlFor="observaciones" className="block text-sm font-medium text-black">
  Observaciones
</label>
<textarea
  id="observaciones"
  {...register("observaciones", { required: true })}
  className="w-full bg-gray-100 text-black px-4 py-2 rounded-md my-2"
  placeholder="Observaciones"
  rows={4} // Define la cantidad de filas que mostrará el textarea
/>


            <button className="bg-blue-500 px-4 py-1 rounded-md my-2 disabled:bg-blue-300 text-white">Guardar</button>
            <button className="bg-red-500 px-4 py-1 rounded-md my-2 text-white">
        Cancelar
      </button>
          </form>
        </div>
      </div>
    
  );
}

export default TaskFormPageUser;
