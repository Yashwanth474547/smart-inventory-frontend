const AccessDenied = () => {

    return (
        <div className="container text-center mt-5">

            <h1 className="text-danger">
                403
            </h1>

            <h2>
                Access Denied
            </h2>

            <p className="text-muted">
                You do not have permission to access this page.
            </p>

        </div>
    );
};

export default AccessDenied;