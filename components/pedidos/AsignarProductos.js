import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { useQuery } from "@apollo/client";
import { OBTENER_PRODUCTOS } from "../../gql/querys";
import PedidoContext from "../../context/pedidos/PedidoContext";

const AsignarProductos = () => {
  // state local del componente
  const [productos, setProductos] = useState([]);

  // Context de pedidos
  const pedidoContext = useContext(PedidoContext);

  const { agregarProducto } = pedidoContext;

  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  useEffect(() => {
    // TODO: Función para pasar a pedidoState
    agregarProducto(productos)
  }, [productos]);

  const seleccionarProducto = producto => {
    setProductos(producto);
  };

  if (loading) return null;
  const { obtenerProductos } = data;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        1.- Selecciona o busca los productos
      </p>
      <Select
        className="mt-3"
        options={obtenerProductos}
        onChange={opcion => seleccionarProducto(opcion)}
        isMulti={true}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones =>
          `${opciones.nombre} - ${opciones.stock} Disponibles`
        }
        placeholder="Busque o Seleccione el Producto"
        noOptionsMessage={() => "No hay resultados"}
      />
    </>
  );
};

export default AsignarProductos;
