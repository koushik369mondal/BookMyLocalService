import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="card-chai max-w-md w-full p-8 text-center space-y-5">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-white/[0.04] border border-white/10 text-2xl font-bold tracking-tight text-white mx-auto">
            404
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Page not found</h1>
            <p className="text-sm text-neutral-400">
              The page you are looking for doesn't exist or has been relocated.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <Link to="/">
              <Button variant="solid" className="flex items-center gap-2">
                <ArrowLeft className="size-4" />
                Return to home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
