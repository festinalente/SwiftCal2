const colours = {
  monthColor: '#fc3',
  monthBackgoundBolor: '#6799cb',
  dayNameColor: '#000',
  dayNameBackgroundColor: '#ccc',
  dayColor: '#000',
  dayBackgroundColor: '#fff',
  monthBorderColor: '#f15925'
};

const selectedStyle = (div) => {
  div.style.backgroundColor = colours.monthColor;
};

const unselectedStyle = (div) => {
  div.style.backgroundColor = colours.dayBackgroundColor;
};

export { selectedStyle, unselectedStyle, colours };
