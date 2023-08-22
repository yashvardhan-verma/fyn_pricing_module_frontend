'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // if(localStorage.getItem("id")){
  //   setIsAuthenticated(true)
  // }
  useEffect(() => {
    if (localStorage.getItem("id")) {
      setIsAuthenticated(true)
    }
  }
    , [isAuthenticated])
  const handleSignIn = async (e: any) => {
    e.preventDefault()
    console.log("email", email, "password", password)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ email, password }),
      redirect: 'follow'
    });
    let data = await res.json();
    if (data.status) {
      setIsAuthenticated(true)
      localStorage.setItem("id", data.data.id)
      localStorage.setItem("token", data.data.token)
    } else {
      alert(data.message)
    }
  }
  return (
    (isAuthenticated ? <> <CalculatePricing /> </> : <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
        <form className="mt-6">
          <div className="mb-4">
            <Input type="email" placeholder="Email" onChange={(event) => {
              setEmail(event.target.value);
            }} />
          </div>
          <div className="mb-2">
            <Input type="password" placeholder="Password" onChange={(event) => {
              setPassword(event.target.value);
            }} />
          </div>
          <div className="mt-2">
            {/* <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
              Sign In
            </button> */}
            <Button onClick={handleSignIn}>Sign In</Button>
          </div>
        </form>
      </div>
    </div>)
  );
}


const CalculatePricing = () => {
  const [pricingConfigId, setpricingConfigId] = useState("");
  const [distanceInKM, setdistanceInKM] = useState(0);
  const [waitingTimeInMin, setwaitingTimeInMin] = useState(0);
  const [calulatedPrice, setcalculatePrice] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [startTime, setStartTime] = useState(new Date());
  const [stopTime, setStopTime] = useState(new Date())


  const handleStart = (e: any) => {
    e.preventDefault()
    setStartTime(new Date());
    setStopTime(null);
    setIsRunning(true)
  };

  const handleStop = (e: any) => {
    e.preventDefault()
    if (startTime) {
      setStopTime(new Date());
      setIsRunning(false)
    }
  };

  const calculateElapsedTime = () => {
    if (startTime && stopTime) {
      const elapsedTime: any = stopTime - startTime;
      return elapsedTime / 1000;
    }
    return 0;
  };

  const handleCalculate = async (e: any) => {
    e.preventDefault()
    var myHeaders = new Headers();
    let token = localStorage.getItem("token")
    myHeaders.append("authorization", token);

    var requestOptions: object = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    console.log(String(`http://localhost:4000/api/pricing/calculate?pricingConfigId=${pricingConfigId}&distanceInKM=${distanceInKM}&waitingTimeInMin=${waitingTimeInMin}&rideTimeStart=${new Date(startTime)}&rideTimeEnd=${new Date(stopTime)}`))
    const res = await fetch(`http://localhost:4000/api/pricing/calculate?pricingConfigId=${pricingConfigId}&distanceInKM=${distanceInKM}&waitingTimeInMin=${waitingTimeInMin}&rideTimeStart=${new Date(startTime)}&rideTimeEnd=${new Date(stopTime)}`, requestOptions)
    let data = await res.json();
    if (data.status) {
      console.log("data", data)
      setcalculatePrice(data.data.finalPricing)
      // localStorage.setItem("id", data.data.id)
      // localStorage.setItem("token", data.data.token)
    } else {
      alert(data.message)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
        <form className="mt-6">
          <div className="mb-4">
            <Label htmlFor="pricingConfigId">Pricing Config ID</Label>
            <Input type="text" placeholder="64cde8abea8cb4246622ec7b" onChange={(event) => {
              setpricingConfigId(event.target.value);
            }} />
          </div>
          <div className="mb-2">
            <Label htmlFor="distanceInKM">Distance in KMs</Label>
            <Input type="text" placeholder="" onChange={(event) => {
              setdistanceInKM(parseInt(event.target.value));
            }} />
          </div>
          <div className="mt-2">
            <Label htmlFor="waitingTimeInMin">Waiting Time in mins</Label>
            <Input type="text" placeholder="" onChange={(event) => {
              setwaitingTimeInMin(parseInt(event.target.value));
            }} />
          </div>
          <div className="mt-2">
            <Button onClick={handleStart}> Start Ride</Button>
            {isRunning && <Button onClick={handleStop}> Stop Ride</Button>}
          </div>
          <div className="mt-2">
            <Label htmlFor="rideTimeStart">Ride Time {calculateElapsedTime()} seconds</Label>
          </div>
          {calculateElapsedTime() &&
            <div className="mt-2">
              <Button onClick={handleCalculate}> Calculate</Button>
            </div>
          }
          {
            calulatedPrice &&
            <div className="mt-2">
              <Label htmlFor="calulatedPrice">price calculated : {calulatedPrice}</Label>
            </div>
          }
        </form>
      </div>
    </div>
  )
}