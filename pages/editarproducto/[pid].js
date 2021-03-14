import React from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Loading from "../../components/ui/Loading";
import { useQuery, useMutation } from "@apollo/client";
import { OBTENER_PRODUCTO, OBTENER_PRODUCTOS } from "../../gql/querys";
import { Formik } from "formik";
import * as Yup from "yup";
import { ACTUALIZAR_PRODUCTO } from "../../gql/mutations";

const EditarProducto = () => {
  // Obtener el ID actual
  const router = useRouter();
  const {
    query: { id }
  } = router;

  // Consultar para obtener el producto
  const { data, loading } = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id
    }
  });

  // Actualizar producto
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO, {
    update(cache, { data: { actualizarProducto } }) {
      // Obtener copia de cache
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS
      });

      // Reescribo el cache
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: [...obtenerProductos, actualizarProducto]
        }
      });
    }
  });

  // Schema de validación
  const schemaValidation = Yup.object({
    nombre: Yup.string().required("El nombre del producto es obligatorio"),
    stock: Yup.string().required("El stock del producto es obligatorio"),
    precio: Yup.string().required("El precio del producto es obligatorio")
  });

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    );

  const { obtenerProducto } = data;

  const actualizarInfoProducto = async values => {
    const { nombre, stock, precio } = values;

    try {
      const { data } = await actualizarProducto({
        variables: {
          id,
          input: {
            nombre,
            precio,
            stock
          }
        }
      });

      // Mostrar alerta
      Swal.fire(
        "Actualizado!",
        "El producto se actualizó correctamente",
        "success"
      );

      // Redireccionar
      router.push("/productos");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mt-5">
        Editar Producto
      </h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={schemaValidation}
            enableReinitialize
            initialValues={obtenerProducto}
            onSubmit={values => {
              actualizarInfoProducto(values);
            }}
          >
            {props => {
              console.log(props);

              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
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
                      placeholder="Nombre Producto"
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.stock}
                    />
                  </div>

                  {/* Validación - Stock */}
                  {props.touched.stock && props.errors.stock ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.stock}</p>
                    </div>
                  ) : null}

                  {/* Precio Producto*/}
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.precio}
                    />
                  </div>

                  {/* Validación - Precio */}
                  {props.touched.precio && props.errors.precio ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.precio}</p>
                    </div>
                  ) : null}

                  <input
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-blue-900 transition duration-500 cursor-pointer"
                    value="Editar Producto"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarProducto;
