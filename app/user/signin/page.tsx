'use client'

import SignInForm from '@/components/user/SignIn'
import React, { Suspense } from 'react'

function page() {
  return (
    <Suspense fallback={null}>
      <SignInForm/>
    </Suspense>
  )
}

export default page
