import { RecoveryForm } from "@/components/auth/RecoveryForm";
export const metadata = { title: "Recover your account | VendoraX" };
export default function Page() {
  return (
    <div className="page-shell max-w-lg">
      <div className="page-intro">
        <p className="eyebrow">LET’S GET YOU BACK IN</p>
        <h1>Forgot your password?</h1>
        <p>Enter your account email to request a secure recovery link.</p>
      </div>
      <RecoveryForm />
    </div>
  );
}
