import React from "react"
import { useQuery } from "@apollo/client"
import { OBTENER_USUARIO } from "../gql/querys"
import { useRouter } from "next/router"

const Header = () => {
  // routing
  const router = useRouter()

  // query de Apollo
  const { data, loading } = useQuery(OBTENER_USUARIO)

  // Proteger que no accedamos a data antes de obtener resultados
  if (loading) return null

  //   Si no hay información
  if (!data) {
    return router.push("/login")
  }

  const { nombre, apellido } = data.obtenerUsuario

  const cerrarSesion = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <div className="sm:flex justify-between">
      <p className="mr-2 mb-5 lg:mb-0">
        Hola: {nombre} {apellido}
      </p>
      <button
        onClick={() => cerrarSesion()}
        type="button"
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
      >
        Cerrar Sesión
      </button>
    </div>
  )
}

export default Header