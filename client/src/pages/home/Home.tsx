import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="select-none bg-gradient-to-bl from-slate-50 to-slate-600 h-[100vh] flex justify-center items-center">
      <div className="bg-white h-[100vh] w-[100%] md:w-[30%] md:h-[80%] rounded-md flex justify-between flex-col items-stretch p-3 pt-10">
        <h1 className="text-center text-5xl text-gray-500 font-bold">Quiz</h1>
        <button className="font-semibold text-gray-600 flex items-center justify-center gap-2">
          Your ID: 121323234 <i className="fa fa-copy"></i>
        </button>
        <div className="flex flex-col justify-center items-center font-medium gap-3">
          <button className="text-white bg-green-400 p-1 pe-4 ps-4 w-[70%] rounded-md">
            Play with a friend
          </button>
          <span className="font-medium text-gray-600">OR</span>
          <button
            onClick={() => navigate("/app")}
            className="text-white bg-blue-400 p-1 pe-4 ps-4 w-[70%] rounded-md"
          >
            Play with random user
          </button>
        </div>
        <p className="font-[Lexend] text-xs text-center text-gray-500 font-normal">
          Quiz game developed by mohd. shas
        </p>
      </div>
    </div>
  );
}
