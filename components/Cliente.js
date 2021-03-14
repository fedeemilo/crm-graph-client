import React from "react"
import Router from "next/router"
import Swal from "sweetalert2"
import { useMutation } from "@apollo/client"
import { ELIMINAR_CLIENTE } from "../gql/mutations"
import { OBTENER_CLIENTES_USUARIO } from "../gql/querys"

const Cliente = ({ cliente }) => {
  const { nombre, apellido, empresa, email, id } = cliente

  // Mutation para eliminar cliente
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
    update(cache) {
      //   Obtener copia del objeto de cache
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO
      })

      //   Reescribir el cache
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: obtenerClientesVendedor.filter(
            clienteActual => clienteActual.id !== id
          )
        }
      })
    }
  })

  // Elimina un cliente
  const confirmarEliminarCliente = () => {
    Swal.fire({
      title: "¿Deseas eliminar a este cliente?",
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
          const { data } = await eliminarCliente({
            variables: {
              id
            }
          })

          // Mostrar una alerta
          Swal.fire("Eliminado!", data.eliminarCliente, "success")
        } catch (err) {
          console.log(err)
        }
      }
    })
  }

  // Editar cliente
  const editarCliente = () => {
    Router.push({
      pathname: "/editarcliente/[id]",
      query: { id }
    })
  }

  return (
    <tr>
      <td className="border px-4 py-2 border-gray-600">
        {nombre} {apellido}
      </td>
      <td className="border px-4 py-2 border-gray-600">{empresa}</td>
      <td className="border px-4 py-2 border-gray-600">{email}</td>
      <td className="border px-4 py-2 border-gray-600">
        <button
          type="button"
          className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white text-xs uppercase font-bold rounded"
          onClick={() => confirmarEliminarCliente()}
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
          onClick={() => editarCliente()}
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
  )
}

export default Cliente
