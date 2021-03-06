import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { useQuery } from '@apollo/client'
import { OBTENER_CLIENTES_USUARIO } from '../../gql/querys';
import PedidoContext from '../../context/pedidos/PedidoContext'

const AsignarCliente = () => {
  const [cliente, setCliente] = useState([]);

  // Context de pedidos
  const pedidoContext = useContext(PedidoContext);

  const { agregarCliente } = pedidoContext;

  // Consultar la base de datos
  const { data, loading} = useQuery(OBTENER_CLIENTES_USUARIO)

  // Resultados de la consulta
  if (loading) return null;

  const { obtenerClientesVendedor } = data


  useEffect(() => {
    agregarCliente(cliente)
  }, [cliente]);

  const seleccionarCliente = cliente => {
    setCliente(cliente);
  };

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        1.- Asigna un Cliente al pedido
      </p>
      <Select
        className="mt-3"
        options={obtenerClientesVendedor}
        onChange={opcion => seleccionarCliente(opcion)}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones => `${opciones.nombre} ${opciones.apellido}`}
        placeholder="Busque o Seleccione el Cliente"
        noOptionsMessage={() => "No hay resultados"}
      />
    </>
  );
};

export default AsignarCliente;
