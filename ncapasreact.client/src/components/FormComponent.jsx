import React, { useState } from 'react';

function FormComponent() {
    const [formData, setFormData] = useState({
        username: '',
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
        imagenPerfil: null,
        status: 'activo',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        validateField(name, value);
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            imagenPerfil: e.target.files[0],
        });
    };

    const validateField = (name, value) => {
        let error = '';
        if (name === 'curp' && !/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/i.test(value)) {
            error = 'CURP no válido';
        } else if (name === 'password' && (!/[!@#$%^&*]/.test(value) || value.length < 8)) {
            error = 'La contraseña debe tener al menos 8 caracteres y un carácter especial.';
        } else if ((name === 'telefono' || name === 'celular') && value && !/^\d{10}$/.test(value)) {
            error = 'Número inválido. Debe contener 10 dígitos.';
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que no haya errores antes de enviar
        const isValid = Object.values(errors).every((error) => !error);
        if (!isValid) {
            alert('Por favor, corrige los errores antes de continuar.');
            return;
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (key === 'imagenPerfil' && formData[key]) {
                formDataToSend.append(key, formData[key]);
            } else {
                formDataToSend.append(key, formData[key] || '');
            }
        }

        try {
            const response = await fetch('api/usuario', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) throw new Error('Error en la solicitud');
            alert('Usuario creado con éxito!');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Error al crear el usuario');
        }
    };

    const handleRegresar = () => {
        window.history.back();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Agregar Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {Object.keys(formData).map((key) => (
                    key !== 'imagenPerfil' && (
                        <div key={key} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                            <input
                                type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-4 py-2 border ${errors[key] ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors[key] ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                                    }`}
                            />
                            {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
                        </div>
                    )
                ))}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Imagen de perfil</label>
                    <input
                        type="file"
                        name="imagenPerfil"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:border file:border-gray-300 file:bg-gray-100 file:text-gray-500 file:px-4 file:py-2"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleRegresar}
                        className="bg-gray-300 px-4 py-2 text-white rounded-md hover:bg-gray-400"
                    >
                        Regresar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 px-4 py-2 text-white rounded-md hover:bg-blue-700"
                    >
                        Guardar Usuario
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormComponent;
