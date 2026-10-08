import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "20px",
            background: "#f4f6f9",
            minHeight: "100vh",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;