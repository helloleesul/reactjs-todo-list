import { useState, useEffect } from "react";

function Header() {
  const week = ["SUN", "MON", "TUES", "WEDNES", "THURS", "FRI", "SATUR"];
  const [time, setTime] = useState(new Date());
  const [img] = useState(require("./image/bg_" + time.getDay() + ".png"));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header>
      <section className="dateTime">
        <div>
          <span>{time.getFullYear()}-</span>
          <span>{("0" + (time.getMonth() + 1)).slice(-2)}-</span>
          <span>{time.getDate()}</span>
        </div>
        <span>{time.toLocaleTimeString("en-US", { hour12: false })}</span>
      </section>
      <img className="bgImg" src={img} alt="backgroundImage" />
      <h1 className="day heavy">
        <span>{week[time.getDay()]}. </span>
        <span className="gray">DAY</span>
      </h1>
    </header>
  );
}

export default Header;
