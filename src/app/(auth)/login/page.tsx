import { redirect } from "next/navigation";
import LoginForm from "@/components/users/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();
    if(user?.role === 'user'){
      redirect('/store/product');
    }

    if(user?.role === 'admin'){
      redirect('/');
    }
  
  return (
    <LoginForm role="user"/>
  );
}
