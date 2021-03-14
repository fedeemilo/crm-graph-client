import React from "react";
import Router from "next/router";
import Swal from "sweetalert2";
import { useMutation } from "@apollo/client";
import { ELIMINAR_PRODUCTO } from "../gql/mutations";
import { OBTENER_PRODUCTOS } from "../gql/querys";

const Producto = ({ producto }) => {
  const { nombre, stock, precio, id } = producto;

  // Mutation para elimnar producto
  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    update(cache) {
      // Obtener copia del cache
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS
      });

      // Reescribir cache
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: obtenerProductos.filter(
            productoActual => productoActual.id !== id
          )
        }
      });
    }
  });

  // Elimina un producto
  const confirmarEliminarProducto = () => {
    Swal.fire({
      title: "¿Deseas eliminar este producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
      cancelButtonText: "No, Cancelar"
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          // Eliminar por ID
          const { data } = await eliminarProducto({
            variables: {
              id
            }
          });

          // Mostrar una alerta
          Swal.fire("Eliminado!", data.eliminarProducto, "success");
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  // Editar producto
  const editarProducto = () => {
    Router.push({
      pathname: "/editarproducto/[id]",
      query: { id }
    });
  };

  return (
    <tr>
      <td className="border px-4 py-2 border-gray-600">{nombre}</td>
      <td className="border px-4 py-2 border-gray-600">{stock}</td>
      <td className="border px-4 py-2 border-gray-600">{precio}</td>
      <td className="border px-4 py-2 border-gray-600">
        <button
          type="button"
          className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white text-xs uppercase font-bold rounded"
          onClick={() => confirmarEliminarProducto()}
        >
          Eliminar
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </td>
      <td className="border px-4 py-2 border-gray-600">
        <button
          type="button"
          className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white text-xs uppercase font-bold rounded"
          onClick={() => editarProducto()}
        >
          Editar
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default Producto;
