import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Error from "./Error";

function App() {
  const location = useLocation();
  console.log(location.state.email);

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

  if(tokenData.token_type==="warden" && tokenData.token_val){
    useEffect(() => {
        handleGetAll();
      }, []);   
  }

  const [stName, setStName] = useState("");
  const [stid, setStId] = useState("");
  const [stmobno, setStMobNo] = useState("");
  const [hostelname, setHostelName] = useState("");
  const [FName, setFName] = useState("");
  const [Fmobno, setFMobNo] = useState("");
  const [Branch, setBranch] = useState("");
  const [Year, setYear] = useState("");
  const [RoomNo, setRoomNo] = useState("");
  const [OutDate, setOutDate] = useState("");
  const [InDate, setInDate] = useState("");
  const [OutTime, setOutTime] = useState("");
  const [Reason, setReason] = useState("");
  const [Dest, setDest] = useState("");
  const [Luggage, setLuggage] = useState("yes");
  const [Company, setCompany] = useState("");

  
  const [error, setError] = useState(false);
  const [infoVisibility, setInfoVisibility] = useState(0);
  const [allOutpass, setAllOutpass] = useState([]);

  const toggleVisibility = (clg_id) => {
    setInfoVisibility(clg_id);
  };

  const toggleError = () => {
    setError(true);
  };
  const toggleError1 = () => {
    setError(false);
  };

  const handleCheckUser = async (clg_id) => {
    try {
      const url = `http://localhost:8000/get_user_by_clg_id?College_id=${clg_id}`;
      const response = await fetch(url);

      if (!response.ok) {
        toggleError();
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      toggleError1();

      const userInfo = await response.json();
      handleUserInfo(userInfo);

      const userInfoUrl = `http://localhost:8000/get_outpass_by_clg_id?College_id=${clg_id}`;
      const userInfoResponse = await fetch(userInfoUrl);

      if (!userInfoResponse.ok) {
        throw new Error(
          `Failed to fetch user information! Status: ${userInfoResponse.status}`
        );
      }
      const outpassInfo = await userInfoResponse.json();
      handleOutpassInfo(outpassInfo);
      toggleVisibility(clg_id);
    } catch (error) {
      console.error("Error logging in:", error);
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
              onClick={() => handleCheckUser(clg_id)}
              className="text-black border-solid hover:cursor-pointer rounded-full p-2 bg-white hover:bg-slate-300 font-semibold hover:text-blue-900 transition duration-200 ease-in-out w-20"
            >
              Check
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleUserInfo = (userInfo) => {
    setStName(userInfo.Name);
    setStId(userInfo.College_id);
    setStMobNo(userInfo.Mobile_no);
    setHostelName(userInfo.Hostel);
    setFName(userInfo.Father_name);
    setFMobNo(userInfo.Father_mob);
    setBranch(userInfo.Branch);
    setYear(userInfo.Year);
    setRoomNo(userInfo.Room_No);
  };

  const handleOutpassInfo = (outpassInfo) => {
    setOutDate(outpassInfo.out_date);
    setInDate(outpassInfo.in_date);
    setOutTime(outpassInfo.out_time);
    setReason(outpassInfo.reason);
    setDest(outpassInfo.destination);
    setLuggage(outpassInfo.luggage);
    setCompany(outpassInfo.company);
  };

  const handleDeleteOutpass = async (num) => {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          College_id: num,
        }),
      };
  
      const response = await fetch(`http://localhost:8000/delete_outpass?College_id=${num}`, requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if(response.ok){
        console.log("Outpass deleted successfully");
      }  
    } catch (error) {
      console.error("Error deleting outpass:", error);
    }
  };
  
  
  const handlesendpass = async (num) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          College_id: num,
        }),
      };
  
      const response = await fetch("http://localhost:8000/send_guard_pass", requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if(response.ok){
        console.log("Outpass sent successfully!");
        handleDeleteOutpass(num);
      }
  
    } catch (error) {
      console.error("Error sending outpass:", error.message); 
    }
  };
  

  const [isVisible, setIsVisible] = useState(0);
  const Generate = (num) => {
    handlesendpass(num);
    setIsVisible(num);
  };

  const handleGetAll = async () => {
    try {
      const url = `http://localhost:8000/get_all_outpass?token=${tokenData.token_val}&email=${location.state.email}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAllOutpass(data);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
      <div className="text-white mt-6 grid place-content-center font-semibold text-4xl mb-10">
        Applicant Information
      </div>
  
      <div className="grid place-content-center">
        {allOutpass.length > 0 &&
          allOutpass.map((item, index) => (
            <div className="text-white" key={index}>
              {isVisible!=item.College_id && (
                <div key={index}>
                  <Card clg_id={item.College_id} />
                  {infoVisibility === item.College_id && (
                    <div className="grid place-content-center text-white mt-9">
                      <div className="flex">
                        <div className="grid place-content-center">
                          <h1 className="ml-3 mr-3 mb-3">Name: {stName}</h1>
                          <h1 className="ml-3 mr-3 mb-3">
                            Mobile Number: {stmobno}
                          </h1>
                          <h1 className="ml-3 mr-3 mb-3">Father's Name: {FName}</h1>
                          <h1 className="ml-3 mr-3 mb-3">Branch: {Branch}</h1>
                          <h1 className="ml-3 mr-3 mb-3">Room No: {RoomNo}</h1>
                          <h1 className="ml-3 mr-3 mb-3">Out Date: {OutDate}</h1>
                          <h1 className="ml-3 mr-3 mb-3">Out Time: {OutTime}</h1>
                          <h1 className="ml-3 mr-3 mb-3">Luggage: {Luggage}</h1>
                        </div>
                        <div className="grid place-content-center">
                          <h1 className="ml-3 mr-3 mb-3">College Id: {stid}</h1>
                          <h1 className="ml-3 mr-3 mb-3">Hostel: {hostelname}</h1>
                          <h1 className="ml-3 mr-3 mb-3">
                            Father's Mobile Number: {Fmobno}
                          </h1>
                          <h1 className="ml-3 mr-3 mb-3">Year: {Year}</h1>
                          <h1 className="ml-3 mr-3 mb-3">In Date: {InDate}</h1>
                          <h1 className="ml-3 mr-3 mb-3">Reason: {Reason}</h1>
                          <h1 className="ml-3 mr-3 mb-3">Destination: {Dest}</h1>
                          <h1 className="ml-3 mr-3 mb-3">Company: {Company}</h1>
                        </div>
                      </div>
  
                      <div className="flex ml-3 mt-3 mb-10 justify-end mr-3">
                        <button onClick={() => Generate(item.College_id)} className="text-white border-solid hover:cursor-pointer rounded-full p-2 bg-blue-900 hover:bg-slate-300 font-semibold hover:text-blue-900 transition duration-200 ease-in-out">
                          Approve
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
  
}

export default App;
