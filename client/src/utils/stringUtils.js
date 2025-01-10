export function getFirstLetterOfLastName(fullName) {
  const nameParts = fullName.split(" ");
  const lastName = nameParts[nameParts.length - 1];
  return lastName.charAt(0).toUpperCase();
}
