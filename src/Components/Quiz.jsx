import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import QuizHeader from "./QuizHeader";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [timerIntervalId, setTimerIntervalId] = useState("");
  const [status,setStatus] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetch("/quiz.json")
      .then((response) => response.json())
      .then((data) => setQuestions(data));

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setTimerIntervalId(intervalId);

    return () => {
      clearInterval(intervalId);
      if (timer === 0) {
        alert("Timer is Out");
      }
    };
  }, [timer]);

  const handleAnswerSelect = (questionId, selectedOption) => {
    const updatedAnswer = { ...answers, [questionId]: selectedOption };
    setAnswers(updatedAnswer);
  };

  const handleSubmit = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    clearInterval(timerIntervalId)
    setTimeout(()=>{
        const quizScore = calculateScore(answers);
        setScore(quizScore)
        const percentage = (quizScore/questions.length) * 100;
        console.log(percentage)
        const newStatus = percentage >= 50?"Passed" : "Failed";
        setStatus(newStatus)
        setShowResult(true)
        setLoading(false)
     
    },1000)
  };

 






   const calculateScore = (userAnswers) =>{
    const correctAnswers = questions.map((question)=>question.answer);
    console.log(correctAnswers)
    let score = 0;
    for( const questionId in userAnswers){
        if(userAnswers[questionId]=== correctAnswers[questionId-1]){
            score++;
        }
    }
    return score;
   }

  const handleReset = (e)=>{
     e.preventDefault()
     setLoading(false)
     setShowResult(false)
     setScore(0)
     setAnswers({})
     setTimer(60)
     navigate("/quiz")
  }


  const formatTime = (seconds)=>{
    const minutes = Math.floor(seconds/60)
    const remainingSeconds = (seconds % 60)
    const formatedTime = `${String(minutes).padStart(2,"0")}:${String(remainingSeconds).padStart(2,"0")}`
     return formatedTime;
  }



  return (
    <section>

         <QuizHeader timer={timer}/>

      <div className="max-w-4xl   lg:mx-auto flex flex-col  min-h-screen">
        <div className=" w-full min-h-screen border-[2px] m-5">
          <div className="flex flex-col justify-center gap-5 mx-auto w-3/4">
            {questions.map((question, index) => (
              <div className="border-[2px] p-3" key={question.id}>
                <p className="text-lg text font-semibold text-sky-700">
                  <span>{index + 1}. </span>
                  {question.question}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-8">
                  {question.options.map((option, opIndex) => (
                    <p
                      onClick={() => handleAnswerSelect(question.id, option)}
                      key={opIndex}
                      className={`border-[2px] ${answers[question.id]==option?"bg-yellow-500 text-white":""} border- p-3 bg-pink-700  text-white font-semibold border-lime-700
                                    hover:bg-transparent hover:text-pink-700 cursor-pointer`}
                    >
                      {option}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="w-full flex flex-col  text-center px-8">
              <button
                onClick={handleSubmit}
                className="text-white font-semibold  text-lg my-1 py-2 px-8 border-[2px] hover:bg-transparent
                hover:text-yellow-600 hover:border-yellow-500 bg-yellow-500 rounded-lg"
              >
                Submit
              </button>
              <button
                onClick={handleReset}
                className="text-white font-semibold  text-lg mb-5 py-2 px-8 border-[2px] hover:bg-transparent
                hover:text-yellow-600 hover:border-yellow-500 bg-orange-700 rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>

          {/* --======================================showResult========================= */}
        </div>

       { showResult &&
        <div className="absolute flex flex-col gap-7 left-0 top-[275px] md:top-[180px] border-[2px] w-[250px] h-[50%] bg-white p-6">
         <p className="text-2xl  font-semibold text-blue-900">Score :{score*10}/60
         </p>
         
         <p className="text-xl  font-semibold text-blue-900">
         Status: 
         <span className={`${status=="Passed"?"text-yellow-500":"text-red-500"}`}> {status}</span>
         </p>
         <p className="text-xl  font-semibold text-blue-900" >Total Time : {formatTime(60-timer)} <span>sec</span></p>


         <button onClick={handleReset} className="px-6 py-1 bg-yellow-400 hover:bg-transparent border-[2px] hover:border-yellow-300 
         hover:text-yellow-400 font-semibold">Restart</button>
        </div>

       }

      </div>
    </section>
  );
};

export default Quiz;
