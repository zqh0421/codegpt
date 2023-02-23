import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
export default function NoPermission() {
  let navigate = useNavigate()
  useEffect(() => {
    navigate('/codegpt')
  }, [])

  return (
    <div>No permission!</div>
  )
}
