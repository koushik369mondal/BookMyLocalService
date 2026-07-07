import MainLayout from "../../layouts/MainLayout";

export default function AdminDashboard() {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Site administration and moderation controls.</p>
            </div>
        </MainLayout>
    );
}
