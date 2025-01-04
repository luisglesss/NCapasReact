import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import FormComponent from './components/FormComponent';

function App() {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        populateUserData();
    }, []);

    const contents = usuarios.length === 0
        ? <p className="text-gray-500"><em>Cargando... Concectando con el servidor</em></p>
        : <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-gray-800 text-white">
                <thead className="bg-gradient-to-r from-gray-700 to-gray-900">
                    <tr>
                        <th className="px-6 py-3">Id Usuario</th>
                        <th className="px-6 py-3">Nombre</th>
                        <th className="px-6 py-3">Apellido Paterno</th>
                        <th className="px-6 py-3">Apellido Materno</th>
                        <th className="px-6 py-3">Username</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Sexo</th>
                        <th className="px-6 py-3">Teléfono</th>
                        <th className="px-6 py-3">Perfil</th>
                        <th className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {usuarios.map(usuario => (
                        <tr key={usuario.idUsuario} className="hover:bg-gray-700">
                            <td>{usuario.idUsuario}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.apellidoPaterno}</td>
                            <td>{usuario.apellidoMaterno}</td>
                            <td>{usuario.userName}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.sexo}</td>
                            <td>{usuario.telefono}</td>
                            <td className="px-6 py-4">
                                {usuario.imagenBase64
                                    ? <img src={usuario.imagenBase64} alt="Perfil" className="w-12 h-12 rounded-full shadow-md" />
                                    : <img src="https://fotografias.lasexta.com/clipping/cmsimages02/2019/11/14/66C024AF-E20B-49A5-8BC3-A21DD22B96E6/default.jpg?crop=1300,731,x0,y0&width=1280&height=720&optimize=low" alt="Perfil" className="w-12 h-12 rounded-full shadow-md" />}
                            </td>
                            <td className="flex justify-center gap-2">
                                <button onClick={() => handleUpdateUser(usuario.idUsuario)} className="bg-yellow-500 p-2 rounded">
                                    <PencilSquareIcon className="h-5 w-5" />
                                </button>
                                <button onClick={() => handleDeleteUser(usuario.idUsuario)} className="bg-red-500 p-2 rounded">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>;

    function handleAddUser() {
        navigate('/form');
    }

    function handleUpdateUser(idUsuario) {
        navigate(`/form/${idUsuario}`);
    }

    async function populateUserData() {
        try {
            const response = await fetch('api/usuario');
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            } else {
                alert("Error al cargar los usuarios.");
            }
        } catch (error) {
            alert(`Error de red: ${error.message}`);
        }
    }

    async function handleDeleteUser(idUsuario) {
        if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            try {
                const response = await fetch(`api/usuario/Delete/${idUsuario}`, { method: 'DELETE' });
                if (response.ok) {
                    alert("Usuario eliminado correctamente.");
                    populateUserData();
                } else {
                    alert("Error al eliminar el usuario.");
                }
            } catch (error) {
                alert(`Error de red: ${error.message}`);
            }
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl">Usuarios</h1>
                <button onClick={handleAddUser} className="bg-green-500 p-2 rounded">
                    <PlusCircleIcon className="h-5 w-5" /> Agregar Usuario
                </button>
            </div>
            {contents}
        </div>
    );
}

function RouterSetup() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/form" element={<FormComponent />} />
                <Route path="/form/:idUsuario" element={<FormComponent />} />
            </Routes>
        </Router>
    );
}

export default RouterSetup;