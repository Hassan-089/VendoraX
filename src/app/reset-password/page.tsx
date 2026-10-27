import { RecoveryForm } from "@/components/auth/RecoveryForm";
export const metadata = { title: "Set a new password | VendoraX" };
export default function Page() {
  return (
    <div className="page-shell max-w-lg">
      <div className="page-intro">
        <p className="eyebrow">A FRESH START</p>
        <h1>Set a new password.</h1>
        <p>
          Open this page through the recovery link in your email. Choose at
          least eight characters.
        </p>
      </div>
      <RecoveryForm reset />
    </div>
  );
}
