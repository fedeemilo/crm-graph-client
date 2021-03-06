import React, { useState } from "react"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import Layout from "../components/Layout"
import * as Yup from "yup"
import { useMutation } from "@apollo/client"
import { REGISTER } from "../gql/mutations"
import { mostrarMensaje } from "../utils/functions"

const Register = () => {
  // State para el mensaje
  const [mensaje, setMensaje] = useState(null)

  // Mutation para crear nuevos usuarios
  const [nuevoUsuario] = useMutation(REGISTER)

  // routing
  const router = useRouter()

  // Validación del formulario
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El Nombre es obligatorio"),
      apellido: Yup.string().required("El Apellido es obligatorio"),
      email: Yup.string()
        .email("El email no es válido")
        .required("El Email es obligatorio"),
      password: Yup.string()
        .required("El Password no puede ir vacío")
        .min(6, "El password debe ser de al menos 6 caracteres")
    }),
    onSubmit: async values => {
      const { nombre, apellido, email, password } = values

      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              password
            }
          }
        })

        // Usuario creado correctamente
        setMensaje(
          `Se creo correctamente el Usuario: ${data.nuevoUsuario.nombre}`
        )

        setTimeout(() => {
          setMensaje(null)
          router.push("/login")
        }, 1500)

        // Redirigir usuario para iniciar sesión
      } catch (err) {
        setMensaje(err.message.replace("GraphQL error: ", ""))

        setTimeout(() => {
          setMensaje(null)
        }, 3000)
      }
    }
  })

  return (
    <>
      <Layout>
        <h1 className="text-center text-2xl text-white font-light">
          Registrarse
        </h1>

        {mensaje && mostrarMensaje(mensaje)}

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              {/* Nombre */}
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
                  placeholder="Nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              {/* Validación - Nombre */}
              {formik.touched.nombre && formik.errors.nombre ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.nombre}</p>
                </div>
              ) : null}

              {/* Apellido */}
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
                  placeholder="Apellido"
                  value={formik.values.apellido}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              {/* Validación - Apellido */}
              {formik.touched.apellido && formik.errors.apellido ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.apellido}</p>
                </div>
              ) : null}

              {/* Email */}
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
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              {/* Validación - Email */}
              {formik.touched.email && formik.errors.email ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.email}</p>
                </div>
              ) : null}

              {/* Password */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              {/* Validación - Password */}
              {formik.touched.password && formik.errors.password ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.password}</p>
                </div>
              ) : null}

              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase rounded hover:bg-gray-900 cursor-pointer"
                value="Crear Cuenta"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Register
