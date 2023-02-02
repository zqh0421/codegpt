import { useEffect } from 'react'
import { useNavigate } from 'react-router'
export default function NoPermission() {
  let navigate = useNavigate()
  useEffect(() => {
    if (localStorage && localStorage.token) {
      navigate('/')
    } else {
      navigate('login')
    }
  }, [])

  return (
    <div>No permission!</div>
  )
}
