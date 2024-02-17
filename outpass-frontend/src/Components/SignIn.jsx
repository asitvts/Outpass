import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import Error from './Error'



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

  const history = useNavigate();
  const history2= useNavigate();
  const history3 = useNavigate();
  const history4 = useNavigate();

  const handleHistory = () => {
    history("./register")
  };
  const handleHistory2 = (clg_id,email) => {
    history2("./apply" , {state: {clg_id:clg_id,email:email}})
  };

  const handleHistory3 = (email) => {
    history3("./Warden", {state: {email:email}})
  };
  const handleHistory4 = (email) => {
    history4("./Guard", {state: {email:email}})
  };

  const [userData, setUserData] = useState({
    email: "",
    hashed_password: ""
  });


  const [error, setError] = useState(false);
  const toggleError = () => {
    setError((prevError) => true);
  };
  const toggleError2 = () => {
    setError((prevError) => false);
  };

  const handlegetCollegeId = async (emailid) =>{
    try {
      const url = `http://localhost:8000/get_user_by_email?emailid=${emailid}`;
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (response.ok) return data.College_id;
  
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  const handleSignIn = async () => {
    try {
      const url = `http://localhost:8000/sign_in?emailid=${userData.email}&password=${userData.hashed_password}`;
      const response = await fetch(url);
  
      if (!response.ok) {
        toggleError();
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (response.ok) {
        toggleError2();
        let token_val;
        let token_type;
        if (data.message === "Sign-in successful for guard"){
          handleHistory4(userData.email);
          token_val= data.token;
          token_type=data.type;
        }
        else if(data.message === "Sign-in successful for warden"){
          handleHistory3(userData.email);
          token_val= data.token;
          token_type=data.type;
        }
        else {
          const clg_id= await handlegetCollegeId(userData.email);
          token_val= data.token;
          token_type=data.type;
          handleHistory2(clg_id,userData.email);
        }
        const tokenData = JSON.stringify({ token_val, token_type });
        document.cookie = `token=${tokenData}; path=/;`;
      }
  
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };


  return (
    <>
      <div
        className="text-white mt-6 grid  
        place-content-center font-semibold text-4xl mb-5"
      >
        Sign In
      </div>

      <div className="grid place-content-center">
        <div className="flex">
          <div className="grid place-content-center mr-3 ml-3">
            <TextInput
              label="Email Id"
              type="text"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid place-content-center ml-3 mr-3">
            <TextInput
              label="Password"
              type="password"
              name="hashed_password"
              value={userData.hashed_password}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex ml-3 mt-5 justify-end mr-3">
          <button 
          onClick={handleSignIn}
          className="text-white w-2/5 h-full border-solid hover:cursor-pointer rounded-full p-2 bg-blue-900 hover:bg-slate-300 font-semibold hover:text-blue-900 transition duration-200 ease-in-out">
            Sign In
          </button>
        </div>

        <div className="flex place-content-center">{error && <Error/>}</div>
        <div className="border mt-20 mb-5"></div>

        <div className="grid place-content-center mt-10">
          <div className="grid ml-3 mt-5 justify-end mr-3">
            <button onClick={handleHistory}
            className="text-white border-solid hover:cursor-pointer rounded-full p-2 bg-blue-900 hover:bg-slate-300 font-semibold hover:text-blue-900 transition duration-200 ease-in-out">
              Register
            </button>
            <p1 className="text-white mb-10">Don't have an account? Register</p1>
          </div>
          
        </div>

        
      </div>
    </>
  );
}
export default App;