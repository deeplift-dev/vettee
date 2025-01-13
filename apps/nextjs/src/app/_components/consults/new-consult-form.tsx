import React from "react";

import SpeechToText from "./speech-to-text";

interface NewConsultFormProps {
  // Add props if needed
}

const NewConsultForm: React.FC<NewConsultFormProps> = () => {
  return (
    <div className="flex flex-col gap-4 pt-24">
      <div className="flex flex-col gap-2">
        <SpeechToText />
      </div>
    </div>
  );
};

export default NewConsultForm;
