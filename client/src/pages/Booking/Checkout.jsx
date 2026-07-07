import MainLayout from "../../layouts/MainLayout";

export default function Checkout() {
    return (
        <MainLayout>
            <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>
                <p className="text-gray-600">Review your booking and pay.</p>
            </div>
        </MainLayout>
    );
}
