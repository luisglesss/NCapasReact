import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

var base64String;
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
            idRol: 0,
            nombre: "",
            rols: [""]
        },
        idDireccion: 0,
        direccion: {
            idDireccion: 1,
            calle: "",
            numeroInterior: "",
            numeroExterior: "",
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

    const [roles, setRoles] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch("http://localhost:5054/api/usuario/getallroles");
                if (response.ok) {
                    const data = await response.json();
                    console.log(data); // Para verificar la estructura de datos
                    if (Array.isArray(data.roles)) {
                        setRoles(data.roles); // Accede a la propiedad 'roles'
                    } else {
                        console.error("Se esperaba un array en la propiedad 'roles', pero no se recibió uno.");
                    }
                } else {
                    console.error("Error al cargar los roles.");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
            } finally {
                setIsLoadingRoles(false);
            }
        };
        fetchRoles();
    }, []);



    // Manejador para cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejador para la selección de rol
    const handleRoleChange = (event) => {
        const selectedIdRol = event.target.value; // Obtén el ID del rol seleccionado
        const selectedRole = roles.find((role) => role.idRol === parseInt(selectedIdRol)); // Busca el rol completo por ID

        setFormData((prevData) => ({
            ...prevData,
            idRol: selectedIdRol, // Actualiza el ID del rol
            rol: {
                ...prevData.rol,
                idRol: selectedRole.idRol, // Actualiza los detalles del rol seleccionado
                nombre: selectedRole.nombre,
            },
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                 base64String = reader.result.split(",")[1]; // Obtener Base64 sin el prefijo
                console.log(base64String)
                // Validate Base64
                if (isValidBase64(base64String)) {
                    setFormData({ ...formData, imagenBase64: base64String });
                    setPreviewImage(reader.result); // Mostrar vista previa
                } else {
                    alert("La imagen no tiene un formato válido.");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const isValidBase64 = (str) => {
        const regex = /^[A-Za-z0-9+/=]+$/;
        return regex.test(str);
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
            imagenBase64: previewImage ? base64String : "",
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
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Registrar Nuevo Usuario</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {formErrors.celular && <p className="text-red-500">{formErrors.celular}</p>}
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
                    <select
                        name="idRol"
                        value={formData.idRol}
                        onChange={handleRoleChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    >
                        <option value="">Selecciona un rol</option>
                        {roles.map((rol) => (
                            <option key={rol.idRol} value={rol.idRol}>
                                {rol.nombre}
                            </option>
                        ))}
                    </select>
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
                    <label className="block text-sm font-medium text-gray-200">Calle</label>
                    <input
                        type="text"
                        name="calle"
                        value={formData.calle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.calle && <p className="text-red-500">{formErrors.calle}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Numero Interior</label>
                    <input
                        type="text"
                        name="numeroInterior"
                        value={formData.numeroInterior}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.numeroInterior && <p className="text-red-500">{formErrors.numeroInterior}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Numero Exterior</label>
                    <input
                        type="text"
                        name="numeroExterior"
                        value={formData.numeroExterior}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {formErrors.numeroExterior && <p className="text-red-500">{formErrors.numeroExterior}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200">Imagen de Perfil</label>
                    <input
                        type="file"
                        name="imagenPerfil"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                    />
                    {previewImage && (
                        <img src={previewImage} alt="Vista previa" className="mt-4 w-32 h-32 rounded-full" />
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
