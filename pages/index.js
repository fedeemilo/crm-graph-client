import Layout from "../components/Layout";
import Cliente from "../components/Cliente";
import { useQuery } from "@apollo/client";
import { OBTENER_CLIENTES_USUARIO } from "../gql/querys";
import Link from "next/link";
import Loading from "../components/ui/Loading";

const Index = () => {
  // Obtener Clientes
  const { data, loading } = useQuery(OBTENER_CLIENTES_USUARIO);

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    );

  if (!data.obtenerClientesVendedor) {
    window.location.href = "login";
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light mt-5">Clientes</h1>
        <Link href="/newclient">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
            Nuevo Cliente
          </a>
        </Link>
        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg border-separate border border-gray-800">
            <thead className="bg-gray-800">
              <tr className="text-left  text-white">
                <th className="w-1/5 pl-4 py-2 border border-gray-600">
                  Nombre
                </th>
                <th className="w-1/5 pl-4 py-2 border-gray-600">Empresa</th>
                <th className="w-1/5 pl-4 py-2 border-gray-600">Email</th>
                <th className="w-1/5 pl-4 py-2 border-gray-600">Eliminar</th>
                <th className="w-1/5 pl-4 py-2 border-gray-600">Editar</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.obtenerClientesVendedor.map(cliente => (
                <Cliente key={cliente.id} cliente={cliente} />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};
export default Index;
