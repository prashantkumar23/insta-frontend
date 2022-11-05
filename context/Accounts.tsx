import React, { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  email_verfied: string;
  numberOfPosts: number;
  numberOfFollowing: number;
  numberOfFollowers: number;
  pic: string;
  username: string;
}

type UserAccountContextType = {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

type Props = {
  children: ReactNode
}

const AccountContext = createContext<UserAccountContextType | undefined>({} as UserAccountContextType);

const Account = ({children}: Props) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  return (
    <AccountContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export { Account, AccountContext };
