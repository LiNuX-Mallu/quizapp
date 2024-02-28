import { useEffect, useState } from "react";

interface Question {
  q: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  }
  a: string;
}

export function Main() {
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {

  }, []);
  return (
    <div className="select-none bg-gradient-to-br from-slate-400 to-slate-800 h-[100vh] flex justify-center items-between flex-col items-center overflow-hidden">
      <div className="bg-transparent mb-5 h-[10%] ps-10 pe-10 text-white w-[100%] flex flex-row justify-between items-center">
        <button className="flex items-center justify-center font-semibold">
          user124 &nbsp; <i className="fa-solid fa-user"></i>
        </button>
        <button className="flex items-center justify-center font-[Lexend]">
          Exit &nbsp; <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
      <div className="bg-transparent h-[100%] w-[100%] md:h-[100vh] md:w-[50%] flex justify-evenly items-center flex-col pb-10">
        <div className="flex flex-col w-[100%] h-[100%] justify-start items-center gap-5">
          <div className="w-[50%] flex font-semibold text-gray-700 overflow-hidden rounded-md">
            <div className="w-[100%] h-[100%] bg-blue-400 p-2 flex justify-center text-white">
              YOU &nbsp; <span>0</span>
            </div>
            <div className="w-[100%] h-[100%] bg-red-400 p-2 flex justify-center text-white">
              OPP &nbsp; <span>0</span>
            </div>
          </div>
        </div>

        {/* <div className="h-[5rem] w-[5rem] bg-gray-500 rounded-[50%] flex justify-center items-center">
          <span className="text-4xl">0</span>
        </div> */}

        <div className="w-[100%] flex flex-col h-[40%] justify-center items-center overflow-hidden">
          <div className="bg-green-200 h-[60%] w-[70%] rounded-md flex justify-center items-center">
            <p className="font-[Lexend] text-green-900">
              Who is the first prime minister of india?
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-1 w-[70%] h-[40%] overflow-hidden font-semibold">
            <div className="bg-slate-200 rounded-md h-full w-full flex justify-center items-center text-gray-900">
              {`a) Narendra Modi`}
            </div>
            <div className="bg-slate-200 rounded-md h-full w-full flex justify-center items-center text-gray-900">
              {`d) Narendra Modi`}
            </div>
            <div className="bg-slate-200 rounded-md h-full w-full flex justify-center items-center text-gray-900">
              {`c) Narendra Modi`}
            </div>
            <div className="bg-slate-200 rounded-md h-full w-full flex justify-center items-center text-gray-900">
              {`d) Narendra Modi`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
