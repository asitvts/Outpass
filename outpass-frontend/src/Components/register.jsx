import React, { useState } from "react";
import {useNavigate} from "react-router-dom"

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
const App = () => {

  const history = useNavigate();
  const history1 = useNavigate();
  const history2 = useNavigate();

  const handleHistory = () => {
      history("/")
  };

  const handleHistory_guard = () => {
    history1("Guard")
  };

  const handleHistory_warden = () => {
    history2("Warden")
  };


  const [userData, setUserData] = useState({
    email: "",
    hashed_password: "",
    Name: "",
    College_id: "",
    Mobile_no: "",
    Hostel: "Nirvana",
    Year: 0,
    Room_No: "",
    Father_name: "",
    Father_mob: "",
    Branch: ""
  });

  const handleRegisterUser = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          hashed_password: userData.hashed_password,
          Name: userData.Name,
          College_id: userData.College_id,
          Mobile_no: userData.Mobile_no,
          Hostel: userData.Hostel,
          Year: userData.Year,
          Room_No: userData.Room_No,
          Father_name: userData.Father_name,
          Father_mob: userData.Father_mob,
          Branch: userData.Branch
        }),
      };
  
      const response = await fetch("http://localhost:8000/auth/register_user", requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if(response.ok)handleHistory();
  
      const data = await response.json();
      console.log(data); 
    } 
    catch (error) {
      console.error("Error registering user:", error);
    }
  };
  

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };
  

  return (
    <>
      <div className="text-white mt-6 grid place-content-center font-semibold text-4xl mb-5">
        Register
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

        <div className="flex">
          <div className="grid place-content-center mr-3 ml-3">
            <TextInput
              label="Full Name"
              type="text"
              name="Name"
              value={userData.Name}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid place-content-center ml-3 mr-3">
            <TextInput
              label="College Id"
              type="text"
              name="College_id"
              value={userData.College_id}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex">
          <div className="grid place-content-center ml-3 mr-3">
            <TextInput
              label="Mobile No"
              type="text"
              name="Mobile_no"
              value={userData.Mobile_no}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid place-content-center ml-3 mr-3">
            <div className="text-white mt-6">Hostel Name</div>
            <div className="">
              <select
                className="mt-1 p-2 rounded-sm w-full bg-slate-600 text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
                name="Hostel"
                value={userData.Hostel}
                onChange={handleInputChange}
              >
                <option value="Nirvana">Nirvana</option>
                <option value="Noran">Noran</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="grid place-content-center ml-3 mr-3">
            <TextInput
              label="Year"
              type="number"
              name="Year"
              value={userData.Year}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid place-content-center mr-3 ml-3">
            <TextInput
              label="Room No"
              type="text"
              name="Room_No"
              value={userData.Room_No}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex">
          <div className="grid place-content-center mr-3 ml-3">
            <TextInput
              label="Father's Name"
              type="text"
              name="Father_name"
              value={userData.Father_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid place-content-center ml-3">
            <TextInput
              label="Father's Mobile No"
              type="text"
              name="Father_mob"
              value={userData.Father_mob}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex">
          <div className="grid place-content-center ml-3 mr-3">
            <TextInput
              label="Branch"
              type="text"
              name="Branch"
              value={userData.Branch}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex ml-3 mt-4 justify-end mr-3">
          <button
            onClick={handleRegisterUser}
            className="text-white border-solid hover:cursor-pointer rounded-full p-2 bg-blue-900 hover:bg-slate-300 font-semibold hover:text-blue-900 transition duration-200 ease-in-out ml-10"
          >
            Register
          </button>
        </div>

        <div className="flex justify-start ml-2">
        <button
            onClick={handleHistory_warden}
            className="text-white underline hover:cursor-pointer p-2  font-semibold hover:text-blue-500 transition duration-100 ease-in-out mr-10 mt-10 justify-center"
          >
            Register as Warden
          </button>
          <button
            onClick={handleHistory_guard}
            className="text-white underline hover:cursor-pointer p-2  font-semibold hover:text-blue-500 transition duration-100 ease-in-out mr-10 mt-10 justify-center"
          >
            Register as Guard
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
