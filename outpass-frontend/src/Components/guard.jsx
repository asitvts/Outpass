import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  console.log(location.state.email);
  const [allOutpass, setAllOutpass] = useState([]);


  function getTokenFromCookie() {
    const cookieString = document.cookie;
    const cookieArray = cookieString.split(';');
    let tokenData = null;
    
    for (let cookie of cookieArray) {
        cookie = cookie.trim();
        if (cookie.startsWith('token=')) {
            const tokenString = cookie.substring('token='.length);
            tokenData = JSON.parse(decodeURIComponent(tokenString));
            break;
        }
    }
    
    return tokenData;
}

const tokenData = getTokenFromCookie();
if (tokenData) {
    const token_val = tokenData.token_val;
    const token_type = tokenData.token_type;
    console.log("Token value:", token_val);
    console.log("Token type:", token_type);
} else {
    console.log("Token not found in cookie.");
} 

  if(tokenData.token_val && tokenData.token_type==="guard"){
    useEffect(() => {
        handleGetAll();
      }, []);  
  }
  const handleGetAll = async () => {
    try {
      const url = `http://localhost:8000/get_all_guard_pass?token=${tokenData.token_val}&email=${location.state.email}`;
      const response = await fetch(url);

      if (!response.ok) {
        toggleVisibility();
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAllOutpass(data);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };



  const handleDeletePass = async (num) => {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          College_id: num,
        }),
      };

      const response = await fetch(`http://localhost:8000/delete_guard_pass?College_id=${num}`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Guard pass deleted successfully");

      handleGetAll();
    } catch (error) {
      console.error("Error deleting guard pass:", error);
    }
  };

  const Card = ({ clg_id }) => {
    return (
      <div className="text-gray-300 mb-3 mt-3 rounded-lg text-sm w-[350px] bg-[#161b22] border border-[#3f3f46] hover:shadow-white hover:shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="text-gray-100">
            <p className="text-lg overflow-hidden whitespace-nowrap text-ellipsis">
              <span>{clg_id}</span>
            </p>
          </div>
          <div>
            <button
              onClick={() => handleDeletePass(clg_id)}
              className="text-black border-solid hover:cursor-pointer rounded-full p-2 bg-white hover:bg-slate-300 font-semibold hover:text-blue-900 transition duration-200 ease-in-out w-20"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    );
  };
  const [isVisible, setIsVisible] = useState(true);
  const toggleVisibility = () => {
    setIsVisible(false);
  }

  return (
    <>
      <div className="text-white mt-6 grid place-content-center font-semibold text-4xl mb-10">Outpass Info</div>

      <div className="grid place-content-center">
        { isVisible && allOutpass.length > 0 &&
          allOutpass.map((item, index) => (
            <div className="text-white" key={index}>
              <div key={index}>
                <Card clg_id={item.College_id} />
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
