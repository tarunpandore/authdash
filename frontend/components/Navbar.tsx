import Link from "next/link"

const Navbar = () => {
  return (
    <div className="shadow-md">
        <nav className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold">PrimeTrade</div>
                <div className="space-x-4">
                    <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                    <Link href="/auth/register" className="text-gray-700 hover:text-blue-600">Register</Link>
                </div>
            </div>
        </nav>
    </div>
  )
}

export default Navbar