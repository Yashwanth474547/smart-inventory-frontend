import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        alert("Logged Out Successfully");

        navigate("/login");

    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container-fluid">

                <a className="navbar-brand">
                    Smart Inventory
                </a>

                <button
                    className="btn btn-danger"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </nav>

    );

};

export default Navbar;