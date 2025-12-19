import {createContext, useState} from "react";

interface SigninContext {
  signIn: boolean;
  setSignIn: (value: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  resetState: () => void;
}

const SigninContext = createContext<SigninContext | undefined>(undefined);

export function SignInProvider({children}: {children: React.ReactNode}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signIn, setSignIn] = useState(false);

  const resetState = () => {
    setEmail("");
    setPassword("");
    setSignIn(false);
  };

  return (
    <SigninContext.Provider
      value={{
        email,
        password,
        signIn,
        setSignIn,
        setEmail,
        setPassword,
        resetState,
      }}
    >
      {children}
    </SigninContext.Provider>
  );
}
