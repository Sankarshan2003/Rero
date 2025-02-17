import LoginForm from "./ui/login-form"
import checkCred from "./functions/functions";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // Check JWTtoken 
  const res = await checkCred();
  
  // Reroute to dashboard
  if (res.status === true) {
    redirect('/dashboard');
  }

  // Render the login screen
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <h1 className={`text-4xl w-32 text-white md:w-36`}>
            RERO
          </h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
