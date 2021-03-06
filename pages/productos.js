import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { OBTENER_PRODUCTOS } from "../gql/querys";
import { useQuery } from "@apollo/client";
import Producto from "../components/Producto";
import Loading from "../components/ui/Loading";

const Productos = () => {
  const router = useRouter();

  const { data, loading } = useQuery(OBTENER_PRODUCTOS);

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    );

  if (!data.obtenerProductos) {
    return router.push("/login");
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light mt-5">Productos</h1>

        <Link href="/newproduct">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
            Nuevo Producto
          </a>
        </Link>

        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg border-separate border border-gray-800">
            <thead className="bg-gray-800">
              <tr className="text-left  text-white">
                <th className="w-1/5 pl-4 py-2 border-gray-600">Nombre</th>
                <th className="w-1/5 pl-4 py-2 border-gray-600">Stock</th>
                <th className="w-1/5 pl-4 py-2 border-gray-600">Precio</th>
                <th className="w-1/5 pl-4 py-2 border-gray-600">Eliminar</th>
                <th className="w-1/5 pl-4 py-2 border-gray-600">Editar</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.obtenerProductos.map(producto => (
                <Producto key={producto.id} producto={producto} />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};

export default Productos;
