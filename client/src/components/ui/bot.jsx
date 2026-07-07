import bot from '@/assets/bot.png';
import { Link } from "react-router-dom"

export default function Bot(){
    return(
        <div>
            {/* Chat Bot Button */}
      <div className="h-[80px] w-[80px] p-2 fixed inset-0 top-[calc(100vh-150px)] left-[calc(100%-150px)] z-10 bounce hover:cursor-pointer ">
        <Link to='/chatbot'>
        <img
          className="border-2 border-orange-300 bg-amber-500/90 rounded-full p-4 shadow-xl shadow-black/80 transition-all duration-300 ease-in-out hover:scale-[1.1]"
          src={bot}
          alt="UniWork Bot"
        /></Link>
      </div>
        </div>
    )
}