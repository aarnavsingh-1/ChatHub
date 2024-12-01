import { LogOut, MessageSquare, Settings, User } from "lucide-react";


const AuthImagePattern = ({ title, subtitle }) => {
 

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
       
        
      
        <div className="chat chat-start mt-12">
        
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
            
          </div>
          
          <div className="chat-bubble">Welcome back!</div>
        </div>

        <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>

          <div className="chat-bubble">Thanks!</div>
        </div>

        <h2 className="text-2xl font-bold mt-32 mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
