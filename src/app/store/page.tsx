import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation";

const StoreHome = async() => {
  const user = await getCurrentUser(); 
  if(!user){
    redirect('/login');
  }
  return (
    <div className="m-10">
      <h1>Home page</h1>
    </div>
  )
}

export default StoreHome
