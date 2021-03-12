import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import PedidoContext from "../context/pedidos/PedidoContext";
import { useMutation } from "@apollo/client";
import { NUEVO_PEDIDO } from "../gql/mutations";
import { OBTENER_PEDIDOS } from "../gql/querys";
import { mostrarMensaje } from "../utils/functions";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const NuevoPedido = () => {
  const router = useRouter();

  const [mensaje, setMensaje] = useState(null);

  // Context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const { cliente, productos, total } = pedidoContext;

  // Mutation para crear otro Pedido
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, { data: { nuevoPedido } }) {
      // Obtener copia del cache
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS
      });

      // Reescribir el cache
      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
        }
      });
    }
  });

  const validarPedido = () => {
    return !productos.every(producto => producto.cantidad > 0) ||
      total === 0 ||
      cliente.length === 0
      ? "opacity-50 cursor-not-allowed"
      : "";
  };

  const crearNuevoPedido = async () => {
    const { id } = cliente;

    // Remover lo no deseado de productos
    const pedido = productos.map(
      ({ __typename, stock, ...producto }) => producto
    );

    try {
      const data = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total,
            pedido
          }
        }
      });


      // Redireccionar
      router.push("/pedidos");

      // Mostrar alerta
      Swal.fire("Correcto", "El pedido se registró correctamente", "success");
    } catch (err) {
      console.log(err);
      setMensaje(err.message.replace("GraphQL Error: ", ""));

      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl mt-5 mb-3 text-gray-800 font-light">
        Crear Nuevo Pedido
      </h1>

      {mensaje && mostrarMensaje(mensaje)}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AsignarCliente />

          <AsignarProductos />

          <ResumenPedido />

          <Total />

          <button
            type="button"
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
            onClick={() => crearNuevoPedido()}
          >
            Registrar Pedido
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoPedido;
