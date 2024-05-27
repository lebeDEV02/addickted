import React, { useState, useRef } from 'react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-item">
      <button className={`accordion ${isOpen ? 'active' : ''}`} onClick={toggleAccordion}>
        {question}
      </button>
      <div
        ref={contentRef}
        className={`panel ${isOpen ? 'open' : ''}`}
        style={{ maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : '0px' }}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default FAQItem