import { FC, useState, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { UserProfileIface } from "../../../shared/UserProfileIface";
import UserProfileContext from "./UserProfileContext";

export const UserProfileProvider: FC = ({ children }) => {
  const isMounted = useRef(false);
  const [id] = useState<string>(uuidv4());
  const [ua, setUa] = useState<UAParser.IResult>(null);
  const [name, setName] = useState<string>(null);

  // fetch user agent and set "ua"
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    let isMounted = true;
    fetch("/api/ua").then(async (res) => {
      if (!isMounted || res.status !== 200) {
        return;
      }
      setUa(await res.json());
    });
  }, []);

  const data: UserProfileIface = useMemo(
    () => ({
      id,
      ua,
      get name() {
        return name;
      },
      /** allow setting name from child components */
      set name(val) {
        setName(val);
      },
    }),
    [id, ua, name]
  );

  return (
    <UserProfileContext.Provider value={data}>
      {children}
    </UserProfileContext.Provider>
  );
};
