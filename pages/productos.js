import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { OBTENER_PRODUCTOS } from "../gql/querys";
import { useQuery } from "@apollo/client";
import Producto from "../components/Producto";

const Productos = () => {
  const router = useRouter();

  const { data, loading } = useQuery(OBTENER_PRODUCTOS);

  if (loading) return "Cargando...";

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
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-left  text-white">
                <th className="w-1/5 pl-4 py-2">Nombre</th>
                <th className="w-1/5 pl-4 py-2">Stock</th>
                <th className="w-1/5 pl-4 py-2">Precio</th>
                <th className="w-1/5 pl-4 py-2">Eliminar</th>
                <th className="w-1/5 pl-4 py-2">Editar</th>
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
