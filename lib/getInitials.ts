const getInitials = (name: string) => {
  const splitName = name.split(' ');
  const initials = splitName[0][0] + splitName[1][0];
  return initials;
};

export default getInitials;
