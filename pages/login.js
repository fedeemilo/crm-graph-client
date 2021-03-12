import React, { useState } from "react"
import Layout from "../components/Layout"
import { useRouter } from "next/router"
import { mostrarMensaje } from "../utils/functions"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useMutation } from "@apollo/client"
import { AUTENTICAR_USUARIO } from "../gql/mutations"

const Login = () => {
  // Mutation para crear nuevos usuarios en apollo
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO)

  const [mensaje, setMensaje] = useState(null)

  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("El email no es válido")
        .required("El email no puede ir vacío"),
      password: Yup.string().required("El password es obligatorio")
    }),
    onSubmit: async values => {
      const { email, password } = values

      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: {
              email,
              password
            }
          }
        })
        setMensaje("Autenticando...")

        
        // Guardar el token en localStorage
        setTimeout(() => {
          const { token } = data.autenticarUsuario
          localStorage.setItem("token", token) 
        }, 1000)


        // Redireccionar hacia clientes
        setTimeout(() => {
          setMensaje(null)
          router.push("/")
        }, 1500)
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
        <h1 className="text-center text-2xl text-white font-light">Login</h1>

        {mensaje && mostrarMensaje(mensaje)}

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
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
                  placeholder="Email Usuario"
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
                  placeholder="Password Usuario"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
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
                className="bg-gray-800 w-full mt-4 p-2 text-white uppercase rounded hover:bg-gray-900 cursor-pointer"
                value="Iniciar Sesión"
              />
              <button
                className="w-full pt-3"
                onClick={() => router.push("/register")}
              >
                Registrate
              </button>
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Login
