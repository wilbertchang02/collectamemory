import { useState } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabase"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return alert(error.message)
    router.push("/")
  }

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) return alert(error.message)
    alert("Account created! Now login.")
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <input className="border p-2 block mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 block mb-4" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

      <button className="bg-blue-600 text-white px-4 py-2 mr-2" onClick={handleLogin}>Login</button>
      <button className="bg-green-600 text-white px-4 py-2" onClick={handleSignup}>Sign Up</button>
    </div>
  )
}