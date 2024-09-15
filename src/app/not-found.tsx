import Link from "next/link";

const Error = () => {
    return (
        <div
            style={{ minHeight: "calc(100vh - 115px)" }}
            className="flex items-center justify-center flex-col px-6"
        >
            <div className="flex flex-col gap-4">
                <h2 className="text-6xl font-bold text-secondary text-center">404</h2>
                <h3 className="font-semibold text-3xl text-secondary text-center">
                    No Routes Found
                </h3>
                <p className="text-center">
                    You might be in the wrong place! <br />
                    <span className="text-secondary font-bold">
                        But Don't Worry, you can jump into our Home to enjoy plenty stuffs
                    </span>
                </p>
                <Link
                    href={"/"}
                    className="px-5 py-4 w-fit mx-auto text-secondary hover:bg-secondary border border-secondary rounded hover:text-white transition-all duration-300 font-semibold"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Error;