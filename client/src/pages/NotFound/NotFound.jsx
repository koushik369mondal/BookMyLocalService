import MainLayout from "../../layouts/MainLayout";

export default function NotFound() {
    return (
        <MainLayout>
            <div className="max-w-md mx-auto my-20 p-6 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Page Not Found</h2>
                <p className="text-gray-600 mb-6">The page you are looking for does not exist or has been moved.</p>
                <a href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                    Go Back Home
                </a>
            </div>
        </MainLayout>
    );
}
