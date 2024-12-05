import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormComponent() {
    const [formData, setFormData] = useState({
        idUsuario: 0,
        userName: "",
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        email: "",
        password: "",
        sexo: "",
        telefono: "",
        celular: "",
        fechaNacimiento: "",
        curp: "",
        idRol: "",
        usuarios: [""],
        rol: {
            idRol: 1,
            nombre: "",
            rols: [""]
        },
        idDireccion: 0,
        direccion: {
            idDireccion: 1,
            calle: "San Lucas",
            numeroInterior: "15",
            numeroExterior: "16",
            colonia: {
                idColonia: 1,
                nombre: "",
                codigoPostal: "",
                municipio: {
                    idMunicipio: 1,
                    nombre: "",
                    estado: {
                        idEstado: 1,
                        nombre: "",
                        estados: [""]
                    },
                    municipios: [""]
                },
                colonias: [""]
            },
            idUsuario: "",
            direcciones: [""]
        },
        imagenPerfil: "",
        imagenBase64: "",
        status: true
    });

    const [formErrors, setFormErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, imagenPerfil: file });
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.userName.trim()) errors.userName = "El campo Nombre de usuario es obligatorio.";
        if (!formData.nombre.trim()) errors.nombre = "El campo Nombre es obligatorio.";
        if (!formData.apellidoPaterno.trim()) errors.apellidoPaterno = "El campo Apellido Paterno es obligatorio.";
        if (!formData.apellidoMaterno.trim()) errors.apellidoMaterno = "El campo Apellido Materno es obligatorio.";
        if (!formData.email.trim()) errors.email = "El campo Correo electrónico es obligatorio.";
        if (!formData.password.trim()) errors.password = "El campo Password es obligatorio";
        if (!formData.curp.trim()) errors.curp = "El campo CURP es obligatorio.";
        if (!formData.telefono.trim()) errors.telefono = "El campo Teléfono es obligatorio.";
        if (!formData.celular.trim()) errors.celular = "El campo Celular es obligatorio.";
        if (!formData.sexo.trim()) errors.sexo = "El campo Sexo es requerido";
        if (!formData.fechaNacimiento.trim()) errors.fechaNacimiento = "El campo Fecha de Nacimiento es obligatorio.";
        if (!formData.idRol) errors.idRol = "El campo Rol es obligatorio.";
        if (!formData.idDireccion) errors.idDireccion = "El campo Dirección es obligatorio.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return; // Detener el envío si hay errores

        const requestData = {
            ...formData,
            imagenBase64: previewImage ? previewImage : "",
            imagenPerfil: undefined // No enviar el archivo directamente
        };

        try {
            const response = await fetch("http://localhost:5054/api/usuario/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData), // Convertir a JSON
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || "Usuario agregado con éxito.");
                navigate("/"); // Redirige a la lista de usuarios
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || "Error desconocido."}`);
            }
        } catch (error) {
            alert(`Error de red: ${error.message}`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Agregar Usuario</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200">Nombre de usuario</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.userName && <p className="text-red-500">{formErrors.userName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.nombre && <p className="text-red-500">{formErrors.nombre}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Apellido Paterno</label>
                    <input
                        type="text"
                        name="apellidoPaterno"
                        value={formData.apellidoPaterno}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.apellidoPaterno && <p className="text-red-500">{formErrors.apellidoPaterno}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Apellido Materno</label>
                    <input
                        type="text"
                        name="apellidoMaterno"
                        value={formData.apellidoMaterno}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.apellidoMaterno && <p className="text-red-500">{formErrors.apellidoMaterno}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.email && <p className="text-red-500">{formErrors.password}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Telefono</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.telefono && <p className="text-red-500">{formErrors.telefono}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Celular</label>
                    <input
                        type="text"
                        name="celular"
                        value={formData.celular}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.celular && <p className="text-red-500">{formErrors.celular}}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Sexo</label>
                    <input
                        type="text"
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.sexo && <p className="text-red-500">{formErrors.sexo}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Fecha de Nacimiento</label>
                    <input
                        type="text"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.fechaNacimiento && <p className="text-red-500">{formErrors.fechaNacimiento}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">CURP</label>
                    <input
                        type="text"
                        name="curp"
                        value={formData.curp}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.curp && <p className="text-red-500">{formErrors.curp}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Rol</label>
                    <input
                        type="text"
                        name="idRol"
                        value={formData.idRol}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.idRol && <p className="text-red-500">{formErrors.idRol}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Dirección</label>
                    <input
                        type="text"
                        name="idDireccion"
                        value={formData.idDireccion}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.idDireccion && <p className="text-red-500">{formErrors.idDireccion}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Imagen de Perfil</label>
                    <input
                        type="file"
                        name="imagenPerfil"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Vista previa"
                            className="mt-2 w-24 h-24 rounded-full"
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg"
                >
                    Guardar
                </button>
            </form>
        </div>
    );
}

export default FormComponent;
