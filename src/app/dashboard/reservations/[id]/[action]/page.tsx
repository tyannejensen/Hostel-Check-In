// Testing
// 
// // import { useRouter } from 'next/router'
// import { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// const mockData = {
//   id: '1',
//   name: 'John Doe',
//   email: 'test@gmail.com',
// }

// export default function TenantPage() {
//   const router = useRouter()
//   const { id, action } = router.query
//   const [tenant, setTenant] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     if (id) {
//       const fetchTenant = async () => {
//         try {
//           // TODO: replace with actual fetch request
//           // const response = await fetch(`/api/tenants/${id}`)
//           // if (!response.ok) {
//           //   throw new Error('Network response was not ok')
//           // }
//           // const data = await response.json()

//           // Using mock data for now
//           const data = await new Promise((resolve) => {
//             setTimeout(() => {
//               resolve(mockData)
//             }, 200)
//           })

//           setTenant(data)
//         } catch (error) {
//           setError(error.message)
//         } finally {
//           setLoading(false)
//         }
//       }

//       fetchTenant()
//     }
//   }, [id])

//   if (loading) {
//     return <div>Loading...</div>
//   }

//   if (error) {
//     return (
//       <div>
//         <h1>Error</h1>
//         <p>{error}</p>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white to-violet-950 text-black font-sans">
//       <Card className="w-[400px] p-6 rounded-lg shadow-lg bg-white text-black text-center">
//         <CardHeader>
//           <CardTitle className="text-3xl font-semibold">
//             {action === 'view' ? 'View Tenant' : 'Edit Tenant'}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <p><strong>Name:</strong> {tenant.name}</p>
//           <p><strong>Email:</strong> {tenant.email}</p>
//           {action === 'edit' && (
//             <div>
//               {/* Add form fields for editing tenant details */}
//               <input type="text" defaultValue={tenant.name} />
//               <input type="email" defaultValue={tenant.email} />
//               <button>Save</button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }