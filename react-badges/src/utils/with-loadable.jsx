import { useState, createContext, useContext, useEffect, useRef } from "react";
import LoadableCurtain from "../components/LoadableCurtain";

const LoadableContext = createContext();

const defaults = {
  // Minimum on-screen time for the loading curtain
  minDuration: 800,
  // Stuff to show
  text: ""
};

const withLoadable =
  (
    Component,
    { minDuration = defaults.minDuration, text = defaults.text } = defaults
  ) =>
  (props) => {
    const displayedAt = useRef(new Date());
    const [isVisible, setIsVisible] = useState(true);

    return (
      <>
        <LoadableContext.Provider
          value={{ minDuration, displayedAt, isVisible, setIsVisible }}
        >
          <Component {...props} />
        </LoadableContext.Provider>
        {isVisible && <LoadableCurtain text={text} />}
      </>
    );
  };

export const useRemoveLoadable = () => {
  const { minDuration, displayedAt, setIsVisible } =
    useContext(LoadableContext);
  useEffect(() => {
    const delay = minDuration - (new Date() - displayedAt.current);
    setTimeout(
      () => {
        setIsVisible(false);
      },
      delay > 0 ? delay : 0
    );
  }, []);
  return null;
};

export const removeLoadable = (Component) => (props) => {
  useRemoveLoadable();
  return <Component {...props} />;
};

export default withLoadable;
