import React, { useState } from "react";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateMockData() {
  const mockData = [];
  for (let i = 1; i <= 100; i++) {
    mockData.push({
      rank: i.toString(),
      user: `user${i}`,
      tweets: Math.floor(Math.random() * 10), 
      views: numberWithCommas(Math.floor(Math.random() * 1000000)),
    });
  }
  return mockData;
}

function Main() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockData = generateMockData();

  const filteredData = mockData.filter(
    (row) => row.user.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  return (
    <div className="w-full flex flex-col items-center justify-start px-9 main">
      <div className="w-full flex flex-col gap-8 items-center">
        <div className="flex flex-col w-full justify-center items-center pt-20 pb-8 px-12 about-text">
          <h1 className="title-lg">
          airdrop 1
          </h1>
          <div className="mt-4 text-xs lg:text-lg text-center">
            <div className="relative max-w-fit">
              <p className="about-text__description">
              Create content about DICK. More views equals more $DICK. Leaderboard is updated every 20 min.
              </p>
            </div>
          </div>
        </div>
        <div
          className="search-input w-2/3 text-sm sm:text-xs md:text-sm lg:text-base xl:text-sm 2xl:text-base uppercase text-nowrap lh-lg text-center"
        >
          <input
            type="text"
            className="w-full px-2 bg-transparent outline-none"
            placeholder="Search by handle"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full">
          <table className="w-full leaderboard">
            <thead>
              <tr>
                {["RANK", "USER", "TWEETS", "VIEWS"].map((header, index) => (
                  <th
                    key={index}
                    className=""
                  >
                    <div className="relative max-w-fit">
                      <p className="pt-0.5 pl-0.5 lh-lg text-pink">
                        {header}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, columnIndex) => (
                      <td
                        key={columnIndex}
                        className={`px-1 lg:px-4 pt-4 text-left w-${
                          columnIndex === 1 ? "2/5" : "1/5"
                        }`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Main;
