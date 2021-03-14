import Layout from "../components/Layout";
import Pedido from "../components/Pedido";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { OBTENER_PEDIDOS } from "../gql/querys";
import Loading from "../components/ui/Loading";

const Pedidos = () => {
  const { data, loading } = useQuery(OBTENER_PEDIDOS);

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    );

  const { obtenerPedidosVendedor } = data;

  return (
    <div>
      <Layout>
        <h1 className="text-2xl mt-5 text-gray-800 font-light">Pedidos</h1>

        <Link href="/neworder">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
            Nuevo Pedido
          </a>
        </Link>

        {obtenerPedidosVendedor.length === 0 ? (
          <p className="mt-5 text-center text-2xl">No hay pedido aún</p>
        ) : (
          obtenerPedidosVendedor.map(pedido => (
            <Pedido key={pedido.id} pedido={pedido} />
          ))
        )}
      </Layout>
    </div>
  );
};

export default Pedidos;
