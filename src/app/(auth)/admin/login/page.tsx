import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/users/LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if(user?.role === 'admin'){
    redirect('/');
  }

  if(user?.role === 'user'){
    redirect('/store/product');
  }
  
  return (
    <LoginForm role="admin"/>
  );
}
