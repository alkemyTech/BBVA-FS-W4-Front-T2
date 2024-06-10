import React from 'react'

export default function ComponenteIncial() {
    const user = useSelector((state)=> state.user)
  return (
    <div>{user.nombre}</div>
  )
}
