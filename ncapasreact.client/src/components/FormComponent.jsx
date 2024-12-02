import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function FormComponent() {
    const [formData, setFormData] = useState({
        idUsuario: 0,
        userName: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        password: '',
        sexo: '',
        telefono: '',
        celular: '',
        fechaNacimiento: '',
        curp: '',
        idRol: '',
        direccion: {
            idDireccion: 0,
            calle: '',
            numeroInterior: '',
            numeroExterior: '',
            colonia: {
                idColonia: 0,
                codigoPostal: '',
            },
        },
        imagenPerfil: null,
        status: true,
    });

    const [errors, setErrors] = useState({});
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const idUsuario = urlParams.get('id'); // Obtener el id del usuario desde la URL

        if (idUsuario) {
            fetchUserData(idUsuario); // Cargar los datos del usuario si el id está presente
        }
    }, [location.search]);

    // Función para cargar los datos del usuario
    const fetchUserData = async (idUsuario) => {
        try {
            // Usar la URL correcta para obtener los datos del usuario
            const response = await fetch(`https://localhost:54340/api/usuario/update/${idUsuario}`);
            if (response.ok) {
                const user = await response.json();
                setFormData(user); // Llenar el formulario con los datos del usuario
            } else {
                alert('Error al cargar los datos del usuario.');
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            alert('Error de red al cargar los datos del usuario.');
        }
    };

    // Manejo de los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Manejo del cambio de la imagen de perfil
    const handleFileChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            imagenPerfil: e.target.files[0],
        }));
    };

    // Función para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (key === 'direccion') {
                formDataToSend.append(key, JSON.stringify(formData[key])); // Convertir la dirección a JSON
            } else if (key === 'imagenPerfil' && formData[key]) {
                formDataToSend.append(key, formData[key]);
            } else {
                formDataToSend.append(key, formData[key]);
            }
        }

        try {
            const method = formData.idUsuario ? 'PUT' : 'POST'; // Usar PUT si se trata de una actualización
            const response = await fetch(`https://localhost:54340/api/usuario/update/${formData.idUsuario}`, {
                method: method,
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error en la solicitud:', errorResponse);
                alert('Error al actualizar el usuario.');
                return;
            }

            alert('Usuario actualizado con éxito!');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Error al actualizar el usuario.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
                {formData.idUsuario ? 'Actualizar Usuario' : 'Agregar Usuario'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {Object.keys(formData).map((key) => {
                    if (key === 'imagenPerfil') {
                        return (
                            <div key={key} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                                <input
                                    type="file"
                                    name={key}
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:border file:border-gray-300 file:bg-gray-100 file:text-gray-500 file:px-4 file:py-2"
                                />
                            </div>
                        );
                    }

                    if (typeof formData[key] === 'object' && formData[key] !== null) {
                        return null; // Manejar direcciones u otros objetos anidados de forma separada
                    }

                    return (
                        <div key={key} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                            <input
                                type={key === 'password' ? 'password' : 'text'}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    );
                })}

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="bg-gray-300 px-4 py-2 text-white rounded-md hover:bg-gray-400"
                    >
                        Regresar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 px-4 py-2 text-white rounded-md hover:bg-blue-700"
                    >
                        {formData.idUsuario ? 'Actualizar Usuario' : 'Guardar Usuario'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormComponent;
