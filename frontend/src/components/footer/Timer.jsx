import React, { useState, useEffect } from 'react';

function Timer () {
    const calculateTimeLeft = () => {
        const difference = +new Date('2024-05-05') - +new Date();
        let timeLeft = {};
    
        if (difference > 0) {
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          };
        }
    
        return timeLeft;
      };
    
      const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
      useEffect(() => {
        const timer = setTimeout(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
    
        return () => clearTimeout(timer);
      });
    
      const timerComponents = [];
      Object.keys(timeLeft).forEach(interval => {
        if (!timeLeft[interval]) {
          return;
        }
    
        const label = interval[0].toUpperCase();
        timerComponents.push(
          <span key={interval}>
            {timeLeft[interval]} {label}{' '}
          </span>
        );
      });
    
      return (
        <>
        <p class="absolute z-1 lh-lg text-yellow">{timerComponents.length ? timerComponents : <span>Time's up!</span>}</p>
        <p class="pt-0.5 pl-0.5 lh-lg text-yellow-medium">
          {timerComponents.length ? timerComponents : <span>Time's up!</span>}
        </p>
        </>
      );
};

export default Timer;
