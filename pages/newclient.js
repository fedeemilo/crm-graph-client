import React, { useState } from "react"
import Swal from "sweetalert2"
import Layout from "../components/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useMutation } from "@apollo/client"
import { NUEVO_CLIENTE } from "../gql/mutations"
import { OBTENER_CLIENTES_USUARIO } from "../gql/querys"
import { useRouter } from "next/router"
import { mostrarMensaje } from "../utils/functions"

const NewClient = () => {
  const router = useRouter()

  const [mensaje, setMensaje] = useState(null)

  // Mutation para crear nuevos clientes
  const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
    update(cache, { data: { nuevoCliente } }) {
      // Obtener el objeto de cache que deseamos actualizar
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO
      })

      // Reescribimos el cache (el cache nunca se debe modificar)
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
        }
      })
    }
  })

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      empresa: "",
      email: "",
      telefono: ""
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre del cliente es obligatorio"),
      apellido: Yup.string().required("El apellido del cliente es obligatorio"),
      empresa: Yup.string().required("El campo empresa es obligatorio"),
      email: Yup.string()
        .required("El email del cliente es obligatorio")
        .email("El email no es válido")
    }),
    onSubmit: async values => {
      const { nombre, apellido, empresa, email, telefono } = values

      try {
        const { data } = await nuevoCliente({
          variables: {
            input: {
              nombre,
              apellido,
              empresa,
              email,
              telefono
            }
          }
        })

        // Mostrar alerta
        Swal.fire("Creado!", "El cliente se creó correctamente", "success")

        // Redireccionar hacia clientes
        router.push("/")
      } catch (err) {
        setMensaje(err.message.replace("GraphQL error: ", ""))

        setTimeout(() => {
          setMensaje(null)
        }, 3000)
      }
    }
  })

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mt-5">Nuevo Cliente</h1>

      {mensaje && mostrarMensaje(mensaje)}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
              />
            </div>

            {/* Validación - Nombre */}
            {formik.touched.nombre && formik.errors.nombre ? (
              <div className=" my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.nombre}</p>
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.apellido}
              />
            </div>

            {/* Validación - Apellido */}
            {formik.touched.apellido && formik.errors.apellido ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.apellido}</p>
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.empresa}
              />
            </div>

            {/* Validación - Empresa */}
            {formik.touched.empresa && formik.errors.empresa ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.empresa}</p>
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>

            {/* Validación - Email */}
            {formik.touched.email && formik.errors.email ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.email}</p>
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telefono}
              />
            </div>

            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-blue-900 transition duration-500 cursor-pointer"
              value="Registrar Cliente"
            />
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default NewClient
