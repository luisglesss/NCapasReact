import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import FormComponent from './components/FormComponent';

function App() {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        populateUserData();
    }, []);

    const contents = usuarios.length === 0
        ? <p className="text-gray-500"><em>Loading... Please refresh once the ASP.NET backend has started.</em></p>
        : <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-gray-800 text-white">
                <thead className="bg-gradient-to-r from-gray-700 to-gray-900">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wide">Id Usuario</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wide">Nombre</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wide">Apellido Paterno</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wide">Apellido Materno</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wide">Username</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wide">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wide">Sexo</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wide">Teléfono</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300 uppercase tracking-wide">Perfil</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-300 uppercase tracking-wide">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {usuarios.map(usuario => (
                        <tr key={usuario.idUsuario} className="hover:bg-gray-700">
                            <td className="px-6 py-4 text-sm">{usuario.idUsuario}</td>
                            <td className="px-6 py-4 text-sm">{usuario.nombre}</td>
                            <td className="px-6 py-4 text-sm">{usuario.apellidoPaterno}</td>
                            <td className="px-6 py-4 text-sm">{usuario.apellidoMaterno}</td>
                            <td className="px-6 py-4 text-sm">{usuario.userName}</td>
                            <td className="px-6 py-4 text-sm">{usuario.email}</td>
                            <td className="px-6 py-4 text-sm">{usuario.sexo}</td>
                            <td className="px-6 py-4 text-sm">{usuario.telefono}</td>
                            <td className="px-6 py-4">
                                {usuario.imagenBase64
                                    ? <img src={usuario.imagenBase64} alt="Perfil" className="w-12 h-12 rounded-full shadow-md" />
                                    : <img src="https://fotografias.lasexta.com/clipping/cmsimages02/2019/11/14/66C024AF-E20B-49A5-8BC3-A21DD22B96E6/default.jpg?crop=1300,731,x0,y0&width=1280&height=720&optimize=low" alt="Perfil" className="w-12 h-12 rounded-full shadow-md" />}
                            </td>
                            <td className="px-6 py-4 text-center flex justify-center gap-4">
                                {/* Botón Actualizar */}
                                <button
                                    onClick={() => handleUpdateUser(usuario.idUsuario)}
                                    className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full focus:outline-none shadow-md"
                                    title="Actualizar Usuario"
                                >
                                    <PencilSquareIcon className="h-6 w-6 text-white" />
                                </button>
                                {/* Botón Eliminar */}
                                <button
                                    onClick={() => handleDeleteUser(usuario.idUsuario)}
                                    className="p-2 bg-red-500 hover:bg-red-600 rounded-full focus:outline-none shadow-md"
                                    title="Eliminar Usuario"
                                >
                                    <TrashIcon className="h-6 w-6 text-white" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-white">Usuarios</h1>
                {/* Botón Agregar Usuario */}
                <button
                    onClick={handleAddUser}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md focus:outline-none"
                    title="Agregar Usuario"
                >
                    <PlusCircleIcon className="h-6 w-6" />
                    <span className="font-medium">Agregar Usuario</span>
                </button>
            </div>
            {contents}
        </div>
    );

    function handleAddUser() {
        navigate('/form');
    }

    function handleUpdateUser(idUsuario) {
        navigate(`/form?id=${idUsuario}`);
    }

    async function populateUserData() {
        const response = await fetch('api/usuario');
        if (response.ok) {
            const data = await response.json();
            setUsuarios(data);
        }
    }

    async function handleDeleteUser(idUsuario) {
        if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            try {
                const response = await fetch(`api/usuario/Delete/${idUsuario}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(result.message || "Usuario eliminado correctamente.");
                    populateUserData(); // Actualiza la lista de usuarios
                } else {
                    const error = await response.json();
                    alert(`Error al eliminar el usuario: ${error.message || "Error desconocido"}`);
                }
            } catch (error) {
                alert(`Error de red: ${error.message}`);
            }
        }
    }
}

function RouterSetup() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/form" element={<FormComponent />} />
            </Routes>
        </Router>
    );
}

export default RouterSetup;
