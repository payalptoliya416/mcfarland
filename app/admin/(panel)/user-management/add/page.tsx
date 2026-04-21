
import EditUserForm from '@/adminpanel/EditUserForm'
import  { Suspense } from 'react'

function page() {
  return (
   <Suspense fallback={<div>Loading...</div>}>
      <EditUserForm/>
    </Suspense>
  )
}

export default page
