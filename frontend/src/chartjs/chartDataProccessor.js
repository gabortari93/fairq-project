// Function to calculate total people over time
export const calculateTotalPeopleOverTime = (statsData) => {
  const labels = statsData.map((entry) => entry.date);
  const values = statsData.map((entry) => entry.total_people);
  return { labels, values };
};

// Function to calculate changes over time
export const calculateChangesOverTime = (statsData) => {
  const labels = statsData.map((entry) => entry.date);
  const newPeople = statsData.map((entry) => entry.new_people);
  const removedPeople = statsData.map((entry) => entry.removed_people);
  const selectedPeople = statsData.map((entry) => entry.selected_people);
  return { labels, newPeople, removedPeople, selectedPeople };
};

// Function to calculate average waiting time over time
export const calculateAverageWaitingTimeOverTime = (statsData) => {
  const labels = statsData.map((entry) => entry.date);
  const values = statsData.map((entry) => entry.average_waiting_time_for_selected_people);
  return { labels, values };
};

// Function to calculate estimated time for new applicants over time
export const calculateEstimatedTimeForNewApplicantsOverTime = (statsData) => {
  const labels = statsData.map((entry) => entry.date);
  const values = statsData.map((entry) => entry.estimated_time_for_new_applicants);
  return { labels, values };
};