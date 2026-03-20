import axios from 'axios'
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { serverUrl } from '../App'

function ForgotPassword() {
  const [step,setStep]=useState(1)
  const [inputClicked,setInputClicked]=useState({
    email:false,
    otp:false,
    newPassword:false,
    confirmNewPassword:false
  })
  const [email,setEmail]=useState("")
  const [otp,setOtp]=useState("")
  const [err,setErr]=useState("")
  const [newPassword,setNewPassword]=useState("")
  const [confirmNewPassword,setConfirmNewPassword]=useState("")
  const [loading,setLoading]=useState(false)

  const handleStep1=async ()=>{
    setLoading(true)
    setErr("")
    try {
      await axios.post(`${serverUrl}/api/auth/sendOtp`,{email},{withCredentials:true})
      setStep(2)
      setLoading(false)
    } catch (error) {
      setErr(error.response?.data?.message)
      setLoading(false)
    }
  }

  const handleStep2=async ()=>{
    setLoading(true)
    setErr("")
    try{
      await axios.post(`${serverUrl}/api/auth/verifyOtp`,{email,otp},{withCredentials:true})
      setStep(3)
      setLoading(false)
    } catch(error){
      setErr(error.response?.data?.message)
      setLoading(false)
    }
  }

  const handleStep3=async ()=>{
    if(newPassword !== confirmNewPassword){
      return setErr("Passwords do not match")
    }
    setErr("")
    setLoading(true)
    try{
      await axios.post(`${serverUrl}/api/auth/resetPassword`,{email,password:newPassword},{withCredentials:true})
      setLoading(false)
      alert("Password reset successful!")
      setStep(1)
      setEmail(""); setOtp(""); setNewPassword(""); setConfirmNewPassword("")
    } catch(error){
      setErr(error.response?.data?.message)
      setLoading(false)
    }
  }

  const renderInput = (label, value, setValue, fieldName) => (
    <div className='relative w-[90%] h-12 rounded-xl border border-gray-300 bg-white hover:shadow-md transition-all duration-300 mb-4'
         onClick={()=>setInputClicked({...inputClicked,[fieldName]:true})}>
      <label className={`absolute left-3 px-1 bg-white text-gray-400 text-sm transition-all duration-300
        ${inputClicked[fieldName]?"-top-3 text-purple-500 font-semibold":""}`}>
        {label}
      </label>
      <input
        type={fieldName.toLowerCase().includes("password")?"text":"text"}
        className='w-full h-full px-3 bg-transparent text-gray-700 outline-none'
        value={value}
        onChange={e=>setValue(e.target.value)}
      />
    </div>
  )

  return (
    <div className='w-full h-screen bg-gradient-to-tr from-pink-400 via-orange-300 to-yellow-300 flex justify-center items-center'>
      <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-3xl flex flex-col justify-center items-center shadow-2xl p-6'>

        <h2 className='text-2xl md:text-3xl font-bold text-purple-700 mb-6 animate-bounce'>
          {step<3 ? "Forgot Password" : "Reset Password"}
        </h2>

        {step===1 && renderInput("Enter Email", email, setEmail, "email")}
        {step===2 && renderInput("Enter OTP", otp, setOtp, "otp")}
        {step===3 && <>
          {renderInput("Enter New Password", newPassword, setNewPassword, "newPassword")}
          {renderInput("Confirm New Password", confirmNewPassword, setConfirmNewPassword, "confirmNewPassword")}
        </>}

        {err && <p className='text-red-500 font-medium mb-2'>{err}</p>}

        <button className='w-[70%] h-12 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:scale-105 transition-all duration-300 shadow-lg mt-4'
          disabled={loading}
          onClick={step===1 ? handleStep1 : step===2 ? handleStep2 : handleStep3}>
          {loading ? <ClipLoader size={25} color='white'/> : step===1 ? "Send OTP" : step===2 ? "Verify OTP" : "Reset Password"}
        </button>

      </div>
    </div>
  )
}

export default ForgotPassword