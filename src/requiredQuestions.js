//validate user input entered in questions
function requiredQuestions(errorMessage) {
    return (userInput) => {
      if (userInput) {
        return true;
      } else {
        console.log(errorMessage);
        return false;
      }
    };
  }
  
  module.exports = requiredQuestions;