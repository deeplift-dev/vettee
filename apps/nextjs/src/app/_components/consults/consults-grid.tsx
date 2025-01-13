import React from "react";

interface Consult {
  id: number;
  name: string;
  date: string;
  animalName: string;
  species: string;
  ownerName: string;
  description: string;
}

const ConsultsGrid: React.FC = () => {
  const consults: Consult[] = [
    {
      id: 1,
      name: "Consult with Katarina K.",
      date: "2022-01-01",
      animalName: "Animal 1",
      species: "Dog",
      ownerName: "Katarina K.",
      description: "Dog presenting with a cough and a fever.",
    },
    {
      id: 2,
      name: "Consult with Chloe M.",
      date: "2022-01-15",
      animalName: "Animal 2",
      species: "Cat",
      ownerName: "Chloe M.",
      description: "Cat presenting with vomiting and diarrhea.",
    },
    {
      id: 3,
      name: "Consult with Declan M.",
      date: "2022-02-15",
      animalName: "Animal 3",
      species: "Dog",
      ownerName: "Declan M.",
      description: "Dog showing signs of arthritis and joint pain.",
    },
    {
      id: 4,
      name: "Consult with Emily W.",
      date: "2022-02-01",
      animalName: "Animal 4",
      species: "Cat",
      ownerName: "Emily W.",
      description: "Cat with a skin infection and hair loss.",
    },
    {
      id: 5,
      name: "Consult with Liam T.",
      date: "2022-02-01",
      animalName: "Animal 5",
      species: "Rabbit",
      ownerName: "Liam T.",
      description: "Rabbit with a respiratory infection and nasal discharge.",
    },
    {
      id: 6,
      name: "Consult with Ava L.",
      date: "2022-02-20",
      animalName: "Animal 6",
      species: "Bird",
      ownerName: "Ava L.",
      description: "Bird with a broken wing and difficulty flying.",
    },
    {
      id: 7,
      name: "Consult with Oliver B.",
      date: "2022-02-01",
      animalName: "Animal 7",
      species: "Dog",
      ownerName: "Oliver B.",
      description: "Dog with a dental issue and bad breath.",
    },
    {
      id: 8,
      name: "Consult with Sophia G.",
      date: "2022-02-01",
      animalName: "Animal 8",
      species: "Bird",
      ownerName: "Sophia G.",
      description: "Bird with a beak injury and difficulty eating.",
    },
    {
      id: 9,
      name: "Consult with Mia H.",
      date: "2022-02-20",
      animalName: "Animal 9",
      species: "Rabbit",
      ownerName: "Mia H.",
      description: "Rabbit with a urinary tract infection and blood in urine.",
    },
    {
      id: 10,
      name: "Consult with Isabella D.",
      date: "2022-02-01",
      animalName: "Animal 10",
      species: "Bird",
      ownerName: "Isabella D.",
      description: "Bird with a respiratory issue and difficulty breathing.",
    },
  ];

  // Sort consults by date
  consults.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group consults by date
  const groupedConsults = consults.reduce((acc, consult) => {
    const date = consult.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(consult);
    return acc;
  }, {});

  return (
    <div className="flex w-full flex-col overflow-y-auto px-2 md:px-0">
      {Object.entries(groupedConsults).map(([date, consults]) => (
        <React.Fragment key={date}>
          <div className="sticky mb-4 text-sm">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="mb-6 grid grid-cols-1 gap-4 font-light md:grid-cols-2 lg:grid-cols-3">
            {consults.map((consult) => (
              <div
                key={consult.id}
                className="max-w-sm cursor-pointer rounded-xl border border-white/30 bg-gradient-to-br from-black/10 via-black/20 to-black/10 p-2 shadow-md transition duration-300 hover:shadow hover:shadow-gray-800"
              >
                <div className="flex justify-between">
                  <h2 className="font-medium text-gray-50">{consult.name}</h2>
                  <p className="text-sm text-gray-100">
                    {new Date(consult.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-100">{consult.species}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-200">{consult.description}</p>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="rounded-md bg-gray-100/20 px-2 py-1 text-sm font-normal text-gray-100 hover:bg-gray-100/40">
                    {consult.ownerName}
                  </div>
                  <div className="rounded-md bg-gray-100/20 px-2 py-1 text-sm font-normal text-gray-100 hover:bg-gray-100/40">
                    {consult.animalName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ConsultsGrid;
