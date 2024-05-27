import FAQItem from './FAQItem';
import React from "react";

const FAQSection = () => {
    const faqData = [
      {
        question: 'Question 1',
        answer: 'Answer 1',
      },
      {
        question: 'Question 2',
        answer: 'Answer 2',
      },
      {
        question: 'Question 3',
        answer: 'Answer 3',
    },
    ];
  
    return (
      <div className="faq-section">
        <h2>FAQ Section</h2>
        {faqData.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    );
  };
  
  export default FAQSection;