import React, { useState } from 'react';
import { X } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import { auth, GoogleProvider, GithubProvider } from './Firebase';
import { useNavigate } from 'react-router-dom';
import google from '../assets/google.jpeg';
import Github from '../assets/github.png';

const Login = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
        await signInWithEmailAndPassword(auth,email,password);
        localStorage.setItem("Email",email);
        console.log(localStorage.getItem("Email"));
        console.log("Signup successful");
        navigate("/chatbot");
    }
    catch(err)
    {
        console.log("An error occured",err)

    }
  }

  const handleGoogleSignIn = async (e) => {
    try{
      const result  = await signInWithPopup(auth , GoogleProvider);
      console.log("Google sign in successful",result.user);
      navigate("/");
    }
    catch (err)
    {
      console.log("Error Sign-In with google",err);
    }
  }

  const handleGithubSignIn = async (e) => {
    try{
      const result = await signInWithPopup(auth, GithubProvider);
      console.log("Github sign-In successful",result.user);
      navigate("/");
    }
    catch (err)
    {
      console.log("Error Sign-In with github",err);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between bg-indigo-900 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-semibold">Login</h2>
              <button
                onClick={() => navigate("/")}
                className="text-white hover:text-purple-200 transition duration-200"
              >
                <X size={24}  />
              </button>
            </div>
            <form className="p-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className='flex items-center'>
                  <label htmlFor="email" className="w-1/3 text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className='flex items-baseline'>
                  <label htmlFor="password" className="w-1/3 text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-900 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"

                >
                  Sign In
                </button>

                <div className="flex justify-center my-2">
                  <p className="text-gray-600">or</p>
                </div>
                 <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-300 transition duration-300 hover:bg-gray-100"
                  >
                    <img src={google} alt="Google Logo" className="w-8 h-8 rounded-full" />
                  </button>

                  <button
                    type="button"
                    onClick={handleGithubSignIn}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-300 transition duration-300 hover:bg-gray-100"
                  >
                    <img src={Github} alt="GitHub Logo" className="w-8 h-8 rounded-full" />
                  </button>
                </div>


                <div className="px-6 pb-6 text-center">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                      <a href="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
                          Sign Up
                      </a>
                      </p>
                </div>
                <div className="px-6 pb-6 text-center">
                  <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Home
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      )
    </div>
  );
}

export default Login;
