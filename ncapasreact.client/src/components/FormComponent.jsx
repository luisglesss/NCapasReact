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
        idDireccion: 1,
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


    const [estados, setEstados] = useState([]); // Lista de estados
    const [municipios, setMunicipios] = useState([]); // Lista de municipios
    const [colonias, setColonias] = useState([]); // Lista de colonias
    const [selectedEstado, setSelectedEstado] = useState(""); // Estado seleccionado
    const [selectedMunicipio, setSelectedMunicipio] = useState(""); // Municipio seleccionado

    // Cargar estados desde la API
    useEffect(() => {
        fetch("http://localhost:5054/api/usuario/estados")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setEstados(data.data); // Establece los estados
                } else {
                    console.error("Error al cargar estados:", data.message);
                }
            })
            .catch((error) => console.error("Error en la solicitud de estados:", error));
    }, []);

    const handleEstadoChange = (e) => {
        const estadoId = parseInt(e.target.value, 10); // Captura el idEstado seleccionado

        if (isNaN(estadoId)) {
            console.error("El ID de estado no es válido.");
            return; // Salir si no es un número válido
        }

        setSelectedEstado(estadoId);

        // Fetch de municipios para el estado seleccionado
        fetch(`http://localhost:5054/api/usuario/municipios/${estadoId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setMunicipios(data.data); // Establece los municipios
                } else {
                    console.error("Error al cargar municipios:", data.message);
                }
            })
            .catch((error) => console.error("Error en la solicitud de municipios:", error));

        // Limpiar municipios y colonias al cambiar el estado
        setMunicipios([]);
        setColonias([]);
        setSelectedMunicipio("");
    };


    // Maneja el cambio de municipio
    const handleMunicipioChange = (e) => {
        const municipioId = parseInt(e.target.value, 10); // Captura el idMunicipio seleccionado

        if (isNaN(municipioId)) {
            console.error("El ID de municipio no es válido.");
            return; // Salir si no es un número válido
        }

        setSelectedMunicipio(municipioId);

        // Fetch de colonias para el municipio seleccionado
        fetch(`http://localhost:5054/api/usuario/colonias/${municipioId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setColonias(data.data); // Establece las colonias
                } else {
                    console.error("Error al cargar colonias:", data.message);
                }
            })
            .catch((error) => console.error("Error en la solicitud de colonias:", error));
    };


    function handleBack() {
        navigate('/');
    }

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
            <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-500">
                Registrar Nuevo Usuario
            </h1>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-800 p-8 rounded-lg shadow-lg"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Nombre de usuario</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.userName && <p className="text-red-500 mt-1 text-xs">{formErrors.userName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.nombre && <p className="text-red-500 mt-1 text-xs">{formErrors.nombre}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Apellido Paterno</label>
                    <input
                        type="text"
                        name="apellidoPaterno"
                        value={formData.apellidoPaterno}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.apellidoPaterno && <p className="text-red-500 mt-1 text-xs">{formErrors.apellidoPaterno}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Apellido Materno</label>
                    <input
                        type="text"
                        name="apellidoMaterno"
                        value={formData.apellidoMaterno}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.apellidoMaterno && <p className="text-red-500 mt-1 text-xs">{formErrors.apellidoMaterno}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.email && <p className="text-red-500 mt-1 text-xs">{formErrors.email}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.password && <p className="text-red-500 mt-1 text-xs">{formErrors.password}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.telefono && <p className="text-red-500 mt-1 text-xs">{formErrors.telefono}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Celular</label>
                    <input
                        type="text"
                        name="celular"
                        value={formData.celular}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.celular && <p className="text-red-500 mt-1 text-xs">{formErrors.celular}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Sexo</label>
                    <select
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                    {formErrors.sexo && <p className="text-red-500 mt-1 text-xs">{formErrors.sexo}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Fecha de Nacimiento</label>
                    <input
                        type="text"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.fechaNacimiento && <p className="text-red-500 mt-1 text-xs">{formErrors.fechaNacimiento}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">CURP</label>
                    <input
                        type="text"
                        name="curp"
                        value={formData.curp}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.curp && <p className="text-red-500 mt-1 text-xs">{formErrors.curp}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Rol</label>
                    <select
                        name="idRol"
                        value={formData.idRol}
                        onChange={handleRoleChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona un rol</option>
                        {roles.map((rol) => (
                            <option key={rol.idRol} value={rol.idRol}>
                                {rol.nombre}
                            </option>
                        ))}
                    </select>
                    {formErrors.idRol && <p className="text-red-500 mt-1 text-xs">{formErrors.idRol}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Dirección</label>
                    <input
                        type="text"
                        name="direccion"
                        value={formData.idDireccion}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.idDireccion && <p className="text-red-500 mt-1 text-xs">{formErrors.idDireccion}</p>}
                </div>

                {/* Estado */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Estado</label>
                    <select
                        value={selectedEstado}
                        onChange={handleEstadoChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona un estado</option>
                        {estados.map((estado) => (
                            <option key={estado.idEstado} value={estado.idEstado}>
                                {estado.nombre}
                            </option>
                        ))}
                    </select>

                </div>

                {/* Municipio */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Municipio</label>
                    <select
                        value={selectedMunicipio}
                        onChange={handleMunicipioChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!selectedEstado} // Deshabilitar si no se ha seleccionado un estado
                    >
                        <option value="">Selecciona un municipio</option>
                        {municipios.map((municipio) => (
                            <option key={municipio.idMunicipio} value={municipio.idMunicipio}>
                                {municipio.nombre}
                            </option>
                        ))}
                    </select>

                </div>

                {/* Colonia */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Colonia</label>
                    <select
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!selectedMunicipio} // Deshabilita si no hay un municipio seleccionado
                    >
                        <option value="">Selecciona una colonia</option>
                        {colonias.map((colonia) => (
                            <option key={colonia.id} value={colonia.id}>
                                {colonia.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Imagen de Perfil</label>
                    <input
                        type="file"
                        name="imagenPerfil"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {previewImage && (
                        <img src={previewImage} alt="Vista previa" className="mt-4 w-32 h-32 rounded-full" />
                    )}
                </div>
                <div className="md:col-span-2 lg:col-span-3 flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="w-1/3 bg-red-600 hover:bg-red-800 text-white py-3 rounded-lg transition duration-200"
                    >
                        Regresar
                    </button>
                    <button
                        type="submit"
                        className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200"
                    >
                        Guardar Usuario
                    </button>
                </div>
            </form>
        </div>

    );
}

export default FormComponent;
