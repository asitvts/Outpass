import { useState } from "react";
import Success from "./Success";
import { useLocation } from "react-router-dom";
const TextInput = ({ label, type, name, value, onChange }) => {
  return (
    <div>
      <label className="text-white">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 rounded-sm w-full bg-slate-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
      />
    </div>
  );
};

function App() {
  const location = useLocation();
  console.log(location.state.clg_id);
  console.log(location.state.email);

  const [outpass, setOutpass] = useState({
    College_id: "",
    out_date: "",
    in_date: "",
    out_time: "",
    reason: "",
    destination: "",
    luggage: "yes",
    company: "self",
  });

  const [success, setSuccess] = useState(false);
  const toggleSuccess = () => {
    setSuccess(true);
  };

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


  const handleApplyOutpass = async () => {
    if(tokenData.token_type==="user" && tokenData.token_val){
        try {
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              College_id: location.state.clg_id,
              out_date: outpass.out_date,
              in_date: outpass.in_date,
              out_time: outpass.out_time,
              reason: outpass.reason,
              destination: outpass.destination,
              luggage: outpass.luggage,
              company: outpass.company,
            }),
          };
          const response = await fetch(`http://localhost:8000/apply?token=${tokenData.token_val}&email=${location.state.email}`, requestOptions);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          if (response.ok) toggleSuccess();

        } 
          catch (error) {
            console.error("Error applying for outpass:", error);
          }
      
    }
    else console.log("no token available now!!")
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setOutpass((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <div
        className="text-white mt-6 grid  
        place-content-center font-semibold text-4xl mb-5"
      >
        Apply for Outpass
      </div>

      <div className="grid place-content-center">
        <div className="flex ">
          <div className="grid place-content-center mr-3 ml-3">
            <div className="text-white mt-6">Out Date</div>
            <div className="">
              <input
                type="date"
                name="out_date"
                value={outpass.out_date}
                onChange={handleInputChange}
                className="mt-1 p-2 rounded-sm w-full bg-slate-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
              ></input>
            </div>
          </div>

          <div className="grid place-content-center ml-3 mr-3">
            <div className="text-white mt-6">In Date</div>
            <div className="">
              <input
                type="date"
                name="in_date"
                value={outpass.in_date}
                onChange={handleInputChange}
                className="mt-1 p-2 rounded-sm w-full bg-slate-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
              ></input>
            </div>
          </div>

          <div className="grid place-content-center ml-3 mr-3">
            <div className="text-white mt-6">Out Time</div>
            <div className="">
              <input
                type="time"
                name="out_time"
                value={outpass.out_time}
                onChange={handleInputChange}
                className="mt-1 p-2 rounded-sm w-full bg-slate-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
              ></input>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="grid place-content-center mr-3 ml-3">
            <div className="text-white mt-6">Reason for Outpass</div>
            <div className="">
              <TextInput
                type="text"
                name="reason"
                value={outpass.reason}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid place-content-center mr-3 ml-3">
            <div className="text-white mt-6">Destination</div>
            <div className="">
              <TextInput
                type="text"
                name="destination"
                value={outpass.destination}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="grid place-content-center ml-3 mr-3">
            <div className="text-white mt-6">Luggage(if any)</div>
            <div className="">
              <select
                name="luggage"
                value={outpass.luggage}
                onChange={handleInputChange}
                className="mt-1 p-2 rounded-sm w-full bg-slate-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
              >
                <option value="yes">yes</option>
                <option value="no">no</option>
              </select>
            </div>
          </div>

          <div className="grid place-content-center mr-3  ml-3">
            <div className="text-white mt-6">Company?</div>
            <div className="">
              <select
                name="company"
                value={outpass.company}
                onChange={handleInputChange}
                className="mt-1 p-2 rounded-sm w-full bg-slate-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
              >
                <option value="self">self</option>
                <option value="friends">friends</option>
                <option value="parents">parents</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex ml-3 mt-14 justify-end mr-3">
          <button
            onClick={handleApplyOutpass}
            className="text-white border-solid hover:cursor-pointer rounded-full p-2 bg-blue-900 hover:bg-slate-300 font-semibold hover:text-blue-900 transition duration-200 ease-in-out"
          >
            Submit
          </button>
        </div>
        <div>{success && <Success />}</div>
      </div>
    </>
  );
}

export default App;
