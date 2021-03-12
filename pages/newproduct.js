import React, { useState } from "react"
import Swal from "sweetalert2"
import Layout from "../components/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useMutation } from "@apollo/client"
import { NUEVO_PRODUCTO } from "../gql/mutations"
import { OBTENER_PRODUCTOS } from "../gql/querys"
import { useRouter } from "next/router"
import { mostrarMensaje } from "../utils/functions"

const NewProduct = () => {
  const router = useRouter()

  const [mensaje, setMensaje] = useState(null)

  const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
    update(cache, { data: { nuevoProducto } }) {
      // Obtener copia del cache
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS
      })

      // Reescribir cache
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: [...obtenerProductos, nuevoProducto]
        }
      })
    }
  })

  const formik = useFormik({
    initialValues: {
      nombre: "",
      stock: "",
      precio: ""
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre del producto es obligatorio"),
      stock: Yup.string().required("El stock del producto es obligatorio"),
      precio: Yup.string().required("El precio del producto es obligatorio")
    }),
    onSubmit: async values => {
      const { nombre, stock, precio } = values

      try {
        const { data } = await nuevoProducto({
          variables: {
            input: {
              nombre,
              stock,
              precio
            }
          }
        })

        // Mostrar alerta
        Swal.fire("Creado !", "El producto se creó correctamente", "success")

        // Redireccionar hacia productos
        router.push("/productos")
      } catch (err) {
        console.log(err)
        setMensaje(err.message.replace("GraphQL error: ", ""))

        setTimeout(() => {
          setMensaje(null)
        }, 3000)
      }
    }
  })

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mt-5">Nuevo Producto</h1>

      {mensaje && mostrarMensaje(mensaje)}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            {/* Nombre Producto */}
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

            {/* Stock Producto */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="stock"
              >
                Stock
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="stock"
                type="number"
                placeholder="Stock Producto"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.stock}
              />
            </div>

            {/* Validación - Stock */}
            {formik.touched.stock && formik.errors.stock ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.stock}</p>
              </div>
            ) : null}

            {/* Precio Producto */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="precio"
              >
                Precio
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="precio"
                type="number"
                placeholder="Precio Producto"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.precio}
              />
            </div>

            {/* Validación - Precio */}
            {formik.touched.precio && formik.errors.precio ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.precio}</p>
              </div>
            ) : null}

            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-blue-900 transition duration-500 cursor-pointer"
              value="Crear Producto"
            />
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default NewProduct
