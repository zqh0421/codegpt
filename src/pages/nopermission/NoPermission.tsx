import { useEffect } from 'react'
import { useNavigate } from 'react-router'
export default function NoPermission() {
  let navigate = useNavigate()
  useEffect(() => {
    navigate('/codegpt_test')
  }, [])

  return (
    <div>No permission!</div>
  )
}
