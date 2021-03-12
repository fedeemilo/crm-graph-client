import React from "react"
import Swal from "sweetalert2"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { useQuery, useMutation } from "@apollo/client"
import { OBTENER_CLIENTE, OBTENER_CLIENTES_USUARIO } from "../../gql/querys"
import { Formik } from "formik"
import * as Yup from "yup"
import { ACTUALIZAR_CLIENTE } from "../../gql/mutations"

const EditarCliente = () => {
  // Obtener el ID actual
  const router = useRouter()
  const {
    query: { id }
  } = router

  // Consultar para obtener el cliente
  const { data, loading } = useQuery(OBTENER_CLIENTE, {
    variables: {
      id
    }
  })

  // Actualizar el cliente
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
    update(cache, { data: { actualizarCliente } }) {
      // Obtengo el objeto de cache que deseo actualizar
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO
      })

      // Reescribo el cache
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: [
            ...obtenerClientesVendedor,
            actualizarCliente
          ]
        }
      })
    }
  })

  // Schema de validación
  const schemaValidation = Yup.object({
    nombre: Yup.string().required("El nombre del cliente es obligatorio"),
    apellido: Yup.string().required("El apellido del cliente es obligatorio"),
    empresa: Yup.string().required("El campo empresa es obligatorio"),
    email: Yup.string()
      .required("El email del cliente es obligatorio")
      .email("El email no es válido")
  })

  if (loading) return "Cargando..."

  const { obtenerCliente } = data

  // Modifica el cliente en la BD
  const actualizarInfoCliente = async values => {
    const { nombre, apellido, email, empresa, telefono } = values

    try {
      const { data } = await actualizarCliente({
        variables: {
          id,
          input: {
            nombre,
            apellido,
            email,
            empresa,
            telefono
          }
        }
      })

      // Mostrar alerta
      Swal.fire(
        "Actualizado!",
        "El cliente se actualizó correctamente",
        "success"
      )

      // Redireccionar
      router.push("/")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mt-5">Editar Cliente</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={schemaValidation}
            enableReinitialize
            initialValues={obtenerCliente}
            onSubmit={values => {
              actualizarInfoCliente(values)
            }}
          >
            {props => {
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
                >
                  {/* Nombre Cliente */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nombre"
                    >
                      Nombre
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="nombre"
                      type="text"
                      placeholder="Nombre Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                    />
                  </div>

                  {/* Validación - Nombre */}
                  {props.touched.nombre && props.errors.nombre ? (
                    <div className=" my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.nombre}</p>
                    </div>
                  ) : null}

                  {/* Apellido Cliente */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="apellido"
                    >
                      Apellido
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="apellido"
                      type="text"
                      placeholder="Apellido Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.apellido}
                    />
                  </div>

                  {/* Validación - Apellido */}
                  {props.touched.apellido && props.errors.apellido ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.apellido}</p>
                    </div>
                  ) : null}

                  {/* Empresa Cliente */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="empresa"
                    >
                      Empresa
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="empresa"
                      type="text"
                      placeholder="Empresa Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.empresa}
                    />
                  </div>

                  {/* Validación - Empresa */}
                  {props.touched.empresa && props.errors.empresa ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.empresa}</p>
                    </div>
                  ) : null}

                  {/* Email Cliente */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="Email Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email}
                    />
                  </div>

                  {/* Validación - Email */}
                  {props.touched.email && props.errors.email ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.email}</p>
                    </div>
                  ) : null}

                  {/* Telefono */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="telefono"
                    >
                      Telefono
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="telefono"
                      type="tel"
                      placeholder="Telefono Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.telefono}
                    />
                  </div>

                  <input
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-blue-900 transition duration-500 cursor-pointer"
                    value="Editar Cliente"
                  />
                </form>
              )
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default EditarCliente
