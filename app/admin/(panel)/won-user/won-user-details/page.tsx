import WonUsersView from '@/adminpanel/WonUsersView'
import React, { Suspense } from 'react'

function WonUsers() {
  return (
     <Suspense fallback={null}>
       <WonUsersView/>
    </Suspense>
  )
}

export default WonUsers
