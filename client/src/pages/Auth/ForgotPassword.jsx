import MainLayout from "../../layouts/MainLayout";

export default function ForgotPassword() {
    return (
        <MainLayout>
            <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Forgot Password</h1>
                <p className="text-gray-600">Enter your email to recover your password.</p>
            </div>
        </MainLayout>
    );
}
